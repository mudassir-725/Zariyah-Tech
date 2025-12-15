/*
 * ========== EFFECTS SCRIPT ==========
 */

// ========== Ripple Effect ==========
{
    document.querySelectorAll('.ripple-effect').forEach(elem => {
        elem.style.position = elem.style.position || 'relative'; // ensure positioning context

        elem.addEventListener('click', e => {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calculate size
            const rect = elem.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';

            // Position the ripple at click position
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            // Apply ripple color from data attribute if present
            const color = elem.dataset.rippleColor;
            if (color === 'dark') {
                ripple.style.backgroundColor = 'rgba(0,0,0,0.4)';
            } else {
                ripple.style.backgroundColor = 'rgba(255,255,255,0.6)';
            }

            elem.appendChild(ripple);

            // Remove ripple after animation ends
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// ========== Scroll Reveal ==========
{
    (() => {
        const reveals = document.querySelectorAll(".reveal");

        function revealOnScroll() {
            const viewportHeight = window.innerHeight;

            reveals.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const elVisible =
                    rect.top < viewportHeight * 0.95 && rect.bottom > 0;

                if (elVisible) {
                    el.classList.add("visible");
                } else {
                    el.classList.remove("visible");
                }
            });
        }

        window.addEventListener("scroll", revealOnScroll);
        window.addEventListener("load", revealOnScroll);
    })();

}

// ============= Auto Text Effect ==========
{
    function autoTypeText({ elementId, texts, speed = 60, delay = 1500 }) {
        const element = document.getElementById(elementId);
        let textIndex = 0;
        let charIndex = 1;

        function type() {
            const currentText = texts[textIndex];
            element.innerText = currentText.slice(0, charIndex++);
            if (charIndex <= currentText.length) {
                setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    charIndex = 1;
                    textIndex = (textIndex + 1) % texts.length;
                    type();
                }, delay);
            }
        }

        type();
    }

    // Initialize Typing Effects
    autoTypeText({
        elementId: 'text-hero',
        texts: [
            "Software Development",
            "Cloud & Devops Engineering",
            "Full Stack Web Development",
            "Content Writing",
            "Problem Solving"
        ]
    });

    autoTypeText({
        elementId: 'text-services',
        texts: [
            "Software Development",
            "Cloud & Devops Engineering",
            "Full Stack Web Development",
            "Content Writing",
            "Problem Solving"
        ]
    });
}

// ========== FapNav Scroll Navigation ==========
{
    const fapNavSectionIds = ['Navs', 'Heros', 'Services', 'Experiences', 'Educations', 'Skills', 'Certifications', 'Projects', 'Researchs', 'Blogs', 'FAQs', 'Solutes', ''];

    const fapNavBtn = document.getElementById('fapNavBtn');
    const fapNavArrowIcon = document.getElementById('fapNavArrowIcon');

    let fapNavShowUpArrow = false;
    const FAP_NAV_SCROLL_OFFSET = 75;

    function fapNavGetCurrentSectionIndex() {
        let currentIndex = 0;
        const currentScrollY = window.scrollY;

        fapNavSectionIds.forEach((id, i) => {
            const sectionEl = document.getElementById(id);
            if (sectionEl && currentScrollY >= sectionEl.offsetTop - window.innerHeight / 2) {
                currentIndex = i;
            }
        });

        return currentIndex;
    }

    function fapNavIsSoluteVisible() {
        const soluteEl = document.getElementById('Solutes');
        if (!soluteEl) return false;

        const rect = soluteEl.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function fapNavUpdateArrow() {
        // Remove both bounce classes before switching
        fapNavBtn.classList.remove('anim-bounce-up', 'anim-bounce-down');

        if (fapNavIsSoluteVisible()) {
            fapNavShowUpArrow = true;
            fapNavArrowIcon.src = './assets/logo/icons/up-arrow.svg';
            fapNavBtn.classList.add('anim-bounce-up');
        } else {
            fapNavShowUpArrow = false;
            fapNavArrowIcon.src = './assets/logo/icons/down-arrow.svg';
            fapNavBtn.classList.add('anim-bounce-down');
        }
    }

    function fapNavHandleClick() {
        if (fapNavShowUpArrow) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const currentIndex = fapNavGetCurrentSectionIndex();
            const nextId = fapNavSectionIds[currentIndex + 1];
            const nextEl = document.getElementById(nextId);

            if (nextEl) {
                const targetY = nextEl.offsetTop - FAP_NAV_SCROLL_OFFSET;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
        }
    }

    fapNavBtn.addEventListener('click', fapNavHandleClick);
    window.addEventListener('scroll', fapNavUpdateArrow);
    window.addEventListener('load', fapNavUpdateArrow);
}