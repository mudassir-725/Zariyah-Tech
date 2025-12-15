// Core Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const logoImage = document.getElementById('logo-img');

// NavBar JS
{
    // Toggle Mobile Nav
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');

        if (isOpen) {
            navbar.style.height = `${navbar.scrollHeight + navLinks.scrollHeight}px`;
        } else {
            collapseNav();
        }
    });


    // Close nav on clicking outside (mobile only)
    document.body.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !navbar.contains(e.target) && navLinks.classList.contains('active')) {
            collapseNav();
        }
    });

    // Collapse nav function
    function collapseNav() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
        navbar.style.height = '';
    }

    // Navbar Expand Resizer
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) collapseNav();
    });

    // Navbar Scroll Behavior
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
        // logoImage.src = scrolled ? './assets/logo/brand/M Logo B.png' : './assets/logo/brand/M Logo W.png';

        // Hndle hamburger color change on scroll
        hamburger.querySelectorAll('span').forEach(span => {
            span.style.backgroundColor = scrolled ? '#284B63' : '#284B63';
        });

        if (scrolled && navLinks.classList.contains('active')) {
            collapseNav();
        }
    });
}

// Smooth scroll to sections with offset
{
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = navbar.offsetHeight + 32; // Additional offset
                window.scrollTo({
                    top: targetSection.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}