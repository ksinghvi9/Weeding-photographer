// ----------------------------------------------------
// LENIS SMOOTH SCROLLER INITIALIZATION
// ----------------------------------------------------
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Request Animation Frame loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ----------------------------------------------------
// GSAP & SCROLLTRIGGER SETUP
// ----------------------------------------------------
function initGSAPAnimations() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 1. Shutter Preloader & Entry Timelines
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.shutter-progress-bar');
  const monogram = document.querySelector('.preloader-monogram');
  const brand = document.querySelector('.preloader-brand');
  const loc = document.querySelector('.preloader-loc');
  const progressContainer = document.querySelector('.preloader-shutter-container');

  // Fade in preloader elements sequentially
  const preloaderTl = gsap.timeline({
    onComplete: () => {
      // Simulate loading progress
      let progress = { value: 0 };
      gsap.to(progress, {
        value: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          progressBar.style.width = `${progress.value}%`;
        },
        onComplete: () => {
          // Animate entry after progress finishes
          startEntryAnimation();
        }
      });
    }
  });

  preloaderTl.to(monogram, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
             .to(brand, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
             .to(loc, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
             .to(progressContainer, { opacity: 1, duration: 0.4 }, '-=0.2');

  function startEntryAnimation() {
    const entryTl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        // Enable scrolling
        document.body.style.overflow = 'auto';
      }
    });

    entryTl.to('.preloader-content', { opacity: 0, y: -30, duration: 0.6, ease: 'power3.in' })
           .to('.gate-top', { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '-=0.2')
           .to('.gate-bottom', { yPercent: 100, duration: 1.2, ease: 'power4.inOut' }, '-=1.2')
           .from('.hero-video-wrapper', { scale: 1.1, duration: 1.6, ease: 'power2.out' }, '-=0.8')
           .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=1.0')
           .from('.hero-title span', { yPercent: 100, duration: 1.0, ease: 'power3.out', stagger: 0.15 }, '-=0.8')
           .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
           .from('.header', { yPercent: -100, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
           .from('.audio-control-btn, .floating-availability-btn', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4');
  }

  // Disable scroll initially
  document.body.style.overflow = 'hidden';

  // 2. Navbar glassmorphism scroll trigger
  ScrollTrigger.create({
    start: 'top -50px',
    onEnter: () => document.querySelector('.header').classList.add('scrolled'),
    onLeaveBack: () => document.querySelector('.header').classList.remove('scrolled'),
  });

  // 3. Editorial reveals on sections
  gsap.utils.toArray('.section-tag, .section-title, .about-heading, .about-text, .signature').forEach((elem) => {
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // 4. Parallax effect on gallery masonry items
  gsap.utils.toArray('.masonry-item-inner img').forEach((img) => {
    gsap.fromTo(img, {
      yPercent: -8
    }, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });

  // 5. Testimonial Background Shifting effect
  const testimonials = document.getElementById('testimonials');
  if (testimonials) {
    gsap.to(testimonials, {
      backgroundColor: '#EADFC9', // Shifts to warm gold-sand
      duration: 1,
      scrollTrigger: {
        trigger: testimonials,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: true,
      }
    });
  }

  // 6. Counter Items Trigger
  gsap.utils.toArray('.counter-number').forEach((counter) => {
    const targetStr = counter.getAttribute('data-target');
    const isFloat = targetStr.includes('.');
    const target = parseFloat(targetStr);
    const countObj = { value: 0 };
    
    gsap.to(countObj, {
      value: target,
      duration: 2.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        counter.textContent = isFloat ? countObj.value.toFixed(1) : Math.floor(countObj.value);
      }
    });
  });

  // 7. Experience Timeline steps reveal
  gsap.utils.toArray('.timeline-step').forEach((step, index) => {
    gsap.from(step.querySelector('.timeline-icon'), {
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
      },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });

    gsap.from(step.querySelector('.timeline-content'), {
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
      },
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}

// ----------------------------------------------------
// FEATURED STORIES AUTO-SCROLL (INFINITE MARQUEE)
// ----------------------------------------------------
function initStoriesAutoScroll() {
  const container = document.querySelector('.horizontal-scroll-container');
  const wrapper = document.querySelector('.horizontal-scroll-wrapper');
  if (!container || !wrapper) return;

  const originalCards = Array.from(wrapper.children);
  
  // Clone all original cards to double the scrollable width
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    wrapper.appendChild(clone);
  });

  let scrollLeft = 0;
  let isPaused = false;
  const speed = 0.5; // Slow, elegant auto-scroll speed (pixels per frame)

  let originalWidth = wrapper.scrollWidth / 2;

  // Recalculate layout dimensions on window resize
  window.addEventListener('resize', () => {
    originalWidth = wrapper.scrollWidth / 2;
  });

  function tick() {
    if (!isPaused) {
      scrollLeft += speed;
      if (scrollLeft >= originalWidth) {
        scrollLeft -= originalWidth; // Instantly loops back seamlessly
      }
      container.scrollLeft = scrollLeft;
    }
    requestAnimationFrame(tick);
  }

  // Mouse hover events to pause/play scroller
  container.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  
  container.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // Start marquee loop
  requestAnimationFrame(tick);
}

// ----------------------------------------------------
// PORTFOLIO FILTER & LAYOUT MANAGEMENT
// ----------------------------------------------------
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // GSAP smooth fade timeline
      const filterTl = gsap.timeline();

      // Fade out all grid items
      filterTl.to('.portfolio-masonry', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          masonryItems.forEach((item) => {
            const categories = item.getAttribute('data-category').split(' ');
            if (filterValue === 'all' || categories.includes(filterValue)) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          });
          // Recalculate Lenis scroll dimensions
          if (lenis) lenis.resize();
        }
      });

      // Fade grid back in
      filterTl.to('.portfolio-masonry', {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
}

// ----------------------------------------------------
// FULLSCREEN LIGHTBOX GALLERY
// ----------------------------------------------------
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!modal) return;

  let currentIndex = 0;
  let activeItems = [];

  function showImage(index) {
    if (activeItems.length === 0) return;
    if (index < 0) index = activeItems.length - 1;
    if (index >= activeItems.length) index = 0;
    currentIndex = index;

    const currentItem = activeItems[currentIndex];
    const imgEl = currentItem.querySelector('img');
    const titleEl = currentItem.querySelector('.item-title');
    const metaEl = currentItem.querySelector('.item-meta');

    const title = titleEl ? titleEl.textContent : '';
    const meta = metaEl ? metaEl.textContent : '';

    // Apply smooth fadeout/fadein sequence on change
    gsap.to(lightboxImg, {
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      onComplete: () => {
        lightboxImg.src = imgEl.getAttribute('data-src') || imgEl.src;
        lightboxTitle.textContent = title;
        lightboxMeta.textContent = meta;
        
        gsap.to(lightboxImg, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  }

  // Delegated document click listener
  document.addEventListener('click', (e) => {
    const masonryItem = e.target.closest('.masonry-item');
    const storyItem = e.target.closest('.story-grid-item');

    if (masonryItem) {
      activeItems = Array.from(document.querySelectorAll('.masonry-item')).filter(item => !item.classList.contains('hidden'));
      currentIndex = activeItems.indexOf(masonryItem);
      modal.classList.add('active');
      showImage(currentIndex);
      if (lenis) lenis.stop();
    } else if (storyItem) {
      activeItems = Array.from(document.querySelectorAll('.story-grid-item'));
      currentIndex = activeItems.indexOf(storyItem);
      modal.classList.add('active');
      showImage(currentIndex);
      if (lenis) lenis.stop();
    }
  });

  // Close lightbox action
  function closeLightbox() {
    modal.classList.remove('active');
    
    // Check if other modals are still active before resuming page scroll
    const storyModal = document.getElementById('story-modal');
    const consultationModal = document.getElementById('consultation-modal');
    const videoModal = document.getElementById('video-player-modal');
    
    const anyModalOpen = 
      (storyModal && storyModal.classList.contains('active')) ||
      (consultationModal && consultationModal.classList.contains('active')) ||
      (videoModal && videoModal.classList.contains('active'));

    if (!anyModalOpen && lenis) {
      lenis.start();
    }
  }

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === document.querySelector('.lightbox-content')) {
      closeLightbox();
    }
  });

  // Next / Prev listeners
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  // Touch/Swipe Mobile support
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  modal.addEventListener('touchend', (e) => {
    if (!modal.classList.contains('active')) return;
    let touchEndX = e.changedTouches[0].screenX;
    let diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) showImage(currentIndex + 1); // Swiped left -> next
      if (diff > 0) showImage(currentIndex - 1); // Swiped right -> prev
    }
  });
}

// ----------------------------------------------------
// CINEMATIC FILMS AND CARDS
// ----------------------------------------------------
function initFilms() {
  const cards = document.querySelectorAll('.film-card');
  const videoPlayerModal = document.getElementById('video-player-modal');
  const player = document.getElementById('cinematic-player');
  const closePlayerBtn = document.querySelector('.video-player-close');

  if (!videoPlayerModal) return;

  cards.forEach((card) => {
    const video = card.querySelector('.film-preview-video');
    const videoUrl = card.getAttribute('data-video-url');

    // 1. Muted Autoplay preview on mouse hover
    card.addEventListener('mouseenter', () => {
      if (video) {
        video.play().catch(e => console.log("Autoplay preview blocked:", e));
      }
    });

    card.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // 2. Play cinematic fullscreen video on click
    card.addEventListener('click', () => {
      player.src = videoUrl;
      videoPlayerModal.classList.add('active');
      player.play();
      if (lenis) lenis.stop();
    });
  });

  function closeVideoPlayer() {
    videoPlayerModal.classList.remove('active');
    player.pause();
    player.src = ''; // reset source
    if (lenis) lenis.start();
  }

  closePlayerBtn.addEventListener('click', closeVideoPlayer);
  videoPlayerModal.addEventListener('click', (e) => {
    if (e.target === videoPlayerModal) {
      closeVideoPlayer();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (videoPlayerModal.classList.contains('active') && e.key === 'Escape') {
      closeVideoPlayer();
    }
  });
}

// ----------------------------------------------------
// LUXURY CAROUSEL (TESTIMONIALS)
// ----------------------------------------------------
function initTestimonialsCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  let autoPlayTimer;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoPlayTimer);
      const index = parseInt(dot.getAttribute('data-slide'));
      showSlide(index);
      startAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      let next = currentSlide + 1;
      if (next >= slides.length) next = 0;
      showSlide(next);
    }, 6000); // 6s duration
  }

  startAutoPlay();
}

// ----------------------------------------------------
// LAZY MEDIA LOAD (INTERSECTION OBSERVER)
// ----------------------------------------------------
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy-media');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback
    lazyImages.forEach((img) => {
      img.src = img.getAttribute('data-src');
      img.classList.add('loaded');
    });
  }
}

// ----------------------------------------------------
// MOBILE MENU NAVIGATION
// ----------------------------------------------------
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const menuOverlay = document.querySelector('.mobile-nav-overlay');
  const navItems = document.querySelectorAll('.mobile-nav-item');

  if (!menuBtn || !menuOverlay) return;

  menuBtn.addEventListener('click', () => {
    const isActive = menuBtn.classList.toggle('active');
    menuOverlay.classList.toggle('active', isActive);

    if (isActive) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
  });

  // Close overlay on nav item click
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      menuOverlay.classList.remove('active');
      if (lenis) lenis.start();
    });
  });
}

// ----------------------------------------------------
// AUDIO SOUNDTRACK TOGGLE
// ----------------------------------------------------
function initAudioController() {
  const audio = document.getElementById('ambient-audio');
  const btn = document.getElementById('audio-toggle');
  
  if (!audio || !btn) return;

  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      btn.querySelector('.audio-label').textContent = 'PLAY AUDIO';
      isPlaying = false;
    } else {
      audio.play()
        .then(() => {
          btn.classList.add('playing');
          btn.querySelector('.audio-label').textContent = 'MUTE AUDIO';
          isPlaying = true;
        })
        .catch(e => {
          console.log("Audio play blocked by browser:", e);
          // Try loading direct fallback source explicitly
          audio.src = "https://archive.org/download/ThreeGnossiennesErikSatie/Satie.mp3";
          audio.play().then(() => {
            btn.classList.add('playing');
            btn.querySelector('.audio-label').textContent = 'MUTE AUDIO';
            isPlaying = true;
          });
        });
    }
  });
}

// ----------------------------------------------------
// RESERVATION CONSULTATION MODAL FORM
// ----------------------------------------------------
function initConsultationForm() {
  const trigger = document.getElementById('consultation-trigger');
  const modal = document.getElementById('consultation-modal');
  const close = document.querySelector('.consultation-close');
  const form = document.getElementById('consultation-form');

  if (!modal) return;

  // Open modal triggers
  const openTriggers = [trigger, document.getElementById('floating-availability')];

  openTriggers.forEach((trig) => {
    if (trig) {
      trig.addEventListener('click', (e) => {
        if (trig.id === 'floating-availability') {
          e.preventDefault();
        }
        modal.classList.add('active');
        if (lenis) lenis.stop();
      });
    }
  });

  // Close modal functions
  function closeModal() {
    modal.classList.remove('active');
    if (lenis) lenis.start();
  }

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Grab user names
      const names = document.getElementById('client-name').value;
      
      // Show elegant success alert
      alert(`Thank you ${names}, your reservation request has been received. We will get back to you within 24 hours to schedule our consultation.`);
      
      form.reset();
      closeModal();
    });
  }
}

// ----------------------------------------------------
// MAGAZINE-STYLE FEATURED STORY MODAL CONTENT
// ----------------------------------------------------
function initMagazineStories() {
  const viewBtns = document.querySelectorAll('.story-view-btn');
  const modal = document.getElementById('story-modal');
  const contentContainer = document.querySelector('.story-modal-content');
  const closeBtn = document.querySelector('.story-modal-close');
  const card = modal ? modal.querySelector('.story-modal-card') : null;

  if (!modal || !contentContainer || !card) return;

  const storiesData = {
    "Aarav & Meera": {
      location: "The Oberoi Udaivilas, Udaipur",
      date: "November 12, 2025",
      heroImage: "/images/couple_palace.png",
      description: "An elegant pre-wedding collection capturing quiet smiles and historic architectural beauty across palatial arches.",
      tags: ["Pre Wedding", "Heritage", "Royal Portraiture"],
      images: [
        { src: "/images/couple_palace.png", title: "Palace Romance", meta: "The Oberoi Udaivilas", layoutClass: "col-span-2" },
        { src: "/images/bride_portrait.png", title: "Bridal Splendor", meta: "Polki Jewellery", layoutClass: "portrait" },
        { src: "/images/royal_groom.png", title: "Royal Groom", meta: "Courtyard Light", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1591555200813-b5e298ee9dca?auto=format&fit=crop&w=800&q=80", title: "Henna Details", meta: "Bridal Prep", layoutClass: "square" },
        { src: "/images/wedding_ceremony.png", title: "The Vows", meta: "Sacred Fire", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", title: "Lakeside Mandap", meta: "Sunset Ceremony", layoutClass: "landscape" },
        { src: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=80", title: "Candid Laughter", meta: "Haldi Moments", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80", title: "Varmala Ceremony", meta: "The Royal Union", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", title: "First Dance", meta: "Grand Ballroom", layoutClass: "portrait" }
      ]
    },
    "Rohan & Priya": {
      location: "Fateh Garh Palace",
      date: "October 18, 2025",
      heroImage: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1200&q=80",
      description: "A heritage wedding overlooking Udaipur city, filled with royal custom colors and candid emotional vows.",
      tags: ["Royal Wedding", "Heritage", "Vibrant Ceremony"],
      images: [
        { src: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1000&q=80", title: "Candid Walk", meta: "Fateh Garh Palace", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80", title: "The Palace Entrance", meta: "Arriving at Fateh Garh", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80", title: "Dancing Under Stars", meta: "Garden Reception", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1591555200813-b5e298ee9dca?auto=format&fit=crop&w=1000&q=80", title: "Henna Grace", meta: "Hand details", layoutClass: "square" },
        { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80", title: "Mandap View", meta: "Lakeside Ceremony", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1550005814-724f3620c47d?auto=format&fit=crop&w=1000&q=80", title: "Palace Ballroom", meta: "Reception Hall", layoutClass: "landscape" },
        { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80", title: "The Varmala Exchange", meta: "Traditional Ritual", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80", title: "Pure Joy", meta: "Candid Smile", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1519225495810-7512c696af37?auto=format&fit=crop&w=1000&q=80", title: "Shadows and Light", meta: "Lake Pier", layoutClass: "portrait" }
      ]
    },
    "Kunal & Aditi": {
      location: "Chunda Palace",
      date: "December 08, 2025",
      heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      description: "A spectacular indoor traditional palace wedding highlighting intricate gold walls and vibrant traditional events.",
      tags: ["Palace Luxury", "Sheesh Mahal", "Traditional Ceremony"],
      images: [
        { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80", title: "The Indoor Mandap", meta: "Chunda Palace", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1507504038482-76210f5c0be1?auto=format&fit=crop&w=1000&q=80", title: "Golden Hour Glow", meta: "Lakeside View", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1519225495810-7512c696af37?auto=format&fit=crop&w=1000&q=80", title: "Quiet Moments", meta: "Palace Corridor", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1000&q=80", title: "Bridal Portrait", meta: "Sunrise Light", layoutClass: "square" },
        { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80", title: "Ring Exchange", meta: "Lakeside Deck", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1529636798458-955852a41286?auto=format&fit=crop&w=1000&q=80", title: "The Dinner Spread", meta: "Palace Gardens", layoutClass: "landscape" },
        { src: "https://images.unsplash.com/photo-1502472591609-f641fc718695?auto=format&fit=crop&w=1000&q=80", title: "Hand in Hand", meta: "Palace Courtyard", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80", title: "Candid Grace", meta: "Bride's Portrait", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80", title: "Departure", meta: "Bidaai Ceremony", layoutClass: "portrait" }
      ]
    },
    "Harsh & Naina": {
      location: "Jagmandir Island Palace",
      date: "September 24, 2025",
      heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      description: "A sunset celebration set on a private island, capturing deep emotional glances and beautiful reflections.",
      tags: ["Island Wedding", "Sunset", "Emotional Vows"],
      images: [
        { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80", title: "Palatial Scale", meta: "Jagmandir Island", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80", title: "Sunset Stroll", meta: "Island Deck", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80", title: "Whispers by the Water", meta: "Lake Pichola Side", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1000&q=80", title: "Intimate Close-up", meta: "Golden Hour", layoutClass: "square" },
        { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80", title: "Promise of Love", meta: "Lakeside Vows", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80", title: "Palace Arches", meta: "Stonework Details", layoutClass: "landscape" },
        { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80", title: "Celebration Spark", meta: "Engagement Night", layoutClass: "portrait" },
        { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=80", title: "Dancing in the Rain", meta: "Island Gardens", layoutClass: "col-span-2" },
        { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80", title: "The Portrait", meta: "Black & White Classic", layoutClass: "portrait" }
      ]
    }
  };

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.story-card');
      const names = parentCard.querySelector('.story-names').textContent;
      const data = storiesData[names];

      if (!data) return;

      // Reset scroll position of card to the top
      card.scrollTop = 0;

      // Construct dynamic html for luxury centered card
      let cardHTML = `
        <div class="story-card-hero">
          <img src="${data.heroImage}" alt="${names} Cover Image">
          <div class="story-card-hero-overlay"></div>
        </div>
        
        <div class="story-card-body">
          <span class="story-card-meta">${data.location} &bull; ${data.date}</span>
          <h2 class="story-card-title">${names}</h2>
          
          <div class="story-card-tags">
            ${data.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
          </div>
          
          <div class="story-card-divider"></div>
          
          <p class="story-card-note">${data.description}</p>
          
          <div class="story-card-gallery">
            ${data.images.map((img) => `
              <div class="story-grid-item ${img.layoutClass}">
                <img src="${img.src}" alt="${img.title}">
                <div class="item-title" style="display: none;">${img.title}</div>
                <div class="item-meta" style="display: none;">${img.meta}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      contentContainer.innerHTML = cardHTML;

      // Open Modal
      modal.classList.add('active');
      if (lenis) lenis.stop();

      // GSAP animate backdrop & card scale/fade
      gsap.killTweensOf([modal, card]);
      gsap.fromTo(modal, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.fromTo(card, {
        scale: 0.93,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.05
      });
    });
  });

  function closeMagazine() {
    gsap.killTweensOf([modal, card]);

    gsap.to(card, {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in"
    });

    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        modal.classList.remove('active');
        
        // Resume lenis scroll only if other modals are not active
        const lightbox = document.getElementById('lightbox-modal');
        const consultation = document.getElementById('consultation-modal');
        const video = document.getElementById('video-player-modal');
        
        const anyModalActive = 
          (lightbox && lightbox.classList.contains('active')) ||
          (consultation && consultation.classList.contains('active')) ||
          (video && video.classList.contains('active'));

        if (!anyModalActive && lenis) {
          lenis.start();
        }
      }
    });
  }

  // Close triggers
  closeBtn.addEventListener('click', closeMagazine);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeMagazine();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active') && e.key === 'Escape') {
      // Don't close story modal if lightbox is open on top of it
      const lightbox = document.getElementById('lightbox-modal');
      if (lightbox && lightbox.classList.contains('active')) return;
      
      closeMagazine();
    }
  });
}

// ----------------------------------------------------
// DOCUMENT INIT
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initGSAPAnimations();
  initPortfolioFilter();
  initLightbox();
  initFilms();
  initTestimonialsCarousel();
  initLazyLoading();
  initMobileMenu();
  initAudioController();
  initConsultationForm();
  initMagazineStories();
  initStoriesAutoScroll();
});
