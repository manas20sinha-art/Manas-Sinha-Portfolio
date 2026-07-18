/* ==========================================================================
   Manas Sinha Portfolio Logic
   Teenage Engineering Visuals Integration, Scroll Stripes, Custom Cursor & CLI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Secure Portal Preloader Screen Setup
  // ==========================================================================
  const preloader = document.getElementById("preloader");
  
  function setupPreloader() {
    if (!preloader) return;
    setTimeout(() => {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
        // Initialize observers on portal launch
        initRevealObserver();
      }, 800);
    }, 1800);
  }
  
  setupPreloader();


  // ==========================================================================
  // 2. Custom Teenage Engineering Cursor & Particle Trail
  // ==========================================================================
  const cursor = document.getElementById("custom-cursor");
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (cursor && !isTouchDevice) {
    document.body.classList.add("custom-cursor-active");
    cursor.style.opacity = "1";

    let curX = -100;
    let curY = -100;
    let targetX = -100;
    let targetY = -100;

    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Smooth cursor LERP follow
    function updateCursor() {
      curX += (targetX - curX) * 0.25;
      curY += (targetY - curY) * 0.25;
      cursor.style.left = `${curX}px`;
      cursor.style.top = `${curY}px`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover scales and rotate actions
    document.addEventListener("mouseover", (e) => {
      const interactive = e.target.closest(".interactive, a, button, select, input, textarea, .interactive-skill, .filter-btn");
      if (interactive) {
        cursor.classList.add("hover");
      }
    });

    document.addEventListener("mouseout", (e) => {
      const interactive = e.target.closest(".interactive, a, button, select, input, textarea, .interactive-skill, .filter-btn");
      if (interactive) {
        cursor.classList.remove("hover");
      }
    });
  }


  // ==========================================================================
  // 3. Navigation Scroll Indicators & Mobile Toggle
  // ==========================================================================
  const header = document.querySelector('header');
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelectorAll('#nav ul li a');
  const sections = document.querySelectorAll('section');

  // Sticky header transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && nav) {
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
  }

  // Active section highlighters
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
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
  }, { passive: true });


  // ==========================================================================
  // 3.5 Background Stripe Scroll-Driven Rotation & Scaling
  // ==========================================================================
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const aboutSection = document.getElementById("about");
    const projectsSection = document.getElementById("projects");

    if (!aboutSection || !projectsSection) return;

    const aboutTop = aboutSection.offsetTop;
    const projectsTop = projectsSection.offsetTop;

    if (scrollY <= aboutTop) {
      // Phase 1: Rotate stripes from 90deg (vertical) to 180deg (horizontal)
      const progress = Math.min(scrollY / aboutTop, 1);
      const angle = 90 + progress * 90;
      document.documentElement.style.setProperty('--stripe-angle', `${angle}deg`);
      document.documentElement.style.setProperty('--stripe-white-w', '120px');
    } else if (scrollY > aboutTop && scrollY <= projectsTop) {
      // Phase 2: Expand black stripes (shrink white gaps from 120px to 0px)
      const range = projectsTop - aboutTop;
      const progress = Math.min((scrollY - aboutTop) / range, 1);
      const whiteWidth = 120 * (1 - progress);
      
      document.documentElement.style.setProperty('--stripe-angle', '180deg');
      document.documentElement.style.setProperty('--stripe-white-w', `${whiteWidth}px`);
    } else {
      // Past the projects section: Keep background fully black
      document.documentElement.style.setProperty('--stripe-angle', '180deg');
      document.documentElement.style.setProperty('--stripe-white-w', '0px');
    }
  }, { passive: true });


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
