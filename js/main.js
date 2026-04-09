// ─── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ─── HAMBURGER ───────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });
}

// ─── ACTIVE NAV LINK (by page) ───────────────────────────────
(function markActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ─── FAQ ACCORDION ───────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ─── ADD REVEAL TO SECTIONS AND OBSERVE ──────────────────────
const elementsToReveal = document.querySelectorAll(
  '.reveal, .feature-card, .outcome-card, .team-card, .course-card, ' +
  '.why-point, .stat-card, .phil-col, .pillar, .trust-item, .contact-detail, .contact-form-box'
);

if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  elementsToReveal.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObs.observe(el);
  });
} else {
  elementsToReveal.forEach(el => {
    el.classList.add('reveal', 'visible');
  });
}

// ─── CONTACT FORM ────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const originalBtnText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Use FormData to collect all form fields (including hidden ones like _cc)
    const formData = new FormData(contactForm);
    const action = contactForm.getAttribute('action');

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.textContent = '✓ Thank you! Your message has been sent successfully. We will get back to you soon.';
          formSuccess.style.background = '#d4f5e2'; // Light green bg
          formSuccess.style.color = '#156634';      // Dark green text
          formSuccess.style.padding = '15px';
          formSuccess.style.borderRadius = '8px';
          formSuccess.style.marginTop = '20px';
          formSuccess.style.fontWeight = '600';
          formSuccess.style.display = 'block';
          // Scroll to success message
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 6000);
        }
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      if (formSuccess) {
        formSuccess.textContent = '❌ Oops! Something went wrong. Please try again later or email us directly at support@trellysrise.com';
        formSuccess.style.background = '#fdeaea'; // Light red bg
        formSuccess.style.color = '#721c24';      // Dark red text
        formSuccess.style.padding = '15px';
        formSuccess.style.borderRadius = '8px';
        formSuccess.style.marginTop = '20px';
        formSuccess.style.fontWeight = '600';
        formSuccess.style.display = 'block';
      }
    })
    .finally(() => {
      btn.textContent = originalBtnText;
      btn.disabled = false;
    });
  });
}

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    const hashIdx = href.indexOf('#');
    if (hashIdx === -1) return;
    const page = href.slice(0, hashIdx);
    const id   = href.slice(hashIdx + 1);
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const targetPage  = page.split('/').pop() || 'index.html';
    if (page === '' || page === '.' || targetPage === currentPage) {
      e.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ─── STAT COUNTER ANIMATION ──────────────────────────────────
function animateCounter(el) {
  const text = el.textContent.trim();
  const num  = parseFloat(text);
  if (isNaN(num)) return;
  const isPercent = text.includes('%');
  const suffix = isPercent ? '%' : (text.includes('+') ? '+' : '');
  let start = 0;
  const duration = 1200;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length && 'IntersectionObserver' in window) {
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(n => statObs.observe(n));
}

// ─── SPLASH SCREEN HIDE ──────────────────────────────────────
window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
      // Set body to overflow visible if it was hidden
      document.body.style.overflow = 'auto';
    }, 1500); // Allow animation to play
  }
});
