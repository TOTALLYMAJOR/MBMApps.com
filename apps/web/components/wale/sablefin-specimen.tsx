import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { SpecimenState } from './precision-model';
import styles from './precision.module.css';

type SpecimenStyle = CSSProperties & {
  '--specimen-reach': number;
  '--specimen-plates': number;
};

interface SablefinSpecimenProps {
  state: SpecimenState;
  variant?: 'SF-01' | 'SF-01A' | 'SF-01B';
  activeSurface?: string;
  compact?: boolean;
  ambient?: boolean;
  onInspect?: () => void;
}

const platePaths = [
  'M252 130L330 84L410 91L371 148Z',
  'M374 149L418 92L494 111L480 173Z',
  'M483 175L499 112L566 146L548 201Z',
  'M305 220L373 154L411 226L348 265Z',
  'M414 229L482 178L548 204L497 264Z',
  'M351 268L412 232L496 267L430 307Z',
  'M499 268L550 207L592 244L555 299Z',
  'M431 310L500 272L555 302L489 337Z',
  'M557 300L596 248L622 289L600 329Z'
] as const;

export const SablefinSpecimen = memo(function SablefinSpecimen({
  state,
  variant = 'SF-01',
  activeSurface,
  compact = false,
  ambient = false,
  onInspect
}: SablefinSpecimenProps) {
  const style = { '--specimen-reach': state.reach, '--specimen-plates': state.plates } as SpecimenStyle;
  return (
    <figure
      className={`${styles.specimen} ${compact ? styles.specimenCompact : ''} ${ambient ? styles.specimenAmbient : ''}`}
      data-architecture={state.architecturePreserved ? 'preserved' : 'open'}
      data-surface={activeSurface ?? 'whole'}
      style={style}
      aria-labelledby={`sablefin-caption-${variant}`}
    >
      <svg className={styles.specimenSvg} viewBox="0 0 760 430" role="img" aria-label={`${variant} SABLEFIN decision specimen; ${state.plates} component plates, ${state.branches} dependency branches`}>
        <defs>
          <pattern id={`wale-grid-${variant}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0H0V16" fill="none" stroke="currentColor" strokeOpacity=".08" strokeWidth="1" />
          </pattern>
          <clipPath id={`body-clip-${variant}`}>
            <path d="M143 207C221 122 365 80 511 105C592 118 650 155 676 198C690 221 685 245 660 265C619 297 566 316 501 330C360 360 231 310 143 235Z" />
          </clipPath>
        </defs>

        <g className={styles.datumField} aria-hidden="true">
          <path d="M18 214H728M172 46V382M657 72V362" />
          <path d="M40 199v30M88 204v20M136 199v30M184 204v20M232 199v30M280 204v20M328 199v30M376 204v20M424 199v30M472 204v20M520 199v30M568 204v20M616 199v30M664 204v20M712 199v30" />
          <text x="20" y="198">DATUM A</text><text x="666" y="198">X 01.000</text>
        </g>

        <g className={styles.branchField} aria-hidden="true">
          <path d="M344 109L304 58H235" /><path d="M467 109L502 53H590" />
          {state.branches >= 3 && <path d="M518 283L566 359H668" />}
          {state.branches >= 4 && <path d="M366 316L328 377H232" />}
          {!state.architecturePreserved && <><path className={styles.openBranch} d="M438 95L449 29H664" /><path className={styles.openBranch} d="M578 198L690 135H738" /><circle cx="690" cy="135" r="6" /></>}
        </g>

        <g className={styles.sablefinBody}>
          <path className={styles.tailFlukes} d="M153 211C110 210 68 191 28 182C36 205 54 219 83 223L65 227C51 235 40 248 34 263C76 254 114 239 153 233L170 223Z" />
          <path className={styles.bodyShell} d="M143 207C221 122 365 80 511 105C592 118 650 155 676 198C690 221 685 245 660 265C619 297 566 316 501 330C360 360 231 310 143 235Z" />
          <rect x="28" y="78" width="640" height="292" fill={`url(#wale-grid-${variant})`} clipPath={`url(#body-clip-${variant})`} />
          <path className={styles.structuralSpine} d="M144 221C270 214 421 210 636 218" />
          <path className={styles.structuralSeam} d="M256 137C287 169 299 225 277 294" />
          <path className={styles.dorsalKeel} d="M294 106L347 52L412 94M348 53l8 31M373 51l6 35M399 64l-2 29" />
          <path className={styles.pectoralFin} d="M455 300C479 336 507 360 544 370C530 328 510 296 483 276Z" />
          <path className={styles.tailNotch} d="M57 252L44 255L53 240" />
          {platePaths.map((path, index) => (
            <path key={path} d={path} className={styles.componentPlate} data-visible={index < state.plates ? 'true' : 'false'} />
          ))}
          <g className={styles.inspectionEye} transform="translate(565 183)">
            <circle r="27" /><circle r="11" /><path d="M-39 0H39M0-39V39" /><circle className={styles.eyeCore} r="4" />
          </g>
          <g className={styles.registrationMarks}>
            <g transform="translate(329 176)"><circle r="7" /><text x="13" y="5">S</text></g>
            <g transform="translate(428 232)"><circle r="7" /><text x="13" y="5">A</text></g>
            <g transform="translate(530 262)"><circle r="7" /><text x="13" y="5">E</text></g>
          </g>
        </g>

        <g className={styles.measurements} aria-hidden="true">
          <path d="M174 104V73H657V104M174 80H657" />
          <path d="M181 332v29h474v-29M181 354h474" />
          <text x="382" y="68">L / 0840</text><text x="377" y="378">REACH {Math.round(state.reach * 100)}%</text>
          {state.measurements >= 9 && <><path d="M259 132L210 88" /><text x="126" y="82">SEAM 04</text></>}
          {state.measurements >= 12 && <><path d="M548 201L681 119" /><text x="620" y="109">EYE DATUM</text></>}
          {state.measurements >= 15 && <><path d="M493 318L630 370" /><text x="628" y="389">PLATE TOL.</text></>}
        </g>

        <g className={styles.serialPlate} transform="translate(187 245)">
          <rect width="122" height="43" rx="2" /><text x="11" y="17">SABLEFIN</text><text x="11" y="34">{variant} / REV 04</text>
        </g>
      </svg>

      <figcaption id={`sablefin-caption-${variant}`} className={styles.specimenCaption}>
        <span><b>SABLEFIN</b> · {variant}</span>
        <span>DECISION SPECIMEN</span>
      </figcaption>
      {onInspect && (
        <button className={styles.inspectControl} type="button" onClick={onInspect}>
          <span aria-hidden="true">⌖</span> Inspect permissions plate
        </button>
      )}
    </figure>
  );
});
