/* ==========================================================================
   THREE.JS 3D CINEMATIC EXPERIENCES & VISUAL EFFECTS
   - 3D Universe: Volumetric Lights, Particles, Floating Flowers & Butterflies
   - 3D Memory Museum: Interactive Floating Framed Photographs in 3D Space
   - 3D Birthday Cake: Multi-tier Luxury Cake with Dynamic Glowing Flames & Smoke
   - 3D Princess Guardian Doll: Stylized 3D Character with Crown & Expressions
   ========================================================================== */

(() => {
  const T = window.THREE;
  if (!T) {
    console.warn("Three.js not loaded");
    return;
  }

  const Birthday = window.Birthday = window.Birthday || {};
  const fx = Birthday.effects = Birthday.effects || {};

  /* --------------------------------------------------------------------------
     1. FULLSCREEN 3D UNIVERSE (Particles, Flowers, Butterflies, Petals)
     -------------------------------------------------------------------------- */
  let universeScene, universeCamera, universeRenderer;
  let universeFlowers = [], universeButterflies = [], universePetals = [];
  let starsMesh;

  function initUniverse() {
    const canvas = document.querySelector('#universe');
    if (!canvas) return;

    universeRenderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    universeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    universeRenderer.setSize(window.innerWidth, window.innerHeight);

    universeScene = new T.Scene();
    universeCamera = new T.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    universeCamera.position.z = 15;

    // Atmospheric Lighting
    const hemiLight = new T.HemisphereLight(0xFFE5D9, 0x21162D, 2.2);
    universeScene.add(hemiLight);

    const goldPoint = new T.PointLight(0xD8B779, 25, 40);
    goldPoint.position.set(4, 5, 6);
    universeScene.add(goldPoint);

    const rosePoint = new T.PointLight(0xD9A6B2, 18, 35);
    rosePoint.position.set(-5, -3, 4);
    universeScene.add(rosePoint);

    // Glowing Stardust Constellation
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const colorPalette = [new T.Color('#D8B779'), new T.Color('#D9A6B2'), new T.Color('#FFF7EC'), new T.Color('#BBAACF')];

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 36;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 28;

      const col = colorPalette[i % colorPalette.length];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new T.BufferGeometry();
    starGeo.setAttribute('position', new T.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new T.BufferAttribute(starColors, 3));
    const starMat = new T.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.85 });
    starsMesh = new T.Points(starGeo, starMat);
    universeScene.add(starsMesh);

    // 3D Floating Blossoms
    for (let i = 0; i < 9; i++) {
      const flowerGroup = create3DFlower();
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8 - 2;
      flowerGroup.position.set(x, y, z);
      universeScene.add(flowerGroup);
      universeFlowers.push({
        group: flowerGroup,
        baseY: y,
        speed: 0.4 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 3D Golden Butterflies
    for (let i = 0; i < 5; i++) {
      const bfly = create3DButterfly();
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;
      bfly.group.position.set(x, y, z);
      universeScene.add(bfly.group);
      universeButterflies.push({
        ...bfly,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 3D Translucent Floating Petals
    const petalGeo = new T.CylinderGeometry(0.12, 0.02, 0.28, 5);
    const petalMat = new T.MeshStandardMaterial({
      color: 0xD9A6B2,
      emissive: 0x381E35,
      roughness: 0.3,
      transparent: true,
      opacity: 0.75,
      side: T.DoubleSide
    });
    for (let i = 0; i < 24; i++) {
      const petal = new T.Mesh(petalGeo, petalMat);
      petal.position.set((Math.random() - 0.5) * 20, Math.random() * 15 - 5, (Math.random() - 0.5) * 12);
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      universeScene.add(petal);
      universePetals.push({
        mesh: petal,
        speedY: 0.015 + Math.random() * 0.02,
        rotSpeed: 0.01 + Math.random() * 0.015
      });
    }

    // 3D Floating Celestial Photograph Planes in Background Universe
    const texLoader = new T.TextureLoader();
    const floatingImages = [
      'assets/images/garden-rose.jpg',
      'assets/images/temple-steps.jpg',
      'assets/images/couture-grace.jpg',
      'assets/images/himachali-heritage.jpg',
      'assets/images/family-harmony.jpg',
      'assets/images/royal-celebration.jpg'
    ];
    const universeFloatingPhotos = [];
    floatingImages.forEach((imgSrc) => {
      const frameGroup = new T.Group();
      const goldBorderMat = new T.MeshBasicMaterial({ color: 0xD8B779 });
      const border = new T.Mesh(new T.PlaneGeometry(1.65, 2.15), goldBorderMat);
      frameGroup.add(border);

      const pMat = new T.MeshBasicMaterial({ transparent: true, opacity: 0.82, side: T.DoubleSide });
      texLoader.load(imgSrc, (tex) => {
        pMat.map = tex;
        pMat.needsUpdate = true;
      });
      const pMesh = new T.Mesh(new T.PlaneGeometry(1.5, 2.0), pMat);
      pMesh.position.z = 0.02;
      frameGroup.add(pMesh);

      const px = (Math.random() - 0.5) * 22;
      const py = (Math.random() - 0.5) * 16;
      const pz = -2 - Math.random() * 8;
      frameGroup.position.set(px, py, pz);
      frameGroup.rotation.z = (Math.random() - 0.5) * 0.4;

      universeScene.add(frameGroup);
      universeFloatingPhotos.push({
        group: frameGroup,
        speedY: 0.008 + Math.random() * 0.012,
        rotSpeed: 0.003 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2
      });
    });

    // Parallax on Pointer Move
    let mouseX = 0, mouseY = 0;
    window.addEventListener('pointermove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.0;
      if (window.gsap) {
        gsap.to(universeCamera.position, { x: mouseX, y: -mouseY, duration: 1.2, ease: 'power2.out' });
      }
    }, { passive: true });

    // Render Loop
    let lastTime = performance.now();
    function animateUniverse(now) {
      requestAnimationFrame(animateUniverse);
      const dt = Math.min((now - lastTime) * 0.001, 0.04);
      lastTime = now;
      const t = now * 0.001;

      if (starsMesh) {
        starsMesh.rotation.y += dt * 0.01;
        starsMesh.rotation.x = Math.sin(t * 0.15) * 0.03;
      }

      universeFlowers.forEach(f => {
        f.group.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * 0.25;
        f.group.rotation.y += dt * 0.15;
      });

      universeButterflies.forEach(b => {
        b.group.position.x = b.baseX + Math.sin(t * 0.7 + b.phase) * 1.2;
        b.group.position.y = b.baseY + Math.sin(t * 1.6 + b.phase) * 0.4;
        b.leftWing.rotation.y = Math.sin(t * 16 + b.phase) * 0.85;
        b.rightWing.rotation.y = -Math.sin(t * 16 + b.phase) * 0.85;
      });

      universePetals.forEach(p => {
        p.mesh.position.y -= p.speedY;
        p.mesh.position.x += Math.sin(t + p.mesh.position.y) * 0.008;
        p.mesh.rotation.x += p.rotSpeed;
        p.mesh.rotation.y += p.rotSpeed * 0.7;
        if (p.mesh.position.y < -10) {
          p.mesh.position.y = 12;
          p.mesh.position.x = (Math.random() - 0.5) * 20;
        }
      });

      universeFloatingPhotos.forEach(p => {
        p.group.position.y += p.speedY;
        p.group.position.x += Math.sin(t * 0.4 + p.phase) * 0.005;
        p.group.rotation.y = Math.sin(t * 0.3 + p.phase) * 0.2;
        p.group.rotation.z += p.rotSpeed * 0.4;
        if (p.group.position.y > 14) {
          p.group.position.y = -14;
          p.group.position.x = (Math.random() - 0.5) * 22;
        }
      });

      universeRenderer.render(universeScene, universeCamera);
    }
    requestAnimationFrame(animateUniverse);

    window.addEventListener('resize', () => {
      universeCamera.aspect = window.innerWidth / window.innerHeight;
      universeCamera.updateProjectionMatrix();
      universeRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function create3DFlower() {
    const group = new T.Group();
    const petalMat = new T.MeshStandardMaterial({
      color: 0xD9A6B2,
      roughness: 0.4,
      metalness: 0.1,
      emissive: 0x481E35,
      emissiveIntensity: 0.3
    });
    const centerMat = new T.MeshStandardMaterial({
      color: 0xD8B779,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0xD8B779,
      emissiveIntensity: 0.4
    });

    const center = new T.Mesh(new T.SphereGeometry(0.12, 12, 12), centerMat);
    group.add(center);

    for (let i = 0; i < 6; i++) {
      const petal = new T.Mesh(new T.ConeGeometry(0.14, 0.45, 6), petalMat);
      const angle = (i / 6) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0);
      petal.rotation.z = angle - Math.PI / 2;
      group.add(petal);
    }
    group.scale.setScalar(0.7);
    return group;
  }

  function create3DButterfly() {
    const group = new T.Group();
    const wingMat = new T.MeshStandardMaterial({
      color: 0xD8B779,
      emissive: 0x6E5224,
      metalness: 0.5,
      roughness: 0.3,
      side: T.DoubleSide
    });
    const wingShape = new T.BufferGeometry();
    const verts = new Float32Array([
      0, 0, 0,
      0.35, 0.45, 0,
      0.5, -0.15, 0,
      0, 0, 0,
      0.5, -0.15, 0,
      0.2, -0.35, 0
    ]);
    wingShape.setAttribute('position', new T.BufferAttribute(verts, 3));
    wingShape.computeVertexNormals();

    const leftWing = new T.Mesh(wingShape, wingMat);
    const rightWing = new T.Mesh(wingShape, wingMat);
    rightWing.scale.x = -1;

    const bodyMat = new T.MeshStandardMaterial({ color: 0x381E35 });
    const body = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.35, 6), bodyMat);
    body.rotation.z = Math.PI / 4;

    group.add(body);
    group.add(leftWing);
    group.add(rightWing);
    group.scale.setScalar(0.8);
    return { group, leftWing, rightWing };
  }

  /* --------------------------------------------------------------------------
     2. LUXURY 3D MEMORY MUSEUM (Floating Framed Photographs in 3D Space)
     -------------------------------------------------------------------------- */
  let museumScene, museumCamera, museumRenderer;
  let museumFrames = [], activeFrameIndex = 0;

  function init3DMuseum() {
    const canvas = document.querySelector('#three-museum-canvas');
    if (!canvas) return;

    museumRenderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    museumRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const rect = canvas.getBoundingClientRect();
    museumRenderer.setSize(rect.width || 800, rect.height || 600);

    museumScene = new T.Scene();
    museumCamera = new T.PerspectiveCamera(45, (rect.width || 800) / (rect.height || 600), 0.1, 100);
    museumCamera.position.set(0, 0, 8);

    // Warm museum studio lighting
    const amb = new T.AmbientLight(0xFFF7EC, 1.2);
    museumScene.add(amb);
    const dir = new T.DirectionalLight(0xD8B779, 1.8);
    dir.position.set(4, 6, 7);
    museumScene.add(dir);

    const textureLoader = new T.TextureLoader();
    const photos = Birthday.galleryPhotos || [];

    // Create 3D floating gallery in a gentle celestial arc
    const total = photos.length || 7;
    photos.forEach((photo, idx) => {
      const angle = ((idx - total / 2) / total) * Math.PI * 0.9;
      const radius = 6.2;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 5.5;

      const frameGroup = new T.Group();
      frameGroup.position.set(x, 0, z);
      frameGroup.rotation.y = -angle;

      // Beveled Gold Frame Border
      const frameGeo = new T.BoxGeometry(2.3, 3.0, 0.08);
      const frameMat = new T.MeshStandardMaterial({
        color: 0xD8B779,
        metalness: 0.8,
        roughness: 0.25,
        emissive: 0x483616,
        emissiveIntensity: 0.2
      });
      const frameBorder = new T.Mesh(frameGeo, frameMat);
      frameGroup.add(frameBorder);

      // Inner Photo Plane
      const photoGeo = new T.PlaneGeometry(2.1, 2.8);
      const photoMat = new T.MeshBasicMaterial({ color: 0x2A1735 });

      textureLoader.load(photo.url, (tex) => {
        tex.generateMipmaps = true;
        photoMat.map = tex;
        photoMat.color.setHex(0xFFFFFF);
        photoMat.needsUpdate = true;
      });

      const photoMesh = new T.Mesh(photoGeo, photoMat);
      photoMesh.position.z = 0.045;
      frameGroup.add(photoMesh);

      // Make clickable
      frameBorder.userData = { id: photo.id, index: idx };
      photoMesh.userData = { id: photo.id, index: idx };

      museumScene.add(frameGroup);
      museumFrames.push({ group: frameGroup, data: photo, angle, index: idx });
    });

    // Raycaster for clicking 3D frames
    const raycaster = new T.Raycaster();
    const pointer = new T.Vector2();

    canvas.addEventListener('click', (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(pointer, museumCamera);

      const intersects = raycaster.intersectObjects(museumScene.children, true);
      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit && hit.userData.index === undefined && hit.parent) {
          hit = hit.parent;
        }
        if (hit && hit.userData.index !== undefined) {
          selectMuseumFrame(hit.userData.index);
        }
      }
    });

    // Smooth hover / drag orbit
    let isDragging = false, prevX = 0;
    canvas.addEventListener('mousedown', (e) => { isDragging = true; prevX = e.clientX; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = (e.clientX - prevX) * 0.005;
      prevX = e.clientX;
      museumScene.rotation.y += deltaX;
    });

    // Touch support
    let touchPrevX = 0;
    canvas.addEventListener('touchstart', (e) => { touchPrevX = e.touches[0].clientX; }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      const deltaX = (e.touches[0].clientX - touchPrevX) * 0.006;
      touchPrevX = e.touches[0].clientX;
      museumScene.rotation.y += deltaX;
    }, { passive: true });

    let isMuseumFloating = true;

    function updateMuseumFloatingUI() {
      const hint = document.querySelector('.museum-hint');
      const toggleBtn = document.querySelector('#btn-toggle-3d-float');
      if (isMuseumFloating) {
        if (hint) hint.innerHTML = '✦ FLOATING 3D ORBIT &nbsp;·&nbsp; (Click Frame to Freeze Static)';
        if (toggleBtn) toggleBtn.innerHTML = '⏸ Freeze Static View';
      } else {
        if (hint) hint.innerHTML = '📌 STATIC VIEW LOCKED &nbsp;·&nbsp; (Tap to Resume Floating Orbit)';
        if (toggleBtn) toggleBtn.innerHTML = '▶ Resume Floating 3D Orbit';
      }
    }

    function renderMuseum() {
      requestAnimationFrame(renderMuseum);
      const time = performance.now() * 0.001;
      if (isMuseumFloating) {
        museumScene.rotation.y += 0.0022; // Smooth automatic floating orbit!
        museumFrames.forEach((f, i) => {
          f.group.position.y = Math.sin(time + i) * 0.08;
        });
      } else {
        museumFrames.forEach((f) => {
          f.group.position.y = 0; // Frozen completely static
        });
      }
      museumRenderer.render(museumScene, museumCamera);
    }
    renderMuseum();

    // Toggle button / hint click to resume or freeze
    const museumHint = document.querySelector('.museum-hint');
    museumHint?.addEventListener('click', () => {
      isMuseumFloating = !isMuseumFloating;
      updateMuseumFloatingUI();
      Birthday.toast?.(isMuseumFloating ? "3D Museum floating resumed! 🌌" : "3D Museum locked in static view. 📌");
    });
    const toggle3DBtn = document.querySelector('#btn-toggle-3d-float');
    toggle3DBtn?.addEventListener('click', () => {
      isMuseumFloating = !isMuseumFloating;
      updateMuseumFloatingUI();
      Birthday.toast?.(isMuseumFloating ? "3D Museum floating resumed! 🌌" : "3D Museum locked in static view. 📌");
    });

    // Resize
    window.addEventListener('resize', () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      museumCamera.aspect = r.width / r.height;
      museumCamera.updateProjectionMatrix();
      museumRenderer.setSize(r.width, r.height);
    });

    // Select initial frame
    if (museumFrames.length > 0) {
      selectMuseumFrame(0);
    }
  }

  function selectMuseumFrame(index) {
    if (!museumFrames[index]) return;
    activeFrameIndex = index;
    const target = museumFrames[index];

    // On clicking a frame, it becomes STATIC!
    isMuseumFloating = false;
    updateMuseumFloatingUI();
    Birthday.toast?.("Photograph focused & locked static. Tap hint to resume orbit! 📌");

    // Smooth camera glide to frame
    if (window.gsap) {
      gsap.to(museumScene.rotation, {
        y: -target.angle,
        duration: 1.2,
        ease: 'power3.out'
      });
    } else {
      museumScene.rotation.y = -target.angle;
    }

    // Update active card UI
    const card = document.querySelector('#museum-active-card');
    const title = document.querySelector('#museum-card-title');
    const desc = document.querySelector('#museum-card-desc');
    if (card && title && desc) {
      card.classList.remove('show');
      setTimeout(() => {
        title.textContent = target.data.title;
        desc.textContent = target.data.caption;
        card.classList.add('show');
      }, 200);
    }
  }

  fx.nextMuseumFrame = () => {
    const next = (activeFrameIndex + 1) % museumFrames.length;
    selectMuseumFrame(next);
  };
  fx.prevMuseumFrame = () => {
    const prev = (activeFrameIndex - 1 + museumFrames.length) % museumFrames.length;
    selectMuseumFrame(prev);
  };

  /* --------------------------------------------------------------------------
     3. PREMIUM 3D BIRTHDAY CAKE WITH PROCEDURAL CANDLE FLAMES & SMOKE
     -------------------------------------------------------------------------- */
  let cakeScene, cakeCamera, cakeRenderer;
  let cakeFlames = [], cakeGroup;
  let isCakeLit = true;

  function init3DCake() {
    const canvas = document.querySelector('#three-cake');
    if (!canvas) return;

    cakeRenderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    cakeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const rect = canvas.getBoundingClientRect();
    cakeRenderer.setSize(rect.width || 480, rect.height || 380);

    cakeScene = new T.Scene();
    cakeCamera = new T.PerspectiveCamera(40, (rect.width || 480) / (rect.height || 380), 0.1, 100);
    cakeCamera.position.set(0, 1.8, 6.2);
    cakeCamera.lookAt(0, 0.4, 0);

    // Warm Luxury Lighting
    const amb = new T.AmbientLight(0xFFF7EC, 1.4);
    cakeScene.add(amb);
    const key = new T.PointLight(0xFFECC2, 18, 30);
    key.position.set(3, 4, 5);
    cakeScene.add(key);

    const rim = new T.PointLight(0xD9A6B2, 12, 25);
    rim.position.set(-3, 2, -2);
    cakeScene.add(rim);

    cakeGroup = new T.Group();
    cakeScene.add(cakeGroup);

    // Cake Pedestal (Champagne Gold Stand)
    const standMat = new T.MeshStandardMaterial({ color: 0xD8B779, metalness: 0.85, roughness: 0.2 });
    const standBase = new T.Mesh(new T.CylinderGeometry(1.6, 1.8, 0.15, 32), standMat);
    standBase.position.y = -0.55;
    cakeGroup.add(standBase);
    const standPlate = new T.Mesh(new T.CylinderGeometry(2.1, 2.0, 0.08, 40), standMat);
    standPlate.position.y = -0.45;
    cakeGroup.add(standPlate);

    // Tier 1 (Base Tier - Warm Ivory Cream with Gold Bead Trim)
    const tier1Mat = new T.MeshStandardMaterial({ color: 0xFFF7EC, roughness: 0.35, metalness: 0.05 });
    const tier1 = new T.Mesh(new T.CylinderGeometry(1.8, 1.8, 0.7, 36), tier1Mat);
    tier1.position.y = -0.05;
    cakeGroup.add(tier1);

    // Tier 1 Gold Piping Beads
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const bead = new T.Mesh(new T.SphereGeometry(0.055, 12, 12), standMat);
      bead.position.set(Math.cos(angle) * 1.81, 0.28, Math.sin(angle) * 1.81);
      cakeGroup.add(bead);
    }

    // Tier 2 (Top Tier - Dusty Rose Velvet Cream)
    const tier2Mat = new T.MeshStandardMaterial({ color: 0xD9A6B2, roughness: 0.45, metalness: 0.1 });
    const tier2 = new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 0.6, 32), tier2Mat);
    tier2.position.y = 0.6;
    cakeGroup.add(tier2);

    // Sugar Roses on Cake
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const rose = create3DFlower();
      rose.scale.setScalar(0.35);
      rose.position.set(Math.cos(angle) * 1.25, 0.9, Math.sin(angle) * 1.25);
      cakeGroup.add(rose);
    }

    // Birthday Candles & Animated Procedural Flames
    const candleMat = new T.MeshStandardMaterial({ color: 0xFFF7EC, roughness: 0.2 });
    const candlePositions = [
      { x: 0, z: 0 },
      { x: 0.45, z: 0.25 },
      { x: -0.45, z: 0.25 },
      { x: 0.3, z: -0.4 },
      { x: -0.3, z: -0.4 }
    ];

    candlePositions.forEach((pos, idx) => {
      const candle = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.45, 16), candleMat);
      candle.position.set(pos.x, 1.12, pos.z);
      cakeGroup.add(candle);

      // Flame Mesh (Cone + Sphere with glowing emissive orange/yellow)
      const flameMat = new T.MeshBasicMaterial({ color: 0xFFCA6E });
      const flame = new T.Mesh(new T.ConeGeometry(0.075, 0.22, 12), flameMat);
      flame.position.set(pos.x, 1.45, pos.z);
      cakeGroup.add(flame);

      // Dynamic Candle Point Light
      const flameLight = new T.PointLight(0xFFA500, 3.5, 3.5);
      flameLight.position.set(pos.x, 1.45, pos.z);
      cakeGroup.add(flameLight);

      cakeFlames.push({ flame, light: flameLight, baseScale: 1.0, index: idx });
    });

    // Render loop for cake
    function renderCake() {
      requestAnimationFrame(renderCake);
      cakeGroup.rotation.y += 0.005;

      // Realistic flame flicker
      if (isCakeLit) {
        const time = performance.now() * 0.015;
        cakeFlames.forEach((f, i) => {
          const s = 1.0 + Math.sin(time + i * 2) * 0.18;
          f.flame.scale.set(s, s * 1.1, s);
          f.light.intensity = 2.8 + Math.sin(time * 1.5 + i) * 0.8;
        });
      }
      cakeRenderer.render(cakeScene, cakeCamera);
    }
    renderCake();

    window.addEventListener('resize', () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      cakeCamera.aspect = r.width / r.height;
      cakeCamera.updateProjectionMatrix();
      cakeRenderer.setSize(r.width, r.height);
    });
  }

  fx.blowOutCandles = () => {
    isCakeLit = false;
    cakeFlames.forEach(f => {
      if (window.gsap) {
        gsap.to(f.flame.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.4 });
        gsap.to(f.light, { intensity: 0, duration: 0.4 });
      } else {
        f.flame.visible = false;
        f.light.intensity = 0;
      }
    });

    // Trigger Smoke Puffs from Candles
    const area = document.querySelector('.cake-canvas-wrap');
    if (area) {
      for (let i = 0; i < 12; i++) {
        const puff = document.createElement('i');
        puff.className = 'smoke-puff';
        puff.textContent = '☁';
        puff.style.left = (42 + Math.random() * 16) + '%';
        puff.style.top = (40 + Math.random() * 10) + '%';
        puff.style.animationDelay = (i * 0.12) + 's';
        area.append(puff);
        setTimeout(() => puff.remove(), 2400);
      }
    }

    // Launch Golden Confetti & Toast
    fx.launchConfetti(80);
    Birthday.toast?.("Close your eyes, Didi... Your wish is drifting to the stars! ✨");
  };

  fx.relightCandles = () => {
    isCakeLit = true;
    cakeFlames.forEach(f => {
      f.flame.visible = true;
      if (window.gsap) {
        gsap.to(f.flame.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(f.light, { intensity: 3.5, duration: 0.5 });
      } else {
        f.flame.scale.set(1, 1, 1);
        f.light.intensity = 3.5;
      }
    });
    Birthday.toast?.("The candles are shining bright again! 🕯️");
  };

  /* --------------------------------------------------------------------------
     4. 3D PRINCESS GUARDIAN DOLL (Stylized Character with Crown & Animations)
     -------------------------------------------------------------------------- */
  let dollScene, dollCamera, dollRenderer, dollGroup;

  function init3DDoll() {
    const canvas = document.querySelector('#three-doll-canvas');
    if (!canvas) return;

    dollRenderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    dollRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const rect = canvas.getBoundingClientRect();
    dollRenderer.setSize(rect.width || 500, rect.height || 520);

    dollScene = new T.Scene();
    dollCamera = new T.PerspectiveCamera(40, (rect.width || 500) / (rect.height || 520), 0.1, 100);
    dollCamera.position.set(0, 1.2, 5.0);
    dollCamera.lookAt(0, 0.4, 0);

    const amb = new T.AmbientLight(0xFFF7EC, 1.6);
    dollScene.add(amb);
    const key = new T.DirectionalLight(0xD8B779, 1.8);
    key.position.set(2, 4, 4);
    dollScene.add(key);

    dollGroup = new T.Group();
    dollScene.add(dollGroup);

    // Princess Ballgown (Pastel Lavender with Gold Sparkle Trim)
    const dressMat = new T.MeshStandardMaterial({
      color: 0xBBAACF,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0x381E35,
      emissiveIntensity: 0.25
    });
    const dress = new T.Mesh(new T.ConeGeometry(1.25, 2.0, 32), dressMat);
    dress.position.y = -0.3;
    dollGroup.add(dress);

    // Dress Gold Tier Ruffles
    const goldMat = new T.MeshStandardMaterial({ color: 0xD8B779, metalness: 0.8, roughness: 0.2 });
    const ruffle1 = new T.Mesh(new T.TorusGeometry(0.85, 0.05, 12, 32), goldMat);
    ruffle1.position.y = -0.5;
    ruffle1.rotation.x = Math.PI / 2;
    dollGroup.add(ruffle1);

    // Torso & Shoulders
    const skinMat = new T.MeshStandardMaterial({ color: 0xFDE6D8, roughness: 0.6 });
    const torso = new T.Mesh(new T.CylinderGeometry(0.32, 0.28, 0.65, 24), dressMat);
    torso.position.y = 0.85;
    dollGroup.add(torso);

    // Head
    const head = new T.Mesh(new T.SphereGeometry(0.48, 28, 28), skinMat);
    head.position.y = 1.55;
    dollGroup.add(head);

    // Silky Black Hair with Elegant Updo
    const hairMat = new T.MeshStandardMaterial({ color: 0x1A0D1F, roughness: 0.3 });
    const hairBack = new T.Mesh(new T.SphereGeometry(0.52, 24, 24), hairMat);
    hairBack.position.set(0, 1.62, -0.06);
    dollGroup.add(hairBack);
    const hairBun = new T.Mesh(new T.SphereGeometry(0.28, 20, 20), hairMat);
    hairBun.position.set(0, 2.05, -0.15);
    dollGroup.add(hairBun);

    // Golden Royal Tiara / Crown
    const crownMat = new T.MeshStandardMaterial({ color: 0xD8B779, metalness: 0.9, roughness: 0.15 });
    const crown = new T.Mesh(new T.CylinderGeometry(0.35, 0.32, 0.2, 8, 1, true), crownMat);
    crown.position.set(0, 2.05, 0.02);
    dollGroup.add(crown);

    // Blushing Cheeks
    const blushMat = new T.MeshBasicMaterial({ color: 0xEE96A8, transparent: true, opacity: 0.65 });
    const blushL = new T.Mesh(new T.SphereGeometry(0.08, 12, 12), blushMat);
    blushL.position.set(-0.24, 1.48, 0.42);
    dollGroup.add(blushL);
    const blushR = blushL.clone();
    blushR.position.x = 0.24;
    dollGroup.add(blushR);

    // Animated Render Loop for Doll
    function renderDoll() {
      requestAnimationFrame(renderDoll);
      const time = performance.now() * 0.002;
      dollGroup.position.y = Math.sin(time) * 0.08;
      dollGroup.rotation.y = Math.sin(time * 0.7) * 0.15;
      dollRenderer.render(dollScene, dollCamera);
    }
    renderDoll();

    // Click on canvas triggers cheerful doll greeting
    canvas.addEventListener('click', () => {
      Birthday.cycleDollGreeting?.();
    });

    window.addEventListener('resize', () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      dollCamera.aspect = r.width / r.height;
      dollCamera.updateProjectionMatrix();
      dollRenderer.setSize(r.width, r.height);
    });
  }

  /* --------------------------------------------------------------------------
     5. CELEBRATION EFFECTS: LUXURY CONFETTI & SPARKS
     -------------------------------------------------------------------------- */
  fx.launchConfetti = (count = 60) => {
    const colors = ['#D8B779', '#D9A6B2', '#FFF7EC', '#BBAACF', '#ECCB93'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--drift', (Math.random() - 0.5) * 300 + 'px');
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.animationDuration = (2.8 + Math.random() * 1.5) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4200);
    }
  };

  // Initialize all Three.js systems after window loads
  window.addEventListener('DOMContentLoaded', () => {
    initUniverse();
    setTimeout(() => {
      init3DMuseum();
      init3DCake();
      init3DDoll();
    }, 150);
  });
})();
