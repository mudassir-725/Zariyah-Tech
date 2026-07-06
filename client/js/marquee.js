/* Duplicates marquee content once for a seamless, reusable loop. */
export function initMarquee() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.querySelectorAll("[data-marquee]").forEach((marquee) => {
    const track = marquee.querySelector("[data-marquee-track]");
    if (!track || track.dataset.ready === "true" || reducedMotion) return;

    const originalItems = [...track.children];
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, input, select, textarea").forEach(
        (control) => control.setAttribute("tabindex", "-1"),
      );
      track.appendChild(clone);
    });

    track.dataset.ready = "true";
  });
}
