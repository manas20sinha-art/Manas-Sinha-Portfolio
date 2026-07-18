/* ==========================================================================
   Manas Sinha Portfolio Logic
   Interactive Particle Network Canvas, CLI Simulator, Filters & UI Hooks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Diagnostics Preloader System
  // ==========================================================================
  const loaderOutput = document.getElementById('loader-output');
  const preloader = document.getElementById('preloader');

  const logs = [
    '> INITIALIZING SECURE LINK PROTOCOL...',
    '> LOADING USER CONFIGURATION REGISTRY...',
    '> VERIFYING PGP SIGNATURES FOR NODE [MANAS]...',
    '> OK: KEY VALIDATED [0x2A8C4B9F]',
    '> DECRYPTING PROJECT DATA SCHEMAS...',
    '> CONFIGURING INTEL NETWORK GRAPH CANVAS...',
    '> ESTABLISHING AES-256 SECURE CONNECTION...',
    '> SYSTEM READY. GRACEFUL LAUNCH INITIATED.'
  ];

  let logIndex = 0;
  function printLog() {
    if (logIndex < logs.length) {
      const p = document.createElement('p');
      p.textContent = logs[logIndex];
      loaderOutput.appendChild(p);
      loaderOutput.scrollTop = loaderOutput.scrollHeight;
      logIndex++;
      setTimeout(printLog, 150 + Math.random() * 150);
    } else {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Kick off scroll reveal after preloader exits
        initRevealObserver();
      }, 500);
    }
  }

  // Start preloader diagnostic logs
  printLog();


  // ==========================================================================
  // 2. Custom Cursor (Desktop Only)
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    document.body.classList.add('custom-cursor-enabled');
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const interactives = document.querySelectorAll('a, button, .interactive, input, textarea, .interactive-skill');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }


  // ==========================================================================
  // 3. Navigation Scroll Indicators & Mobile Toggle
  // ==========================================================================
  const header = document.querySelector('header');
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky header transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });

  // Close mobile menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });

  // Active section highlighters
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================================================
  // 4. Typewriter Headline Subtitles
  // ==========================================================================
  const strings = [
    'focusing on Network Forensics',
    'practicing Binary Exploitation',
    'designing dynamic UI/UX',
    'vibe coding interactive systems'
  ];
  let stringIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typingTarget = document.getElementById('typing-sub');
  
  function typeEffect() {
    const currentString = strings[stringIdx];
    if (isDeleting) {
      typingTarget.textContent = currentString.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingTarget.textContent = currentString.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = 100 - Math.random() * 50;

    if (isDeleting) {
      delay /= 2; // Delete faster
    }

    if (!isDeleting && charIdx === currentString.length) {
      delay = 1800; // Pause at end of string
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      stringIdx = (stringIdx + 1) % strings.length;
      delay = 400; // Pause before starting next string
    }

    setTimeout(typeEffect, delay);
  }

  // Launch Typewriter
  setTimeout(typeEffect, 1500);


  // ==========================================================================
  // 5. Canvas Particles Network
  // ==========================================================================
  const canvas = document.getElementById('canvas-network');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const connectionDistance = 140;
  let mouse = { x: null, y: null, radius: 150 };

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);
  
  class Particle {
    constructor(x, y, vx, vy, radius) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = radius;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = 'rgba(180, 160, 130, 0.25)';
      ctx.fill();
    }
    
    update() {
      // Bounce boundary check
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Mouse push effect
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 1.5;
          let directionY = forceDirectionY * force * 1.5;
          
          this.x += directionX;
          this.y += directionY;
        }
      }
      
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    // Dynamic density based on canvas size
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
    for (let i = 0; i < numberOfParticles; i++) {
      let radius = Math.random() * 1.2 + 0.4;
      let x = Math.random() * (canvas.width - radius * 2) + radius;
      let y = Math.random() * (canvas.height - radius * 2) + radius;
      let vx = (Math.random() - 0.5) * 0.22;
      let vy = (Math.random() - 0.5) * 0.22;
      particlesArray.push(new Particle(x, y, vx, vy, radius));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        let dist = Math.sqrt(
          Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
          Math.pow(particlesArray[a].y - particlesArray[b].y, 2)
        );
        if (dist < connectionDistance) {
          // Fade connection opacity based on proximity
          let opacity = (1 - dist / connectionDistance) * 0.08;
          ctx.strokeStyle = `rgba(180, 160, 130, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Boot Canvas Network Background
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
  animateParticles();


  // ==========================================================================
  // 6. Project Filters System
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });


  // ==========================================================================
  // 7. Interactive Skills Matrix Expandable Detailed Overlay
  // ==========================================================================
  const interactiveSkills = document.querySelectorAll('.interactive-skill');
  interactiveSkills.forEach(skill => {
    skill.addEventListener('click', () => {
      skill.classList.toggle('active');
    });
  });


  // ==========================================================================
  // 8. Interactive CLI Sandbox Terminal Simulation
  // ==========================================================================
  const terminalInput = document.getElementById('terminal-input');
  const terminalLogs = document.getElementById('terminal-logs');
  const terminalScreen = document.getElementById('terminal-screen');

  // Command History
  let history = [];
  let historyIndex = -1;

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim();
      if (input) {
        history.push(input);
        historyIndex = history.length;
        processCommand(input);
      }
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  // Focus terminal input when clicking anywhere inside the terminal screen
  terminalScreen.addEventListener('click', () => {
    terminalInput.focus();
  });

  function processCommand(rawInput) {
    const parts = rawInput.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ').toLowerCase().trim();

    // Log the user's prompt
    createLogLine(`manas@xaenithra:~$ ${rawInput}`, 'prompt');

    switch (cmd) {
      case 'help':
        output(`Available Operations:
  about       - Display biography profile parameters.
  skills      - Query active technical skill vectors.
  projects    - Print list of active development and security projects.
  flag        - Start/submit the Layer 4 Security Challenge! (Usage: flag [answer])
  contact     - Reveal cryptographic communication vectors.
  clear       - Purge terminal terminal-log-line entries.
  help        - This command panel.`, 'text');
        break;

      case 'about':
        output(`=================== DOSSIER: MANAS SINHA ===================
CSE Cybersecurity Undergraduate focusing on Intrusion forensics and Binary pwn.
Active member of the Xaenithra cybersecurity operations division.
Focused on solving network packet anomalies and assembly vulnerabilities.
Complements security audits with AI-assisted UI/UX prototyping.`, 'text');
        break;

      case 'skills':
        output(`=================== ACTIVE TECHNICAL MATRIX ===================
* Network Forensics       - Active Focus (Packet capture, traffic reconstruction)
* Binary Exploitation     - Core Capability (Stack overflows, gdb pwn, CTF pwn)
* Bash & Linux Operations - Advanced (Process audits, automation shell scripts)
* C / C++ & DSA           - Advanced (Memory layout, algorithms, structures)
* Java Programming        - Proficient (Object-oriented application structures)
* SQL & Databases         - Proficient (Relational queries, SQLi prevention testing)
* Web Development         - Proficient (Interactive UI architectures, responsive layout)`, 'text');
        break;

      case 'projects':
        output(`=================== DEPLOYED APPLICATIONS ===================
1. Xaenithra Team Operations
   Role: Forensic Investigator & Exploitation trainee.
   Accomplishment: 15th overall placement at BYU CTF (Jun 2026).
   
2. EdTech Application
   Role: Founder & Lead Developer
   Details: End-to-end full stack web architecture designed for responsive layout.
   
3. Sea Cones Concept Earphones
   Role: Concept Industrial Designer
   Details: Ergonomic form exploration exploring alternative acoustic spaces.`, 'text');
        break;

      case 'contact':
        output(`=================== ENCRYPTED PORT PATHS ===================
* Secure Mail   : manas20sinha@gmail.com
* Professional  : linkedin.com/in/manas-sinha-b0ttlecap
* Code Repository: github.com/manas20sinha-art
* Training Hub  : tryhackme.com/p/ManasSinha`, 'text');
        break;

      case 'clear':
        terminalLogs.innerHTML = '';
        break;

      case 'flag':
        if (!args) {
          output(`============= SECURE ENVELOPE ENCRYPTED: L4 PROTOCOL =============
Riddle: What protocol operating at Layer 4 of the OSI model is connection-oriented,
provides guaranteed delivery, and establishes sessions using a 3-way handshake?

Submit your decrypted flag: flag [answer] (Example: flag http)`, 'text');
        } else if (args === 'tcp') {
          output(`[+] CHALLENGE SOLVED SUCCESSFULLY! ACCESS GRANTED.
================================================================
  ██████╗ ██████╗ ███╗   ██╗ ██████╗ ██████╗  █████╗ ████████╗███████╗
 ██╔════╝██╔═══██╗████╗  ██║██╔════╝ ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
 ██║     ██║   ██║██╔██╗ ██║██║  ███╗██████╔╝███████║   ██║   ███████╗
 ██║     ██║   ██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║   ██║   ╚════██║
 ╚██████╗╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║██║  ██║   ██║   ███████║
  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
================================================================
FLAG UNLOCKED: FLAG{N3TW0RK_F0R3NS1CS_M4ST3R}`, 'success');
        } else {
          output(`[-] DECRYPTION FAILED. Verification checksum mismatch for parameter "${args}".
Verify Layer 4 protocols and submit again.`, 'error');
        }
        break;

      default:
        output(`shell: command not found: "${cmd}". Type "help" for valid parameters.`, 'error');
        break;
    }
    
    // Auto-scroll to bottom of terminal screen
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function createLogLine(text, typeClass) {
    const line = document.createElement('div');
    line.classList.add('terminal-log-line', typeClass);
    line.textContent = text;
    terminalLogs.appendChild(line);
  }

  function output(text, status) {
    const pre = document.createElement('pre');
    pre.classList.add('terminal-output');
    if (status === 'error') pre.classList.add('terminal-error');
    if (status === 'success') pre.classList.add('terminal-success');
    pre.textContent = text;
    terminalLogs.appendChild(pre);
  }





  // ==========================================================================
  // 10. Reveal on Scroll Helper Mechanism
  // ==========================================================================
  // ==========================================================================
  // 8. Scroll-Reveal Fly-In Animation (IntersectionObserver)
  // ==========================================================================
  function initRevealObserver() {
    const revealEls = document.querySelectorAll('.reveal');

    // Stamp delay as a CSS custom property so CSS transitions can pick it up
    revealEls.forEach(el => {
      const delay = el.dataset.revealDelay;
      if (delay) {
        el.style.setProperty('--reveal-delay', `${delay}ms`);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Stop watching once revealed — no need to re-trigger
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,      // fire when 12% of the element is visible
      rootMargin: '0px 0px -50px 0px'  // slightly before the viewport bottom
    });

    revealEls.forEach(el => observer.observe(el));
  }

  initRevealObserver();
});
