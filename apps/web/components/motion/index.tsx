'use client';

/**
 * MBMApps landing motion system.
 *
 * One vocabulary, used everywhere on the portfolio landing:
 *  - glide easing for entrances, soft spring for pops
 *  - 26px rise, 80ms sibling stagger, viewport margin -64px
 *  - every primitive collapses to a simple fade (or nothing) under
 *    prefers-reduced-motion.
 */

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode
} from 'react';

export const EASE_GLIDE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const SPRING_POP = { type: 'spring', stiffness: 320, damping: 26, mass: 0.9 } as const;
export const RISE_DISTANCE = 26;
export const STAGGER = 0.08;
export const VIEWPORT_MARGIN = '-64px';

/**
 * The startup loader locks the body while its intro plays. The hero waits for
 * that lock to clear so its choreography is actually seen, not spent behind
 * the overlay.
 */
export function useIntroGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.body.classList.contains('is-locked')) {
      setReady(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains('is-locked')) {
        setReady(true);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const failSafe = window.setTimeout(() => setReady(true), 4500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failSafe);
    };
  }, []);

  return ready;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  play?: boolean;
  style?: CSSProperties;
};

/** Standard entrance: rise + fade with a soft blur clear. */
export function Reveal({ children, className, delay = 0, y = RISE_DISTANCE, once = true, play, style }: RevealProps) {
  const reducedMotion = useReducedMotion();

  const hidden = reducedMotion ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(7px)' };
  const shown = reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' };
  const transition = reducedMotion
    ? { duration: 0.2, delay }
    : { duration: 0.8, delay, ease: EASE_GLIDE };

  if (play !== undefined) {
    return (
      <motion.div className={className} style={style} initial={hidden} animate={play ? shown : hidden} transition={transition}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      whileInView={shown}
      viewport={{ once, margin: VIEWPORT_MARGIN }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

type RevealListProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: 'div' | 'ul' | 'ol' | 'dl';
};

const listVariants = {
  hidden: {},
  shown: {}
};

/** Stagger container; pair with <RevealItem>. */
export function RevealList({ children, className, delay = 0, stagger = STAGGER, once = true, as = 'div' }: RevealListProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, margin: VIEWPORT_MARGIN }}
      variants={listVariants}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'span';
  pop?: boolean;
};

/** Child of <RevealList>; rises in on the shared stagger. `pop` adds a soft spring overshoot. */
export function RevealItem({ children, className, as = 'div', pop = false }: RevealItemProps) {
  const reducedMotion = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  const variants = useMemo(() => {
    if (reducedMotion) {
      return {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.2 } }
      };
    }
    if (pop) {
      return {
        hidden: { opacity: 0, y: RISE_DISTANCE, scale: 0.92 },
        shown: { opacity: 1, y: 0, scale: 1, transition: SPRING_POP }
      };
    }
    return {
      hidden: { opacity: 0, y: RISE_DISTANCE },
      shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_GLIDE } }
    };
  }, [pop, reducedMotion]);

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}

type TitleRevealProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  play?: boolean;
  delay?: number;
};

/** Film-title style headline: each word rises and sharpens into place. */
export function TitleReveal({ text, className, as = 'h2', id, play, delay = 0 }: TitleRevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = motion[as] as typeof motion.h2;
  const words = useMemo(() => text.split(' '), [text]);

  const container = {
    hidden: {},
    shown: { transition: { staggerChildren: reducedMotion ? 0 : 0.055, delayChildren: delay } }
  };

  const word = reducedMotion
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.2 } }
      }
    : {
        hidden: { opacity: 0, y: '0.6em', filter: 'blur(9px)' },
        shown: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_GLIDE } }
      };

  const controlled = play !== undefined;

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      {...(controlled
        ? { animate: play ? 'shown' : 'hidden' }
        : { whileInView: 'shown', viewport: { once: true, margin: VIEWPORT_MARGIN } })}
      variants={container}
      aria-label={text}
    >
      {words.map((token, index) => (
        <span key={`${token}-${index}`} aria-hidden="true">
          <motion.span className="motion-word" variants={word}>
            {token}
          </motion.span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Component>
  );
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
};

/** Gentle scroll-linked drift for section visuals. */
export function Parallax({ children, className, distance = 42 }: ParallaxProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.6 });

  return (
    <motion.div ref={ref} className={className} style={reducedMotion ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/** Pointer-following 3D tilt with a spring settle. Fine pointers only. */
export function TiltCard({ children, className, maxTilt = 6 }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.6 });

  useEffect(() => {
    setFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const active = finePointer && !reducedMotion;

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width - 0.5;
      const py = (event.clientY - bounds.top) / bounds.height - 0.5;
      rotateX.set(-py * maxTilt * 2);
      rotateY.set(px * maxTilt * 2);
    },
    [maxTilt, rotateX, rotateY]
  );

  const onPointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', transformPerspective: 1100 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}

type CountUpProps = {
  value: string;
  className?: string;
  duration?: number;
};

/**
 * Signal value. Numeric values spring-count from zero when they enter the
 * viewport; non-numeric values ("Live", "v0.6.0") pop into place instead.
 */
export function CountUp({ value, className, duration = 1.4 }: CountUpProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-48px' });
  const parsed = useMemo(() => /^([0-9]+)(.*)$/.exec(value.trim()), [value]);
  const target = parsed ? Number.parseInt(parsed[1] ?? '0', 10) : 0;
  const suffix = parsed ? (parsed[2] ?? '') : '';
  const [display, setDisplay] = useState(() => (parsed && !reducedMotion ? 0 : target));

  useEffect(() => {
    if (!parsed || reducedMotion || !inView) {
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: EASE_GLIDE,
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return () => controls.stop();
  }, [duration, inView, parsed, reducedMotion, target]);

  if (!parsed) {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={reducedMotion ? { duration: 0.2 } : SPRING_POP}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {reducedMotion || !inView ? target : display}
      {suffix}
    </span>
  );
}

/** Scroll-driven vertical line for the story timelines. */
export function TimelineTrack({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.5'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <div ref={ref} className={className}>
      <motion.span
        className="portfolio-moment__line"
        aria-hidden="true"
        style={reducedMotion ? { scaleY: 1 } : { scaleY }}
      />
      {children}
    </div>
  );
}
