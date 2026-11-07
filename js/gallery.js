/* ==========================================================================
   EDITORIAL PHOTO GALLERY & POETRY SPOTLIGHT ENGINE
   - Curated Photographs with Thematic Poems & Expressions of Gratitude
   - Champagne-Gold Spotlight for Didi
   - Original vs Cinematic Grade Toggle
   - Lightbox with Full Poem, Gratitude Note, and Spotlight Tweak
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};

  // Curated Luxury Photo Collection with Thematic Poetry & Gratitude
  const defaultPhotos = [
    {
      id: 'photo-1',
      url: 'assets/images/garden-rose.jpg',
      title: 'A Blossom in the Sunlight',
      subtitle: 'Theme: Natural Grace & Springtime',
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
      subtitle: 'Theme: Peace, Strength & Spiritual Grace',
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
      subtitle: 'Theme: Glamour, Ambition & Radiance',
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
      subtitle: 'Theme: Heritage, Sibling Bond & Shared Smiles',
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
      subtitle: 'Theme: Family, Protection & Pillars of Life',
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
      subtitle: 'Theme: Motherly Tenderness & Sweet Memories',
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
      subtitle: 'Theme: Adoration, Forever Bond & Celebration',
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

    grid.innerHTML = filtered.map((photo) => {
      const isQueen = photo.group && photo.spotlight;
      const enhancedClass = photo.enhanced ? 'cinematic-enhanced' : '';

      return `
        <article class="editorial-card ${photo.layoutClass || 'editorial-medium'}" data-id="${photo.id}">
          <div class="photo-visual-frame" data-open="${photo.id}">
            <img src="${photo.url}" alt="${photo.title}" class="${enhancedClass}" loading="lazy">
            
            ${isQueen ? `
              <div class="spotlight-wrapper" style="left: ${photo.spotlight.x}%; top: ${photo.spotlight.y}%;">
                <div class="spotlight-halo"></div>
                <div class="spotlight-tag">THE BIRTHDAY GIRL ♕</div>
              </div>
            ` : ''}

            <!-- Floating Poetry Snippet on Hover -->
            <div class="card-poetry-badge">
              <span>✦ Read Poem & Wish</span>
            </div>
          </div>

          <div class="editorial-meta">
            <div class="editorial-info">
              <span class="photo-theme-tag">${photo.subtitle || 'MEMORIES WITH DIDI'}</span>
              <h3>${photo.title}</h3>
              <p>${photo.caption}</p>
            </div>
            <div class="editorial-actions">
              <button class="btn-photo-action toggle-grade" data-toggle="${photo.id}">
                ${photo.enhanced ? 'Cinematic' : 'Original'}
              </button>
              <button class="btn-photo-action open-expand" data-open="${photo.id}">
                Poem & Full View
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Click Events
    grid.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => {
        openLightboxById(el.dataset.open);
      });
    });

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
      if (lightboxTip) lightboxTip.textContent = "The Birthday Girl is spotlit with champagne gold. Tap anywhere to reposition.";
      if (lightboxSpotlight) {
        lightboxSpotlight.style.display = 'flex';
        lightboxSpotlight.style.left = photo.spotlight.x + '%';
        lightboxSpotlight.style.top = photo.spotlight.y + '%';
      }
    } else {
      if (lightboxTip) lightboxTip.textContent = "Luxury editorial presentation — high fashion resolution.";
      if (lightboxSpotlight) lightboxSpotlight.style.display = 'none';
    }

    lightbox.classList.add('open');
    if (window.gsap) {
      gsap.fromTo('.lightbox-content-box', { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
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

  // Navigation
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

  // Live Photo Upload Handling
  const photoInput = document.querySelector('#photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      Array.from(files).forEach((file, i) => {
        const url = URL.createObjectURL(file);
        const newPhoto = {
          id: 'user-photo-' + Date.now() + '-' + i,
          url: url,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          subtitle: 'Cherished Family Moment',
          caption: "A newly added cherished memory with Didi.",
          poem: `Another moment in our story,\nBathed in love and golden glory.\nWith every picture we can see,\nHow much your guidance means to me.`,
          gratitude: `“Thank you for every moment you share with me.”`,
          wish: `“May your future be filled with eternal joy and blessings.”`,
          group: false,
          category: 'individual',
          layoutClass: 'editorial-portrait',
          enhanced: true
        };
        Birthday.galleryPhotos.unshift(newPhoto);
      });

      renderGallery();
      Birthday.toast?.(`${files.length} new photograph(s) welcomed into Didi's world! ✨`);
    });
  }

  window.addEventListener('DOMContentLoaded', renderGallery);
  Birthday.renderGallery = renderGallery;
})();
