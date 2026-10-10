import { DEFAULTS, chooseQuality, clamp, mix } from "./config.js";
import { Observatory } from "./engine.js";
import { Interface } from "./interface.js";

class Soundscape {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.oscillators = [];
    this.phase = 0;
  }

  async initialize() {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("Web Audio is not available in this browser.");
    }

    this.context = new AudioContextClass();

    const context = this.context;

    this.master = context.createGain();
    this.master.gain.value = 0;

    this.filter = context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 1100;
    this.filter.Q.value = 0.35;

    this.compressor = context.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 18;
    this.compressor.ratio.value = 5;
    this.compressor.attack.value = 0.02;
    this.compressor.release.value = 0.4;

    this.filter.connect(this.master);
    this.master.connect(this.compressor);
    this.compressor.connect(context.destination);

    const frequencies = [65.406, 97.999, 130.813, 195.998];

    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index % 2 === 0 ? -3 : 3;

      gain.gain.value = [0.13, 0.075, 0.05, 0.028][index];

      oscillator.connect(gain);
      gain.connect(this.filter);

      oscillator.start();

      this.oscillators.push({
        oscillator,
        gain,
        base: frequency
      });
    });

    const duration = 3;
    const buffer = context.createBuffer(
      1,
      Math.floor(context.sampleRate * duration),
      context.sampleRate
    );

    const data = buffer.getChannelData(0);

    let seed = 329191;
    let previous = 0;

    for (let i = 0; i < data.length; i++) {
      seed = (1664525 * seed + 1013904223) >>> 0;

      const white = seed / 4294967296 * 2 - 1;

      previous = previous * 0.96 + white * 0.04;
      data[i] = previous;
    }

    this.noise = context.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;

    this.noiseGain = context.createGain();
    this.noiseGain.gain.value = 0.022;

    this.noise.connect(this.noiseGain);
    this.noiseGain.connect(this.filter);
    this.noise.start();

    await context.resume();
  }

  async setEnabled(enabled) {
    if (enabled && !this.context) {
      await this.initialize();
    }

    if (!this.context) {
      this.enabled = false;
      return false;
    }

    if (enabled && this.context.state !== "running") {
      await this.context.resume();
    }

    this.enabled = enabled;

    const now = this.context.currentTime;

    this.master.gain.cancelScheduledValues(now);

    this.master.gain.setTargetAtTime(
      enabled ? 0.16 : 0,
      now,
      0.45
    );

    return this.enabled;
  }

  update(phase) {
    this.phase = phase;

    if (!this.context || !this.enabled) return;

    const stages = [0, 2, 3, 5, 7];

    const index = Math.min(3, Math.floor(phase));
    const fraction = clamp(phase - index, 0, 1);

    const semitones = mix(
      stages[index],
      stages[index + 1],
      fraction
    );

    const ratio = 2 ** (semitones / 12);
    const now = this.context.currentTime;

    this.oscillators.forEach(({ oscillator, base }, oscillatorIndex) => {
      oscillator.frequency.setTargetAtTime(
        base * ratio *
          (1 + Math.sin(phase + oscillatorIndex) * 0.001),
        now,
        1.1
      );
    });

    this.filter.frequency.setTargetAtTime(
      850 + phase * 210,
      now,
      1.2
    );
  }

  async visibility(hidden) {
    if (!this.context) return;

    if (hidden) {
      await this.context.suspend();
    } else if (this.enabled) {
      await this.context.resume();
    }
  }

  async dispose() {
    if (!this.context) return;

    this.oscillators.forEach(({ oscillator }) => {
      oscillator.stop();
    });

    this.noise.stop();

    await this.context.close();
    this.context = null;
  }
}

const settings = { ...DEFAULTS };
const quality = chooseQuality();

const ui = new Interface(settings, quality);
const sound = new Soundscape();

const events = new AbortController();

let engine;

try {
  engine = new Observatory({
    settings,
    quality,

    onStatus: message => ui.status(message),

    onError: error => {
      ui.error(error);

      sound.setEnabled(false).catch(audioError => {
        console.warn(audioError);
      });
    },

    onFrame: delta => {
      ui.tick(delta);
      sound.update(engine.phase);
    },

    onStats: stats => ui.stats(stats)
  });

  await engine.initialize();

  ui.bind({
    phase: value => engine.setPhase(value),

    motion: enabled => engine.setMotion(enabled),

    configure: () => engine.configure(),

    select: index => engine.select(index),

    capture: () => engine.capture(),

    sound: enabled => sound.setEnabled(enabled)
  });

  ui.ready();

  const signal = events.signal;

  function interactiveTarget(target) {
    return target instanceof Element && Boolean(
      target.closest(
        "button, a, input, select, textarea, dialog, " +
        ".specimen-panel, .footer"
      )
    );
  }

  let pointerDown = null;

  window.addEventListener("pointermove", event => {
    if (
      event.pointerType === "touch" ||
      interactiveTarget(event.target)
    ) {
      engine.clearPointer();
      return;
    }

    engine.setPointer(
      event.clientX,
      event.clientY,
      true
    );
  }, { passive: true, signal });

  document.documentElement.addEventListener(
    "pointerleave",
    () => engine.clearPointer(),
    { signal }
  );

  window.addEventListener("pointerdown", event => {
    if (interactiveTarget(event.target)) {
      pointerDown = null;
      return;
    }

    pointerDown = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now()
    };
  }, { passive: true, signal });

  window.addEventListener("pointerup", event => {
    if (
      !pointerDown ||
      interactiveTarget(event.target)
    ) {
      pointerDown = null;
      return;
    }

    const distance = Math.hypot(
      event.clientX - pointerDown.x,
      event.clientY - pointerDown.y
    );

    const duration = performance.now() - pointerDown.time;

    pointerDown = null;

    if (distance > 7 || duration > 650) return;

    const index = engine.pick(
      event.clientX,
      event.clientY
    );

    if (index >= 0) {
      ui.inspect(index);
    }
  }, { passive: true, signal });

  window.addEventListener("pointercancel", () => {
    pointerDown = null;
    engine.clearPointer();
  }, { signal });

  document.addEventListener("visibilitychange", () => {
    sound.visibility(document.hidden).catch(error => {
      console.warn("Audio visibility change failed:", error);
    });
  }, { signal });

  window.addEventListener("pagehide", event => {
    if (event.persisted) return;

    events.abort();
    ui.dispose();

    sound.dispose().catch(error => {
      console.warn("Audio cleanup failed:", error);
    });
  }, { signal });

} catch (error) {
  engine?.dispose();
  ui.error(error);
}