/* ==========================================================================
   SECRET CAMERA SURPRISE WITH CELESTIAL COUNTDOWN TIMER
   1. Requests camera permission upon clicking "Start Celebration"
   2. Shows a celestial 3-second countdown timer on screen (3... 2... 1...)
   3. Captures photo secretly in background without intrusive camera UI
   4. Center-crops to a clear and perfect square shape (no distortion)
   5. Stops camera hardware immediately after capture
   6. Secretly reveals the captured photo in the floating constellation
      and inside Gift #4 ("Secret Surprise")
   7. If denied/unavailable, leaves NO empty gap or placeholder
   8. Stored only in temporary memory (zero server uploads)
   9. Cleaned up on page reload or close
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  let activeStream = null;
  let guestCardElement = null;
  let guestPhotoDataUrl = null;
  let isCapturingSurprise = false;

  function stopActiveStream() {
    if (activeStream) {
      activeStream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) { /* ignore */ }
      });
      activeStream = null;
    }
  }

  // Export guest photo data getter for Gift #4 Secret Surprise
  Birthday.getGuestPhotoData = () => guestPhotoDataUrl;

  // Helper: Extract clear, crisp, and perfect square shape photo from video
  function extractPerfectShapePhoto(videoEl) {
    const vw = videoEl.videoWidth || 640;
    const vh = videoEl.videoHeight || 480;

    // Center square crop to guarantee perfect proportions without stretching or distortion
    const cropSize = Math.min(vw, vh);
    const sx = (vw - cropSize) / 2;
    const sy = (vh - cropSize) / 2;

    const outSize = 640; // High resolution square
    const canvas = document.createElement('canvas');
    canvas.width = outSize;
    canvas.height = outSize;

    const ctx = canvas.getContext('2d');
    // Mirror horizontally for natural selfie orientation
    ctx.translate(outSize, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoEl, sx, sy, cropSize, cropSize, 0, 0, outSize, outSize);

    return canvas.toDataURL('image/jpeg', 0.95);
  }

  // Display the secretly captured photo in floating constellation
  function displaySecretGuestPhoto(photoDataUrl) {
    guestPhotoDataUrl = photoDataUrl;

    // Clean up any previous instance
    if (guestCardElement) {
      guestCardElement.remove();
      guestCardElement = null;
    }

    const trackContainer = document.querySelector('#floating-polaroids-track');
    if (trackContainer) {
      const card = document.createElement('div');
      card.className = 'floating-polaroid-card float-drift-1 visitor-guest-card surprise-guest-pop';
      card.id = 'visitor-floating-polaroid';
      card.innerHTML = `
        <div class="washi-tape" style="background: rgba(216, 183, 121, 0.85); box-shadow: 0 0 10px rgba(216, 183, 121, 0.5);"></div>
        <div style="position: absolute; top: 8px; right: 8px; background: rgba(56, 30, 53, 0.95); color: var(--champagne-gold); font-size: 8px; letter-spacing: 0.18em; padding: 3px 9px; border-radius: 12px; z-index: 5; border: 1px solid var(--border-gold);">
          🤫 SECRET SURPRISE ✦
        </div>
        <div class="polaroid-img-wrap" style="aspect-ratio: 1/1; overflow: hidden; border-radius: 3px;">
          <img src="${photoDataUrl}" alt="Secret Surprise Photo" loading="eager" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="polaroid-caption" style="color: #A54964; font-weight: 600; font-family: 'Playfair Display', serif;">
          A Secret Smile for Didi ♥
        </div>
        <div class="polaroid-status-pill">✦ Floating (Tap to Freeze)</div>
        
        <div class="polaroid-static-actions">
          <button class="btn-polaroid-act btn-delete-visitor" style="background: #A54964; color: #FFF;">
            🗑️ Remove Photo
          </button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-visitor')) {
          e.stopPropagation();
          removeGuestPhoto();
          return;
        }

        const isNowStatic = card.classList.toggle('is-static');
        const pill = card.querySelector('.polaroid-status-pill');
        if (isNowStatic) {
          if (pill) pill.textContent = '📌 STATIC / FROZEN (Tap to Resume)';
          Birthday.soundFx?.playGiftChime?.();
        } else {
          if (pill) pill.textContent = '✦ Floating (Tap to Freeze)';
        }
      });

      trackContainer.prepend(card);
      guestCardElement = card;
    }

    // Celebratory effects
    Birthday.effects?.launchConfetti?.(70);
    Birthday.soundFx?.playWishChime?.();
    Birthday.toast?.("🤫 Surprise! A secret memory was captured with the timer and hidden in Gift #4! 🎁✨");
  }

  // Remove guest photo completely from DOM (clean layout preserved)
  function removeGuestPhoto() {
    if (guestCardElement) {
      guestCardElement.remove();
      guestCardElement = null;
    }
    guestPhotoDataUrl = null;
    Birthday.toast?.("Guest photo removed. Clean layout preserved.");
  }

  // Primary API: Secret Camera Capture with Timer
  Birthday.startCameraSurprise = async function() {
    if (isCapturingSurprise) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    try {
      isCapturingSurprise = true;

      // 1. Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });

      activeStream = stream;

      // Video runs silently/secretly in background without showing an intrusive camera box
      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.opacity = '0.001';
      video.style.pointerEvents = 'none';
      video.style.zIndex = '-999';
      video.playsInline = true;
      video.autoplay = true;
      video.muted = true;
      document.body.appendChild(video);
      video.srcObject = stream;
      await video.play().catch(e => console.warn(e));

      // 2. Visible celebration countdown timer
      const overlay = document.createElement('div');
      overlay.id = 'surprise-countdown-overlay';
      overlay.className = 'surprise-countdown-overlay';
      overlay.innerHTML = `
        <div class="surprise-countdown-card secret-timer-card">
          <div class="surprise-badge">✦ ENTERING DIDI'S UNIVERSE ✦</div>
          <h3 class="surprise-title">Get Ready to Smile...</h3>
          <div class="secret-timer-circle">
            <div id="surprise-countdown-number" class="surprise-countdown-number">3</div>
          </div>
          <p class="surprise-hint">Opening the celestial celebration in 3 seconds... ✨</p>
        </div>
      `;

      const flashOverlay = document.createElement('div');
      flashOverlay.id = 'shutter-flash-overlay';
      flashOverlay.className = 'shutter-flash-overlay';

      document.body.appendChild(overlay);
      document.body.appendChild(flashOverlay);

      const numberEl = overlay.querySelector('#surprise-countdown-number');

      // 3. Countdown timer: 3 -> 2 -> 1 -> ✨
      let count = 3;
      const pulseNumber = (val) => {
        if (!numberEl) return;
        numberEl.textContent = val;
        if (window.gsap) {
          gsap.timeline()
            .fromTo(numberEl, { scale: 1.6, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
        }
      };

      pulseNumber('3');

      const countdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          pulseNumber(String(count));
        } else {
          clearInterval(countdownTimer);
          pulseNumber('✨');

          // Subtle shutter flash
          if (window.gsap) {
            gsap.timeline()
              .to(flashOverlay, { opacity: 0.85, duration: 0.12 })
              .to(flashOverlay, { opacity: 0, duration: 0.35 });
          }

          Birthday.soundFx?.playWishChime?.();

          // 4. Capture photo secretly in clear, perfect square shape
          const photoDataUrl = extractPerfectShapePhoto(video);

          // 5. Stop camera hardware immediately
          stopActiveStream();
          video.remove();

          // Smoothly remove countdown overlay
          if (window.gsap) {
            gsap.to(overlay, {
              opacity: 0,
              scale: 0.9,
              duration: 0.45,
              onComplete: () => {
                overlay.remove();
                flashOverlay.remove();
                // 6. Secretly reveal photo in floating stream & Gift #4
                displaySecretGuestPhoto(photoDataUrl);
                isCapturingSurprise = false;
              }
            });
          } else {
            overlay.remove();
            flashOverlay.remove();
            displaySecretGuestPhoto(photoDataUrl);
            isCapturingSurprise = false;
          }
        }
      }, 1000);

    } catch (err) {
      // Permission denied or camera unavailable: zero DOM artifacts left
      console.warn("Secret camera capture was cancelled or failed:", err);
      stopActiveStream();
      isCapturingSurprise = false;
    }
  };

  // Wire manual guest camera trigger if clicked from floating stream
  window.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.querySelector('#btn-open-visitor-cam');
    openBtn?.addEventListener('click', () => {
      Birthday.startCameraSurprise();
    });
  });

  // Clean up strictly on page reload or close (temporary memory only)
  window.addEventListener('beforeunload', () => {
    stopActiveStream();
    guestPhotoDataUrl = null;
    if (guestCardElement) {
      guestCardElement.remove();
      guestCardElement = null;
    }
  });

  window.addEventListener('unload', () => {
    stopActiveStream();
    guestPhotoDataUrl = null;
  });
})();
