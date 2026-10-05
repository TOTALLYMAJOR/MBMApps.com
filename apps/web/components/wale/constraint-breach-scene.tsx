import { memo } from 'react';
import { motion } from 'framer-motion';
import { breachShards } from './model';
import styles from './scene.module.css';

interface ConstraintBreachSceneProps {
  reduceMotion: boolean;
  breachActive: boolean;
}

const timing = [0, 0.22, 0.48, 0.68, 0.8, 1] as const;

function SceneDefinitions() {
  return (
    <defs>
      <linearGradient id="interceptor-shell" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b2fff0" />
        <stop offset="0.2" stopColor="#47ddcc" />
        <stop offset="0.56" stopColor="#159d99" />
        <stop offset="0.83" stopColor="#08606b" />
        <stop offset="1" stopColor="#043744" />
      </linearGradient>
      <linearGradient id="interceptor-belly" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#74e8d6" stopOpacity="0.14" />
        <stop offset="0.58" stopColor="#c3fff4" stopOpacity="0.48" />
        <stop offset="1" stopColor="#4fc8c1" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="interceptor-fin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#21b8ad" />
        <stop offset="1" stopColor="#053b50" />
      </linearGradient>
      <linearGradient id="constraint-wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1f1814" />
        <stop offset="0.24" stopColor="#4d3525" />
        <stop offset="0.5" stopColor="#6a472d" />
        <stop offset="0.76" stopColor="#36251c" />
        <stop offset="1" stopColor="#15110f" />
      </linearGradient>
      <radialGradient id="aperture-void" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#010607" />
        <stop offset="0.68" stopColor="#020b0d" />
        <stop offset="0.86" stopColor="#07191b" />
        <stop offset="1" stopColor="#19534e" />
      </radialGradient>
      <radialGradient id="sonar-eye" cx="42%" cy="44%" r="60%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.2" stopColor="#a5fff0" />
        <stop offset="0.55" stopColor="#2df5d6" />
        <stop offset="1" stopColor="#042b33" />
      </radialGradient>
      <filter id="interceptor-glow" x="-70%" y="-70%" width="240%" height="240%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.89 0 0 0 0 0.79 0 0 0 0.44 0" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="aperture-glow" x="-70%" y="-70%" width="240%" height="240%">
        <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#55e4d1" floodOpacity="0.55" />
      </filter>
      <filter id="shard-glow-v2" x="-120%" y="-120%" width="340%" height="340%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#57e5d2" floodOpacity="0.72" />
      </filter>
      <clipPath id="signal-aperture"><circle cx="984" cy="306" r="124" /></clipPath>
      <pattern id="wood-grain" width="96" height="24" patternUnits="userSpaceOnUse">
        <path d="M0 7c18-5 39 7 58 1s27-4 38 0M0 18c24 4 45-6 68-1s20 3 28 1" fill="none" stroke="#d19a67" strokeOpacity="0.11" strokeWidth="2" />
      </pattern>
    </defs>
  );
}

function FieldGrid() {
  return (
    <g className={styles.fieldGrid}>
      <path d="M0 78H1240M0 230H1240M0 382H1240M0 534H1240" />
      <path d="M108 0V620M338 0V620M568 0V620M798 0V620M1028 0V620" />
      <path className={styles.gridAccent} d="M0 306H1240" />
      <circle cx="984" cy="306" r="210" />
      <circle cx="984" cy="306" r="246" />
    </g>
  );
}

function ConstraintWall({ breachActive, reduceMotion }: ConstraintBreachSceneProps) {
  return (
    <motion.g
      className={styles.constraintWall}
      animate={breachActive && !reduceMotion ? { opacity: [1, 1, 0.96, 0.82] } : { opacity: 1 }}
      transition={{ duration: 2.8, times: [0, 0.68, 0.82, 1] }}
    >
      <path fill="url(#constraint-wood)" d="M901 30H1240V588H901Z" />
      <path fill="url(#wood-grain)" d="M901 30H1240V588H901Z" />
      <path className={styles.wallEdge} d="M905 30v558" />
      <path className={styles.wallBands} d="M918 82c74 17 184-21 300 8M916 151c102-24 194 18 310-7M914 456c113 19 186-25 326-5M918 531c91-20 197 14 315-8" />
      <circle className={styles.apertureOuter} cx="984" cy="306" r="156" />
      <circle fill="url(#aperture-void)" cx="984" cy="306" r="128" />
      <circle className={styles.apertureInner} cx="984" cy="306" r="127" />
      <g className={styles.apertureBolts}>
        <circle cx="984" cy="145" r="4" /><circle cx="1098" cy="192" r="4" />
        <circle cx="1145" cy="306" r="4" /><circle cx="1098" cy="420" r="4" />
        <circle cx="984" cy="467" r="4" /><circle cx="870" cy="420" r="4" />
        <circle cx="823" cy="306" r="4" /><circle cx="870" cy="192" r="4" />
      </g>
      <motion.path
        className={styles.cracks}
        d="M920 190l-31-59-26-35M1054 198l27-52 45-39M1103 292l61-16 54-31M1070 408l34 49 19 57M921 424l-40 46-16 55M845 340l-55 22-41 36"
        initial={{ opacity: 0.34 }}
        animate={breachActive ? { opacity: [0.34, 0.34, 1, 0.66] } : { opacity: 0.34 }}
        transition={{ duration: reduceMotion ? 0 : 2.8, times: [0, 0.58, 0.78, 1] }}
      />
    </motion.g>
  );
}

function SignalAnomaly({ breachActive, reduceMotion }: ConstraintBreachSceneProps) {
  const duration = reduceMotion ? 0.01 : 2.8;
  return (
    <g clipPath="url(#signal-aperture)">
      <motion.g
        className={styles.signalAnomaly}
        initial={{ x: 126, y: 0, opacity: 1 }}
        animate={breachActive
          ? { x: [126, 82, 24, -42, -66, -66], y: [0, -8, -20, 7, 7, 7], opacity: [1, 1, 1, 1, 0, 0] }
          : reduceMotion
            ? { x: 48, y: 0, opacity: 1 }
            : { x: [126, 72, 110], y: [0, -12, 6], opacity: 1 }}
        transition={breachActive
          ? { duration, times: timing, ease: [0.3, 0, 0.16, 1] }
          : reduceMotion
            ? { duration: 0 }
            : { duration: 4.1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <path className={styles.signalBody} d="M971 290l-33-21 6 24-7 25 34-19c18 13 46 9 58-7-13-16-41-18-58-2Z" />
        <path className={styles.signalFin} d="m995 284 12-18 7 22ZM982 302l17 17-3-20Z" />
        <circle cx="1013" cy="287" r="3" />
        <motion.circle
          className={styles.signalPing}
          cx="1009" cy="292" r="24"
          animate={reduceMotion ? { opacity: 0 } : { opacity: [0, 0.6, 0], scale: [0.7, 1.45, 2] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
      </motion.g>
    </g>
  );
}

function EngineeredInterceptor({ breachActive, reduceMotion }: ConstraintBreachSceneProps) {
  const duration = reduceMotion ? 0.01 : 2.8;
  const finalX = breachActive && reduceMotion ? 586 : 0;
  return (
    <motion.g
      className={styles.interceptor}
      initial={{ x: 0, y: 0, rotate: 0 }}
      animate={breachActive
        ? reduceMotion
          ? { x: finalX, y: -2, rotate: -1 }
          : { x: [0, 18, 62, 206, 586, 612], y: [0, -3, -9, -5, -2, -2], rotate: [0, -0.4, -1.5, -1, -1, -1] }
        : reduceMotion
          ? { x: 0, y: 0, rotate: 0 }
          : { x: [0, 10, 0], y: [0, -5, 0], rotate: [0, -0.5, 0] }}
      transition={breachActive
        ? { duration, times: timing, ease: [0.4, 0.02, 0.06, 1] }
        : reduceMotion
          ? { duration: 0 }
          : { duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <g filter="url(#interceptor-glow)">
        <path className={styles.interceptorTail} d="M72 296 3 232l20 78-19 83 73-62 36-19Z" />
        <path fill="url(#interceptor-shell)" d="M69 309c26-80 112-120 239-111 96 7 166 50 207 105l48 22-49 31c-52 59-137 81-252 64-113-16-193-52-193-111Z" />
        <path fill="url(#interceptor-belly)" d="M94 350c92 50 280 61 410-1-53 71-160 93-272 66-74-17-119-39-138-65Z" />
        <path className={styles.interceptorDorsal} d="m252 204 64-79 36 84Z" />
        <path fill="url(#interceptor-fin)" d="m268 391 80 99 24-94Z" />
        <path className={styles.interceptorBrow} d="m442 267 53 4-27 24Z" />
        <path className={styles.interceptorEyeSocket} d="m459 286 20 7-19 11-14-9Z" />
        <ellipse className={styles.interceptorEye} cx="462" cy="294" rx="7" ry="5" />
        <path className={styles.interceptorGills} d="m161 273 43-25M153 297l56-20M152 321l53-9" />
        <path className={styles.interceptorJaw} d="m403 345 111-16-44 32Z" />
        <path className={styles.seamA} d="M218 225 276 248 338 231" />
        <path className={styles.seamB} d="M187 367 266 341 341 363" />
        <path className={styles.seamC} d="M339 245 391 271" />
      </g>
      <motion.path
        className={styles.sonarArc}
        d="M477 292q55-42 104 1M486 293q73-61 137 1"
        animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0.08, 0.72, 0.08], scale: [0.96, 1.02, 0.96] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '477px 292px' }}
      />
    </motion.g>
  );
}

function VelocityField({ breachActive, reduceMotion }: ConstraintBreachSceneProps) {
  return (
    <g className={styles.velocityField}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.path
          key={index}
          d={`M${45 + index * 12} ${270 + index * 22}H${470 - index * 18}`}
          initial={{ opacity: 0, x: -18 }}
          animate={breachActive && !reduceMotion
            ? { opacity: [0, 0, 0.74, 0.34, 0], x: [-18, -18, 0, 18, 34] }
            : { opacity: 0, x: -18 }}
          transition={{ duration: 2.8, delay: index * 0.018, times: [0, 0.28, 0.55, 0.78, 1] }}
        />
      ))}
    </g>
  );
}

function BreachEffect({ breachActive, reduceMotion }: ConstraintBreachSceneProps) {
  return (
    <>
      <motion.circle
        className={styles.breachRing}
        cx="984" cy="306" r="133"
        initial={{ opacity: 0, scale: 0.84 }}
        animate={breachActive && !reduceMotion
          ? { opacity: [0, 0, 0, 0.94, 0], scale: [0.84, 0.84, 0.84, 1.05, 1.38] }
          : { opacity: 0 }}
        transition={{ duration: 2.8, times: [0, 0.6, 0.69, 0.79, 1] }}
        style={{ transformOrigin: '984px 306px' }}
      />
      <motion.path
        className={styles.breachFlash}
        d="M806 306H1160M984 128V486"
        initial={{ opacity: 0, scale: 0.84 }}
        animate={breachActive && !reduceMotion
          ? { opacity: [0, 0, 0.8, 0], scale: [0.84, 0.84, 1, 1.08] }
          : { opacity: 0, scale: 0.84 }}
        transition={{ duration: 2.8, times: [0, 0.68, 0.75, 0.86] }}
        style={{ transformOrigin: '984px 306px' }}
      />
    </>
  );
}

function DiagnosticShards({ breachActive, reduceMotion }: ConstraintBreachSceneProps) {
  return (
    <g className={styles.shards} filter="url(#shard-glow-v2)">
      {breachShards.map((shard, index) => (
        <g key={shard.id}>
          <motion.path
            d={shard.path}
            initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={breachActive
              ? reduceMotion
                ? { opacity: 0.72, x: shard.x * 0.44, y: shard.y * 0.44, rotate: shard.rotate }
                : {
                    opacity: [0, 0, 1, 1, 0.72],
                    x: [0, 0, shard.x * 0.28, shard.x * 0.62, shard.x],
                    y: [0, 0, shard.y * 0.22, shard.y * 0.56, shard.y],
                    rotate: [0, 0, shard.rotate * 0.22, shard.rotate * 0.58, shard.rotate]
                  }
              : { opacity: 0, x: 0, y: 0, rotate: 0 }}
            transition={{ duration: reduceMotion ? 0 : 2.8, delay: index * 0.014, times: [0, 0.66, 0.77, 0.88, 1], ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformOrigin: '984px 306px' }}
          />
          <motion.g
            className={styles.shardLabel}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={breachActive && !reduceMotion
              ? { opacity: [0, 0, 0, 0.86, 0], x: shard.x * 0.52, y: shard.y * 0.52 }
              : { opacity: 0, x: 0, y: 0 }}
            transition={{ duration: 2.8, delay: index * 0.014, times: [0, 0.73, 0.8, 0.91, 1] }}
          >
            <path d={`M984 306l${Math.sign(shard.x) * 34} ${Math.sign(shard.y || 1) * 22}`} />
            <text x={1018 + Math.sign(shard.x) * 4} y={330 + Math.sign(shard.y || 1) * 4}>{shard.label}</text>
          </motion.g>
        </g>
      ))}
    </g>
  );
}

export const ConstraintBreachScene = memo(function ConstraintBreachScene(props: ConstraintBreachSceneProps) {
  return (
    <motion.div
      className={styles.scene}
      initial={props.reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.72, delay: 0.24 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1240 620" role="presentation">
        <SceneDefinitions />
        <FieldGrid />
        <ConstraintWall {...props} />
        <SignalAnomaly {...props} />
        <VelocityField {...props} />
        <EngineeredInterceptor {...props} />
        <BreachEffect {...props} />
        <DiagnosticShards {...props} />
      </svg>
    </motion.div>
  );
});
