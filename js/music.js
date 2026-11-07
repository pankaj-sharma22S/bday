/* ==========================================================================
   LUXURY SOUND DESIGN & MUSIC ENGINE
   - Web Audio API Generative Ambient Score
   - Synthesized Orchestral Music-Box "Happy Birthday To You" Melody
   - Custom Local Audio Loader with Seek & Volume Controls
   - Cake & Gift Celebration Chimes
   ========================================================================== */

(() => {
  const Birthday = window.Birthday = window.Birthday || {};
  const music = Birthday.music = {};
  const soundFx = Birthday.soundFx = {};

  let audioCtx = null;
  let isPlaying = false;
  let isMuted = false;
  let masterGain = null;
  let synthInterval = null;
  let currentMelodyTimeout = null;

  // Custom audio element for uploads
  const audioEl = new Audio();
  audioEl.loop = true;
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

  // Musical Note Frequencies for Celesta / Bell Synthesizer
  const N = {
    C3: 130.81, G3: 196.00, A3: 220.00, F3: 174.61,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50
  };

  // Play a rich, bell-like celesta tone with harmonics
  function playMusicBoxTone(freq, duration = 1.8, timeOffset = 0, volume = 0.22) {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const t = ctx.currentTime + timeOffset;

    // Fundamental oscillator (sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    // Shimmering overtone oscillator (triangle)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, t);

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, t);
    noteGain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  // Play a warm bass chord
  function playBassChord(rootFreq, timeOffset = 0, duration = 2.4) {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime + timeOffset;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(rootFreq, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  /* --------------------------------------------------------------------------
     "HAPPY BIRTHDAY TO YOU" INSTRUMENTAL MUSIC BOX SCORE
     -------------------------------------------------------------------------- */
  // Score definition: [Note, BeatDuration, BassChordRoot]
  const happyBirthdayScore = [
    // "Hap-py birth-day to you..."
    { n: N.G4, d: 0.75 }, { n: N.G4, d: 0.25 }, { n: N.A4, d: 1.0, b: N.C3 }, { n: N.G4, d: 1.0 }, { n: N.C5, d: 1.0 }, { n: N.B4, d: 2.0, b: N.G3 },
    // "Hap-py birth-day to you..."
    { n: N.G4, d: 0.75 }, { n: N.G4, d: 0.25 }, { n: N.A4, d: 1.0, b: N.G3 }, { n: N.G4, d: 1.0 }, { n: N.D5, d: 1.0 }, { n: N.C5, d: 2.0, b: N.C3 },
    // "Hap-py birth-day dear Di-di..."
    { n: N.G4, d: 0.75 }, { n: N.G4, d: 0.25 }, { n: N.G5, d: 1.0, b: N.C3 }, { n: N.E5, d: 1.0 }, { n: N.C5, d: 1.0, b: N.F3 }, { n: N.B4, d: 1.0 }, { n: N.A4, d: 2.0, b: N.F3 },
    // "Hap-py birth-day to you!"
    { n: N.F5, d: 0.75 }, { n: N.F5, d: 0.25 }, { n: N.E5, d: 1.0, b: N.C3 }, { n: N.C5, d: 1.0 }, { n: N.D5, d: 1.0, b: N.G3 }, { n: N.C5, d: 3.0, b: N.C3 }
  ];

  music.playHappyBirthdaySong = () => {
    getAudioContext();
    stopAmbientScore();
    if (currentMelodyTimeout) clearTimeout(currentMelodyTimeout);

    const songStatus = document.querySelector('#song-status');
    const songTitle = document.querySelector('#song-title');
    const audioWave = document.querySelector('.audio-wave');

    if (songTitle) songTitle.textContent = "Happy Birthday To You 🎂";
    if (songStatus) songStatus.textContent = "Music-Box Celestial Melody";
    if (audioWave) audioWave.classList.add('playing');
    isPlaying = true;

    Birthday.toast?.("Playing Happy Birthday for Didi! 🎶✨");

    let tempo = 0.52; // seconds per beat
    let currentTime = 0;

    happyBirthdayScore.forEach((item) => {
      const duration = item.d * tempo;
      playMusicBoxTone(item.n, duration * 1.5, currentTime, 0.25);
      if (item.b) {
        playBassChord(item.b, currentTime, duration * 2.2);
      }
      currentTime += duration;
    });

    // Loop after completion or return to ambient
    currentMelodyTimeout = setTimeout(() => {
      if (isPlaying && !isCustomTrack) {
        startAmbientScore();
        if (songTitle) songTitle.textContent = "Celestial Reverie";
        if (songStatus) songStatus.textContent = "Generative Ambient Score";
      }
    }, (currentTime + 1.5) * 1000);
  };

  /* --------------------------------------------------------------------------
     AMBIENT CELESTIAL BACKGROUND SCORE
     -------------------------------------------------------------------------- */
  const celestialFrequencies = [
    N.D4, N.E4, 369.99, N.A4, N.B4, N.D5, N.E5, 739.99, N.A5, N.B5, N.D6
  ];

  function playAmbientChord() {
    if (!isPlaying || isCustomTrack) return;
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * celestialFrequencies.length);
      const freq = celestialFrequencies[idx];
      playMusicBoxTone(freq, 4.0, i * 0.45, 0.16);
    }
  }

  function startAmbientScore() {
    if (synthInterval) clearInterval(synthInterval);
    playAmbientChord();
    synthInterval = setInterval(playAmbientChord, 4000);
  }

  function stopAmbientScore() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  // Sound FX
  soundFx.playWishChime = () => {
    const chimeNotes = [N.D5, 739.99, N.A5, N.D6];
    chimeNotes.forEach((f, i) => {
      playMusicBoxTone(f, 3.5, i * 0.14, 0.22);
    });
  };

  soundFx.playGiftChime = () => {
    playMusicBoxTone(N.A4, 2.0, 0, 0.2);
    playMusicBoxTone(N.E5, 2.5, 0.12, 0.2);
    playMusicBoxTone(N.A5, 3.0, 0.24, 0.25);
  };

  // Wire UI Controls
  window.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.querySelector('#sound-toggle');
    const bdaySongNavBtn = document.querySelector('#btn-play-bday-song-nav');
    const musicPanel = document.querySelector('#music-panel');
    const panelClose = document.querySelector('#panel-close');
    const playBtn = document.querySelector('#player-play');
    const muteBtn = document.querySelector('#player-mute');
    const volumeSlider = document.querySelector('#player-volume');
    const audioInput = document.querySelector('#audio-file-input');
    const bdaySongPanelBtn = document.querySelector('#btn-bday-song-panel');
    const audioWave = document.querySelector('.audio-wave');

    function updatePlayState(playing) {
      isPlaying = playing;
      if (playing) {
        if (audioWave) audioWave.classList.add('playing');
        if (playBtn) playBtn.textContent = '❚❚';
        if (isCustomTrack) {
          audioEl.play().catch(e => console.warn(e));
        } else {
          startAmbientScore();
        }
      } else {
        if (audioWave) audioWave.classList.remove('playing');
        if (playBtn) playBtn.textContent = '▶';
        if (currentMelodyTimeout) clearTimeout(currentMelodyTimeout);
        if (isCustomTrack) {
          audioEl.pause();
        } else {
          stopAmbientScore();
        }
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
        if (masterGain && audioCtx) {
          masterGain.gain.setValueAtTime(isMuted ? 0 : (volumeSlider?.value / 100 || 0.5), audioCtx.currentTime);
        }
        audioEl.muted = isMuted;
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        if (masterGain && audioCtx && !isMuted) {
          masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
        }
        audioEl.volume = val;
      });
    }

    if (audioInput) {
      audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        stopAmbientScore();
        if (currentMelodyTimeout) clearTimeout(currentMelodyTimeout);
        const url = URL.createObjectURL(file);
        audioEl.src = url;
        isCustomTrack = true;

        const songTitle = document.querySelector('#song-title');
        const songStatus = document.querySelector('#song-status');
        if (songTitle) songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
        if (songStatus) songStatus.textContent = "Playing Custom Song";
        updatePlayState(true);
        Birthday.toast?.(`Custom track loaded: ${file.name} 🎵`);
      });
    }

    music.start = () => updatePlayState(true);
    music.pause = () => updatePlayState(false);
  });
})();
