/* ========== 
   ✅ Infinite Marquee Helper 
   File: js/marquee.js
========== */

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".cap-track");

    if (track) {
        // 1. Clone the content to ensure seamless scrolling
        // We create a duplicate set of cards and append them to the end
        const content = track.innerHTML;
        track.innerHTML += content;

        // 2. Optional: If the combined width is still too small for screen,
        // clone again to be safe (for huge monitors)
        if (track.scrollWidth < window.innerWidth * 2) {
            track.innerHTML += content;
        }
    }
});