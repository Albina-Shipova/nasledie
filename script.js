const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(opened));
  menu.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Открыть меню');
}));
const lightbox = document.querySelector('.lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  lightbox.querySelector('img').src = button.dataset.image;
  lightbox.querySelector('img').alt = button.querySelector('img').alt;
  lightbox.showModal();
}));
lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
const stageButtons = document.querySelectorAll('[data-step]');
const stages = [...document.querySelectorAll('.steps article')];
let selectedStage = -1;
stageButtons.forEach(button => button.addEventListener('click', () => {
  selectedStage = (selectedStage + Number(button.dataset.step) + stages.length) % stages.length;
  stages.forEach((stage, index) => stage.classList.toggle('active', index === selectedStage));
}));
const viewer = document.querySelector('.project-viewer');
if (viewer) {
  const projectButtons = [...document.querySelectorAll('.project-list button')];
  const mainImage = viewer.querySelector('.project-photo img');
  const counter = viewer.querySelector('.project-counter');
  const tag = viewer.querySelector('.project-tag');
  const thumbs = viewer.querySelector('.project-thumbs');
  const lbImage = lightbox.querySelector('img');
  const lbNav = lightbox.querySelectorAll('.lb-nav');
  let photos = [], current = 0, title = '';
  const pad = n => String(n).padStart(2, '0');
  const showPhoto = index => {
    current = (index + photos.length) % photos.length;
    mainImage.src = photos[current];
    mainImage.alt = `${title} — фото ${current + 1}`;
    counter.textContent = `${pad(current + 1)} / ${pad(photos.length)}`;
    thumbs.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', String(i === current)));
    thumbs.children[current]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (lightbox.open) { lbImage.src = photos[current]; lbImage.alt = mainImage.alt; }
  };
  const selectProject = button => {
    projectButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    photos = button.dataset.photos.split('|');
    title = button.querySelector('b').textContent;
    tag.textContent = button.dataset.tag;
    thumbs.innerHTML = photos.map((src, i) => `<button type="button" aria-label="Фото ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('');
    thumbs.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => showPhoto(i)));
    showPhoto(0);
  };
  projectButtons.forEach(b => b.addEventListener('click', () => selectProject(b)));
  viewer.querySelectorAll('[data-photo]').forEach(b => b.addEventListener('click', () => showPhoto(current + Number(b.dataset.photo))));
  viewer.querySelector('.project-photo').addEventListener('click', () => {
    lbImage.src = photos[current]; lbImage.alt = mainImage.alt;
    lbNav.forEach(b => b.hidden = false);
    lightbox.showModal();
  });
  lbNav[0].addEventListener('click', () => showPhoto(current - 1));
  lbNav[1].addEventListener('click', () => showPhoto(current + 1));
  lightbox.addEventListener('close', () => lbNav.forEach(b => b.hidden = true));
  lightbox.addEventListener('keydown', e => { if (!lbNav[0].hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) showPhoto(current + (e.key === 'ArrowLeft' ? -1 : 1)); });
  let touchX = null;
  viewer.querySelector('.project-photo').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  viewer.querySelector('.project-photo').addEventListener('touchend', e => { if (touchX === null) return; const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 40) showPhoto(current + (dx < 0 ? 1 : -1)); touchX = null; });
  selectProject(projectButtons[0]);
}
const reviewsTrack = document.querySelector('.reviews-track');
if (reviewsTrack) {
  const cards = [...reviewsTrack.querySelectorAll('.review')];
  const maxLeft = () => reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
  const currentIndex = () => {
    const left = reviewsTrack.scrollLeft;
    let best = 0;
    cards.forEach((c, i) => { if (Math.abs(c.offsetLeft - cards[0].offsetLeft - left) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - left)) best = i; });
    return best;
  };
  let anim = null;
  const goTo = index => {
    const target = Math.max(0, Math.min(cards[index].offsetLeft - cards[0].offsetLeft, maxLeft()));
    const start = reviewsTrack.scrollLeft, dist = target - start, t0 = performance.now(), dur = 450;
    cancelAnimationFrame(anim);
    reviewsTrack.classList.add('is-animating');
    const frame = now => {
      const p = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
      reviewsTrack.scrollLeft = start + dist * ease;
      if (p < 1) anim = requestAnimationFrame(frame); else reviewsTrack.classList.remove('is-animating');
    };
    anim = requestAnimationFrame(frame);
  };
  const move = dir => {
    const atEnd = reviewsTrack.scrollLeft >= maxLeft() - 2;
    const atStart = reviewsTrack.scrollLeft <= 2;
    if (dir > 0 && atEnd) return goTo(0);
    if (dir < 0 && atStart) return goTo(cards.length - 1);
    goTo(Math.max(0, Math.min(cards.length - 1, currentIndex() + dir)));
  };
  document.querySelectorAll('[data-review]').forEach(b => b.addEventListener('click', () => move(Number(b.dataset.review))));
  let wheelLock = false;
  reviewsTrack.addEventListener('wheel', e => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const dir = Math.sign(delta);
    if (!dir) return;
    const atEnd = reviewsTrack.scrollLeft >= maxLeft() - 2;
    const atStart = reviewsTrack.scrollLeft <= 2;
    if ((dir > 0 && atEnd) || (dir < 0 && atStart)) return;
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    goTo(Math.max(0, Math.min(cards.length - 1, currentIndex() + dir)));
    setTimeout(() => { wheelLock = false; }, 500);
  }, { passive: false });
  let dragX = null, dragLeft = 0, moved = false;
  reviewsTrack.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.target.closest('a')) return;
    dragX = e.clientX; dragLeft = reviewsTrack.scrollLeft; moved = false;
    reviewsTrack.setPointerCapture(e.pointerId); reviewsTrack.classList.add('is-dragging');
  });
  reviewsTrack.addEventListener('pointermove', e => {
    if (dragX === null) return;
    const dx = e.clientX - dragX; if (Math.abs(dx) > 3) moved = true;
    reviewsTrack.scrollLeft = dragLeft - dx;
  });
  const endDrag = e => {
    if (dragX === null) return;
    dragX = null;
    reviewsTrack.classList.remove('is-dragging');
    if (moved) goTo(currentIndex());
  };
  reviewsTrack.addEventListener('pointerup', endDrag);
  reviewsTrack.addEventListener('pointercancel', endDrag);
  reviewsTrack.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } });
}
