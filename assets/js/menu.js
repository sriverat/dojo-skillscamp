document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    let isAnimating = false;

    function toggleMenu(shouldOpen = null) {
        if (isAnimating) return;
        isAnimating = true;

        const isOpen = shouldOpen !== null ? !shouldOpen : mobileMenu.classList.contains('active');
        
        if (!isOpen) {
            overlay.classList.remove('hidden');
            // Dar tiempo al navegador para pintar el overlay antes de hacerlo visible
            requestAnimationFrame(() => {
                mobileMenu.classList.add('active');
                overlay.classList.add('opacity-100');
                hamburger.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
                mobileMenuClose.focus();
            });
        } else {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('opacity-100');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
            hamburger.focus();
            
            // Esperar a que termine la transición antes de ocultar el overlay
            setTimeout(() => {
                overlay.classList.add('hidden');
                isAnimating = false;
            }, 300);
            return;
        }

        isAnimating = false;
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    }

    // Event Listeners
    hamburger?.addEventListener('click', () => toggleMenu());
    mobileMenuClose?.addEventListener('click', () => toggleMenu(false));
    overlay?.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', handleEscapeKey);

    // Cerrar menú al hacer clic en un enlace
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar menú al redimensionar la ventana a desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        }, 100);
    });

    // Prevenir scroll cuando el menú está abierto en iOS
    mobileMenu.addEventListener('touchmove', function(e) {
        const target = e.target;
        if (!target.closest('.mobile-menu-content')) {
            e.preventDefault();
        }
    }, { passive: false });
}); 