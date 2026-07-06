/* Fixed glass navigation, mobile menu, and active-section state. */
export function initNavbar() {
  const navbar = document.getElementById("navbar");
  const panel = document.getElementById("nav-panel");
  const toggle = document.getElementById("nav-toggle");
  const links = [...document.querySelectorAll(".nav-link")];
  const cta = panel?.querySelector(".nav-cta");

  if (!navbar || !panel || !toggle) return;

  const setMenu = (open) => {
    panel.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    document.body.classList.toggle("menu-open", open);
  };

  const closeMenu = () => setMenu(false);

  const updateScrollState = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 64);
  };

  toggle.addEventListener("click", () => {
    setMenu(!panel.classList.contains("open"));
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));
  cta?.addEventListener("click", closeMenu);

  document.addEventListener("click", (event) => {
    if (!panel.classList.contains("open")) return;
    if (panel.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  if (!("IntersectionObserver" in window) || links.length === 0) return;

  const targets = links
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return null;
      const target = document.querySelector(href);
      return target?.matches("section") ? target : null;
    })
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    },
    {
      rootMargin: "-28% 0px -58% 0px",
      threshold: [0, 0.15, 0.45],
    },
  );

  targets.forEach((target) => observer.observe(target));
}
