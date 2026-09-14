'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import { quietPilotArchitectureIntro, quietPilotTopologySequence } from '@/lib/quietpilot-marketing';

export function QuietPilotArchitectureTopology() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: -8, y: 2 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [toast, setToast] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const activeStep = quietPilotTopologySequence[activeIndex] ?? quietPilotTopologySequence[0];

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  function activate(index: number) {
    setActiveIndex(index);
  }

  function handleSequenceKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = event.key === 'ArrowDown' ? index + 1 : event.key === 'ArrowUp' ? index - 1 : index;

    if (nextIndex !== index && quietPilotTopologySequence[nextIndex]) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      const nextButton = document.querySelector<HTMLButtonElement>(`[data-topology-step="${nextIndex}"]`);
      nextButton?.focus();
    }
  }

  function commenceSequence() {
    clearTimers();
    setIsRunning(true);
    setToast('Sequence initialized');

    quietPilotTopologySequence.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setActiveIndex(index), index * 720));
    });

    timers.current.push(
      window.setTimeout(() => {
        setIsRunning(false);
        setToast('Deployment grid aligned');
      }, quietPilotTopologySequence.length * 720)
    );

    timers.current.push(window.setTimeout(() => setToast(null), quietPilotTopologySequence.length * 720 + 1900));
  }

  return (
    <div
      className="terminal-architecture relative isolate min-h-screen overflow-hidden bg-[#030412] text-[#eef6ff]"
      style={{
        backgroundImage: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(22,199,255,0.14), transparent 18rem), radial-gradient(circle at 14% 0%, rgba(37,50,150,0.32), transparent 25rem), radial-gradient(circle at 92% 45%, rgba(12,196,255,0.12), transparent 18rem)`
      }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100
        });
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(126,135,255,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(126,135,255,0.11)_1px,transparent_1px)] bg-[length:50vw_34vh] opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.026)_0,rgba(255,255,255,0.026)_1px,transparent_1px,transparent_5px)] opacity-20" />

      <div className="relative mx-auto grid min-h-screen max-w-[1500px] border-x border-[#6070b4]/20 lg:grid-cols-2">
        <section className="relative grid min-h-[44rem] border-b border-[#6070b4]/20 lg:border-b-0 lg:border-r">
          <div className="absolute left-7 top-8 hidden h-[34rem] w-4 bg-[repeating-linear-gradient(to_bottom,rgba(58,74,190,0.22)_0_4rem,transparent_4rem_5rem)] opacity-50 md:block" aria-hidden="true" />
          <div className="border-b border-[#6070b4]/20 px-8 py-10 md:px-16 md:py-14">
            <Link href="/quietpilot" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to QuietPilot
            </Link>
            <h1 className="mt-8 max-w-xl font-display text-6xl font-semibold leading-[0.95] text-white md:text-7xl xl:text-8xl">
              {quietPilotArchitectureIntro.title}
            </h1>
          </div>

          <div
            className="relative grid min-h-[30rem] place-items-center overflow-hidden px-6 py-12"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width - 0.5) * 24;
              const y = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
              setTilt({ x, y });
            }}
            onPointerLeave={() => setTilt({ x: -8, y: 2 })}
          >
            <div className="absolute h-[min(36rem,82vw)] w-[min(36rem,82vw)] rounded-full border border-[#2a42a8]/30 shadow-[inset_0_0_52px_rgba(22,199,255,0.06)]" aria-hidden="true" />
            <div className="absolute right-5 top-0 hidden h-full flex-col justify-evenly opacity-70 md:flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((node) => (
                <span key={node} className="h-1.5 w-1.5 rounded-full bg-[#7c86b5] shadow-[0_0_12px_rgba(116,132,255,0.7)]" />
              ))}
            </div>

            <svg
              className="relative z-10 w-[min(36rem,92vw)] drop-shadow-[0_0_36px_rgba(38,61,180,0.36)] transition-transform duration-300 motion-reduce:transition-none"
              viewBox="0 0 600 600"
              role="img"
              aria-label="Interactive abstract topology model"
              style={{ transform: `translateY(-0.25rem) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) rotateZ(-2deg)` }}
            >
              <defs>
                <linearGradient id="quietpilotFaceA" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#082861" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#050629" stopOpacity="0.88" />
                </linearGradient>
                <linearGradient id="quietpilotFaceB" x1="0" x2="1" y1="1" y2="0">
                  <stop offset="0" stopColor="#071b4b" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#0d143a" stopOpacity="0.72" />
                </linearGradient>
                <filter id="quietpilotGlow">
                  <feGaussianBlur stdDeviation="2.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#quietpilotGlow)" stroke="#33407d" strokeWidth="3" strokeLinejoin="round">
                <polygon points="161,175 290,105 418,158 496,276 386,412 214,436 98,336 110,213" fill="rgba(3,7,35,0.58)" />
                <polygon points="110,213 161,175 151,303 98,336" fill="#061238" opacity="0.8" />
                <polygon points="161,175 290,105 418,158 386,303 151,303" fill="url(#quietpilotFaceA)" />
                <polygon points="418,158 496,276 386,412 386,303" fill="#050725" opacity="0.85" />
                <polygon points="151,303 386,303 430,454 214,436 98,336" fill="url(#quietpilotFaceB)" />
                <polygon points="386,303 496,276 430,454" fill="#030519" opacity="0.88" />
              </g>
              <g stroke="#5260a8" strokeWidth="1.25" opacity="0.46" strokeDasharray="10 10">
                <line x1="151" y1="303" x2="161" y2="175" />
                <line x1="386" y1="303" x2="418" y2="158" />
                <line x1="386" y1="303" x2="430" y2="454" />
                <line x1="151" y1="303" x2="98" y2="336" />
                <line x1="161" y1="175" x2="418" y2="158" />
              </g>
            </svg>
          </div>
        </section>

        <section className="relative grid grid-rows-[auto_auto_1fr]">
          <header className="border-b border-[#6070b4]/20 px-8 py-10 text-center md:px-16">
            <p className="mx-auto max-w-2xl text-base font-semibold leading-7 text-[#a0a7bd]">{quietPilotArchitectureIntro.summary}</p>
            <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#8d88ff]">{quietPilotArchitectureIntro.eyebrow}</p>
          </header>

          <nav className="border-b border-[#6070b4]/20" aria-label="Topology sequence">
            {quietPilotTopologySequence.map((step, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  data-topology-step={index}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => activate(index)}
                  onKeyDown={(event) => handleSequenceKey(event, index)}
                  className={`grid min-h-[5.9rem] w-full grid-cols-[3.1rem_1.8rem_1fr_auto] items-center gap-4 border-b border-[#6070b4]/20 px-6 text-left text-sm font-semibold transition last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-300 md:px-12 md:text-base ${
                    isActive ? 'bg-cyan-950/35 text-white shadow-[inset_0_0_0_1px_rgba(24,121,178,0.22)]' : 'text-[#b7bed5] hover:bg-cyan-950/20 hover:text-white'
                  }`}
                >
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#9c98ff]' : 'text-[#9296b3]'}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={`h-px ${isActive ? 'w-7 bg-[#16c7ff]' : 'w-4 bg-[#a0a8d8]/50'}`} aria-hidden="true" />
                  <span>{step.label}</span>
                  <span className="hidden h-1.5 w-14 border border-[#7e87ff]/35 sm:block" aria-hidden="true">
                    <span
                      className="block h-full bg-gradient-to-r from-[#8d88ff] to-[#16c7ff] transition-[width] duration-500"
                      style={{ width: isActive ? `${step.progress}%` : '0%' }}
                    />
                  </span>
                </button>
              );
            })}
          </nav>

          <footer className="flex min-h-[18rem] flex-col justify-end gap-8 px-8 py-10 md:px-14">
            <p className="max-w-2xl text-base font-semibold leading-7 text-[#a2a8bb]">{activeStep.copy}</p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={commenceSequence}
                disabled={isRunning}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#d9def0] transition hover:translate-x-1 hover:text-white disabled:cursor-wait disabled:opacity-65"
              >
                {isRunning ? 'Sequencing' : 'Commence Sequence'}
                <ChevronDown className="h-4 w-4 -rotate-90" aria-hidden="true" />
              </button>
              <div className="inline-flex items-center gap-2 border border-[#4352e7]/45 bg-[#060d2f]/80 px-4 py-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#b9c8ff] shadow-[inset_0_0_14px_rgba(23,197,255,0.1),0_0_18px_rgba(34,53,255,0.2)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#8f87ff]" aria-hidden="true" />
                {isRunning ? 'Syncing Grid' : 'Grid Online'}
              </div>
            </div>
          </footer>
        </section>
      </div>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-20 border border-cyan-300/35 bg-[#030818]/95 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-[#d9efff] shadow-[0_0_34px_rgba(22,199,255,0.14)]" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
