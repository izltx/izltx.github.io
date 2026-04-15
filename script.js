/* ============================================
   PORTFOLIO — SCRIPT.JS
   Data loading, animations, interactions
   ============================================ */

(function () {
  'use strict';

  // ─── Tool Icons (SVG inline) ───
  const toolIcons = {
    Python: '🐍',
    Docker: '🐳',
    Linux: '🐧',
    Nmap: '🔍',
    Splunk: '📊',
    Git: '🔀',
    Bash: '💻',
    'VS Code': '💠',
    AWS: '☁️',
    Azure: '🌐',
    GitHub: '🐙',
    Windows: '🪟',
    Ollama: '🦙',
    'Qwen2.5': '🧠',
    LLMs: '🤖',
    Wireshark: '🦈',
    'Burp Suite': '🕷️',
    CrowdStrike: '🦅'
  };

  const skillIcons = {
    shield: '🛡️',
    search: '🔎',
    code: '⚙️',
    lock: '🔒'
  };

  // ─── Data Fetch & Init ───
  let portfolioData = null;

  async function init() {
    try {
      const res = await fetch('data.json');
      portfolioData = await res.json();
      renderAll();
      initAnimations();
      hidePreloader();
    } catch (err) {
      console.error('Failed to load data:', err);
      hidePreloader();
    }
  }

  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    }, 800);
  }

  // ─── Render All Sections ───
  function renderAll() {
    renderHero();
    renderMarquee();
    renderAbout();
    renderExperience();
    renderSkills();
    renderProjects();
    renderCertifications();
    renderRoadmap();
    renderContact();
  }

  // ─── Hero ───
  function renderHero() {
    const d = portfolioData;
    document.getElementById('heroName').textContent = d.personal.name;
    renderStats();
    startTerminalTyping();
  }

  function renderStats() {
    const s = portfolioData.stats;
    const container = document.getElementById('heroStats');
    const items = [
      { num: s.projects, label: 'Projects' },
      { num: s.certifications, label: 'Certifications' },
      { num: s.skillAreas, label: 'Skill Areas' }
    ];
    container.innerHTML = items.map(item => `
      <div class="stat-item">
        <div class="stat-number" data-target="${item.num}">0</div>
        <div class="stat-label">${item.label}</div>
      </div>
    `).join('');
  }

  // ─── Terminal Typing Effect ───
  function startTerminalTyping() {
    const d = portfolioData.personal;
    const lines = [
      { prompt: '$ whoami', output: d.name },
      { prompt: '$ role', output: d.title },
      { prompt: '$ specialization', output: d.subtitle },
      { prompt: '$ status', output: 'Ready for deployment ✓' }
    ];

    const container = document.getElementById('terminalContent');
    container.innerHTML = '';
    let lineIndex = 0;

    function typeLine() {
      if (lineIndex >= lines.length) return;
      const line = lines[lineIndex];
      const lineEl = document.createElement('div');
      lineEl.className = 'terminal-line';
      container.appendChild(lineEl);

      // Type prompt
      let promptText = '';
      let promptIdx = 0;
      function typePrompt() {
        if (promptIdx < line.prompt.length) {
          promptText += line.prompt[promptIdx];
          lineEl.innerHTML = `<span class="terminal-prompt">${promptText}</span><span class="terminal-cursor"></span>`;
          promptIdx++;
          setTimeout(typePrompt, 50 + Math.random() * 30);
        } else {
          // Show output
          setTimeout(() => {
            const outputEl = document.createElement('div');
            outputEl.className = 'terminal-line';
            outputEl.innerHTML = `<span class="terminal-output">${line.output}</span>`;
            container.appendChild(outputEl);
            lineEl.innerHTML = `<span class="terminal-prompt">${line.prompt}</span>`;
            lineIndex++;
            setTimeout(typeLine, 400);
          }, 300);
        }
      }
      typePrompt();
    }

    setTimeout(typeLine, 1200);
  }

  // ─── Logo Marquee ───
  function renderMarquee() {
    const track = document.getElementById('marqueeTrack');
    const tools = portfolioData.tools;

    // Double the items for seamless loop
    const items = [...tools, ...tools].map(tool => `
      <div class="marquee-item">
        <span class="marquee-icon">${toolIcons[tool] || '🔧'}</span>
        <span>${tool}</span>
      </div>
    `).join('');

    track.innerHTML = items;
  }

  // ─── About ───
  function renderAbout() {
    const d = portfolioData;
    document.getElementById('aboutText').textContent = d.summary;

    const cards = [
      { icon: '🎓', label: 'Education', value: d.education.degree },
      { icon: '💼', label: 'Experience', value: d.experience[0].role + ' @ ' + d.experience[0].company },
      { icon: '🏅', label: 'Top Certification', value: 'CompTIA Security+' },
      { icon: '📍', label: 'Location', value: d.personal.location },
      { icon: '🗣️', label: 'Languages', value: d.languages.map(l => l.name).join(' / ') }
    ];

    const cardsContainer = document.getElementById('aboutCards');
    cardsContainer.innerHTML = cards.map((c, i) => `
      <div class="about-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="about-card-icon">${c.icon}</div>
        <div class="about-card-label">${c.label}</div>
        <div class="about-card-value">${c.value}</div>
      </div>
    `).join('');

    // Coursework
    const tagsContainer = document.getElementById('courseworkTags');
    tagsContainer.innerHTML = d.coursework.map(c => `
      <span class="coursework-tag">${c}</span>
    `).join('');
  }

  // ─── Experience ───
  function renderExperience() {
    const list = document.getElementById('experienceList');
    if (!list) return;

    list.innerHTML = portfolioData.experience.map((exp, i) => `
      <div class="experience-item reveal reveal-delay-${(i % 3) + 1}">
        <div class="experience-header">
          <div class="experience-role-company">
            <h3 class="experience-role">${exp.role}</h3>
            <div class="experience-company">${exp.company} — ${exp.location}</div>
          </div>
          <div class="experience-dates">${exp.dates}</div>
        </div>
        <ul class="experience-bullets">
          ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // ─── Skills ───
  function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = portfolioData.skills.map((skill, i) => `
      <div class="skill-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="skill-card-icon">${skillIcons[skill.icon] || '🔧'}</div>
        <h3 class="skill-card-title">${skill.category}</h3>
        <div class="skill-tags">
          ${skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // ─── Projects ───
  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = portfolioData.projects.map((proj, i) => `
      <div class="project-card reveal reveal-delay-${(i % 3) + 1}" data-project="${i}">
        <div class="project-date">${proj.date}</div>
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-subtitle">${proj.subtitle}</p>
        <p class="project-desc">${proj.description}</p>
        <div class="project-techs">
          ${proj.technologies.map(t => `<span class="project-tech">${t}</span>`).join('')}
        </div>
        <div class="project-arrow">→</div>
      </div>
    `).join('');

    // Click handlers
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.project);
        openProjectModal(idx);
      });
    });

    // 3D tilt effect
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  // ─── Project Modal ───
  function openProjectModal(index) {
    const proj = portfolioData.projects[index];
    const modal = document.getElementById('projectModal');

    document.getElementById('modalTitle').textContent = proj.title;
    document.getElementById('modalSubtitle').textContent = proj.subtitle;
    document.getElementById('modalDate').textContent = proj.date;
    document.getElementById('modalBullets').innerHTML = proj.bullets.map(b => `<li>${b}</li>`).join('');
    document.getElementById('modalTechs').innerHTML = proj.technologies.map(t => `<span class="project-tech">${t}</span>`).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ─── Certifications ───
  function renderCertifications() {
    const grid = document.getElementById('certsGrid');
    grid.innerHTML = portfolioData.certifications.map((cert, i) => {
      const issuerStyle = `background: ${cert.color}15; color: ${cert.color}; border: 1px solid ${cert.color}30;`;
      const verifyLink = cert.credlyUrl
        ? `<a href="${cert.credlyUrl}" target="_blank" rel="noopener noreferrer" class="cert-verify">Verify on Credly →</a>`
        : '';

      return `
        <div class="cert-card reveal reveal-delay-${(i % 4) + 1}">
          <span class="cert-issuer" style="${issuerStyle}">${cert.issuer}</span>
          <h4 class="cert-name">${cert.name}</h4>
          <span class="cert-date">${cert.date}</span>
          ${verifyLink}
        </div>
      `;
    }).join('');
  }

  // ─── Certification Roadmap ───
  function renderRoadmap() {
    const timeline = document.getElementById('roadmapTimeline');

    // Group by date and sort chronologically
    const sorted = [...portfolioData.certifications].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    timeline.innerHTML = sorted.map((cert, i) => `
      <div class="roadmap-item reveal reveal-delay-${(i % 4) + 1}">
        <div class="roadmap-dot"></div>
        <div class="roadmap-date">${cert.date}</div>
        <div class="roadmap-title">${cert.name}</div>
        <div class="roadmap-issuer">${cert.issuer}</div>
      </div>
    `).join('');
  }

  // ─── Contact ───
  function renderContact() {
    const d = portfolioData.personal;
    const contacts = [
      { icon: '✉️', label: 'Email', value: d.email, href: `mailto:${d.email}` },
      { icon: '📱', label: 'Phone', value: d.phone, href: `tel:${d.phone.replace(/\s/g, '')}` },
      { icon: '💼', label: 'LinkedIn', value: 'az-alsidrani', href: d.linkedin },
      { icon: '🐙', label: 'GitHub', value: 'izltx.github.io', href: d.github },
      { icon: '💬', label: 'WhatsApp', value: 'Message me', href: d.whatsapp }
    ];

    const grid = document.getElementById('contactGrid');
    grid.innerHTML = contacts.map((c, i) => `
      <a href="${c.href}" target="_blank" rel="noopener noreferrer" class="contact-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="contact-icon">${c.icon}</div>
        <div>
          <div class="contact-label">${c.label}</div>
          <div class="contact-value">${c.value}</div>
        </div>
      </a>
    `).join('');
  }

  // ─── Animations & Interactions ───
  function initAnimations() {
    initParticleNetwork();
    initScrollProgress();
    initScrollReveal();
    initNavbar();
    initCursorGlow();
    initMagneticButtons();
    initStatsCounter();
  }

  // ─── Particle Network ───
  function initParticleNetwork() {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animFrame;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
      }
    }

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 200)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  // ─── Scroll Progress ───
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (scrollTop / docHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ─── Scroll Reveal ───
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Observe dynamically added elements after a short delay
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
    }, 100);
  }

  // ─── Navbar ───
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');
    let lastScrollY = 0;

    // Scroll behavior
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }

      lastScrollY = currentScrollY;

      // Active link
      updateActiveLink();
    }, { passive: true });

    // Hamburger
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  function updateActiveLink() {
    const sections = ['about', 'experience', 'skills', 'projects', 'certifications', 'contact'];
    const scrollPos = window.scrollY + 200;

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;

      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ─── Cursor Glow ───
  function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let glowX = 0, glowY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
    });

    function updateGlow() {
      currentX += (glowX - currentX) * 0.1;
      currentY += (glowY - currentY) * 0.1;
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';
      requestAnimationFrame(updateGlow);
    }

    updateGlow();
  }

  // ─── Magnetic Buttons ───
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ─── Stats Counter ───
  function initStatsCounter() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    setTimeout(() => {
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        observer.observe(el);
      });
    }, 200);
  }

  function animateCounter(el, target) {
    const duration = 1500;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    tick();
  }

  // ─── Start ───
  document.addEventListener('DOMContentLoaded', init);

})();
