import { initNavbar } from "./navbar.js";
import { initReveal } from "./reveal.js";
import { initRipple } from "./ripple.js";
import { initMarquee } from "./marquee.js";
import { initFaq } from "./faq.js";
import { initServices } from "./services.js";
import { initAuth } from "./auth.js";
import { initPricing } from "./pricing.js";
import { initNotice } from "./notice.js";
import { initFooter } from "./footer.js";

const start = () => {
  initNavbar();
  initReveal();
  initRipple();
  initMarquee();
  initFaq();
  initServices();
  initAuth();
  initPricing();
  initNotice();
  initFooter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
