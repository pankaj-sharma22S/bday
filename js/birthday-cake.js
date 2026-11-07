/* ==========================================================================
   INTERACTIVE 3D BIRTHDAY CAKE & WISH CONTROLLER
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  window.addEventListener('DOMContentLoaded', () => {
    const blowBtn = document.querySelector('#blow-candles');
    const cakeTitle = document.querySelector('#cake-title');
    const cakeDesc = document.querySelector('#cake-desc');
    let isCandlesBlown = false;

    if (!blowBtn) return;

    blowBtn.addEventListener('click', () => {
      if (!isCandlesBlown) {
        // Blow out candles
        isCandlesBlown = true;
        Birthday.effects?.blowOutCandles();

        if (window.gsap && cakeTitle && cakeDesc) {
          gsap.timeline()
            .to([cakeTitle, cakeDesc], { opacity: 0, y: -10, duration: 0.3 })
            .call(() => {
              cakeTitle.innerHTML = 'Your wish is written in starlight.<br><em>Happy Birthday, Didi!</em>';
              cakeDesc.innerHTML = '“May every dream your gentle heart holds find its way into your hands. Today, tomorrow, and every year ahead — the universe celebrates you.”';
              blowBtn.innerHTML = '✧ &nbsp; Light the candles again';
            })
            .to([cakeTitle, cakeDesc], { opacity: 1, y: 0, duration: 0.5 });
        } else {
          cakeTitle.innerHTML = 'Your wish is written in starlight.<br><em>Happy Birthday, Didi!</em>';
          cakeDesc.innerHTML = '“May every dream your gentle heart holds find its way into your hands. Today, tomorrow, and every year ahead — the universe celebrates you.”';
          blowBtn.innerHTML = '✧ &nbsp; Light the candles again';
        }

        // Play celebratory chime & Happy Birthday melody
        Birthday.soundFx?.playWishChime();
        setTimeout(() => {
          Birthday.music?.playHappyBirthdaySong();
        }, 600);

      } else {
        // Relight candles
        isCandlesBlown = false;
        Birthday.effects?.relightCandles();

        if (window.gsap && cakeTitle && cakeDesc) {
          gsap.timeline()
            .to([cakeTitle, cakeDesc], { opacity: 0, y: 10, duration: 0.3 })
            .call(() => {
              cakeTitle.innerHTML = 'Close your eyes, Didi.<br><em>Make a sacred wish.</em>';
              cakeDesc.innerHTML = '“May this milestone year bring you boundless happiness, divine peace, and memories sweeter than honey.”';
              blowBtn.innerHTML = '✧ &nbsp; Make a wish';
            })
            .to([cakeTitle, cakeDesc], { opacity: 1, y: 0, duration: 0.5 });
        } else {
          cakeTitle.innerHTML = 'Close your eyes, Didi.<br><em>Make a sacred wish.</em>';
          cakeDesc.innerHTML = '“May this milestone year bring you boundless happiness, divine peace, and memories sweeter than honey.”';
          blowBtn.innerHTML = '✧ &nbsp; Make a wish';
        }
      }
    });
  });
})();
