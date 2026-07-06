/* Footer helpers kept separate from the page and dialog modules. */
export function initFooter() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}
