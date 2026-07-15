import { siteConfig } from "./site-config.js";

/* Footer helpers and public contact configuration. */
export function initFooter() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-contact-mail]").forEach((node) => {
    node.textContent = siteConfig.contactMail;
  });

  document.querySelectorAll("[data-contact-mail-link]").forEach((link) => {
    link.href = `mailto:${siteConfig.contactMail}`;
  });
}
