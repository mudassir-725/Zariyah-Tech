/* Lightweight placeholder notice for features planned for later releases. */
export function initNotice() {
  const notice = document.getElementById("site-notice");
  const triggers = [...document.querySelectorAll("[data-docs-placeholder]")];
  const closeButton = notice?.querySelector("[data-notice-close]");

  if (!notice || triggers.length === 0) return;

  let timer = null;

  const hide = () => {
    window.clearTimeout(timer);
    notice.classList.remove("show");
    window.setTimeout(() => {
      if (!notice.classList.contains("show")) notice.hidden = true;
    }, 210);
  };

  const show = (event) => {
    event.preventDefault();
    window.clearTimeout(timer);
    notice.hidden = false;
    requestAnimationFrame(() => notice.classList.add("show"));
    timer = window.setTimeout(hide, 4200);
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", show));
  closeButton?.addEventListener("click", hide);
}
