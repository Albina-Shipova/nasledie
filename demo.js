/* Демо-защита. После оплаты удалить этот файл и его подключение в index.html */
(() => {
  const allowed = ['nasledie.asama.site', 'localhost', '127.0.0.1'];
  const host = location.hostname;

  const css = `
    html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
    input,textarea,[contenteditable]{-webkit-user-select:text;user-select:text}
    img{-webkit-user-drag:none;user-drag:none}
    .demo-badge{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:900;display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:30px;background:rgba(47,36,27,.82);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#f6efe5;font:400 12px/1.2 Manrope,Arial,sans-serif;letter-spacing:.02em;white-space:nowrap;box-shadow:0 6px 20px rgba(0,0,0,.18);pointer-events:auto}
    .demo-badge a{color:#e3c896;text-decoration:none;border-bottom:1px solid rgba(227,200,150,.5)}
    .demo-badge i{width:6px;height:6px;border-radius:50%;background:#d5b77b;display:block}
    .demo-lock{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;background:#211a13;color:#f6efe5;font:300 16px/1.5 Manrope,Arial,sans-serif;text-align:center}
    .demo-lock b{display:block;font-weight:300;font-size:26px;margin-bottom:10px}
    .demo-lock a{color:#e3c896}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();

  if (!allowed.includes(host)) {
    ready(() => {
      document.body.innerHTML = '<div class="demo-lock"><div><b>Демо-версия сайта</b>Эта страница доступна только по адресу разработчика.<br>Разработка — <a href="https://asama.site/">asama.site</a></div></div>';
    });
    return;
  }

  ready(() => {
    const badge = document.createElement('div');
    badge.className = 'demo-badge';
    badge.innerHTML = '<i></i>Демо-версия · разработка <a href="https://asama.site/" target="_blank" rel="noopener">asama.site</a>';
    document.body.appendChild(badge);
  });

  const block = e => { e.preventDefault(); return false; };
  document.addEventListener('contextmenu', block);
  document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') block(e); });
  document.addEventListener('selectstart', e => { if (!e.target.closest?.('input,textarea,[contenteditable]')) block(e); });
  document.addEventListener('copy', block);
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === 'F12' ||
        (mod && ['s', 'u', 'p'].includes(k)) ||
        (mod && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(k))) block(e);
  });
})();
