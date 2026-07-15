/* Fixed glass navigation, mobile menu, and active-section state. */
export function initNavbar() {
  const navbar = document.getElementById("navbar");
  const panel = document.getElementById("nav-panel");
  const toggle = document.getElementById("nav-toggle");
  const links = [...document.querySelectorAll(".nav-link")];
  const contactLink = document.querySelector("[data-contact-nav]");
  const footer = document.getElementById("footer");

  if (!navbar || !panel || !toggle) return;

  let visibleSection = null;
  let contactDialogOpen = false;
  let footerVisible = false;
  let footerHovered = false;

  const contactIsActive = () => contactDialogOpen || footerVisible || footerHovered;

  const updateActiveLinks = () => {
    links.forEach((link) => {
      const isContact = link === contactLink;
      const active = isContact
        ? contactIsActive()
        : !contactIsActive() && link.getAttribute("href") === `#${visibleSection}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const setMenu = (open) => {
    panel.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", open);
  };

  const closeMenu = () => setMenu(false);
  const updateScrollState = () => navbar.classList.toggle("scrolled", window.scrollY > 64);

  toggle.addEventListener("click", () => setMenu(!panel.classList.contains("open")));
  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!panel.classList.contains("open")) return;
    if (panel.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("contact:open", () => {
    contactDialogOpen = true;
    updateActiveLinks();
  });

  document.addEventListener("contact:close", () => {
    contactDialogOpen = false;
    updateActiveLinks();
  });

  footer?.addEventListener("mouseenter", () => {
    footerHovered = true;
    updateActiveLinks();
  });

  footer?.addEventListener("mouseleave", () => {
    footerHovered = false;
    updateActiveLinks();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  if (!("IntersectionObserver" in window)) return;

  const sectionLinks = links.filter((link) => link !== contactLink);
  const targets = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter((target) => target?.matches("section"));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      visibleSection = visible.target.id;
      updateActiveLinks();
    },
    { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.15, 0.45] },
  );
  targets.forEach((target) => sectionObserver.observe(target));

  if (footer) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry.isIntersecting;
        updateActiveLinks();
      },
      { threshold: 0.12 },
    );
    footerObserver.observe(footer);
  }
}
