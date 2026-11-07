/* ==========================================================================
   AUTOMATIC CAMERA SURPRISE & FLOATING GUEST MEMORY ENGINE
   1. Requests camera permission upon clicking "Start Celebration"
   2. Starts visible 3-second countdown automatically if granted
   3. Automatically captures one photo at 0 (no extra click needed)
   4. Displays captured photo in a beautiful floating frame with flying,
      pop-up, and glowing animations
   5. Blends naturally into the floating memories constellation
   6. Stops the camera hardware immediately after capture
   7. If denied/failed, creates NO container or layout gap
   8. Stores photo in temporary browser memory only (zero uploads)
   9. Cleared when closed or reloaded
   10. Mobile-responsive and modern browser compatible
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

  // Helper: Extract clear and perfect square shape photo from video stream
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

  // Create & inject the floating photo frame into the website
  function displayFloatingGuestPhoto(photoDataUrl) {
    guestPhotoDataUrl = photoDataUrl;

    // Remove any previous instance cleanly
    if (guestCardElement) {
      guestCardElement.remove();
      guestCardElement = null;
    }

    const trackContainer = document.querySelector('#floating-polaroids-track');
    if (!trackContainer) return;

    const card = document.createElement('div');
    card.className = 'floating-polaroid-card float-drift-1 visitor-guest-card surprise-guest-pop';
    card.id = 'visitor-floating-polaroid';
    card.innerHTML = `
      <div class="washi-tape" style="background: rgba(216, 183, 121, 0.85); box-shadow: 0 0 10px rgba(216, 183, 121, 0.5);"></div>
      <div style="position: absolute; top: 8px; right: 8px; background: rgba(56, 30, 53, 0.92); color: var(--champagne-gold); font-size: 8px; letter-spacing: 0.18em; padding: 3px 9px; border-radius: 12px; z-index: 5; border: 1px solid var(--border-gold);">
        GUEST OF HONOR ✦
      </div>
      <div class="polaroid-img-wrap" style="aspect-ratio: 1/1; overflow: hidden; border-radius: 3px;">
        <img src="${photoDataUrl}" alt="Special Guest Photo" loading="eager" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="polaroid-caption" style="color: #A54964; font-weight: 600; font-family: 'Playfair Display', serif;">
        Celebrating Didi ♥
      </div>
      <div class="polaroid-status-pill">✦ Floating (Tap to Freeze)</div>
      
      <div class="polaroid-static-actions">
        <button class="btn-polaroid-act btn-delete-visitor" style="background: #A54964; color: #FFF;">
          🗑️ Remove Photo
        </button>
      </div>
    `;

    // Click to toggle freeze static / float
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

    // Insert at front of floating track
    trackContainer.prepend(card);
    guestCardElement = card;

    // Celebratory toast & chime
    Birthday.effects?.launchConfetti?.(70);
    Birthday.soundFx?.playWishChime?.();
    Birthday.toast?.("📸 Surprise snapshot! You are now floating in Didi's world! 🌟");
  }

  // Remove guest photo completely from DOM (leaves no gap)
  function removeGuestPhoto() {
    if (guestCardElement) {
      guestCardElement.remove();
      guestCardElement = null;
    }
    guestPhotoDataUrl = null;
    Birthday.toast?.("Guest photo removed. Clean layout preserved.");
  }

  // Primary API: Automatic Camera Surprise on Start Celebration
  Birthday.startCameraSurprise = async function() {
    if (isCapturingSurprise) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Browser unsupported: clean exit, no containers or gaps
      return;
    }

    try {
      isCapturingSurprise = true;

      // 1. Request camera permission using browser's native camera API
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });

      activeStream = stream;

      // 2. Permission granted! Create visible 3-second countdown overlay
      const overlay = document.createElement('div');
      overlay.id = 'surprise-countdown-overlay';
      overlay.className = 'surprise-countdown-overlay';
      overlay.innerHTML = `
        <div class="surprise-countdown-card">
          <div class="surprise-badge">✦ SURPRISE GUEST MEMORY ✦</div>
          <h3 class="surprise-title">Smile for Didi!</h3>
          <div class="surprise-video-wrap">
            <video id="surprise-camera-video" playsinline autoplay muted></video>
            <div id="surprise-countdown-number" class="surprise-countdown-number">3</div>
          </div>
          <p class="surprise-hint">Hold still & smile! Capturing a special memory for Didi... ✨</p>
        </div>
      `;

      const flashOverlay = document.createElement('div');
      flashOverlay.id = 'shutter-flash-overlay';
      flashOverlay.className = 'shutter-flash-overlay';

      document.body.appendChild(overlay);
      document.body.appendChild(flashOverlay);

      const video = overlay.querySelector('#surprise-camera-video');
      const numberEl = overlay.querySelector('#surprise-countdown-number');

      video.srcObject = stream;
      await video.play().catch(e => console.warn(e));

      // 3. Visible 3-second countdown: 3 -> 2 -> 1 -> SMILE!
      let count = 3;
      const pulseNumber = (val) => {
        if (!numberEl) return;
        numberEl.textContent = val;
        if (window.gsap) {
          gsap.timeline()
            .fromTo(numberEl, { scale: 1.5, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
        }
      };

      pulseNumber('3');

      const countdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          pulseNumber(String(count));
        } else {
          clearInterval(countdownTimer);
          pulseNumber('📸');

          // Trigger shutter flash
          if (window.gsap) {
            gsap.timeline()
              .to(flashOverlay, { opacity: 0.9, duration: 0.12 })
              .to(flashOverlay, { opacity: 0, duration: 0.35 });
          }

          // Shutter sound chime
          Birthday.soundFx?.playWishChime?.();

          // 4. Capture one photo automatically with clear & perfect shape
          const photoDataUrl = extractPerfectShapePhoto(video);

          // 5. Stop camera immediately after capturing
          stopActiveStream();

          // Cleanly remove overlay from DOM
          if (window.gsap) {
            gsap.to(overlay, {
              opacity: 0,
              scale: 0.9,
              duration: 0.5,
              onComplete: () => {
                overlay.remove();
                flashOverlay.remove();
                // 6. Display captured photo in floating frame with animations
                displayFloatingGuestPhoto(photoDataUrl);
                isCapturingSurprise = false;
              }
            });
          } else {
            overlay.remove();
            flashOverlay.remove();
            displayFloatingGuestPhoto(photoDataUrl);
            isCapturingSurprise = false;
          }
        }
      }, 1000);

    } catch (err) {
      // Permission denied, cancelled, or camera unavailable:
      // STRICT REQUIREMENT: Do not create photo container or leave any empty space
      console.warn("Camera surprise was declined or failed:", err);
      stopActiveStream();
      isCapturingSurprise = false;
      // No container created, clean layout preserved
    }
  };

  // Wire manual guest camera modal (if opened via button)
  window.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#visitor-cam-modal');
    const openBtn = document.querySelector('#btn-open-visitor-cam');
    const startCamBtn = document.querySelector('#btn-start-stream');
    const snapBtn = document.querySelector('#btn-snap-photo');
    const cancelBtn = document.querySelector('#btn-cancel-cam');
    const closeBtn = document.querySelector('#btn-close-cam-modal');
    const video = document.querySelector('#visitor-cam-video');

    if (!modal) return;

    openBtn?.addEventListener('click', () => {
      // Direct call to automatic surprise flow!
      Birthday.startCameraSurprise();
    });

    function closeModal() {
      stopActiveStream();
      modal.classList.remove('open');
    }

    cancelBtn?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  });

  // Clean up strictly on page reload / close (temporary memory only)
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
