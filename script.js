/* ===========================================================
   MALIK'S SMILE N GLOW — Site JS (vanilla, no build step)
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 350);
  });
  // fallback in case 'load' fires late for slow assets
  setTimeout(() => loader && loader.classList.add('hide'), 2200);

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('msg-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  function updateThemeIcon(){
    if(!themeBtn) return;
    const icon = themeBtn.querySelector('i');
    const isDark = root.getAttribute('data-theme') === 'dark';
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  updateThemeIcon();
  themeBtn && themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('msg-theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
  });

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  function onScrollNav(){
    if(!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive:true });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scroll-progress');
  function onScrollProgress(){
    if(!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = h.scrollHeight - h.clientHeight;
    progress.style.width = height > 0 ? (scrolled / height) * 100 + '%' : '0%';
  }
  onScrollProgress();
  window.addEventListener('scroll', onScrollProgress, { passive:true });

  /* ---------- Back to top ---------- */
  const fabTop = document.getElementById('fab-top');
  window.addEventListener('scroll', () => {
    if(!fabTop) return;
    fabTop.classList.toggle('show', window.scrollY > 500);
  }, { passive:true });
  fabTop && fabTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  /* ---------- Cursor glow ---------- */
  const glow = document.getElementById('cursor-glow');
  if(glow){
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  }

  /* ---------- Hero portrait tilt ---------- */
  const portrait = document.querySelector('.hero-portrait');
  const heroVisual = document.querySelector('.hero-visual');
  if(portrait && heroVisual){
    heroVisual.addEventListener('mousemove', (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      portrait.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCount(entry.target);
        cio.unobserve(entry.target);
      }
    });
  }, { threshold:0.4 });
  counters.forEach(el => cio.observe(el));

  function animateCount(el){
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Testimonials auto-slide ---------- */
  const track = document.getElementById('testi-track');
  if(track){
    const cards = track.children.length;
    let index = 0;
    let perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 980 ? 2 : 3;
    function slide(){
      perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 980 ? 2 : 3;
      const maxIndex = Math.max(cards - perView, 0);
      index = index > maxIndex ? 0 : index;
      track.style.transform = `translateX(-${index * (100 / perView)}%)`;
    }
    setInterval(() => {
      const maxIndex = Math.max(cards - perView, 0);
      index = index >= maxIndex ? 0 : index + 1;
      slide();
    }, 3800);
    window.addEventListener('resize', slide);
    slide();
  }

  /* ---------- Before / After slider ---------- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const after = slider.querySelector('.after-img');
    let dragging = false;
    function setPos(clientX){
      const r = slider.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      handle.style.left = pct + '%';
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    }
    handle.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => { if(dragging) setPos(e.clientX); });
    handle.addEventListener('touchstart', () => dragging = true, {passive:true});
    window.addEventListener('touchend', () => dragging = false);
    window.addEventListener('touchmove', (e) => { if(dragging) setPos(e.touches[0].clientX); }, {passive:true});
    slider.addEventListener('click', (e) => { if(e.target === handle) return; setPos(e.clientX); });
  });

  /* Gallery pair switch dots (index-based sets) */
  document.querySelectorAll('.ba-nav').forEach(nav => {
    const dots = nav.querySelectorAll('.ba-dot');
    const wrap = nav.previousElementSibling;
    const beforeImg = wrap.querySelector('.before-img');
    const afterImg = wrap.querySelector('.after-img');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        beforeImg.src = dot.getAttribute('data-before');
        afterImg.src = dot.getAttribute('data-after');
      });
    });
  });

  /* ---------- Appointment form -> WhatsApp ---------- */
  const apptForm = document.getElementById('appointment-form');
  if(apptForm){
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const phone = document.getElementById('f-phone').value.trim();
      const treatment = document.getElementById('f-treatment').value;
      const date = document.getElementById('f-date').value;
      const message = document.getElementById('f-message').value.trim();

      if(!name || !phone || !treatment){
        alert('Please fill your name, phone number and treatment.');
        return;
      }

      const text = `Hello Malik's Smile N Glow, I would like to book an appointment.%0A%0A`
        + `Name: ${name}%0A`
        + `Phone: ${phone}%0A`
        + `Treatment: ${treatment}%0A`
        + (date ? `Preferred Date: ${date}%0A` : '')
        + (message ? `Message: ${message}` : '');

      window.open(`https://wa.me/919782258787?text=${text}`, '_blank');
      const confirmBox = document.getElementById('form-confirm');
      if(confirmBox){
        confirmBox.textContent = 'Thank you, ' + name.split(' ')[0] + '. Opening WhatsApp to confirm your appointment…';
        confirmBox.style.display = 'block';
      }
      apptForm.reset();
    });
  }

  /* ---------- Canvas particle field (hero) ---------- */
  const canvas = document.getElementById('hero-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const isDark = () => root.getAttribute('data-theme') === 'dark';

    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function initParticles(){
      const count = Math.min(60, Math.floor(w / 22));
      particles = Array.from({length: count}).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.5 + 0.2
      }));
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      const color = isDark() ? '232,205,138' : '201,162,75';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1;
        if(p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.o})`;
        ctx.fill();
      });
      // connecting lines
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < 110){
            ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist/110)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ---------- Set active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

});
