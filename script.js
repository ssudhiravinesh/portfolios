// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Animation ---
    const preloader = document.getElementById('preloader');
    const preloaderShape = document.getElementById('preloader-shape');
    const mainContent = document.body; // Target body for fade-in

    if (preloader && preloaderShape) {
        // Ensure path length calculation happens after SVG is potentially rendered
        setTimeout(() => {
            const pathLength = preloaderShape.getTotalLength();

            // Set initial state for line drawing
            anime.set(preloaderShape, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
                opacity: 1 // Ensure it's visible for drawing
            });

            const preloaderTimeline = anime.timeline({
                easing: 'easeInOutSine',
                complete: function() {
                    // Hide preloader physically after fade out
                    preloader.style.display = 'none';
                    // Make body visible
                    mainContent.classList.add('loaded');
                    // Trigger hero animation *after* preloader is done
                    animateHero();
                }
            });

            preloaderTimeline
                .add({
                    targets: preloaderShape,
                    strokeDashoffset: [pathLength, 0],
                    duration: 1800,
                    easing: 'easeInOutQuart',
                })
                .add({ // Add a slight pulse/glow effect
                    targets: preloaderShape,
                    strokeWidth: [3, 5, 3],
                    opacity: [1, 0.7, 1],
                    duration: 800,
                    easing: 'easeInOutCirc',
                    offset: '-=800' // Overlap slightly with end of draw
                }, '+=200') // Start shortly after drawing starts
                .add({
                    targets: preloader,
                    opacity: [1, 0],
                    duration: 700,
                    easing: 'easeOutExpo',
                }, '-=500'); // Start fade out before pulse ends

        }, 100); // Small delay just in case

    } else {
        // If no preloader, show content immediately and run hero animation
        mainContent.classList.add('loaded');
        animateHero();
    }


    // --- Hero Text Animation ---
    function animateHero() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDesc = document.querySelector('.hero-description');
        const ctaButton = document.querySelector('.cta-button');

        if (!heroTitle) return; // Exit if hero elements not found

        // Wrap letters in spans
        heroTitle.innerHTML = heroTitle.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        const heroTimeline = anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        });

        heroTimeline
            .add({
                targets: '.hero-title .letter',
                translateY: [-100, 0],
                opacity: [0, 1],
                duration: 1200,
                delay: anime.stagger(50) // Stagger letter animation
            })
            .add({
                targets: [heroSubtitle, heroDesc, ctaButton],
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: anime.stagger(100)
            }, '-=800'); // Start slightly before title finishes

        // Add subtle floating effect to the whole content block after initial animation
        anime({
            targets: '.hero-content',
            translateY: ['-5px', '5px'],
            duration: 4000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            delay: heroTimeline.duration // Start after initial animation
        });
    }

    // --- Scroll Reveal Animations (Intersection Observer) ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Optional: Animate with Anime.js directly instead of CSS class
                 // if (entry.target.classList.contains('project-card')) {
                 //     anime({
                 //         targets: entry.target,
                 //         opacity: [0, 1],
                 //         translateY: [50, 0],
                 //         scale: [0.9, 1],
                 //         duration: 800,
                 //         easing: 'easeOutExpo'
                 //     });
                 // } else {
                 //     anime({
                 //         targets: entry.target,
                 //         opacity: [0, 1],
                 //         translateY: [30, 0],
                 //         duration: 600,
                 //         easing: 'easeOutSine'
                 //     });
                 // }


                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    scrollElements.forEach(el => {
        elementObserver.observe(el);
    });


    // --- Project Card Hover Effect (Example - Enhance CSS Hover) ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                // CSS already handles transform/shadow, maybe add subtle detail?
                // e.g., animate border color intensity or background gradient
                 borderColor: ['rgba(0, 191, 255, 0.5)', 'rgba(0, 191, 255, 1)'],
                 duration: 300,
                 easing: 'linear'
            });
        });
        card.addEventListener('mouseleave', () => {
             anime({
                 targets: card,
                 borderColor: ['rgba(0, 191, 255, 1)', 'rgba(0, 191, 255, 0.5)'], // Fade back (or to transparent)
                 duration: 500,
                 easing: 'linear'
             });
        });
    });


    // --- Smooth Scroll for Hero CTA ---
    const ctaButton = document.querySelector('#hero .cta-button');
    const aboutSection = document.querySelector('#about');

    if (ctaButton && aboutSection) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor jump
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded