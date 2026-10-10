import {
  ACTS,
  CONTROLS,
  DEFAULTS,
  SPECIMENS,
  clamp
} from "./config.js";

function $(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Missing interface element: ${selector}`);
  }

  return element;
}

export class Interface {
  constructor(settings, quality) {
    this.settings = settings;
    this.quality = quality;

    this.events = new AbortController();

    this.playing = false;
    this.motion = !matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.motionOverridden = false;
    this.sound = false;

    this.phase = 0;
    this.progress = 0;

    this.anchors = [];
    this.maxScroll = 1;

    this.activeStage = -1;
    this.previousPercent = -1;
    this.toastTimer = 0;

    this.handlers = null;

    this.chapters = [...document.querySelectorAll(".chapter")];
    this.chapterLinks = [...document.querySelectorAll(".chapter-nav a")];

    this.dialog = $("#studio-dialog");
    this.panel = $("#specimen-panel");

    this.rangeInputs = new Map();

    this.buildControls();
    this.buildSpecimenDirectory();

    $("#quality-select").value = quality;

    this.measure();
  }

  buildControls() {
    const container = $("#settings-controls");

    CONTROLS.forEach(control => {
      const label = document.createElement("label");
      label.className = "range-control";

      const text = document.createElement("span");
      text.textContent = control.label;

      const output = document.createElement("output");
      output.textContent = this.formatValue(
        control.key,
        this.settings[control.key]
      );

      const input = document.createElement("input");

      input.type = "range";
      input.min = String(control.min);
      input.max = String(control.max);
      input.step = String(control.step);
      input.value = String(this.settings[control.key]);

      input.setAttribute("aria-label", control.label);

      input.addEventListener("input", () => {
        const value = clamp(
          Number(input.value),
          control.min,
          control.max
        );

        this.settings[control.key] = value;
        output.textContent = this.formatValue(control.key, value);

        this.handlers?.configure();
      }, { signal: this.events.signal });

      label.append(text, output, input);
      container.append(label);

      this.rangeInputs.set(control.key, {
        input,
        output
      });
    });
  }

  buildSpecimenDirectory() {
    const container = $("#specimen-buttons");

    SPECIMENS.forEach((specimen, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = `${specimen.id} / ${specimen.name}`;

      button.addEventListener("click", () => {
        this.dialog.close();
        this.inspect(index, true);
      }, { signal: this.events.signal });

      container.append(button);
    });
  }

  formatValue(key, value) {
    if (key === "aperture") return String(Math.round(value));
    if (key === "grain") return value.toFixed(3);

    return value.toFixed(2);
  }

  bind(handlers) {
    this.handlers = handlers;

    const signal = this.events.signal;

    $("#studio-button").addEventListener("click", () => {
      this.stopPlayback();
      this.dialog.showModal();
    }, { signal });

    $("#studio-close").addEventListener("click", () => {
      this.dialog.close();
    }, { signal });

    $("#artwork-button").addEventListener("click", () => {
      const active = document.body.classList.toggle("is-artwork");

      $("#artwork-button").setAttribute(
        "aria-pressed",
        String(active)
      );

      $("#artwork-button").textContent = active
        ? "Interface"
        : "Artwork";
    }, { signal });

    $("#play-button").addEventListener("click", () => {
      if (this.playing) {
        this.stopPlayback();
        return;
      }

      if (!this.motion) {
        this.setMotion(true, true);
      }

      if (this.progress > 0.985) {
        document.documentElement.classList.add("is-playing");

        window.scrollTo({
          top: 0,
          behavior: "auto"
        });

        this.readScroll();
      }

      this.playing = true;

      document.documentElement.classList.add("is-playing");

      $("#play-button").textContent = "Pause journey";
      $("#play-button").setAttribute("aria-pressed", "true");
    }, { signal });

    $("#motion-button").addEventListener("click", () => {
      this.setMotion(!this.motion, true);
    }, { signal });

    $("#sound-button").addEventListener("click", async () => {
      const button = $("#sound-button");
      button.disabled = true;

      try {
        this.sound = await handlers.sound(!this.sound);

        button.textContent = this.sound
          ? "Sound: On"
          : "Sound: Off";

        button.setAttribute(
          "aria-pressed",
          String(this.sound)
        );
      } catch (error) {
        this.notify(
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        button.disabled = false;
      }
    }, { signal });

    $("#capture-button").addEventListener("click", async () => {
      const button = $("#capture-button");
      button.disabled = true;
      button.textContent = "Capturing…";

      try {
        const blob = await handlers.capture();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download =
          `wale-archive-${Date.now()}.png`;

        document.body.append(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 10000);

        this.notify("Artwork captured as a PNG.");
      } catch (error) {
        this.notify(
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        button.disabled = false;
        button.textContent = "Capture PNG";
      }
    }, { signal });

    $("#reset-button").addEventListener("click", () => {
      Object.assign(this.settings, DEFAULTS);

      this.rangeInputs.forEach(({ input, output }, key) => {
        input.value = String(this.settings[key]);
        output.textContent = this.formatValue(
          key,
          this.settings[key]
        );
      });

      handlers.configure();
      this.notify("The original art direction has been restored.");
    }, { signal });

    $("#quality-select").addEventListener("change", event => {
      const url = new URL(location.href);

      url.searchParams.set(
        "quality",
        event.target.value
      );

      location.assign(url);
    }, { signal });

    $("#specimen-close").addEventListener("click", () => {
      this.panel.hidden = true;
      handlers.select(-1);
    }, { signal });

    window.addEventListener("scroll", () => {
      this.readScroll();
    }, { passive: true, signal });

    window.addEventListener("resize", () => {
      this.measure();
      this.readScroll();
    }, { passive: true, signal });

    window.addEventListener("wheel", () => {
      this.stopPlayback();
    }, { passive: true, signal });

    window.addEventListener("touchstart", () => {
      this.stopPlayback();
    }, { passive: true, signal });

    window.addEventListener("keydown", event => {
      if ([
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " "
      ].includes(event.key)) {
        this.stopPlayback();
      }

      if (event.key === "Escape" && !this.dialog.open) {
        this.panel.hidden = true;
        handlers.select(-1);
      }
    }, { signal });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", () => {
        this.stopPlayback();
      }, { signal });
    });

    const preference = matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    preference.addEventListener("change", event => {
      if (!this.motionOverridden) {
        this.setMotion(!event.matches, false);
      }
    }, { signal });

    this.setMotion(this.motion, false);
    this.readScroll();

    [
      "#artwork-button",
      "#play-button",
      "#studio-button"
    ].forEach(selector => {
      $(selector).disabled = false;
    });
  }

  measure() {
    this.maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - innerHeight
    );

    this.anchors = this.chapters.map(chapter =>
      chapter.getBoundingClientRect().top + scrollY
    );

    this.anchors[this.anchors.length - 1] = Math.min(
      this.anchors[this.anchors.length - 1],
      this.maxScroll
    );
  }

  readScroll() {
    const y = Math.max(0, scrollY);

    let segment = 0;

    while (
      segment < this.anchors.length - 2 &&
      y >= this.anchors[segment + 1]
    ) {
      segment++;
    }

    const length = Math.max(
      1,
      this.anchors[segment + 1] - this.anchors[segment]
    );

    this.phase = clamp(
      segment + (y - this.anchors[segment]) / length,
      0,
      4
    );

    this.progress = clamp(
      y / this.maxScroll,
      0,
      1
    );

    $("#progress-fill").style.transform =
      `scaleX(${this.progress})`;

    const percent = Math.round(this.progress * 100);

    if (percent !== this.previousPercent) {
      this.previousPercent = percent;

      $("#progress-number").textContent =
        `${String(percent).padStart(3, "0")}%`;

      $("#journey-progress").setAttribute(
        "aria-valuenow",
        String(percent)
      );
    }

    const stage = Math.round(this.phase);

    if (stage !== this.activeStage) {
      this.activeStage = stage;

      $("#stage-readout").textContent = ACTS[stage].name;

      document.documentElement.style.setProperty(
        "--accent",
        ACTS[stage].accent
      );

      this.chapterLinks.forEach((link, index) => {
        if (index === stage) {
          link.setAttribute("aria-current", "step");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    this.handlers?.phase(this.phase);
  }

  tick(delta) {
    if (!this.playing) return;

    const next = Math.min(
      1,
      this.progress + delta / 88
    );

    window.scrollTo({
      top: next * this.maxScroll,
      behavior: "auto"
    });

    this.readScroll();

    if (next >= 1) {
      this.stopPlayback();
    }
  }

  stopPlayback() {
    if (!this.playing) return;

    this.playing = false;

    document.documentElement.classList.remove("is-playing");

    $("#play-button").textContent = "Play journey";
    $("#play-button").setAttribute("aria-pressed", "false");
  }

  setMotion(enabled, overridden) {
    this.motion = enabled;

    if (overridden) {
      this.motionOverridden = true;
    }

    if (!enabled) {
      this.stopPlayback();
    }

    document.documentElement.dataset.motion =
      enabled ? "on" : "off";

    $("#motion-button").textContent =
      enabled ? "Motion: On" : "Motion: Off";

    $("#motion-button").setAttribute(
      "aria-pressed",
      String(enabled)
    );

    this.handlers?.motion(enabled);
  }

  inspect(index, focus = false) {
    const specimen = SPECIMENS[index];

    if (!specimen) return;

    $("#specimen-id").textContent =
      `${specimen.id} / Candidate record`;

    $("#specimen-title").textContent = specimen.name;
    $("#specimen-summary").textContent = specimen.summary;

    $("#specimen-origin").textContent = specimen.origin;
    $("#specimen-evidence").textContent = specimen.evidence;
    $("#specimen-contract").textContent = specimen.contract;

    this.panel.hidden = false;

    this.handlers?.select(index);

    if (focus) {
      $("#specimen-title").focus({
        preventScroll: true
      });
    }
  }

  status(message) {
    $("#loading").hidden = false;
    $("#loading-message").textContent = message;
  }

  ready() {
    $("#loading").hidden = true;
  }

  error(error) {
    console.error(error);

    this.stopPlayback();

    $("#viewport").hidden = true;

    this.status(
      "The archive could not render. " +
      (error instanceof Error ? error.message : String(error))
    );

    [
      "#play-button",
      "#studio-button",
      "#artwork-button"
    ].forEach(selector => {
      $(selector).disabled = true;
    });
  }

  stats({ fps, particles, calls, width, height }) {
    $("#render-stats").textContent =
      `${particles.toLocaleString()} simulated particles / ` +
      `${width} × ${height} render / ` +
      `${calls} draw calls / ` +
      (fps === null ? "motion paused" : `${fps} fps`);
  }

  notify(message) {
    clearTimeout(this.toastTimer);

    $("#toast").textContent = message;
    $("#toast").hidden = false;

    this.toastTimer = setTimeout(() => {
      $("#toast").hidden = true;
    }, 4200);
  }

  dispose() {
    clearTimeout(this.toastTimer);
    this.events.abort();
  }
}