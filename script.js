document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-loader');
    const stack = document.getElementById("card-stack");
     
    // ==========================================
    // 1. LOADER & INITIAL LANDING SEQUENCE
    // ==========================================
    
    // Lock scroll immediately on script load
    document.body.style.overflow = "hidden";

    window.addEventListener('load', () => {
        // Step A: Initial Dumbbell Animation Duration (1.5s)
        setTimeout(() => {
            loader.classList.add('reveal');
            document.body.style.overflow = ""; // Restore scroll as curtains open

            // Step B: Trigger Hero "Pop" while curtains are opening
            setTimeout(() => {
                const heroItems = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-badge, .hero-actions, .mini-card, .social-stack');
                heroItems.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, index * 100); // Staggered entrance
                });
            }, 400);

            // Step C: Clean up Loader completely
            setTimeout(() => {
                loader.classList.add('done');
                loader.style.display = 'none';
            }, 1000); 
        }, 1500);
    });

    // ==========================================
    // 2. SCROLL REVEAL LOGIC (INTERSECTION OBSERVER)
    // ==========================================
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Apply base class and observe all specified elements
    const elementsToReveal = [
        '.hero-title', '.hero-subtitle', '.hero-badge', '.hero-actions', 
        '.mini-card', '.issue-card', '.impact-item', '.big-stat', '.post-card'
    ];

    document.querySelectorAll(elementsToReveal.join(',')).forEach(el => {
        el.classList.add('reveal-on-scroll');
        // If it's not a hero element, observe it for scroll reveal
        if (!el.closest('.hero-inner')) {
            revealObserver.observe(el);
        }
    });

    // ==========================================
    // 3. SOCIAL CARD STACK (SWIPE & ROTATION)
    // ==========================================
    
    const cards = Array.from(stack.querySelectorAll(".post-card"));
    let currentIndex = 0;
    let isAnimating = false;

    function rotateCards() {
        if (isAnimating) return;
        isAnimating = true;

        const currentCard = cards[currentIndex];
        const nextIndex = (currentIndex + 1) % cards.length;
        const waitingIndex = (currentIndex + 2) % cards.length;

        currentCard.classList.add("swiped");
        currentCard.classList.remove("active");

        cards[nextIndex].classList.remove("next");
        cards[nextIndex].classList.add("active");

        cards[waitingIndex].classList.remove("waiting");
        cards[waitingIndex].classList.add("next");

        setTimeout(() => {
            currentCard.classList.remove("swiped");
            currentCard.classList.add("waiting");
            currentIndex = nextIndex;
            isAnimating = false;
        }, 600);
    }

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let activeCard = null;

    function handleStart(e) {
        const target = e.target.closest('.post-card.active');
        if (!target || isAnimating) return;
        
        activeCard = target;
        isDragging = true;
        const point = e.type.includes('touch') ? e.touches[0] : e;
        startX = point.clientX;
        startY = point.clientY;
        activeCard.style.transition = 'none';
    }

    function handleMove(e) {
        if (!isDragging || !activeCard) return;
        const point = e.type.includes('touch') ? e.touches[0] : e;
        currentX = point.clientX - startX;
        const currentY = point.clientY - startY;
        
        const rotation = currentX * 0.1;
        activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
    }

    function handleEnd() {
        if (!isDragging || !activeCard) return;
        isDragging = false;
        activeCard.style.transition = '';
        activeCard.style.transform = '';

        if (currentX > 100) {
            rotateCards();
        }
        activeCard = null;
        currentX = 0;
    }

    stack.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    stack.addEventListener("touchstart", handleStart, { passive: false });
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    stack.addEventListener("dragstart", (e) => e.preventDefault());
});