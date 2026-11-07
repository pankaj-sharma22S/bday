/* ==========================================================================
   MAIN ORCHESTRATION & GSAP SCROLL STORYTELLING
   - Custom Smooth Luxury Cursor
   - Welcome Curtain & Audio Unlock
   - Interactive 3D Envelope & Letter Opening Engine with Chapter Tabs
   - Topbar Scroll Blur & Compact
   - GSAP ScrollTrigger Cinematic Journeys
   - Magnetic Micro-Interactions
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  // Toast System
  const toastEl = document.querySelector('#toast-notice');
  let toastTimer;
  Birthday.toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  };

  // Doll Greetings
  const dollLines = [
    "Hello Didi! Today, the entire universe was created just for you! ✨",
    "You look absolutely breathtaking today, Queen Didi! 👑",
    "Your little sibling feels so blessed to have you in their life. 💕",
    "Did you make a wish at the golden cake yet? 🎂",
    "Keep smiling, keep shining, and never stop being you!"
  ];
  let dollIdx = 0;
  Birthday.cycleDollGreeting = () => {
    dollIdx = (dollIdx + 1) % dollLines.length;
    const bubble = document.querySelector('#doll-speech-bubble');
    if (bubble) {
      if (window.gsap) {
        gsap.timeline()
          .to(bubble, { scale: 0.8, opacity: 0, duration: 0.2 })
          .call(() => { bubble.textContent = dollLines[dollIdx]; })
          .to(bubble, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' });
      } else {
        bubble.textContent = dollLines[dollIdx];
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Smooth Cursor (Desktop)
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring && window.innerWidth > 768) {
      window.addEventListener('pointermove', (e) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';

        if (window.gsap) {
          gsap.to(ring, { left: e.clientX, top: e.clientY, duration: 0.18, ease: 'power2.out' });
        } else {
          ring.style.left = e.clientX + 'px';
          ring.style.top = e.clientY + 'px';
        }
      });

      document.querySelectorAll('a, button, .luxury-gift-card, .editorial-card, .luxury-envelope, canvas').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
      });
    }

    // 2. Welcome Curtain & Entrance Experience
    const welcomeScreen = document.querySelector('#welcome-screen');
    const enterBtn = document.querySelector('#btn-enter-experience');

    if (enterBtn && welcomeScreen) {
      enterBtn.addEventListener('click', () => {
        Birthday.music?.start();
        Birthday.effects?.launchConfetti(45);

        if (window.gsap) {
          gsap.to(welcomeScreen, {
            opacity: 0,
            duration: 0.9,
            ease: 'power3.inOut',
            onComplete: () => {
              welcomeScreen.classList.add('hidden');
              initHeroEntranceAnimations();
            }
          });
        } else {
          welcomeScreen.classList.add('hidden');
        }
      });
    }

    // 3. Topbar Scroll Blur & Compact
    const topbar = document.querySelector('.topbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        topbar?.classList.add('scrolled');
      } else {
        topbar?.classList.remove('scrolled');
      }
    }, { passive: true });

    // 4. Hero Entrance Animations
    function initHeroEntranceAnimations() {
      if (!window.gsap) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo('.hero-title-main', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.hero-title-reveal', { opacity: 0, scale: 0.92, y: 35 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power4.out' }, '-=0.6')
        .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo('.hero-cta-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.editorial-arch-frame', { opacity: 0, scale: 0.88, rotate: -4 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.3, ease: 'back.out(1.2)' }, '-=1.0');
    }

    // 5. GSAP ScrollTrigger Cinematic Journey
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to('.editorial-arch-frame', {
        y: 60,
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      gsap.utils.toArray('.eyebrow, .section-title, .section-desc').forEach(el => {
        gsap.fromTo(el, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      gsap.fromTo('.editorial-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.editorial-grid',
            start: 'top 82%'
          }
        }
      );
    }

    // 6. Magnetic Buttons
    document.querySelectorAll('.btn-luxury-gold, .brand-monogram, .sound-toggle-btn, .envelope-wax-seal').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (window.gsap) {
          gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
        }
      });
      btn.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        }
      });
    });

    // 7. 3D Museum Next/Prev Button Wireup
    document.querySelector('#museum-btn-prev')?.addEventListener('click', () => {
      Birthday.effects?.prevMuseumFrame();
    });
    document.querySelector('#museum-btn-next')?.addEventListener('click', () => {
      Birthday.effects?.nextMuseumFrame();
    });

    // 8. Doll Speak Button Wireup
    document.querySelector('#btn-doll-talk')?.addEventListener('click', () => {
      Birthday.cycleDollGreeting();
    });

    // 9. Happy Birthday Song in Cake Section
    document.querySelector('#btn-play-bday-song-cake')?.addEventListener('click', () => {
      Birthday.music?.playHappyBirthdaySong();
    });

    // 10. Finale Celebrate Button
    document.querySelector('#btn-celebrate-again')?.addEventListener('click', () => {
      Birthday.effects?.launchConfetti(100);
      document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
      Birthday.toast?.("A thousand blessings, endless love, and joy for Didi! 💖");
    });

    // 11. INTERACTIVE 3D ENVELOPE & LETTER OPENING ENGINE
    const envelopeStage = document.querySelector('#envelope-closed-stage');
    const envelopeFlap = document.querySelector('#envelope-flap');
    const waxSeal = document.querySelector('#envelope-wax-seal');
    const breakSealBtn = document.querySelector('#btn-break-seal');
    const letterDisplay = document.querySelector('#interactive-letter-display');
    const resealBtn = document.querySelector('#btn-reseal-letter');

    function openEnvelope() {
      if (!envelopeFlap || !letterDisplay) return;

      Birthday.soundFx?.playGiftChime();
      waxSeal?.classList.add('broken');
      envelopeFlap.classList.add('opened');
      Birthday.effects?.launchConfetti(50);
      Birthday.toast?.("The golden seal is broken... Didi’s letter unfolds. 📜✨");

      if (window.gsap) {
        gsap.timeline()
          .to(envelopeStage, { opacity: 0, y: -20, duration: 0.6, delay: 0.4 })
          .call(() => {
            envelopeStage.style.display = 'none';
            letterDisplay.classList.add('revealed');
          })
          .fromTo(letterDisplay, 
            { opacity: 0, y: 40, scale: 0.95 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
          );
      } else {
        envelopeStage.style.display = 'none';
        letterDisplay.classList.add('revealed');
      }
    }

    function resealEnvelope() {
      if (!envelopeStage || !letterDisplay) return;

      if (window.gsap) {
        gsap.to(letterDisplay, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          onComplete: () => {
            letterDisplay.classList.remove('revealed');
            envelopeStage.style.display = 'block';
            gsap.to(envelopeStage, { opacity: 1, y: 0, duration: 0.5 });
            envelopeFlap?.classList.remove('opened');
            waxSeal?.classList.remove('broken');
          }
        });
      } else {
        letterDisplay.classList.remove('revealed');
        envelopeStage.style.display = 'block';
        envelopeFlap?.classList.remove('opened');
        waxSeal?.classList.remove('broken');
      }
      Birthday.toast?.("The letter is sealed with golden wax once more.");
    }

    waxSeal?.addEventListener('click', openEnvelope);
    breakSealBtn?.addEventListener('click', openEnvelope);
    document.querySelector('#interactive-envelope')?.addEventListener('click', (e) => {
      if (e.target !== waxSeal) openEnvelope();
    });
    resealBtn?.addEventListener('click', resealEnvelope);

    // 12. Interactive Letter Chapter Navigation
    const navTabs = document.querySelectorAll('.letter-nav-tab');
    const chapters = document.querySelectorAll('.letter-chapter');

    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const chapterId = 'chapter-' + tab.dataset.chapter;
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        chapters.forEach(ch => {
          if (ch.id === chapterId) {
            ch.classList.add('active');
          } else {
            ch.classList.remove('active');
          }
        });
      });
    });
  });
})();


    // 13. Mobile Touch Sparkle Trail
    let lastSparkleTime = 0;
    window.addEventListener('touchmove', (e) => {
      const now = performance.now();
      if (now - lastSparkleTime < 70) return; // throttle for 60fps performance
      lastSparkleTime = now;

      const touch = e.touches[0];
      if (!touch) return;

      const sparkle = document.createElement('div');
      sparkle.className = 'touch-sparkle';
      sparkle.style.left = touch.clientX + 'px';
      sparkle.style.top = touch.clientY + 'px';

      const symbols = ['✦', '✧', '❊', '✨', '♥'];
      sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      sparkle.style.color = (Math.random() > 0.5) ? '#D8B779' : '#D9A6B2';
      sparkle.style.fontSize = (12 + Math.random() * 8) + 'px';

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }, { passive: true });

    // 14. Mobile Bottom Dock Active Section Tracking
    const dockItems = document.querySelectorAll('.dock-item');
    const trackedSections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 200;
      trackedSections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          dockItems.forEach(item => {
            if (item.getAttribute('href') === '#' + id) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, { passive: true });
