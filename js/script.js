/**
 * Cross株式会社 コーポレートサイト
 * JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Elements
    // ============================================
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-list a');

    // ============================================
    // Hero Slider
    // ============================================
    initHeroSlider();

    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');

        if (slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval;
        const intervalTime = 6000;

        function showSlide(index) {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;

            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                // Reset animations
                const content = slide.querySelector('.hero-content');
                if (content) {
                    content.querySelectorAll('.hero-catch, .hero-title, .hero-desc').forEach(el => {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                        el.style.animation = '';
                    });
                }
            });
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                stopAutoSlide();
                showSlide(index);
                startAutoSlide();
            });
        });

        startAutoSlide();

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoSlide);
            heroSection.addEventListener('mouseleave', startAutoSlide);
        }
    }

    // ============================================
    // Loader
    // ============================================
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');

            // トリガーアニメーション after load
            initScrollAnimations();
        }, 1800);
    });

    document.body.classList.add('loading');

    // ============================================
    // Header Scroll Effect
    // ============================================
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // ヘッダーの背景変更
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top ボタン
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // Hamburger Menu
    // ============================================
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // ナビゲーションリンクをクリックしたらメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // Smooth Scroll
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Back to Top
    // ============================================
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // Scroll Animations (AOS-like)
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');

        const counterOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();
                    const isDecimal = target % 1 !== 0;

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const current = start + (target - start) * easeProgress;

                        if (isDecimal) {
                            counter.textContent = current.toFixed(1);
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString();
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            if (isDecimal) {
                                counter.textContent = target.toFixed(1);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, counterOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounters();

    // ============================================
    // Parallax Effect for Hero
    // ============================================
    const heroPattern = document.querySelector('.hero-pattern');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (heroPattern && scrolled < window.innerHeight) {
            heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // ============================================
    // Service Cards Hover Effect
    // ============================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // Resize Handler
    // ============================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // モバイルメニューが開いている状態でリサイズされた場合
            if (window.innerWidth > 1024) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // ============================================
    // Form Validation (if contact form exists)
    // ============================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // バリデーションロジックをここに追加
            const formData = new FormData(this);
            console.log('Form submitted:', Object.fromEntries(formData));

            // 成功メッセージを表示するロジック
        });
    }

    // ============================================
    // Preload Images
    // ============================================
    function preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // 必要に応じて画像をプリロード
    // preloadImages(['images/hero.jpg', 'images/about.jpg']);

    // ============================================
    // Performance: Lazy Load Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Console Message
    // ============================================
    console.log('%c Cross株式会社 ', 'background: #1a365d; color: #10b981; font-size: 20px; padding: 10px 20px;');
    console.log('%c 製造現場の頼れるパートナー ', 'color: #2563eb; font-size: 12px;');
});
