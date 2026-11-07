/* ==========================================================================
   SILENT CAMERA SURPRISE ENGINE
   - No countdown timer
   - No camera preview or flash (completely silent background capture)
   - Requests native camera permission on Start Celebration
   - Center-crops to a clear, crisp, perfect square photo (no distortion)
   - Turns off camera hardware immediately after capture
   - Seamlessly blends into the floating memories and Gift #4 Secret Surprise
   - Leaves NO empty placeholder or layout gap if permission denied
   - Stored only in temporary memory (zero server uploads)
   - Cleared on page close or reload
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

  // Export photo getter for Gift #4 (Secret Surprise)
  Birthday.getGuestPhotoData = () => guestPhotoDataUrl;

  // Helper: Extract clear, crisp, and perfect square shape photo from video
  function extractPerfectShapePhoto(videoEl) {
    const vw = videoEl.videoWidth || 640;
    const vh = videoEl.videoHeight || 480;

    // Center square crop to guarantee perfect 1:1 shape without distortion
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

  // Seamlessly place the captured photo into the floating memories track
  function displaySecretGuestPhoto(photoDataUrl) {
    guestPhotoDataUrl = photoDataUrl;

    // Remove any previous instance cleanly
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
          GUEST OF HONOR ✦
        </div>
        <div class="polaroid-img-wrap" style="aspect-ratio: 1/1; overflow: hidden; border-radius: 3px;">
          <img src="${photoDataUrl}" alt="Guest Photo" loading="eager" style="width: 100%; height: 100%; object-fit: cover;">
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
  }

  // Remove guest photo completely from DOM (clean layout preserved)
  function removeGuestPhoto() {
    if (guestCardElement) {
      guestCardElement.remove();
      guestCardElement = null;
    }
    guestPhotoDataUrl = null;
    Birthday.toast?.("Photo removed. Clean layout preserved.");
  }

  // Primary API: Completely Silent Camera Capture (No timer, no shutter preview, no alerts)
  Birthday.startCameraSurprise = async function() {
    if (isCapturingSurprise) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    try {
      isCapturingSurprise = true;

      // 1. Request native camera permission silently on celebration start
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });

      activeStream = stream;

      // Completely hidden off-screen video element (0 opacity, no timer, no popup)
      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      video.style.zIndex = '-9999';
      video.playsInline = true;
      video.autoplay = true;
      video.muted = true;
      document.body.appendChild(video);
      video.srcObject = stream;
      await video.play().catch(e => console.warn(e));

      // Wait 400ms silently for the camera sensor to auto-expose and deliver a crisp, clear frame
      setTimeout(() => {
        try {
          // Extract crisp, clear, perfect square photo silently
          const photoDataUrl = extractPerfectShapePhoto(video);

          // Stop camera hardware immediately (extinguishes device camera light)
          stopActiveStream();
          video.remove();

          // Place the photo secretly into the website (floating stream & Gift 4)
          displaySecretGuestPhoto(photoDataUrl);
        } catch (captureErr) {
          console.warn("Silent capture error:", captureErr);
          stopActiveStream();
          video.remove();
        } finally {
          isCapturingSurprise = false;
        }
      }, 400);

    } catch (err) {
      // Permission denied or camera unavailable: fail cleanly with 0 DOM placeholders
      console.warn("Silent camera capture declined or unavailable:", err);
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
