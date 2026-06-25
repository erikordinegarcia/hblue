(function () {
  // ── Header scroll hide/show + scrolled shadow ──
  const header = document.getElementById('header');
  let lastY = 0;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) header.classList.add('hide');
      else header.classList.remove('hide');
      header.classList.toggle('scrolled', y > 10);
      lastY = y;
    },
    { passive: true }
  );

  // ── Mobile menu toggle ──
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-links a').forEach((a) => {
      a.addEventListener('click', () => {
        header.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        header.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Reveal on scroll (uses .active) ──
  const reveals = document.querySelectorAll('.reveal, .reveal-delay');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('active'));
  }

  // ── Carrossel de produtos ──
  const carousel = document.getElementById('talksCarousel');
  const prevBtn = document.getElementById('prevTalk');
  const nextBtn = document.getElementById('nextTalk');

  if (carousel && prevBtn && nextBtn) {
    let idx = 0;
    const getVisible = () => {
      const w = carousel.parentElement.offsetWidth;
      if (w < 560) return 1;
      if (w < 900) return 2;
      return 3;
    };
    const slides = () => carousel.querySelectorAll('.talk-slide').length;
    const update = () => {
      const vis = getVisible();
      const max = Math.max(0, slides() - vis);
      idx = Math.min(Math.max(idx, 0), max);
      const slideW = carousel.querySelector('.talk-slide').offsetWidth + 16;
      carousel.style.transform = `translateX(-${idx * slideW}px)`;
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx >= max;
    };
    prevBtn.addEventListener('click', () => {
      idx--;
      update();
    });
    nextBtn.addEventListener('click', () => {
      idx++;
      update();
    });
    window.addEventListener('resize', update);
    update();
  }

  // ── Galeria slideshow ──
  const slides = document.querySelectorAll('.galeria-carousel .slide');
  if (slides.length) {
    let cur = 0;
    setInterval(() => {
      slides[cur].classList.remove('active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
    }, 3500);
  }

  // ── Carrossel de depoimentos ──
  const feedbackCarousel = document.getElementById('feedbackCarousel');
  const prevFb = document.getElementById('prevFeedback');
  const nextFb = document.getElementById('nextFeedback');

  if (feedbackCarousel && prevFb && nextFb) {
    let fi = 0;
    const fbSlides = feedbackCarousel.querySelectorAll('.feedback-card');
    const getVisibleFb = () => {
      const w = feedbackCarousel.parentElement.offsetWidth;
      if (w < 560) return 1;
      if (w < 900) return 2;
      return 3;
    };
    const updateFb = () => {
      const vis = getVisibleFb();
      const max = Math.max(0, fbSlides.length - vis);
      fi = Math.min(Math.max(fi, 0), max);
      const cardW = fbSlides[0].offsetWidth + 20;
      feedbackCarousel.style.transform = `translateX(-${fi * cardW}px)`;
      prevFb.disabled = fi === 0;
      nextFb.disabled = fi >= max;
    };
    prevFb.addEventListener('click', () => {
      fi--;
      updateFb();
    });
    nextFb.addEventListener('click', () => {
      fi++;
      updateFb();
    });
    window.addEventListener('resize', updateFb);
    updateFb();
  }

  // ── Contador animado nos números ──
  const counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && counters.length) {
    const formatNum = (n, hasDot) => {
      if (hasDot) return n.toLocaleString('pt-BR');
      return n;
    };

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const hasDot = el.dataset.format === 'dot';
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        // easing: começa rápido e desacelera no final
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);

        el.textContent = prefix + formatNum(current, hasDot);

        if (step >= steps) {
          clearInterval(timer);
          el.textContent = prefix + formatNum(target, hasDot);
        }
      }, duration / steps);
    };

    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterIO.observe(c));
  }

  // ── Nav active link on scroll ──
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const io2 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => io2.observe(s));
})();
