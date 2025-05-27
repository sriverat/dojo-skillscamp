document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('hidden');
        hamburger.setAttribute('aria-expanded', !isOpen);
        body.style.overflow = isOpen ? '' : 'hidden';

        // Manejo de foco para accesibilidad
        if (!isOpen) {
            mobileMenuClose.focus();
        } else {
            hamburger.focus();
        }
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.add('hidden');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        hamburger.focus();
    }

    hamburger?.addEventListener('click', toggleMenu);
    mobileMenuClose?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    // Cerrar menú al hacer clic en un enlace
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar menú al redimensionar la ventana a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Manejar tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}); 