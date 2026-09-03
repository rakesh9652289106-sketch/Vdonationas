// Web Audio API procedural sound synthesizer for sacred temple ambiance

class TempleAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Sacred Temple Ghanta (Bell) with resonant metallic overtones
  playTempleBell(volume = 0.6) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 880; // High resonant temple bell note (A5)
    const harmonics = [1, 1.48, 2.01, 2.76, 3.42, 4.2];
    const decays = [2.8, 2.2, 1.8, 1.3, 0.9, 0.6];

    harmonics.forEach((h, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      gain.gain.setValueAtTime((volume / (index + 1)) * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[index]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decays[index]);
    });
  }

  // 2. Shankha (Sacred Conch Horn) Resonance
  playShankhaSound(volume = 0.5) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(330, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(220, now + 2.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.8);
  }

  // 3. Gold Coin Drop Sound (Metallic Clink & Settle)
  playCoinDrop(volume = 0.5) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [1800, 2400, 3100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + i * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, startTime + 0.3);

      gain.gain.setValueAtTime(volume * (0.8 - i * 0.2), startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // 4. Pushparchana / Flower Shower Chime
  playFlowerChime(volume = 0.4) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major pentatonic chime

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, delay);

      gain.gain.setValueAtTime(volume * 0.4, delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, delay + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(delay);
      osc.stop(delay + 1.2);
    });
  }

  // 5. Meditative Tanpura / Om Drone (Toggleable)
  toggleDrone(enable: boolean, volume = 0.15) {
    const ctx = this.getContext();
    if (!ctx) return;

    if (!enable) {
      if (this.droneGain && this.droneOsc) {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1);
        setTimeout(() => {
          try {
            this.droneOsc?.stop();
            this.droneOsc?.disconnect();
          } catch {
            // safely ignore
          }
          this.droneOsc = null;
          this.droneGain = null;
        }, 1100);
      }
      return;
    }

    if (this.droneOsc) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(136.1, now); // 136.1 Hz = Cosmic Om frequency

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);

    this.droneOsc = osc;
    this.droneGain = gain;
  }
}

export const templeAudio = new TempleAudioSynthesizer();
