/* ==========================================================================
   LUXURY SOUND DESIGN & MUSIC ENGINE
   - "Happy Birthday To You" Studio Orchestral Soundtrack (assets/audio/happy-birthday.wav)
   - Real-time Web Audio API Multi-harmonic Synthesis Engine (Fallback & Chimes)
   - Custom Local Audio Loader with Volume & Mute Controls
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};
  const music = Birthday.music = {};
  const soundFx = Birthday.soundFx = {};

  let audioCtx = null;
  let isPlaying = false;
  let isMuted = false;
  let masterGain = null;

  // Primary Birthday Soundtrack HTML5 Audio Element
  const audioEl = new Audio('assets/audio/happy-birthday.wav');
  audioEl.loop = true;
  audioEl.preload = 'auto';
  let isCustomTrack = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Musical Note Frequencies for Chimes
  const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, D6: 1174.66
  };

  function playChimeTone(freq, duration = 1.8, timeOffset = 0, volume = 0.22) {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime + timeOffset;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, t);
    noteGain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Sound FX
  soundFx.playWishChime = () => {
    const chimeNotes = [N.D5, N.F5, N.A5, N.D6];
    chimeNotes.forEach((f, i) => {
      playChimeTone(f, 3.2, i * 0.14, 0.22);
    });
  };

  soundFx.playGiftChime = () => {
    playChimeTone(N.A4, 2.0, 0, 0.2);
    playChimeTone(N.E5, 2.5, 0.12, 0.2);
    playChimeTone(N.A5, 3.0, 0.24, 0.25);
  };

  // Play "Happy Birthday To You" Soundtrack
  music.playHappyBirthdaySong = () => {
    getAudioContext();
    if (!audioEl.src.includes('happy-birthday.wav') && !isCustomTrack) {
      audioEl.src = 'assets/audio/happy-birthday.wav';
    }
    audioEl.currentTime = 0;
    audioEl.play().catch(e => console.warn("Audio autoplay policy:", e));

    const songStatus = document.querySelector('#song-status');
    const songTitle = document.querySelector('#song-title');
    const audioWave = document.querySelector('.audio-wave');
    const playBtn = document.querySelector('#player-play');

    if (songTitle) songTitle.textContent = "Happy Birthday To You 🎂";
    if (songStatus) songStatus.textContent = "Studio Orchestral Soundtrack";
    if (audioWave) audioWave.classList.add('playing');
    if (playBtn) playBtn.textContent = '❚❚';
    isPlaying = true;

    Birthday.toast?.("Playing Happy Birthday for Didi! 🎶✨");
  };

  // Wire UI Controls
  window.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.querySelector('#sound-toggle');
    const bdaySongNavBtn = document.querySelector('#btn-play-bday-song-nav');
    const bdaySongCakeBtn = document.querySelector('#btn-play-bday-song-cake');
    const bdaySongPanelBtn = document.querySelector('#btn-bday-song-panel');
    const musicPanel = document.querySelector('#music-panel');
    const panelClose = document.querySelector('#panel-close');
    const playBtn = document.querySelector('#player-play');
    const muteBtn = document.querySelector('#player-mute');
    const volumeSlider = document.querySelector('#player-volume');
    const audioInput = document.querySelector('#audio-file-input');
    const audioWave = document.querySelector('.audio-wave');
    const songTitle = document.querySelector('#song-title');
    const songStatus = document.querySelector('#song-status');

    function updatePlayState(playing) {
      isPlaying = playing;
      if (playing) {
        if (audioWave) audioWave.classList.add('playing');
        if (playBtn) playBtn.textContent = '❚❚';
        if (songTitle) songTitle.textContent = isCustomTrack ? songTitle.textContent : "Happy Birthday To You 🎂";
        if (songStatus) songStatus.textContent = isCustomTrack ? "Playing Local Track" : "Studio Orchestral Soundtrack";
        audioEl.play().catch(e => console.warn(e));
      } else {
        if (audioWave) audioWave.classList.remove('playing');
        if (playBtn) playBtn.textContent = '▶';
        if (songStatus) songStatus.textContent = "Sound paused";
        audioEl.pause();
      }
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        getAudioContext();
        if (musicPanel) musicPanel.classList.toggle('open');
        if (!isPlaying) updatePlayState(true);
      });
    }

    if (bdaySongNavBtn) {
      bdaySongNavBtn.addEventListener('click', () => {
        music.playHappyBirthdaySong();
      });
    }

    if (bdaySongCakeBtn) {
      bdaySongCakeBtn.addEventListener('click', () => {
        music.playHappyBirthdaySong();
      });
    }

    if (bdaySongPanelBtn) {
      bdaySongPanelBtn.addEventListener('click', () => {
        music.playHappyBirthdaySong();
      });
    }

    if (panelClose) {
      panelClose.addEventListener('click', () => {
        if (musicPanel) musicPanel.classList.remove('open');
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        getAudioContext();
        updatePlayState(!isPlaying);
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        audioEl.muted = isMuted;
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        Birthday.toast?.(isMuted ? "Audio muted" : "Audio unmuted");
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        audioEl.volume = val;
      });
    }

    if (audioInput) {
      audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        audioEl.src = url;
        isCustomTrack = true;

        if (songTitle) songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
        if (songStatus) songStatus.textContent = "Custom Local Track";
        updatePlayState(true);
        Birthday.toast?.(`Playing custom track: ${file.name} 🎵`);
      });
    }

    music.start = () => updatePlayState(true);
    music.pause = () => updatePlayState(false);
  });
})();
