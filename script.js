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
