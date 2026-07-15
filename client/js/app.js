import { initNavbar } from "./navbar.js";
import { initReveal } from "./reveal.js";
import { initRipple } from "./ripple.js";
import { initMarquee } from "./marquee.js";
import { initServices } from "./services.js";
import { initFeedback } from "./feedback.js";
import { initContact } from "./contact.js";
import { initFooter } from "./footer.js";

const start = () => {
  initNavbar();
  initReveal();
  initRipple();
  initMarquee();
  initServices();
  initFeedback();
  initContact();
  initFooter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
