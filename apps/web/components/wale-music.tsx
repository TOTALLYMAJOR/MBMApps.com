'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './wale-music.module.css';

const RECORDING = '/audio/moonlight-sonata-paul-pitman.mp3';
type Status = 'off' | 'loading' | 'playing' | 'error';

export function WaleMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const requested = useRef(false);
  const attempt = useRef(0);
  const [status, setStatus] = useState<Status>('off');

  useEffect(() => {
    const player = audio.current!;
    const pendingAttempt = attempt;
    player.volume = 0.24;
    const hide = () => {
      if (!document.hidden) return;
      requested.current = false;
      pendingAttempt.current++;
      player.pause();
      setStatus('off');
    };
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide);
      requested.current = false;
      pendingAttempt.current++;
      player.pause();
      player.removeAttribute('src');
      player.load();
    };
  }, []);

  const toggle = async () => {
    const player = audio.current!;
    const current = ++attempt.current;
    if (requested.current) {
      requested.current = false;
      player.pause();
      setStatus('off');
      return;
    }
    requested.current = true;
    setStatus('loading');
    if (!player.getAttribute('src')) player.src = RECORDING;
    else if (player.error) player.load();
    try {
      await player.play();
    } catch {
      if (current !== attempt.current) return;
      requested.current = false;
      setStatus('error');
    }
  };

  return (
    <div className={styles.music}>
      <audio ref={audio} preload="none"
        onPlaying={() => { if (requested.current) setStatus('playing'); else audio.current?.pause(); }}
        onWaiting={() => { if (requested.current) setStatus('loading'); }}
        onPause={() => { if (!requested.current) setStatus(current => current === 'error' ? current : 'off'); }}
        onEnded={() => { requested.current = false; setStatus('off'); }}
        onError={() => { requested.current = false; setStatus('error'); }} />
      <button type="button" onClick={toggle} aria-pressed={status === 'playing'}
        aria-label={status === 'playing' ? 'Pause Moonlight Sonata' : status === 'loading' ? 'Cancel music loading' : status === 'error' ? 'Retry Moonlight Sonata' : 'Play Moonlight Sonata'}
        aria-describedby={status === 'error' ? 'wale-music-error' : undefined}
        title="Moonlight Sonata · I. Adagio sostenuto — Paul Pitman / Musopen">
        {status === 'playing' ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
        <span>{status === 'loading' ? 'Loading…' : status === 'error' ? 'Retry music' : `Music ${status === 'playing' ? 'on' : 'off'}`}</span>
      </button>
      {status === 'error' && <p id="wale-music-error" role="status">Music couldn’t start. Check your connection and retry.</p>}
    </div>
  );
}
