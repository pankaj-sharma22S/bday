/* ==========================================================================
   EDITORIAL PHOTO GALLERY & 3D FLIPPABLE MEMORY EXPERIENCE
   - 3D Flippable Memory Cards (Photo on front, Dedicated Poem & Gratitude on back)
   - Interactive Touch Swipe Navigation for Mobile Lightbox
   - Floating Polaroids Stream
   - Spotlight with Custom Repositioning
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  // Curated Luxury Photo Collection with Thematic Poetry & Gratitude
  const defaultPhotos = [
    {
      id: 'photo-1',
      url: 'assets/images/garden-rose.jpg',
      title: 'A Blossom in the Sunlight',
      subtitle: 'Natural Grace & Springtime',
      caption: 'Radiant, timeless, and smiling with the roses. A moment capturing your natural warmth.',
      poem: `In a garden of a thousand blooms,
You are the gentlest rose that grows.
Where others merely catch the light,
You bring the warmth the season knows.
A sister with a heart of gold,
More precious than the earth can hold.`,
      gratitude: `“Thank you, Didi, for bringing springtime and warmth into my life whenever things felt dark. Your smile has always been my safe haven.”`,
      wish: `“May your year ahead blossom with joy, good health, and sweet surprises at every turn.”`,
      group: false,
      category: 'individual',
      layoutClass: 'editorial-hero-spread',
      enhanced: true
    },
    {
      id: 'photo-2',
      url: 'assets/images/temple-steps.jpg',
      title: 'Serenity & Quiet Wisdom',
      subtitle: 'Peace, Strength & Guidance',
      caption: 'Elegance in quiet contemplation on carved wooden steps. Pure peace and sophistication.',
      poem: `Like quiet dawn on temple stone,
You walk with grace that stands alone.
A calm retreat, a steady guide,
With wisdom walking by your side.
Through every storm you held my hand,
The strongest tree upon our land.`,
      gratitude: `“Whenever I was lost, scared, or doubtful, your calm guidance gave me courage. You taught me how to walk with integrity.”`,
      wish: `“May divine peace shield your heart, and may clarity guide your every noble dream.”`,
      group: false,
      category: 'individual',
      layoutClass: 'editorial-tall',
      enhanced: true
    },
    {
      id: 'photo-3',
      url: 'assets/images/couture-grace.jpg',
      title: 'Starlight & Royal Couture',
      subtitle: 'Glamour, Ambition & Radiance',
      caption: 'An evening of royalty, shimmering couture, and diamond grace.',
      poem: `A queen who wears no boastful crown,
Yet outshines all across the town.
In shimmering grace you softly glow,
Teaching my heart how dreams can grow.
Radiant, kind, and ever true,
No star can match the light in you.`,
      gratitude: `“You inspire me to dream higher and carry myself with dignity. Seeing you succeed makes me the proudest sibling in the world.”`,
      wish: `“May your future shimmer brighter than diamonds, with endless opportunities and royal triumphs.”`,
      group: false,
      category: 'individual',
      layoutClass: 'editorial-portrait',
      enhanced: true
    },
    {
      id: 'photo-4',
      url: 'assets/images/himachali-heritage.jpg',
      title: 'Tradition, Laughter & Roots',
      subtitle: 'Heritage & Sibling Bond',
      caption: 'Traditional Himachali elegance, celebrating culture, sibling laughter, and heritage.',
      poem: `From childhood laughs to silly fights,
To whispered jokes on festive nights.
No treasure on this rolling earth
Could ever match a sister’s worth.
You teased me young, you raised me strong,
Beside you is where I belong.`,
      gratitude: `“Thank you for every silly argument, every laugh we shared, and for defending me against the whole world. I’d choose you as my sister in every lifetime.”`,
      wish: `“May our bond remain unbreakable forever, filled with endless laughter and cherished traditions.”`,
      group: true,
      category: 'group',
      layoutClass: 'editorial-medium',
      enhanced: true,
      spotlight: { x: 27, y: 48 } // Didi on left
    },
    {
      id: 'photo-5',
      url: 'assets/images/family-harmony.jpg',
      title: 'Roots & Unbreakable Love',
      subtitle: 'Family Protection & Pillars',
      caption: 'Surrounded by loving family under the shade of trees. Where blessings always protect you.',
      poem: `Under the branches wide and green,
The purest love the world has seen.
You are the thread of silk and gold,
That keeps our family in its fold.
A daughter proud, a sister dear,
Whose gentle presence dries each tear.`,
      gratitude: `“You are the heartbeat of our home. Thank you for caring so deeply for Mom, Dad, and me, and for always being our pillar of strength.”`,
      wish: `“May our family always remain united, blessed with abundance, laughter, and lifelong togetherness.”`,
      group: true,
      category: 'group',
      layoutClass: 'editorial-wide',
      enhanced: true,
      spotlight: { x: 29, y: 42 } // Didi on far left
    },
    {
      id: 'photo-6',
      url: 'assets/images/mom-and-didi.jpg',
      title: 'Mother’s Sweetest Blessing',
      subtitle: 'Motherly Tenderness & Sweetness',
      caption: 'Birthday tiara, pure sweetness, and the unconditional warmth of Mom’s love.',
      poem: `A mother's smile, a daughter's grace,
Two tender souls in one embrace.
From her sweet hands a taste of joy,
A memory time can ne'er destroy.
May heaven pour its sweetest wine,
Upon this sister heart of mine.`,
      gratitude: `“Seeing the bond between you and Mom fills my heart with joy. Thank you for mirroring her gentleness and showering that love on me.”`,
      wish: `“May your life always taste as sweet as birthday cake, enveloped in Mom’s warmest prayers and blessings.”`,
      group: true,
      category: 'group',
      layoutClass: 'editorial-medium',
      enhanced: true,
      spotlight: { x: 32, y: 24 } // Didi on left
    },
    {
      id: 'photo-7',
      url: 'assets/images/royal-celebration.jpg',
      title: 'The Queen of Our Universe',
      subtitle: 'Adoration & Lifelong Promise',
      caption: 'Grand celebration under crystal chandeliers. The center of everyone’s adoration.',
      poem: `The chandeliers may sparkle bright,
Yet you remain the only light.
Wrapped in the love of all who see,
The queen you are and e'er will be.
So take my hand through years untold,
And let our lifelong bond unfold.`,
      gratitude: `“You have given so much to make my life better, happier, and brighter. All I ask from the universe today is: please be by my side forever, Didi.”`,
      wish: `“Happy Birthday to the most extraordinary sister in the universe! You deserve every drop of happiness this world has to offer.”`,
      group: true,
      category: 'group',
      layoutClass: 'editorial-wide',
      enhanced: true,
      spotlight: { x: 51, y: 40 } // Didi in center
    }
  ];

  Birthday.galleryPhotos = Birthday.galleryPhotos || defaultPhotos;
  Birthday.activeFilter = 'all';
  Birthday.currentLightboxIndex = 0;

  const grid = document.querySelector('#editorial-grid');
  const countEl = document.querySelector('#gallery-count');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const polaroidsTrack = document.querySelector('#floating-polaroids-track');

  // Lightbox elements
  const lightbox = document.querySelector('#lightbox');
  const lightboxImg = document.querySelector('#lightbox-img');
  const lightboxTitle = document.querySelector('#lightbox-title');
  const lightboxDesc = document.querySelector('#lightbox-desc');
  const lightboxPoem = document.querySelector('#lightbox-poem');
  const lightboxGratitude = document.querySelector('#lightbox-gratitude');
  const lightboxWish = document.querySelector('#lightbox-wish');
  const lightboxTip = document.querySelector('#lightbox-tip');
  const lightboxSpotlight = document.querySelector('#lightbox-spotlight');

  function renderGallery() {
    if (!grid) return;

    const filtered = Birthday.galleryPhotos.filter(p => {
      if (Birthday.activeFilter === 'all') return true;
      if (Birthday.activeFilter === 'individual') return !p.group;
      if (Birthday.activeFilter === 'group') return p.group;
      return true;
    });

    if (countEl) countEl.textContent = `${filtered.length} CURATED MEMORIES & POEMS`;

    // 1. Render 3D Flippable Editorial Cards
    grid.innerHTML = filtered.map((photo) => {
      const isQueen = photo.group && photo.spotlight;
      const enhancedClass = photo.enhanced ? 'cinematic-enhanced' : '';

      return `
        <article class="editorial-card ${photo.layoutClass || 'editorial-medium'}" data-id="${photo.id}">
          <div class="card-inner-3d">
            
            <!-- FRONT: High Fashion Photo -->
            <div class="card-front">
              <div class="photo-visual-frame" data-open="${photo.id}">
                <img src="${photo.url}" alt="${photo.title}" class="${enhancedClass}" loading="lazy">
                
                ${isQueen ? `
                  <div class="spotlight-wrapper" style="left: ${photo.spotlight.x}%; top: ${photo.spotlight.y}%;">
                    <div class="spotlight-halo"></div>
                    <div class="spotlight-tag">THE BIRTHDAY GIRL ♕</div>
                  </div>
                ` : ''}

                <div class="card-poetry-badge">
                  <span>✦ Tap to Flip & Read Poem</span>
                </div>
              </div>

              <div class="editorial-meta">
                <div class="editorial-info">
                  <span class="photo-theme-tag">${photo.subtitle || 'MEMORIES WITH DIDI'}</span>
                  <h3>${photo.title}</h3>
                  <p>${photo.caption}</p>
                </div>
                <div class="editorial-actions">
                  <button class="btn-photo-action btn-flip" data-flip="${photo.id}">
                    🔄 Flip
                  </button>
                  <button class="btn-photo-action toggle-grade" data-toggle="${photo.id}">
                    ${photo.enhanced ? 'Cinematic' : 'Original'}
                  </button>
                  <button class="btn-photo-action open-expand" data-open="${photo.id}">
                    Enlarge
                  </button>
                </div>
              </div>
            </div>

            <!-- BACK: Dedicated Poem & Gratitude -->
            <div class="card-back">
              <div>
                <span class="photo-theme-tag">DEDICATED TO DIDI</span>
                <h3 style="font-family: var(--font-serif); font-size: 20px; color: var(--champagne-gold); margin-bottom: 12px;">${photo.title}</h3>
                <div class="card-back-poem">
                  ${(photo.poem || "").replace(/\n/g, '<br>')}
                </div>
                <div class="card-back-gratitude">
                  ${photo.gratitude || ""}
                </div>
                <div class="card-back-wish">
                  ${photo.wish || ""}
                </div>
              </div>
              <div class="card-back-actions">
                <button class="btn-photo-action btn-unflip" data-flip="${photo.id}">
                  ↩ Return to Photo
                </button>
                <button class="btn-photo-action open-expand" data-open="${photo.id}">
                  🔍 Full Screen View
                </button>
              </div>
            </div>

          </div>
        </article>
      `;
    }).join('');

    // Attach Card Flip Interactions
    grid.querySelectorAll('.btn-flip, .btn-unflip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.editorial-card');
        card?.classList.toggle('flipped');
        Birthday.soundFx?.playGiftChime();
      });
    });

    // Double tap / Click photo frame opens lightbox
    grid.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => {
        openLightboxById(el.dataset.open);
      });
    });

    // Toggle Cinematic Grade
    grid.querySelectorAll('.toggle-grade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.toggle;
        const p = Birthday.galleryPhotos.find(item => item.id === id);
        if (p) {
          p.enhanced = !p.enhanced;
          renderGallery();
          Birthday.toast?.(p.enhanced ? "Cinematic grade applied." : "Viewing original photograph.");
        }
      });
    });

    // 2. Render Automatic Floating Polaroids Constellation
    if (polaroidsTrack) {
      polaroidsTrack.innerHTML = Birthday.galleryPhotos.map((photo, i) => {
        const driftClass = 'float-drift-' + ((i % 7) + 1);
        return `
          <div class="floating-polaroid-card ${driftClass}" data-id="${photo.id}">
            <div class="washi-tape"></div>
            <div class="polaroid-img-wrap">
              <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            </div>
            <div class="polaroid-caption">${photo.title}</div>
            <div class="polaroid-status-pill">✦ Floating (Tap to Freeze)</div>
            <div class="polaroid-static-actions">
              <button class="btn-polaroid-act btn-resume-float" data-resume="${photo.id}">▶ Resume Float</button>
              <button class="btn-polaroid-act btn-open-modal" data-open="${photo.id}">🔍 Enlarge</button>
            </div>
          </div>
        `;
      }).join('');

      polaroidsTrack.querySelectorAll('.floating-polaroid-card').forEach(card => {
        card.addEventListener('click', (e) => {
          // If clicked on "Enlarge" button
          if (e.target.closest('.btn-open-modal')) {
            openLightboxById(card.dataset.id);
            return;
          }

          // If clicked on "Resume Float" button
          if (e.target.closest('.btn-resume-float')) {
            card.classList.remove('is-static');
            const pill = card.querySelector('.polaroid-status-pill');
            if (pill) pill.textContent = '✦ Floating (Tap to Freeze)';
            Birthday.toast?.("Photograph floating resumed! ✨");
            return;
          }

          // Toggle Static / Floating state
          const isNowStatic = card.classList.toggle('is-static');
          const pill = card.querySelector('.polaroid-status-pill');

          if (isNowStatic) {
            if (pill) pill.textContent = '📌 STATIC / FROZEN (Tap to Resume)';
            Birthday.soundFx?.playGiftChime();
            Birthday.effects?.launchConfetti(20);
            Birthday.toast?.("Memory frozen in place. Tap again to resume floating! 📌");
          } else {
            if (pill) pill.textContent = '✦ Floating (Tap to Freeze)';
            Birthday.toast?.("Photograph floating resumed! ✨");
          }
        });
      });

      // Global Toggle All Floating / Static Button
      const toggleAllBtn = document.querySelector('#btn-toggle-all-float');
      if (toggleAllBtn) {
        toggleAllBtn.onclick = () => {
          const cards = polaroidsTrack.querySelectorAll('.floating-polaroid-card');
          const anyStatic = Array.from(cards).some(c => c.classList.contains('is-static'));

          cards.forEach(card => {
            const pill = card.querySelector('.polaroid-status-pill');
            if (anyStatic) {
              // Resume all to floating
              card.classList.remove('is-static');
              if (pill) pill.textContent = '✦ Floating (Tap to Freeze)';
            } else {
              // Freeze all static
              card.classList.add('is-static');
              if (pill) pill.textContent = '📌 STATIC / FROZEN (Tap to Resume)';
            }
          });

          toggleAllBtn.textContent = anyStatic ? '⏸ Freeze All Static' : '✦ Float All Photos';
          Birthday.toast?.(anyStatic ? "All memories are floating! ✨" : "All memories frozen static! 📌");
        };
      }
    }
  }

  // Filter Handling
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Birthday.activeFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  // Lightbox Viewport Logic
  function openLightboxById(id) {
    const idx = Birthday.galleryPhotos.findIndex(p => p.id === id);
    if (idx !== -1) {
      openLightbox(idx);
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    Birthday.currentLightboxIndex = index;
    const photo = Birthday.galleryPhotos[index];

    lightboxImg.src = photo.url;
    lightboxImg.alt = photo.title;
    if (lightboxTitle) lightboxTitle.textContent = photo.title;
    if (lightboxDesc) lightboxDesc.textContent = photo.caption;

    if (lightboxPoem) {
      lightboxPoem.innerHTML = (photo.poem || "").replace(/\n/g, '<br>');
    }
    if (lightboxGratitude) {
      lightboxGratitude.textContent = photo.gratitude || "";
    }
    if (lightboxWish) {
      lightboxWish.textContent = photo.wish || "";
    }

    if (photo.group && photo.spotlight) {
      if (lightboxTip) lightboxTip.textContent = "The Birthday Girl is spotlit with champagne gold. Tap anywhere on photo to reposition.";
      if (lightboxSpotlight) {
        lightboxSpotlight.style.display = 'flex';
        lightboxSpotlight.style.left = photo.spotlight.x + '%';
        lightboxSpotlight.style.top = photo.spotlight.y + '%';
      }
    } else {
      if (lightboxTip) lightboxTip.textContent = "Swipe left / right to browse memories. Swipe down to close.";
      if (lightboxSpotlight) lightboxSpotlight.style.display = 'none';
    }

    lightbox.classList.add('open');
    if (window.gsap) {
      gsap.fromTo('.lightbox-content-box', { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }

  // Touch Swipe Gestures for Mobile Lightbox (Left = Next, Right = Prev, Down = Close)
  let touchStartX = 0, touchStartY = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const len = Birthday.galleryPhotos.length;
        if (deltaX < 0) {
          // Swipe Left -> Next photo
          openLightbox((Birthday.currentLightboxIndex + 1) % len);
        } else {
          // Swipe Right -> Prev photo
          openLightbox((Birthday.currentLightboxIndex - 1 + len) % len);
        }
      } else if (deltaY > 80 && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Swipe Down -> Close lightbox
        lightbox.classList.remove('open');
      }
    }, { passive: true });
  }

  // Manual Spotlight Repositioning on Click
  const lightboxImgArea = document.querySelector('#lightbox-img-area');
  if (lightboxImgArea) {
    lightboxImgArea.addEventListener('click', (e) => {
      const photo = Birthday.galleryPhotos[Birthday.currentLightboxIndex];
      if (!photo || !photo.group) return;

      const rect = lightboxImgArea.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

      photo.spotlight = { x, y };
      if (lightboxSpotlight) {
        lightboxSpotlight.style.left = x + '%';
        lightboxSpotlight.style.top = y + '%';
      }
      renderGallery();
      Birthday.toast?.("Spotlight updated for Didi!");
    });
  }

  // Navigation Buttons
  const prevBtn = document.querySelector('#lightbox-prev');
  const nextBtn = document.querySelector('#lightbox-next');
  const closeBtn = document.querySelector('#lightbox-close');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const len = Birthday.galleryPhotos.length;
      openLightbox((Birthday.currentLightboxIndex - 1 + len) % len);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const len = Birthday.galleryPhotos.length;
      openLightbox((Birthday.currentLightboxIndex + 1) % len);
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('open');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  window.addEventListener('DOMContentLoaded', renderGallery);
  Birthday.renderGallery = renderGallery;
})();
