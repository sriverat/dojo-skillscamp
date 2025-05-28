document.addEventListener('DOMContentLoaded', function() {
    // Verificar que los elementos existen antes de usarlos
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-button');
    const navLinks = document.querySelectorAll('.nav-button[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const body = document.body;

    // Validar que todos los elementos necesarios existen
    if (!hamburger || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        console.error('Elementos necesarios del menú móvil no encontrados');
        return;
    }

    // Variable para controlar el estado de la animación
    let isAnimating = false;

    // Función para actualizar la sección activa
    function setActiveSection() {
        const scrollPosition = window.scrollY + 100; // Offset para mejor detección

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Función para abrir el menú
    function openMenu() {
        if (isAnimating) return;
        isAnimating = true;

        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.remove('hidden');
        mobileMenuOverlay.classList.add('active');
        body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');

        // Asegurar que el menú móvil tenga foco para accesibilidad
        mobileMenuClose.focus();

        // Prevenir el scroll del body
        const scrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';

        setTimeout(() => {
            isAnimating = false;
        }, 300); // Duración de la animación
    }

    // Función para cerrar el menú
    function closeMenu() {
        if (isAnimating) return;
        isAnimating = true;

        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');

        // Restaurar el scroll
        const scrollY = body.style.top;
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);

        // Devolver el foco al botón hamburguesa
        hamburger.focus();

        // Esperar a que termine la animación antes de ocultar el overlay
        setTimeout(() => {
            mobileMenuOverlay.classList.add('hidden');
            isAnimating = false;
        }, 300);
    }

    // Event listeners con manejo de errores
    try {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });

        mobileMenuOverlay.addEventListener('click', closeMenu);

        // Cerrar menú al hacer clic en un enlace
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // No prevenir el comportamiento por defecto para permitir la navegación
                closeMenu();
            });
        });

        // Cerrar menú con la tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Prevenir el scroll del body cuando el menú está abierto en iOS
        mobileMenu.addEventListener('touchmove', function(e) {
            const menuContent = e.target.closest('.mobile-menu-content');
            if (!menuContent || (menuContent.scrollHeight <= menuContent.clientHeight && menuContent.scrollTop === 0)) {
                e.preventDefault();
            }
        }, { passive: false });

        // Manejar cambios de orientación y redimensionamiento
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
                    closeMenu();
                }
            }, 100);
        });

        // Manejar el refresco de la página
        window.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                closeMenu();
            }
        });

        // Scroll suave para enlaces internos
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80; // Altura del header
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (mobileMenu.classList.contains('active')) {
                        closeMenu();
                    }
                }
            });
        });

        // Eventos adicionales
        window.addEventListener('scroll', setActiveSection);
        window.addEventListener('resize', setActiveSection);
        document.addEventListener('DOMContentLoaded', setActiveSection);

    } catch (error) {
        console.error('Error al inicializar el menú móvil:', error);
    }
}); 