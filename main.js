/**
 * ARJUN DOMBARA - PERSONAL PORTFOLIO
 * Main JavaScript: Theme switching, navigation, scroll-spy, ambient canvas, certificate modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollSpy();
  initBackToTop();
  initAmbientCanvas();
  initCertificateModal();
});

/* --------------------------------------------------------------------------
   THEME TOGGLER (Light / Dark Mode with LocalStorage & OS Preference)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('arjun_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Listen for system theme changes if user hasn't explicitly set one
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('arjun_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('arjun_theme', theme);
  }
}

/* --------------------------------------------------------------------------
   NAVIGATION & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerNavLinks = document.querySelectorAll('.drawer-nav-link');
  const allNavLinks = document.querySelectorAll('.nav-link, .drawer-nav-link, .btn[href^="#"]');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open mobile drawer
  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  // Close mobile drawer
  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer when link clicked
  drawerNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Smooth scroll for anchor links
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   SCROLL-SPY (Highlight active link on scroll)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        drawerLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* --------------------------------------------------------------------------
   BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   CERTIFICATE MODAL VIEWER (Tap to View Certificate)
   -------------------------------------------------------------------------- */
function initCertificateModal() {
  const modal = document.getElementById('cert-modal');
  const modalCloseBtn = document.getElementById('cert-modal-close');
  const modalTitle = document.getElementById('modal-cert-title');
  const modalIssuer = document.getElementById('modal-cert-issuer');
  const modalPreviewCard = document.getElementById('cert-preview-card');
  const modalMetaDate = document.getElementById('modal-meta-date');
  const modalPdfBtn = document.getElementById('modal-pdf-btn');
  const modalVerifyBtn = document.getElementById('modal-verify-btn');
  const certCards = document.querySelectorAll('.cert-card');

  if (!modal) return;

  const certificatesData = {
    ibm: {
      title: 'Cybersecurity Fundamentals',
      issuer: 'IBM SkillsBuild',
      date: 'Nov 27, 2025',
      recipient: 'Dombara Arjun',
      verifyUrl: 'https://www.credly.com/badges/0ea5df6c-a914-486d-975c-1efc3b6dc06d',
      pdfPath: 'assets/certificates/ibm-cybersecurity-fundamentals.pdf',
      html: `
        <div class="cert-ibm-view" style="padding: 28px; width: 100%; border-radius: 8px;">
          <div class="cert-ibm-badge-strip">
            <div class="cert-ibm-logo">IBM</div>
          </div>
          <div class="cert-ibm-headline">In recognition of the commitment to achieve professional excellence</div>
          <div class="cert-ibm-name">Dombara Arjun</div>
          <div class="cert-ibm-sub">Has successfully satisfied the requirements for:</div>
          <div class="cert-ibm-course">Cybersecurity Fundamentals</div>
          <div class="cert-ibm-footer">
            <div>
              <div><strong>Issued on:</strong> Nov 27, 2025</div>
              <div><strong>Issued by:</strong> IBM SkillsBuild</div>
            </div>
            <div style="text-align: right;">
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #e0f2fe; color: #0284c7; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">
                <i class="fa-solid fa-circle-check"></i> Credly Verified
              </span>
            </div>
          </div>
        </div>
      `
    },
    be10x: {
      title: 'AI Tools & Claude Workshop Certificate',
      issuer: 'be10x',
      date: 'March 1st, 2026',
      recipient: 'DOMBARA ARJUN',
      verifyUrl: 'assets/certificates/be10x-ai-tools-workshop.pdf',
      pdfPath: 'assets/certificates/be10x-ai-tools-workshop.pdf',
      html: `
        <div class="cert-be10x-view" style="padding: 28px; width: 100%; border-radius: 8px;">
          <div class="cert-be10x-header">
            <div class="cert-be10x-logo">be<span style="color:#8b5cf6;">10x</span></div>
            <div class="cert-be10x-badge">AI Tools Workshop</div>
          </div>
          <div class="cert-be10x-title">Certificate</div>
          <div class="cert-be10x-sub">of Completion Awarded to</div>
          <div class="cert-be10x-name">DOMBARA ARJUN</div>
          <p style="font-size: 0.95rem; color: #475569; margin-bottom: 12px;">on successful completion of <strong>AI Tools &amp; Claude Workshop</strong>. Holder of this certificate can:</p>
          <div class="cert-be10x-skills">
            <div>• Create presentations using AI in under 5 min</div>
            <div>• Analyse data using AI in under 30 min</div>
            <div>• Code and Debug using AI in under 10 min</div>
          </div>
          <div class="cert-be10x-sign-row">
            <div>
              <div style="font-family: cursive, sans-serif; font-size: 1.15rem; color: #0f172a; font-weight: 700;">Aditya Goenka &amp; Aditya Kachave</div>
              <div style="font-size: 0.78rem; color: #64748b;">Co-founders, be10x</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Issued: March 1st, 2026</div>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #ecfdf5; color: #059669; border-radius: 4px; font-weight: 700; font-size: 0.78rem;">
                <i class="fa-solid fa-circle-check"></i> Verified Certificate
              </span>
            </div>
          </div>
        </div>
      `
    },
    zscaler: {
      title: 'Zero Trust Cloud Security Virtual Internship',
      issuer: 'AICTE • EduSkills • Zscaler',
      date: 'Jan – Mar 2026',
      recipient: 'Dombara Arjun',
      verifyUrl: 'assets/certificates/zscaler-zero-trust-cloud-security.pdf',
      pdfPath: 'assets/certificates/zscaler-zero-trust-cloud-security.pdf',
      html: `
        <div class="cert-zscaler-view" style="padding: 28px; width: 100%; border-radius: 8px;">
          <div class="cert-zscaler-logos">
            <div style="font-weight: 800; font-size: 0.9rem; color: #0f172a;"><i class="fa-solid fa-landmark"></i> Ministry of Education / AICTE</div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #0284c7;">EduSkills</div>
            <div style="font-weight: 900; font-size: 1rem; color: #0084ff;">zscaler™</div>
          </div>
          <div class="cert-zscaler-title">Certificate of Virtual Internship</div>
          <div class="cert-zscaler-name">Dombara Arjun</div>
          <div class="cert-zscaler-college">Rajeev Gandhi Memorial College of Engineering and Technology</div>
          <div style="text-align: center; font-size: 0.9rem; color: #64748b; margin-bottom: 6px;">has successfully completed the 10-weeks</div>
          <div class="cert-zscaler-internship">Zero Trust Cloud Security Virtual Internship</div>
          <div class="cert-zscaler-duration">During January - March 2026</div>
          <div class="cert-zscaler-meta">
            <div><strong>Certificate ID:</strong> 431282e684659ae1f5f3</div>
            <div><strong>Student ID:</strong> STU6989b106a04651770631430</div>
            <div><strong>Grade:</strong> Outstanding (O)</div>
          </div>
        </div>
      `
    }
  };

  function openModal(certKey) {
    const data = certificatesData[certKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalIssuer.textContent = data.issuer;
    modalPreviewCard.innerHTML = data.html;
    modalMetaDate.innerHTML = `<i class="fa-regular fa-calendar"></i> Issued: <strong>${data.date}</strong>`;
    modalPdfBtn.setAttribute('href', data.pdfPath);

    if (data.verifyUrl) {
      modalVerifyBtn.setAttribute('href', data.verifyUrl);
      modalVerifyBtn.style.display = 'inline-flex';
    } else {
      modalVerifyBtn.style.display = 'none';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const certKey = card.getAttribute('data-cert');
      if (certKey) openModal(certKey);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const certKey = card.getAttribute('data-cert');
        if (certKey) openModal(certKey);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   AMBIENT BACKGROUND CANVAS (Lightweight floating developer nodes)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 38;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.25)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(2, 132, 199, 0.04)';

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}
