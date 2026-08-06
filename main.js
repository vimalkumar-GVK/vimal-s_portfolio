/* ════════════════════════════════════════════════════════════
   VIMAL KUMAR G — Portfolio JavaScript
   Features: Navbar, Typed Text, Scroll Animations,
             Skill Bars, Contact Form, Reading Assistant
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   1. NAVBAR — scroll class + active link tracking
   ────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  // Scrolled class for backdrop blur
  function onScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active nav link via Intersection tracking
  function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 100) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
})();


/* ──────────────────────────────────────────────
   2. TYPED TEXT EFFECT
   ────────────────────────────────────────────── */
(function initTyped() {
  const phrases = [
    'B.Sc IT Student',
    'Aspiring Full Stack Developer',
    'Python Enthusiast',
    'Problem Solver',
    'IoT Explorer',
  ];

  const el = document.getElementById('typedText');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, 1200);
      return;
    }

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isPaused    = true;
        isDeleting  = true;
        setTimeout(type, 100);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting   = false;
        phraseIndex  = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 60 : 95;
    setTimeout(type, speed);
  }

  setTimeout(type, 600);
})();


/* ──────────────────────────────────────────────
   3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ────────────────────────────────────────────── */
(function initScrollReveal() {
  const animatedEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   4. SKILL BAR ANIMATION
   ────────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ──────────────────────────────────────────────
   5. CONTACT FORM — Formspree integration
   ────────────────────────────────────────────── */
(function initContactForm() {
  // ── Formspree Config ─────────────────────────
  // 1. Go to https://formspree.io  →  Sign up free with vimalkumarg2366@gmail.com
  // 2. Click "New Form" → name it "Portfolio Contact" → copy the Form ID shown
  // 3. Paste that ID (e.g. "xbjnkpqz") below ↓
  const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace with your actual ID
  const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
  // ─────────────────────────────────────────────

  const form        = document.getElementById('contactForm');
  const nameInput   = document.getElementById('contactName');
  const emailInput  = document.getElementById('contactEmail');
  const msgInput    = document.getElementById('contactMessage');
  const nameError   = document.getElementById('nameError');
  const emailError  = document.getElementById('emailError');
  const msgError    = document.getElementById('messageError');
  const submitBtn   = document.getElementById('formSubmitBtn');
  const successMsg  = document.getElementById('formSuccess');
  const replyToField= document.getElementById('replyToField');

  if (!form) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function setError(input, errorEl, message) {
    input.classList.toggle('error', !!message);
    errorEl.textContent = message;
  }

  function validateAll() {
    let valid = true;

    if (!nameInput.value.trim()) {
      setError(nameInput, nameError, 'Please enter your name.');
      valid = false;
    } else if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameError, 'Name must be at least 2 characters.');
      valid = false;
    } else {
      setError(nameInput, nameError, '');
    }

    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailInput.value)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, emailError, '');
    }

    if (!msgInput.value.trim()) {
      setError(msgInput, msgError, 'Please enter a message.');
      valid = false;
    } else if (msgInput.value.trim().length < 10) {
      setError(msgInput, msgError, 'Message must be at least 10 characters.');
      valid = false;
    } else {
      setError(msgInput, msgError, '');
    }

    return valid;
  }

  // Real-time validation on blur
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('blur', validateAll);
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  // Keep _replyto in sync with the email field so Formspree sets Reply-To
  emailInput.addEventListener('input', () => {
    if (replyToField) replyToField.value = emailInput.value.trim();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Guard: warn if form ID has not been set
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      alert(
        '⚠️ Contact form not connected yet.\n\n' +
        'Steps:\n' +
        '1. Go to https://formspree.io and sign up free.\n' +
        '2. Create a new form → copy the Form ID.\n' +
        '3. Open main.js → find FORMSPREE_ID and paste your ID there.'
      );
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').hidden = true;
    submitBtn.querySelector('.btn-loading').hidden = false;

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        // Success
        successMsg.hidden = false;
        form.reset();
        if (replyToField) replyToField.value = '';
        setTimeout(() => { successMsg.hidden = true; }, 6000);
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data?.errors?.map(err => err.message).join(', ')
                    || 'Something went wrong. Please try again.';
        alert('❌ ' + msg);
      }
    } catch (err) {
      alert('❌ Network error. Please check your connection and try again.');
      console.error('Formspree error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').hidden = false;
      submitBtn.querySelector('.btn-loading').hidden = true;
    }
  });
})();




/* ──────────────────────────────────────────────
   7. SMOOTH SCROLL for anchor links
   ────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ──────────────────────────────────────────────
   8. BACK-TO-TOP on logo click
   ────────────────────────────────────────────── */
(function initLogoScroll() {
  const logo = document.getElementById('navLogo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ──────────────────────────────────────────────
   9. PHOTO PLACEHOLDER logic
   (if src is empty, show placeholder automatically)
   ────────────────────────────────────────────── */
(function initPhotoPlaceholder() {
  const photo       = document.getElementById('profilePhoto');
  const placeholder = document.getElementById('photoPlaceholder');
  if (!photo || !placeholder) return;

  // If src is empty or not set, show placeholder immediately
  if (!photo.src || photo.src === window.location.href) {
    photo.style.display    = 'none';
    placeholder.style.display = 'flex';
  }
})();


/* ──────────────────────────────────────────────
   10. STATS COUNTER ANIMATION
   ────────────────────────────────────────────── */
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const rawText = el.textContent.trim();
        const target  = parseFloat(rawText.replace(/[^0-9.]/g, ''));
        const suffix  = rawText.replace(/[0-9.]/g, '');
        const isDecimal = rawText.includes('.');
        const duration  = 1200;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed  = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current  = target * eased;
          el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();
