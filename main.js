/* ════════════════════════════════════════════════════════════
   VIMAL KUMAR G — Premium 3D Cinematic Portfolio
   JavaScript: Three.js Hero, GSAP ScrollTrigger, Lenis,
               Custom Cursor, Scroll Progress, Animations
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   WAIT FOR DOM
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initScrollProgress();
  initCustomCursor();
  initNavbar();
  initTyped();
  initHeroCanvas();
  initContactCanvas();
  initGSAPAnimations();
  initSkillBars();
  initCounters();
  initSmoothScrollLinks();
  initLogoScroll();
  initPhotoPlaceholder();
});


/* ──────────────────────────────────────────────
   1. LENIS SMOOTH SCROLL
   ────────────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Connect Lenis to GSAP ticker
  if (typeof gsap !== 'undefined' && gsap.ticker) {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function rafLoop(time) {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
  }

  window._lenis = lenis;
}


/* ──────────────────────────────────────────────
   2. SCROLL PROGRESS BAR
   ────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}


/* ──────────────────────────────────────────────
   3. CUSTOM CURSOR
   ────────────────────────────────────────────── */
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let isVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .tech-card, .project-card, .contact-card, .cert-card, .achievement-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Animate ring with lag
  function animateCursor() {
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';

    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}


/* ──────────────────────────────────────────────
   4. NAVBAR
   ────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 100) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}


/* ──────────────────────────────────────────────
   5. TYPED TEXT EFFECT
   ────────────────────────────────────────────── */
function initTyped() {
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
        isPaused   = true;
        isDeleting = true;
        setTimeout(type, 100);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? 55 : 90);
  }

  setTimeout(type, 1000);
}


/* ──────────────────────────────────────────────
   6. THREE.JS HERO CANVAS
   ────────────────────────────────────────────── */
function initHeroCanvas() {
  if (typeof THREE === 'undefined') return;
  if (window.innerWidth < 768) return; // Skip on mobile for performance

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const scene  = new THREE.Scene();
  const W      = window.innerWidth;
  const H      = window.innerHeight;
  // Use a slightly wider FOV for a cinematic look
  const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
  camera.position.set(0, 15, 60); // Elevated camera looking down
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  // ── Digital Terrain Particle Grid ────────────────────────────
  const gridX = 70;
  const gridZ = 70;
  const spacing = 3.5;
  const particleCount = gridX * gridZ;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // Colors
  const colorTop = new THREE.Color('#63D8D5'); // Cyan for peaks
  const colorBottom = new THREE.Color('#A970FF'); // Purple for valleys

  let i = 0;
  for (let ix = 0; ix < gridX; ix++) {
    for (let iz = 0; iz < gridZ; iz++) {
      const x = (ix - gridX / 2) * spacing;
      const z = (iz - gridZ / 2) * spacing;
      
      positions[i * 3]     = x;
      positions[i * 3 + 1] = 0; // Y will be animated
      positions[i * 3 + 2] = z;

      sizes[i] = 1.5;
      i++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  
  // Tilt the grid slightly to look impressive
  particles.rotation.x = -Math.PI / 12; 
  scene.add(particles);

  // ── Central Floating Holographic Core ───────────────────────
  const coreGeo = new THREE.IcosahedronGeometry(8, 2); // Sphere-like
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x27C2C5,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 15, 0); // Hovering above the wave
  scene.add(core);
  
  const coreRingGeo = new THREE.RingGeometry(12, 12.2, 64);
  const coreRingMat = new THREE.MeshBasicMaterial({
    color: 0xA970FF,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
  coreRing.position.set(0, 15, 0);
  coreRing.rotation.x = Math.PI / 2;
  scene.add(coreRing);

  // ── Mouse parallax ────────────────────────────────────────
  let targetCamX = 0, targetCamY = 0;

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetCamX = nx * 10;
    targetCamY = ny * 8;
  }, { passive: true });

  // ── Scroll-based camera ───────────────────────────────────
  let heroScrollProgress = 0;
  window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    const scrolled = window.scrollY;
    const heroH    = heroSection.offsetHeight;
    heroScrollProgress = Math.min(scrolled / heroH, 1);
  }, { passive: true });

  // ── Resize handler ─────────────────────────────────────────
  window.addEventListener('resize', () => {
    const W2 = window.innerWidth;
    const H2 = window.innerHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  });

  // ── Render loop ────────────────────────────────────────────
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const t = frame * 0.02;

    // Animate Waves
    const pos = particles.geometry.attributes.position.array;
    const col = particles.geometry.attributes.color.array;
    
    let i = 0;
    for (let ix = 0; ix < gridX; ix++) {
      for (let iz = 0; iz < gridZ; iz++) {
        // Complex wave math for organic terrain flow
        const y = Math.sin((ix + t) * 0.3) * 3 + 
                  Math.cos((iz + t) * 0.2) * 3 + 
                  Math.sin((ix + iz - t) * 0.1) * 4;
                  
        pos[i * 3 + 1] = y - 25; // offset down
        
        // Color mapping based on height
        const heightRatio = (y + 10) / 20; 
        const mixedColor = colorBottom.clone().lerp(colorTop, Math.max(0, Math.min(1, heightRatio)));
        
        col[i * 3] = mixedColor.r;
        col[i * 3 + 1] = mixedColor.g;
        col[i * 3 + 2] = mixedColor.b;

        i++;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;

    // Animate Core
    core.rotation.y += 0.005;
    core.rotation.x += 0.002;
    core.position.y = 15 + Math.sin(t * 0.5) * 2; // Hover effect
    
    coreRing.rotation.z -= 0.003;
    coreRing.position.y = 15 + Math.sin(t * 0.5 + Math.PI) * 1; 

    // Camera parallax (smooth interpolation)
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (15 + targetCamY - camera.position.y) * 0.04;
    camera.lookAt(0, 5, 0);

    // Fade out on scroll
    const opacity = Math.max(0, 1 - heroScrollProgress * 1.5);
    mat.opacity = 0.8 * opacity;
    coreMat.opacity = 0.15 * opacity;
    coreRingMat.opacity = 0.3 * opacity;

    // Push camera back slightly on scroll
    camera.position.z = 60 + heroScrollProgress * 30;

    renderer.render(scene, camera);
  }
  animate();
}


/* ──────────────────────────────────────────────
   7. CONTACT CANVAS (Particle Orb)
   ────────────────────────────────────────────── */
function initContactCanvas() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas) return;

  const section = document.getElementById('contact');
  if (!section) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Orb
  let orbX, orbY;
  let mouseX = 0, mouseY = 0;
  let targetOrbX, targetOrbY;

  function updateOrbCenter() {
    orbX = W / 2;
    orbY = H / 2;
    targetOrbX = orbX;
    targetOrbY = orbY;
  }
  updateOrbCenter();

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    targetOrbX = orbX + (mouseX - orbX) * 0.08;
    targetOrbY = orbY + (mouseY - orbY) * 0.08;
  });

  // Particles
  const NUM_PARTICLES = 45;
  const particles = [];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = (i / NUM_PARTICLES) * Math.PI * 2;
    const r = 60 + Math.random() * 80;
    particles.push({
      angle: angle,
      baseR: r,
      r: r,
      speed: 0.003 + Math.random() * 0.008,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#63D8D5' : '#A970FF',
    });
  }

  let frame = 0;
  let currentOrbX, currentOrbY;
  currentOrbX = orbX;
  currentOrbY = orbY;

  function drawFrame() {
    requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0, W, H);

    frame++;
    const t = frame * 0.01;

    // Smooth orb position
    currentOrbX = currentOrbX || orbX;
    currentOrbY = currentOrbY || orbY;
    currentOrbX += (targetOrbX - currentOrbX) * 0.05;
    currentOrbY += (targetOrbY - currentOrbY) * 0.05;

    // Central glow orb
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    const baseR = 60 * pulse;

    const grad = ctx.createRadialGradient(currentOrbX, currentOrbY, 0, currentOrbX, currentOrbY, baseR * 2.5);
    grad.addColorStop(0,    'rgba(99, 216, 213, 0.18)');
    grad.addColorStop(0.3,  'rgba(99, 216, 213, 0.08)');
    grad.addColorStop(0.65, 'rgba(169, 112, 255, 0.04)');
    grad.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(currentOrbX, currentOrbY, baseR * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Core glow
    const core = ctx.createRadialGradient(currentOrbX, currentOrbY, 0, currentOrbX, currentOrbY, baseR * 0.6);
    core.addColorStop(0,   'rgba(99, 216, 213, 0.55)');
    core.addColorStop(0.5, 'rgba(99, 216, 213, 0.15)');
    core.addColorStop(1,   'rgba(99, 216, 213, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(currentOrbX, currentOrbY, baseR * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Orbit rings
    for (let i = 0; i < 2; i++) {
      const ringR = baseR * (0.8 + i * 0.5);
      ctx.beginPath();
      ctx.arc(currentOrbX, currentOrbY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(99,216,213,${0.08 - i * 0.03})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Orbiting particles
    particles.forEach((p) => {
      p.angle += p.speed;
      const jitter = Math.sin(t * 3 + p.angle * 5) * 8;
      p.r = p.baseR + jitter;

      const px = currentOrbX + Math.cos(p.angle) * p.r;
      const py = currentOrbY + Math.sin(p.angle) * p.r;

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);

      const alpha = p.opacity * (0.8 + Math.sin(t * 5 + p.angle) * 0.2);
      const hex   = p.color;
      const r     = parseInt(hex.slice(1,3), 16);
      const g     = parseInt(hex.slice(3,5), 16);
      const b     = parseInt(hex.slice(5,7), 16);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      // Draw line to orb for some particles
      if (p.size > 1.8) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(currentOrbX, currentOrbY);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  }

  // Only run when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        drawFrame();
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(section);
}


/* ──────────────────────────────────────────────
   8. GSAP SCROLL ANIMATIONS
   ────────────────────────────────────────────── */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallbackReveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Helper to create a scroll-triggered "from" animation safely
  function revealFrom(selector, fromVars, triggerEl, options = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const triggerSelector = triggerEl || selector;
    const startPos = options.start || 'top 82%';

    gsap.fromTo(selector,
      { opacity: 0, ...fromVars },
      {
        opacity: 1,
        x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0,
        duration: options.duration || 0.8,
        ease: options.ease || 'power3.out',
        stagger: options.stagger || 0,
        scrollTrigger: {
          trigger: triggerSelector,
          start: startPos,
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  }

  // ── Hero (no scroll trigger — runs immediately) ────────────
  const heroTL = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.2
  });

  heroTL
    .fromTo('#heroBadge',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 }
    )
    .fromTo('.hero-name-line',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power4.out' },
      '-=0.3'
    )
    .fromTo('#heroTitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('#heroObjective',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )
    .fromTo('#heroCta .btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
      '-=0.3'
    )
    .fromTo('#heroStats .stat, #heroStats .stat-sep',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.5 },
      '-=0.3'
    )
    .fromTo('#heroRight',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.9 },
      0.3
    )
    .fromTo('.float-badge',
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, stagger: 0.2, duration: 0.5 },
      '-=0.5'
    )
    .fromTo('#heroBioCard',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );

  // ── About ─────────────────────────────────────────────────
  revealFrom('#aboutHeader', { y: 40 }, '#about', { start: 'top 80%' });
  revealFrom('.about-card',  { y: 50, rotateX: 8 }, '#about .about-grid', {
    start: 'top 80%', stagger: 0.13, ease: 'power3.out'
  });

  // ── Skills ────────────────────────────────────────────────
  revealFrom('#skillsHeader', { y: 40 }, '#skills', { start: 'top 80%' });
  revealFrom('#skillsBars',   { x: -50 }, '#skills .skills-layout', { start: 'top 80%', duration: 0.9 });
  revealFrom('#skillsIcons',  { x: 50  }, '#skills .skills-layout', { start: 'top 80%', duration: 0.9 });
  revealFrom('.tech-card',    { scale: 0.7, y: 20 }, '.tech-grid', {
    start: 'top 85%', stagger: 0.05, duration: 0.45, ease: 'back.out(1.5)'
  });

  // ── Projects ─────────────────────────────────────────────
  revealFrom('#projectsHeader', { y: 40 }, '#projects', { start: 'top 80%' });
  revealFrom('.project-card',   { y: 60, rotateX: 6 }, '#projectsGrid', {
    start: 'top 80%', stagger: 0.1, ease: 'power3.out'
  });

  // ── Internships ───────────────────────────────────────────
  revealFrom('#internshipsHeader', { y: 40 }, '#internships', { start: 'top 80%' });

  gsap.fromTo('#timelineSpine',
    { scaleY: 0 },
    {
      scaleY: 1, duration: 1.5, ease: 'power2.inOut',
      transformOrigin: 'top center',
      scrollTrigger: { trigger: '#internshipsTimeline', start: 'top 80%', toggleActions: 'play none none none', once: true }
    }
  );

  revealFrom('#intern1', { x: -60 }, '#intern1', { start: 'top 85%' });
  revealFrom('#intern2', { x:  60 }, '#intern2', { start: 'top 85%' });
  revealFrom('#intern3', { x: -60 }, '#intern3', { start: 'top 85%' });

  // ── Certifications ────────────────────────────────────────
  revealFrom('#certsHeader', { y: 40 }, '#certifications', { start: 'top 80%' });
  revealFrom('.cert-card', { rotateY: 50, scale: 0.85 }, '#certsGrid', {
    start: 'top 82%', stagger: 0.12, ease: 'power3.out'
  });

  // ── Achievements ──────────────────────────────────────────
  revealFrom('#achievementsHeader', { y: 40 }, '#achievements', { start: 'top 80%' });
  revealFrom('.achievement-card', { y: 35, scale: 0.92 }, '#achievementsGrid', {
    start: 'top 82%', stagger: 0.07, duration: 0.6, ease: 'back.out(1.2)'
  });

  // ── Contact ───────────────────────────────────────────────
  revealFrom('#contactHeader', { y: 40 }, '#contact', { start: 'top 80%' });
  revealFrom('#contactCentered', { y: 40 }, '#contact', { start: 'top 70%', duration: 0.9 });
  revealFrom('.contact-card', { y: 28 }, '#contactCards', {
    start: 'top 85%', stagger: 0.1, duration: 0.6
  });
  revealFrom('#locationTag', { scale: 0.8 }, '#locationTag', {
    start: 'top 90%', duration: 0.5, ease: 'back.out(2)'
  });

  // Refresh to catch already-visible elements
  ScrollTrigger.refresh();
}




// Fallback for when GSAP CDN fails
function initFallbackReveal() {
  const els = document.querySelectorAll(
    '.about-card, .project-card, .cert-card, .achievement-card, .timeline-card, #heroLeft, #heroRight, .section-header'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
  });
}


/* ──────────────────────────────────────────────
   9. SKILL BAR ANIMATION
   ────────────────────────────────────────────── */
function initSkillBars() {
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
}


/* ──────────────────────────────────────────────
   10. STATS COUNTER ANIMATION
   ────────────────────────────────────────────── */
function initCounters() {
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
        const duration  = 1400;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed  = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
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
}


/* ──────────────────────────────────────────────
   11. SMOOTH SCROLL for anchor links
   ────────────────────────────────────────────── */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      if (window._lenis) {
        window._lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      } else {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}


/* ──────────────────────────────────────────────
   12. BACK-TO-TOP on logo click
   ────────────────────────────────────────────── */
function initLogoScroll() {
  const logo = document.getElementById('navLogo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (window._lenis) {
        window._lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}


/* ──────────────────────────────────────────────
   13. PHOTO PLACEHOLDER
   ────────────────────────────────────────────── */
function initPhotoPlaceholder() {
  const photo       = document.getElementById('profilePhoto');
  const placeholder = document.getElementById('photoPlaceholder');
  if (!photo || !placeholder) return;

  if (!photo.src || photo.src === window.location.href) {
    photo.style.display      = 'none';
    placeholder.style.display = 'flex';
  }
}
