/* ==========================================================================
   CONDITIONAL VISITOR PHOTO CAMERA & FLOATING CARD ENGINE
   - Requests camera permission ONLY after explicit user consent
   - Captures photo ONLY after permission granted & visitor clicks Capture
   - Dynamically creates floating photo container ONLY upon successful capture
   - Leaves NO empty placeholder or layout gap if denied/failed/unsupported
   - Completely removes container from DOM upon deletion or reload
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  let currentStream = null;
  let visitorCardElement = null;
  let visitorImageData = null;

  function stopStream() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#visitor-cam-modal');
    const openBtn = document.querySelector('#btn-open-visitor-cam');
    const startCamBtn = document.querySelector('#btn-start-stream');
    const snapBtn = document.querySelector('#btn-snap-photo');
    const cancelBtn = document.querySelector('#btn-cancel-cam');
    const closeBtn = document.querySelector('#btn-close-cam-modal');
    const video = document.querySelector('#visitor-cam-video');
    const canvas = document.querySelector('#visitor-cam-canvas');
    const trackContainer = document.querySelector('#floating-polaroids-track');

    if (!modal) return;

    // Open Camera Consent Modal
    openBtn?.addEventListener('click', () => {
      modal.classList.add('open');
      if (video) video.style.display = 'none';
      if (startCamBtn) startCamBtn.style.display = 'inline-flex';
      if (snapBtn) snapBtn.style.display = 'none';
    });

    // Close Modal without creating anything
    function closeModal() {
      stopStream();
      modal.classList.remove('open');
      if (video) video.style.display = 'none';
      if (startCamBtn) startCamBtn.style.display = 'inline-flex';
      if (snapBtn) snapBtn.style.display = 'none';
    }

    cancelBtn?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Explicit User Agreement to Start Camera
    startCamBtn?.addEventListener('click', async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        closeModal();
        Birthday.toast?.("Camera is unsupported on this browser. Layout remains clean.");
        return;
      }

      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });

        if (video) {
          video.srcObject = currentStream;
          video.style.display = 'block';
          video.play();
        }

        if (startCamBtn) startCamBtn.style.display = 'none';
        if (snapBtn) snapBtn.style.display = 'inline-flex';
        Birthday.toast?.("Camera ready! Click 'Capture Photo' to take your selfie. 📸");

      } catch (err) {
        closeModal();
        // Strict requirement: If camera is denied or fails, do not create any container or gap!
        console.warn("Camera access denied or failed:", err);
        Birthday.toast?.("Camera access was not granted. No guest container was created.");
      }
    });

    // Capture Snapshot & Create Floating Photo Container
    snapBtn?.addEventListener('click', () => {
      if (!video || !canvas || !currentStream) {
        closeModal();
        return;
      }

      try {
        const width = video.videoWidth || 480;
        const height = video.videoHeight || 480;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Mirror horizontally for selfie
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, width, height);

        visitorImageData = canvas.toDataURL('image/jpeg', 0.92);

        // Turn off camera hardware immediately
        stopStream();
        closeModal();

        // Dynamically create and inject floating photo container
        createVisitorFloatingCard(visitorImageData);

        Birthday.effects?.launchConfetti(45);
        Birthday.soundFx?.playGiftChime();
        Birthday.toast?.("You have joined Didi's floating constellation! 🌟");

      } catch (e) {
        console.error("Capture failed:", e);
        closeModal();
        Birthday.toast?.("Capture failed. No placeholder was created.");
      }
    });

    // Create & Inject Floating Visitor Card
    function createVisitorFloatingCard(imgData) {
      // Remove any previous instance cleanly
      if (visitorCardElement) {
        visitorCardElement.remove();
        visitorCardElement = null;
      }

      if (!trackContainer) return;

      const card = document.createElement('div');
      card.className = 'floating-polaroid-card float-drift-1 visitor-guest-card';
      card.id = 'visitor-floating-polaroid';
      card.innerHTML = `
        <div class="washi-tape" style="background: rgba(217, 166, 178, 0.75);"></div>
        <div style="position: absolute; top: 8px; right: 8px; background: rgba(56, 30, 53, 0.9); color: var(--champagne-gold); font-size: 8px; letter-spacing: 0.15em; padding: 2px 8px; border-radius: 10px; z-index: 5;">
          GUEST ✦
        </div>
        <div class="polaroid-img-wrap">
          <img src="${imgData}" alt="Birthday Guest Photo" loading="eager">
        </div>
        <div class="polaroid-caption" style="color: #A54964;">Celebrating Didi ♥</div>
        <div class="polaroid-status-pill">✦ Floating (Tap to Freeze)</div>
        
        <div class="polaroid-static-actions">
          <button class="btn-polaroid-act btn-delete-visitor" style="background: #A54964; color: #FFF;">
            🗑️ Remove Photo
          </button>
        </div>
      `;

      // Click to toggle freeze static / float
      card.addEventListener('click', (e) => {
        // If clicked delete button
        if (e.target.closest('.btn-delete-visitor')) {
          e.stopPropagation();
          deleteVisitorPhoto();
          return;
        }

        const isNowStatic = card.classList.toggle('is-static');
        const pill = card.querySelector('.polaroid-status-pill');
        if (isNowStatic) {
          if (pill) pill.textContent = '📌 STATIC / FROZEN (Tap to Resume)';
          Birthday.soundFx?.playGiftChime();
        } else {
          if (pill) pill.textContent = '✦ Floating (Tap to Freeze)';
        }
      });

      // Insert at the front of the floating track
      trackContainer.prepend(card);
      visitorCardElement = card;
    }

    // Completely Delete Visitor Photo & DOM Container
    function deleteVisitorPhoto() {
      if (visitorCardElement) {
        visitorCardElement.remove(); // Removed completely from DOM
        visitorCardElement = null;
      }
      visitorImageData = null;
      Birthday.toast?.("Visitor photo completely removed. No empty gap left.");
    }

    // Clean up on page unload / refresh
    window.addEventListener('beforeunload', () => {
      stopStream();
      visitorImageData = null;
    });
  });
})();
