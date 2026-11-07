/* ==========================================================================
   LUXURY INTERACTIVE GIFT UNWRAPPING EXPERIENCE
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  const giftData = {
    letter: {
      tag: "FROM YOUR SIBLING WITH LOVE",
      title: "Words from the Heart",
      content: `
        <p style="font-size: 18px; line-height: 1.8; color: #FFF7EC; font-family: var(--font-serif); font-style: italic; margin-bottom: 20px;">
          “Didi, you are not just my elder sister — you are my safe harbor, my mentor, and one of the finest blessings God has ever bestowed upon our family.
        </p>
        <p style="font-size: 15px; line-height: 1.8; color: #D9A6B2; margin-bottom: 24px;">
          Through every fight, every shared ice cream, every secret confided, and every celebration, your warmth has shaped my world. Thank you for being you.”
        </p>
        <div style="text-align: right; font-family: var(--font-script); font-size: 32px; color: var(--champagne-gold);">
          Your Little Sibling ♥
        </div>
      `
    },
    memories: {
      tag: "TIME CAPSULE ARCHIVE",
      title: "Treasured Milestones",
      content: `
        <p style="font-size: 15px; line-height: 1.7; color: #FFF7EC; margin-bottom: 18px;">
          Every photograph we take together is a testament to an unbreakable bond. Scroll down to the <b>3D Memory Museum</b> and the <b>Editorial Gallery</b> to view each picture rendered in high fashion clarity!
        </p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px;">
          <img src="assets/images/garden-rose.jpg" style="width: 100%; height: 110px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-gold);" alt="Didi Garden">
          <img src="assets/images/temple-steps.jpg" style="width: 100%; height: 110px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-gold);" alt="Didi Temple">
          <img src="assets/images/couture-grace.jpg" style="width: 100%; height: 110px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-gold);" alt="Didi Gown">
        </div>
      `
    },
    wishes: {
      tag: "STARRY BLESSINGS",
      title: "A Thousand Golden Wishes",
      content: `
        <div style="text-align: left; font-size: 15px; line-height: 2; color: #F2E7D5;">
          <div style="margin-bottom: 10px;">✨ <b>May your laughter</b> echo in every room you enter.</div>
          <div style="margin-bottom: 10px;">✨ <b>May health & prosperity</b> walk beside you at every crossroad.</div>
          <div style="margin-bottom: 10px;">✨ <b>May your grandest aspirations</b> unfold effortlessly into reality.</div>
          <div style="margin-bottom: 10px;">✨ <b>May your kindness</b> be returned to you multiplied ten-thousandfold.</div>
          <div>✨ <b>And may you always remember:</b> you are deeply, unconditionally loved.</div>
        </div>
      `
    },
    surprise: {
      tag: "THE ROYAL CORONATION",
      title: "A Secret Birthday Surprise",
      content: `
        <div style="text-align: center;">
          <div style="font-size: 54px; margin-bottom: 12px; filter: drop-shadow(0 0 20px #D8B779);">👑</div>
          <h4 style="font-family: var(--font-display); font-size: 24px; color: var(--champagne-gold); margin-bottom: 12px;">The Queen of Our Hearts</h4>
          <p style="font-size: 15px; line-height: 1.8; color: #FFF7EC;">
            Today isn't just another day on the calendar — it's the day the world was blessed with the gentlest soul. As your special gift, a golden celebration fireworks display has been unlocked for you!
          </p>
          <button class="btn-luxury-gold" id="btn-trigger-fireworks" style="margin-top: 24px;">
            ✧ &nbsp; Launch Grand Royal Fireworks
          </button>
        </div>
      `
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    const giftCards = document.querySelectorAll('.luxury-gift-card');
    const modal = document.querySelector('#gift-modal');
    const modalTag = document.querySelector('#gift-modal-tag');
    const modalTitle = document.querySelector('#gift-modal-title');
    const modalBody = document.querySelector('#gift-modal-body');
    const modalClose = document.querySelector('#gift-modal-close');

    if (!modal) return;

    giftCards.forEach(card => {
      card.addEventListener('click', () => {
        const giftType = card.dataset.gift;
        const data = giftData[giftType];
        if (!data) return;

        // Untie & Pop Animation
        if (window.gsap) {
          gsap.fromTo(card.querySelector('.gift-icon-svg'), 
            { scale: 1, rotation: 0 }, 
            { scale: 1.3, rotation: 15, duration: 0.35, yoyo: true, repeat: 1, ease: 'back.out(2)' }
          );
        }

        Birthday.effects?.launchConfetti(40);
        Birthday.soundFx?.playGiftChime();

        setTimeout(() => {
          modalTag.textContent = data.tag;
          modalTitle.textContent = data.title;
          modalBody.innerHTML = data.content;

          // Wire special button in surprise if present
          const fwBtn = modalBody.querySelector('#btn-trigger-fireworks');
          if (fwBtn) {
            fwBtn.addEventListener('click', () => {
              modal.classList.remove('open');
              Birthday.effects?.launchConfetti(120);
              Birthday.toast?.("Fireworks illuminated across Didi's celestial universe! 🎆");
            });
          }

          modal.classList.add('open');
          if (window.gsap) {
            gsap.fromTo('.gift-modal-content', { scale: 0.9, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
          }
        }, 300);
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });
})();
