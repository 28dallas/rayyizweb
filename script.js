// Audio Player Class
class AudioPlayer {
    constructor(container) {
        this.container = container;
        this.audio = container.querySelector('audio');
        this.playBtn = container.querySelector('.play-pause-btn');
        this.progressBar = container.querySelector('.progress-bar');
        this.progressContainer = container.querySelector('.progress-container');
        this.timeDisplay = container.querySelector('.time-display');
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.audio.addEventListener('ended', () => this.resetPlayer());
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        // Pause all other players
        document.querySelectorAll('.audio-player').forEach(player => {
            if (player !== this.container) {
                const otherAudio = player.querySelector('audio');
                if (!otherAudio.paused) {
                    otherAudio.pause();
                    player.querySelector('.play-pause-btn i').className = 'fas fa-play';
                }
            }
        });
        
        this.audio.play();
        this.isPlaying = true;
        this.playBtn.querySelector('i').className = 'fas fa-pause';
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.querySelector('i').className = 'fas fa-play';
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    updateProgress() {
        const { duration, currentTime } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        const current = this.formatTime(this.audio.currentTime);
        const duration = this.formatTime(this.audio.duration);
        this.timeDisplay.textContent = `${current} / ${duration}`;
    }
    
    formatTime(time) {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    resetPlayer() {
        this.isPlaying = false;
        this.playBtn.querySelector('i').className = 'fas fa-play';
        this.progressBar.style.width = '0%';
        this.audio.currentTime = 0;
    }
}

// Form Handler Class
class FormHandler {
    constructor(form) {
        this.form = form;
        this.messageDiv = document.getElementById('form-message');
        this.submitBtn = form.querySelector('.submit-button');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.loading = this.submitBtn.querySelector('.loading');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        if (!this.validateForm(data)) return;
        
        this.showLoading();
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccess('Message sent successfully! We\'ll get back to you soon.');
            this.form.reset();
            this.hideLoading();
        }, 2000);
    }
    
    validateForm(data) {
        const { name, email, subject, message } = data;
        
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            this.showError('Please fill in all fields.');
            return false;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    showLoading() {
        this.btnText.style.display = 'none';
        this.loading.style.display = 'inline-block';
        this.submitBtn.disabled = true;
    }
    
    hideLoading() {
        this.btnText.style.display = 'inline';
        this.loading.style.display = 'none';
        this.submitBtn.disabled = false;
    }
    
    showMessage(message, type) {
        this.messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
            this.messageDiv.innerHTML = '';
        }, 5000);
    }
    
    showSuccess(message) {
        this.showMessage(message, 'success');
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        const mobileMenu = document.createElement('div');
        mobileMenu.classList.add('mobile-menu');
        mobileMenu.innerHTML = navLinks.outerHTML;
        document.body.appendChild(mobileMenu);

        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Navbar background change on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    navbar.style.backgroundColor = window.scrollY > 100 ? 
                        'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.8)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Initialize Audio Players
    document.querySelectorAll('.audio-player').forEach(player => {
        new AudioPlayer(player);
    });

    // Initialize Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        new FormHandler(contactForm);
    }

    // Video Slideshow
    const videoSlider = document.querySelector('.video-slider');
    const videoSlides = document.querySelectorAll('.video-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (videoSlider && videoSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = videoSlides.length;
        
        function updateSlideshow() {
            videoSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
            
            // Update slide active class
            videoSlides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlideshow();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlideshow();
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateSlideshow();
            });
        });
        
        // Auto-play slideshow
        let autoPlay = setInterval(nextSlide, 5000);
        
        // Pause auto-play on hover
        const slideshow = document.querySelector('.video-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => {
                clearInterval(autoPlay);
            });
            
            slideshow.addEventListener('mouseleave', () => {
                autoPlay = setInterval(nextSlide, 5000);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }

    // Lightbox for gallery
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    if (galleryImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close">&times;</span>
                <img id="lightbox-img" src="" alt="">
            </div>
        `;
        document.body.appendChild(lightbox);

        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const lightboxImg = document.getElementById('lightbox-img');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.style.display = 'flex';
            });
        });

        lightbox.querySelector('.close').addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
        
        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex' && e.key === 'Escape') {
                lightbox.style.display = 'none';
            }
        });
    }
    
    // Initialize Stats Counter
    initStatsCounter();
    
    // Initialize Calendar
    initCalendar();
    
    // Initialize Testimonials Slider
    initTestimonials();
    
    // Initialize Newsletter
    initNewsletter();
});

// Stats Counter Animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Calendar Widget
function initCalendar() {
    const currentMonthElement = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (!currentMonthElement || !calendarGrid) return;
    
    let currentDate = new Date();
    const bookedDates = [5, 12, 18, 25];
    const pendingDates = [8, 15, 22];
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthElement.textContent = new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        calendarGrid.innerHTML = '';
        
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '0.5rem';
            calendarGrid.appendChild(dayHeader);
        });
        
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarGrid.appendChild(emptyDay);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'calendar-day';
            
            if (bookedDates.includes(day)) {
                dayElement.classList.add('booked');
            } else if (pendingDates.includes(day)) {
                dayElement.classList.add('pending');
            } else {
                dayElement.classList.add('available');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    renderCalendar();
}

// Testimonials Slider
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    setInterval(nextSlide, 6000);
}

// Newsletter Subscription
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            }
        });
    }
}

// WhatsApp Chat Widget
function toggleChat() {
    const chatPopup = document.getElementById('chat-popup');
    if (chatPopup) {
        chatPopup.classList.toggle('active');
    }
}

// Service booking buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('service-btn')) {
        const service = e.target.closest('.service-card').querySelector('h3').textContent;
        const message = `Hi DJ Rayyiz, I'm interested in booking your ${service} service.`;
        const whatsappUrl = `https://wa.me/254768224111?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
});

// Performance optimization: Preload critical resources
function preloadResources() {
    const criticalImages = [
        'img/logo2.png',
        'img/pexels-cesar-de-miranda-1252217-2381596.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadResources);
} else {
    preloadResources();
}

// Make toggleChat function globally available
window.toggleChat = toggleChat;