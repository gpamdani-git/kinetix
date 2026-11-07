export type SocialPlatform =
  | 'instagram-reel'
  | 'instagram-post'
  | 'x-landscape'
  | 'threads-portrait'
  | 'standard-4-3'
  | 'editorial-3-4';

export interface PlatformSpec {
  id: SocialPlatform;
  label: string;
  network: 'Instagram' | 'X' | 'Threads' | 'Studio';
  ratioLabel: '16:9' | '4:3' | '1:1' | '4:5' | '3:4' | '9:16';
  width: number;
  height: number;
  aspectRatio: number;
}

export const PLATFORM_SPECS: Record<SocialPlatform, PlatformSpec> = {
  'x-landscape': {
    id: 'x-landscape',
    label: 'Widescreen 16:9',
    network: 'X',
    ratioLabel: '16:9',
    width: 1920,
    height: 1080,
    aspectRatio: 16 / 9,
  },
  'standard-4-3': {
    id: 'standard-4-3',
    label: 'Classic 4:3',
    network: 'Studio',
    ratioLabel: '4:3',
    width: 1440,
    height: 1080,
    aspectRatio: 4 / 3,
  },
  'instagram-post': {
    id: 'instagram-post',
    label: 'Square 1:1',
    network: 'Instagram',
    ratioLabel: '1:1',
    width: 1080,
    height: 1080,
    aspectRatio: 1,
  },
  'threads-portrait': {
    id: 'threads-portrait',
    label: 'Portrait 4:5',
    network: 'Threads',
    ratioLabel: '4:5',
    width: 1080,
    height: 1350,
    aspectRatio: 4 / 5,
  },
  'editorial-3-4': {
    id: 'editorial-3-4',
    label: 'Editorial 3:4',
    network: 'Studio',
    ratioLabel: '3:4',
    width: 1080,
    height: 1440,
    aspectRatio: 3 / 4,
  },
  'instagram-reel': {
    id: 'instagram-reel',
    label: 'Vertical 9:16',
    network: 'Instagram',
    ratioLabel: '9:16',
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
  },
};

export type TemplateCategoryGroup =
  | '3d-perspective'
  | 'multiscene'
  | 'isometric'
  | 'orbit'
  | 'carousel-flow'
  | 'grid'
  | 'spotlight-focus'
  | 'reveal-wipe'
  | 'stack-scatter'
  | 'ui-transitions';

export type FormationType =
  // 1. 3D & PERSPECTIVE (12)
  | 'showcase-ring'
  | 'sphere-wall'
  | 'card-globe'
  | 'orbit-globe'
  | 'sphere-cascade'
  | 'totem-wall'
  | 'parallax-totem'
  | 'card-tunnel'
  | 'spiral-stream'
  | 'depth-stack'
  | 'cover-ring'
  | 'cover-ring-v'
  // 2. MULTISCENE (14)
  | 'flyby-rolodex'
  | 'bloom-belt'
  | 'lens-orbit'
  | 'stairway'
  | 'grid-dive'
  | 'pop-parade'
  | 'triple-scene'
  | 'collage-reel'
  | 'fan-shuffle'
  | 'sweep-ring'
  | 'scatter-dial'
  | 'grid-zoom'
  | 'spread-rows'
  | 'spread-columns'
  // 3. ISOMETRIC (3)
  | 'iso-cascade'
  | 'iso-focus'
  | 'iso-orbit'
  // 4. ORBIT (8)
  | 'orbit-showcase'
  | 'orbit-bloom'
  | 'orbit-carousel'
  | 'photo-orbit'
  | 'focus-orbit'
  | 'vortex-spin'
  | 'wheel-spin'
  | 'wheel-spin-arc'
  // 5. CAROUSEL & FLOW (10)
  | 'card-totem'
  | 'film-strip'
  | 'wheel-carousel'
  | 'cover-flow'
  | 'cover-flow-v'
  | 'carousel-flow'
  | 'diagonal-cascade'
  | 'focus-slider'
  | 'mosaic-marquee'
  | 'hero-reel'
  // 6. GRID (8)
  | 'grid-reveal'
  | 'spotlight-zoom'
  | 'flip-grid'
  | 'pop-grid'
  | 'ticker-loop'
  | 'ticker-tilt'
  | 'column-drift'
  | 'feed-scroll'
  // 7. SPOTLIGHT & FOCUS (4)
  | 'center-stage'
  | 'focus-shift'
  | 'deck-peel'
  | 'zoom-parallax'
  // 8. REVEAL & WIPE (4)
  | 'diagonal-wipe'
  | 'stripe-reveal'
  | 'split-reveal'
  | 'mosaic-wipe'
  // 9. STACK & SCATTER (7)
  | 'stack-slide'
  | 'cascade-drop'
  | 'cascade-diagonal'
  | 'image-trail'
  | 'poster-burst'
  | 'card-toss'
  | 'position-dance'
  // Legacy / UI Transition aliases for full backward compatibility
  | 'coverflow-stage'
  | 'bento-grid-morph'
  | 'spring-stack-rolodex'
  | 'dock-magnifier';

export type MotionPhysicsMode = 'spring' | 'ease-out' | 'linear';

export interface PositionSettings {
  padding: number;      // 0 - 25 (%)
  cornerRadius: number; // 0 - 25 (%)
  ringTilt: number;     // -45 to 45 (deg) - defaults to 0° level horizon
  ringOpening: number;  // 10 to 100 (%)
  ringSize: number;     // 30 to 130 (%)
  cardSize: number;     // 10 to 45 (%)
  backFade: number;     // 0 to 100 (%)
  perspective: number;  // 5 to 60 (%)
  cardRatio: 'Auto' | '1:1' | '4:3' | '3:4' | '4:5' | '16:9' | '9:16';
  shadow: boolean;
  // Emil Kowalski & transitions.dev physics parameters
  physicsMode?: MotionPhysicsMode;
  springStiffness?: number; // 120 - 600 (default 380)
  springDamping?: number;   // 12 - 60 (default 30)
  staggerMs?: number;       // 20 - 120 (default 45)
  clampScaleFloor?: boolean; // Emil Kowalski rule: never scale below 0.90
}

export const DEFAULT_POSITION_SETTINGS: PositionSettings = {
  padding: 6.0,
  cornerRadius: 3.5,
  ringTilt: 0,
  ringOpening: 52,
  ringSize: 82,
  cardSize: 22,
  backFade: 68,
  perspective: 22,
  cardRatio: '1:1',
  shadow: true,
  physicsMode: 'linear',
  springStiffness: 380,
  springDamping: 30,
  staggerMs: 45,
  clampScaleFloor: true,
};

export type AnimatableProperty =
  | 'padding'
  | 'cornerRadius'
  | 'ringTilt'
  | 'ringOpening'
  | 'ringSize'
  | 'cardSize'
  | 'backFade'
  | 'perspective';

export interface PropertyKeyframe {
  id: string;
  property: AnimatableProperty;
  label: string;
  time: number; // seconds
  value: number;
}

export interface MediaSlot {
  id: string;
  slotIndex: number;
  title: string;
  subtitle: string;
  assetId: string;
  accentColor: string;
  badgeText?: string;
}

export type CubicBezier = [number, number, number, number];

export interface EasingPreset {
  id: string;
  label: string;
  bezier: CubicBezier;
  description: string;
  authorTag?: string;
}

export const EASING_PRESETS: EasingPreset[] = [
  {
    id: 'emil-quint-out',
    label: 'Emil Quint Out',
    bezier: [0.23, 1, 0.32, 1],
    description: 'Emil Kowalski signature UI entrance with organic deceleration',
    authorTag: 'emilkowalski',
  },
  {
    id: 'linear-snap',
    label: 'Expo Out',
    bezier: [0.16, 1, 0.3, 1],
    description: 'High-velocity entrance with crisp studio settle',
    authorTag: 'transitions.dev',
  },
  {
    id: 'transitions-morph',
    label: 'Quart In-Out',
    bezier: [0.77, 0, 0.175, 1],
    description: 'transitions.dev symmetrical layout morphing & resize curve',
    authorTag: 'transitions.dev',
  },
  {
    id: 'spring-overshoot',
    label: 'Spring Overshoot',
    bezier: [0.34, 1.56, 0.64, 1],
    description: 'Low-damping playful spring settle for focal badges',
    authorTag: 'transitions.dev',
  },
  {
    id: 'smooth-cinema',
    label: 'Cinema S-Curve',
    bezier: [0.65, 0, 0.35, 1],
    description: 'Balanced on-screen camera pan and depth transition',
    authorTag: 'emilkowalski',
  },
  {
    id: 'gentle-drift',
    label: 'Editorial Drift',
    bezier: [0.25, 1, 0.5, 1],
    description: 'Subtle high-craft Quart Out pacing for typography',
    authorTag: 'emilkowalski',
  },
];

export type AnimationType =
  | 'slide-up'
  | 'fade-scale'
  | 'kinetic-pop'
  | 'flip-3d'
  | 'glitch-snap'
  | 'float-wave'
  | 'spin-reveal';

export type LoopEffect = 'none' | 'pulse' | 'float' | 'rotate' | 'shimmer';

export type LayerType = 'text' | 'image' | 'shape' | 'metric';

export interface ImageFilters {
  brightness: number; // 50 - 150
  contrast: number;   // 50 - 150
  saturation: number; // 0 - 200
  blur: number;       // 0 - 20
  hueRotate: number;  // 0 - 360
  tintColor: string;
  tintOpacity: number; // 0 - 1
}

export interface ImageAsset {
  id: string;
  name: string;
  category: 'Product' | 'Background' | 'Avatar' | 'Brand' | 'Custom';
  url: string;
  width: number;
  height: number;
  filters: ImageFilters;
  createdAt: string;
}

export interface MotionLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
  borderRadius: number;
  text?: string;
  subtext?: string;
  fontSize: number;
  fontWeight: number;
  textAlign?: 'left' | 'center' | 'right';
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  assetId?: string;
  imageFilters?: ImageFilters;
  animationType: AnimationType;
  startTime: number;
  duration: number;
  entryDuration: number;
  exitAnimation: boolean;
  speed: number;
  bezier: CubicBezier;
  easingPreset: string;
  loopEffect: LoopEffect;
}

export interface MotionScene {
  id: string;
  name: string;
  referenceSubtitle?: string;
  category: 'Instagram' | 'X' | 'Threads' | 'Launch';
  templateGroup?: TemplateCategoryGroup;
  motionBadge?: 'SPRING' | 'EASE-OUT' | '3D' | 'MORPH' | 'NEW' | 'PRO';
  isNew?: boolean;
  formation?: FormationType;
  description: string;
  platform: SocialPlatform;
  fps: 30 | 60;
  duration: number;
  backgroundMode?: 'colour' | 'gradient' | 'image';
  backgroundColor: string;
  backgroundSecondaryColor?: string;
  backgroundGradientAngle?: number;
  backgroundGradientType?: 'linear' | 'radial';
  backgroundGradient?: string;
  backgroundImageUrl?: string;
  backgroundBlur?: number; // 0 - 40px
  backgroundDim?: number;  // 0 - 90%
  accentColor: string;
  showGridOverlay: boolean;
  slotCount?: number;
  positionSettings?: PositionSettings;
  keyframes?: PropertyKeyframe[];
  logoUrl?: string;
  layers: MotionLayer[];
}

export interface ComputedLayerFrame {
  visible: boolean;
  activeInTimeline: boolean;
  progress: number;
  easedEntry: number;
  translateX: number;
  translateY: number;
  scale: number;
  rotation: number;
  opacity: number;
  skewX: number;
  perspectiveRotateX: number;
}

export interface ComputedSlot3DTransform {
  slotIndex: number;
  translateX: number; // px relative to stage center
  translateY: number; // px relative to stage center
  translateZ: number; // px depth
  rotateX: number;    // deg
  rotateY: number;    // deg
  rotateZ: number;    // deg
  scale: number;
  opacity: number;
  zIndex: number;
  blurPx?: number;    // Optical depth-of-field blur (0 - 3px)
  isHeroFocus?: boolean;
}

/**
 * Helper: Computes exact CSS gradient string from a `MotionScene` configuration.
 */
export function resolveSceneGradientCss(scene: MotionScene): string {
  if (scene.backgroundGradient && !scene.backgroundSecondaryColor) {
    return scene.backgroundGradient;
  }
  const c1 = scene.backgroundColor || '#141829';
  const c2 = scene.backgroundSecondaryColor || '#090a0f';
  const angle = scene.backgroundGradientAngle ?? 135;
  const gType = scene.backgroundGradientType || 'linear';
  if (gType === 'radial') {
    return `radial-gradient(circle at 50% 35%, ${c1} 0%, ${c2} 85%)`;
  }
  return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
}

/**
 * Helper: Computes width & height for a card given `baseSizePx` and `cardRatio`.
 */
export function getCardAspectDimensions(
  baseSizePx: number,
  cardRatio: PositionSettings['cardRatio']
): { width: number; height: number } {
  switch (cardRatio) {
    case '16:9':
      return { width: Math.round(baseSizePx * 1.24), height: Math.round(baseSizePx * 0.7) };
    case '4:3':
      return { width: Math.round(baseSizePx * 1.12), height: Math.round(baseSizePx * 0.84) };
    case '3:4':
      return { width: Math.round(baseSizePx * 0.86), height: Math.round(baseSizePx * 1.15) };
    case '4:5':
      return { width: Math.round(baseSizePx * 0.88), height: Math.round(baseSizePx * 1.1) };
    case '9:16':
      return { width: Math.round(baseSizePx * 0.74), height: Math.round(baseSizePx * 1.32) };
    case '1:1':
    case 'Auto':
    default:
      return { width: Math.round(baseSizePx), height: Math.round(baseSizePx) };
  }
}

/**
 * Evaluates a cubic-bezier(p1x, p1y, p2x, p2y) curve at normalized time x in [0, 1].
 */
export function evaluateCubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  x: number
): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  if (p1x === p1y && p2x === p2y) return x;

  const sampleCurveX = (t: number): number => {
    const invT = 1 - t;
    return 3 * invT * invT * t * p1x + 3 * invT * t * t * p2x + t * t * t;
  };

  const sampleCurveY = (t: number): number => {
    const invT = 1 - t;
    return 3 * invT * invT * t * p1y + 3 * invT * t * t * p2y + t * t * t;
  };

  const sampleCurveDerivativeX = (t: number): number => {
    const invT = 1 - t;
    return (
      3 * invT * invT * p1x +
      6 * invT * t * (p2x - p1x) +
      3 * t * t * (1 - p2x)
    );
  };

  let t2 = x;
  for (let i = 0; i < 8; i++) {
    const x2 = sampleCurveX(t2) - x;
    if (Math.abs(x2) < 1e-6) break;
    const d2 = sampleCurveDerivativeX(t2);
    if (Math.abs(d2) < 1e-6) break;
    t2 = t2 - x2 / d2;
  }

  t2 = Math.max(0, Math.min(1, t2));

  let t0 = 0;
  let t1 = 1;
  for (let i = 0; i < 8; i++) {
    const x2 = sampleCurveX(t2);
    if (Math.abs(x2 - x) < 1e-6) break;
    if (x > x2) {
      t0 = t2;
    } else {
      t1 = t2;
    }
    t2 = (t1 + t0) * 0.5;
  }

  return sampleCurveY(t2);
}

/**
 * Evaluates a damped harmonic oscillator (Spring Physics) for `t` in [0, 1].
 */
export function evaluateSpringPhysics(
  t: number,
  stiffness = 380,
  damping = 30,
  mass = 1
): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const omega0 = Math.sqrt(stiffness / Math.max(0.1, mass));
  const zeta = damping / (2 * Math.sqrt(stiffness * Math.max(0.1, mass)));
  const physicalTime = t * 0.65;

  if (zeta < 1) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const envelope = Math.exp(-zeta * omega0 * physicalTime);
    const osc =
      Math.cos(omegaD * physicalTime) +
      ((zeta * omega0) / omegaD) * Math.sin(omegaD * physicalTime);
    return 1 - envelope * osc;
  } else {
    const envelope = Math.exp(-omega0 * physicalTime);
    return 1 - envelope * (1 + omega0 * physicalTime);
  }
}

/**
 * Smooth periodic step function with spring/bezier transitions between discrete focal steps.
 */
/**
 * Smooth periodic step function with Continuous, Spring, or Quint-Out transitions.
 */
function computeChoreographedPhase(
  currentTime: number,
  duration: number,
  slotCount: number,
  physicsMode: MotionPhysicsMode = 'linear',
  stiffness = 380,
  damping = 30
): { continuousAngle: number; steppedIndex: number; stepFraction: number; normLoopTime: number } {
  const safeDur = Math.max(1, duration);
  const normTime = (((currentTime % safeDur) + safeDur) % safeDur) / safeDur;

  if (physicsMode === 'linear') {
    return {
      continuousAngle: normTime * Math.PI * 2,
      steppedIndex: normTime * slotCount,
      stepFraction: (normTime * slotCount) % 1,
      normLoopTime: normTime,
    };
  }

  const totalSteps = Math.max(4, slotCount);
  const rawStep = normTime * totalSteps;
  const wholeStep = Math.floor(rawStep);
  const frac = rawStep - wholeStep;

  const transitionWindow = 0.72;
  let easedFrac = 1;
  if (frac < transitionWindow) {
    const localT = frac / transitionWindow;
    easedFrac =
      physicsMode === 'spring'
        ? evaluateSpringPhysics(localT, stiffness, damping, 1)
        : evaluateCubicBezier(0.23, 1, 0.32, 1, localT);
  }

  const steppedIndex = wholeStep + easedFrac;
  const continuousAngle = (steppedIndex / totalSteps) * Math.PI * 2;
  return {
    continuousAngle,
    steppedIndex,
    stepFraction: easedFrac,
    normLoopTime: normTime,
  };
}

/**
 * Raised-cosine boundary envelope for linear/conveyor/scrolling formations.
 * Given `normCoord` in [-0.5, +0.5], returns 1.0 in the safe center [-fadeStart, +fadeStart]
 * and smoothly tapers to 0.0 at ±0.5 so cards never teleport across the screen on wrap-around.
 */
function computeWrapEdgeEnvelope(normCoord: number, fadeStart = 0.34): number {
  const a = Math.abs(normCoord);
  if (a <= fadeStart) return 1;
  if (a >= 0.495) return 0;
  const t = (a - fadeStart) / (0.495 - fadeStart);
  return 0.5 * (1 + Math.cos(t * Math.PI));
}

/**
 * Continuous circular Gaussian proximity weight in [0, 1].
 * Eliminates 1-frame integer snapping when highlighting or zooming the active card.
 */
function computeCircularFocusWeight(
  slotIndex: number,
  activeIndex: number,
  count: number,
  sharpness = 1.65
): number {
  let d = Math.abs(slotIndex - ((activeIndex % count + count) % count));
  if (d > count / 2) d = count - d;
  return Math.exp(-(d * d) * sharpness);
}

/**
 * Interpolates keyframed position settings at `currentTime`.
 */
export function resolvePositionSettingsAtTime(
  base: PositionSettings,
  keyframes: PropertyKeyframe[] | undefined,
  currentTime: number
): PositionSettings {
  if (!keyframes || keyframes.length === 0) return base;
  const resolved = { ...base };

  const byProp = new Map<AnimatableProperty, PropertyKeyframe[]>();
  for (const kf of keyframes) {
    const list = byProp.get(kf.property) || [];
    list.push(kf);
    byProp.set(kf.property, list);
  }

  for (const [prop, list] of byProp.entries()) {
    list.sort((a, b) => a.time - b.time);
    if (list.length === 1) {
      resolved[prop] = list[0].value;
      continue;
    }
    if (currentTime <= list[0].time) {
      resolved[prop] = list[0].value;
      continue;
    }
    if (currentTime >= list[list.length - 1].time) {
      resolved[prop] = list[list.length - 1].value;
      continue;
    }
    for (let i = 0; i < list.length - 1; i++) {
      const k0 = list[i];
      const k1 = list[i + 1];
      if (currentTime >= k0.time && currentTime <= k1.time) {
        const span = Math.max(0.01, k1.time - k0.time);
        const rawT = (currentTime - k0.time) / span;
        const eased = evaluateCubicBezier(0.23, 1, 0.32, 1, rawT);
        resolved[prop] = Number((k0.value + (k1.value - k0.value) * eased).toFixed(2));
        break;
      }
    }
  }

  return resolved;
}

/**
 * Computes studio-grade, non-overlapping 3D & UI Transition card slot coordinates at `currentTime`
 * across all 70 templates and 9 categories.
 * Every template has its own distinct mathematical choreography with zero wrap-around teleportation.
 */
export function computeFormationSlotTransforms(
  formation: FormationType,
  slotCount: number,
  pos: PositionSettings,
  currentTime: number,
  duration: number,
  stageWidth: number,
  stageHeight: number
): ComputedSlot3DTransform[] {
  const count = Math.max(1, Math.min(16, slotCount));
  const padScale = Math.max(0.65, 1 - (pos.padding || 0) * 0.014);
  const effW = stageWidth * padScale;
  const effH = stageHeight * padScale;
  const minDim = Math.min(effW, effH);

  const baseRadius = minDim * 0.35 * (pos.ringSize / 80);
  const tiltDeg = pos.ringTilt || 0;
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const openingRatio = Math.max(0.2, pos.ringOpening / 55);

  const { continuousAngle, steppedIndex, normLoopTime } = computeChoreographedPhase(
    currentTime,
    duration,
    count,
    pos.physicsMode || 'linear',
    pos.springStiffness ?? 380,
    pos.springDamping ?? 30
  );

  const results: ComputedSlot3DTransform[] = [];

  for (let i = 0; i < count; i++) {
    const normIdx = i / count;
    const theta = normIdx * Math.PI * 2 - continuousAngle;

    let x = 0;
    let y = 0;
    let z = 0;
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let customScale: number | null = null;
    let customOpacity: number | null = null;
    let isHeroFocus = false;

    // Signed circular offset in [-count/2, +count/2] and normalized [-0.5, +0.5]
    let relOffset = (i - (steppedIndex % count) + count) % count;
    if (relOffset > count / 2) relOffset -= count;
    const absOffset = Math.abs(relOffset);
    const normRel = relOffset / count; // [-0.5, +0.5]
    const edgeEnv = computeWrapEdgeEnvelope(normRel, 0.34);
    const focusW = computeCircularFocusWeight(i, steppedIndex, count, 1.55);

    switch (formation) {
      // ======================================================================
      // 1. 3D & PERSPECTIVE (12 DISTINCT FORMATIONS)
      // ======================================================================
      case 'showcase-ring': {
        const ringX = Math.cos(theta) * baseRadius * 1.06;
        const ringY = Math.sin(theta) * baseRadius * 0.44 * openingRatio;
        z = Math.sin(theta) * baseRadius * 0.92;
        x = ringX * Math.cos(tiltRad) - ringY * Math.sin(tiltRad);
        y = ringX * Math.sin(tiltRad) + ringY * Math.cos(tiltRad);
        rotY = -Math.cos(theta) * 24;
        rotX = -Math.sin(theta) * 10 * openingRatio;
        rotZ = tiltDeg * 0.45;
        isHeroFocus = Math.sin(theta) > 0.82;
        break;
      }

      case 'sphere-wall': {
        // Concave IMAX dome matrix panning smoothly
        const cols = 4;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const panLon = ((col - (cols - 1) / 2) / cols) * 1.35 + Math.sin(continuousAngle) * 0.32;
        const lat = ((row - (rows - 1) / 2) / Math.max(1, rows)) * 0.95;
        const r = baseRadius * 1.24;

        x = Math.sin(panLon) * Math.cos(lat) * r;
        y = Math.sin(lat) * r * 0.78 * openingRatio;
        z = (1 - Math.cos(panLon) * Math.cos(lat)) * r * 0.65 - baseRadius * 0.15;
        rotY = (-panLon * 180) / Math.PI * 0.65;
        rotX = (lat * 180) / Math.PI * 0.5 + tiltDeg * 0.25;
        rotZ = tiltDeg * 0.15;
        isHeroFocus = Math.abs(panLon) < 0.28 && Math.abs(lat) < 0.25;
        customScale = 0.88;
        break;
      }

      case 'card-globe': {
        // Convex Fibonacci geodesic sphere spinning 360°
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const ySphere = 1 - ((i + 0.5) / count) * 1.75;
        const radiusAtY = Math.sqrt(Math.max(0.05, 1 - ySphere * ySphere));
        const lonAngle = i * goldenAngle + continuousAngle;
        const r = baseRadius * 1.06;

        x = Math.cos(lonAngle) * radiusAtY * r;
        y = ySphere * r * 0.82 * openingRatio;
        z = Math.sin(lonAngle) * radiusAtY * r;
        rotY = -Math.cos(lonAngle) * 32;
        rotX = ySphere * 22 + tiltDeg * 0.25;
        rotZ = tiltDeg * 0.2;
        isHeroFocus = z > r * 0.6;
        break;
      }

      case 'orbit-globe': {
        // Dual-shell counter-rotating 3D core cluster
        const isInner = i < Math.floor(count / 2);
        const shellCount = isInner ? Math.floor(count / 2) : count - Math.floor(count / 2);
        const shellIdx = isInner ? i : i - Math.floor(count / 2);
        const dir = isInner ? 1 : -1;
        const angle = (shellIdx / Math.max(1, shellCount)) * Math.PI * 2 + continuousAngle * dir;
        const r = baseRadius * (isInner ? 0.52 : 0.96);
        const elev = Math.sin(angle * 2 + (isInner ? 0 : 1.2)) * baseRadius * 0.36 * openingRatio;

        x = Math.cos(angle) * r;
        y = elev;
        z = Math.sin(angle) * r;
        rotY = -Math.cos(angle) * 22;
        rotX = (elev / Math.max(1, baseRadius)) * -20 + tiltDeg * 0.25;
        rotZ = tiltDeg * 0.2;
        isHeroFocus = z > baseRadius * 0.55;
        customScale = isInner ? 0.92 : 1.02;
        break;
      }

      case 'sphere-cascade': {
        // Spherical meridian waterfall with smooth polar wrap fade
        const cols = 4;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const vNorm = (((row / rows) + normLoopTime + col * 0.15) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);
        const lat = vNorm * Math.PI * 0.82;
        const lon = ((col - (cols - 1) / 2) / cols) * Math.PI * 0.72;
        const r = baseRadius * 1.15;

        x = Math.sin(lon) * Math.cos(lat) * r;
        y = Math.sin(lat) * r * 0.88 * openingRatio;
        z = Math.cos(lon) * Math.cos(lat) * r - r * 0.35;
        rotY = ((lon * 180) / Math.PI) * 0.5;
        rotX = -((lat * 180) / Math.PI) * 0.45 + tiltDeg * 0.25;
        isHeroFocus = Math.abs(vNorm) < 0.16 && (col === 1 || col === 2);
        customScale = 0.82 * (0.85 + 0.15 * env);
        customOpacity = env;
        break;
      }

      case 'totem-wall': {
        // 3-column architectural monolith wall with smooth boundary wrap
        const cols = 3;
        const col = i % cols;
        const rowsPerCol = Math.max(1, Math.ceil(count / cols));
        const row = Math.floor(i / cols);
        const dir = col === 1 ? -1 : 1;
        const vNorm = (((row / rowsPerCol) + normLoopTime * dir + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);

        x = (col - 1) * baseRadius * 0.82;
        y = vNorm * effH * 0.78;
        z = (col === 1 ? 36 : -18) * openingRatio - (1 - env) * 60;
        rotY = (col - 1) * -12;
        rotX = tiltDeg * 0.25;
        isHeroFocus = col === 1 && Math.abs(vNorm) < 0.16;
        customScale = (col === 1 ? 0.96 : 0.86) * (0.86 + 0.14 * env);
        customOpacity = env;
        break;
      }

      case 'parallax-totem': {
        // Multi-plane deep Z-space pillars gliding horizontally in parallax
        const plane = i % 3; // 0: back, 1: mid, 2: front
        const idxInPlane = Math.floor(i / 3);
        const totalInPlane = Math.max(1, Math.ceil(count / 3));
        const speedMult = plane === 2 ? 1.0 : plane === 1 ? -0.65 : 0.45;
        const hNorm = (((idxInPlane / totalInPlane) + normLoopTime * speedMult + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(hNorm, 0.33);

        x = hNorm * effW * 0.82;
        y = (plane - 1) * baseRadius * 0.52 * openingRatio;
        z = (plane - 1) * baseRadius * 0.55;
        rotY = -hNorm * 16;
        rotX = tiltDeg * 0.25;
        isHeroFocus = plane === 2 && Math.abs(hNorm) < 0.18;
        customScale = (0.78 + plane * 0.14) * (0.86 + 0.14 * env);
        customOpacity = (0.45 + plane * 0.27) * env;
        break;
      }

      case 'card-tunnel': {
        // 4-wall infinite wormhole corridor flying toward camera with smooth fade
        const depthLoop = (normIdx + normLoopTime) % 1; // 0 (far) -> 1 (near camera)
        const nearFarEnv = Math.sin(depthLoop * Math.PI); // 0 at 0 and 1, 1.0 at mid-tunnel
        const wall = i % 4;
        const anchors = [
          { ax: -1, ay: -0.68, ry: 22, rx: -12 },
          { ax: 1, ay: -0.68, ry: -22, rx: -12 },
          { ax: 1, ay: 0.68, ry: -22, rx: 12 },
          { ax: -1, ay: 0.68, ry: 22, rx: 12 },
        ];
        const a = anchors[wall];
        const r = baseRadius * (0.18 + Math.pow(depthLoop, 1.35) * 1.05);

        x = a.ax * r;
        y = a.ay * r * openingRatio;
        z = (depthLoop - 0.45) * baseRadius * 1.9;
        rotY = a.ry;
        rotX = a.rx + tiltDeg * 0.2;
        rotZ = tiltDeg * 0.2;
        isHeroFocus = depthLoop > 0.58 && depthLoop < 0.82;
        customScale = 0.45 + depthLoop * 0.72;
        customOpacity = Math.pow(nearFarEnv, 0.65);
        break;
      }

      case 'spiral-stream': {
        // Vertical 3D DNA helix ribbon with smooth top/bottom boundary fade
        const vNorm = ((normIdx + normLoopTime) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.34);
        const helixAngle = vNorm * Math.PI * 2.8 + (i % 2) * 0.4;

        x = Math.sin(helixAngle) * baseRadius * 0.86;
        y = vNorm * effH * 0.78 * openingRatio;
        z = Math.cos(helixAngle) * baseRadius * 0.82;
        rotY = -Math.sin(helixAngle) * 26;
        rotX = tiltDeg * 0.25;
        rotZ = Math.cos(helixAngle) * 8 + tiltDeg * 0.15;
        isHeroFocus = Math.abs(vNorm) < 0.14 && z > 0;
        customOpacity = env;
        break;
      }

      case 'depth-stack': {
        // Z-Space starfield drift: cards travel forward from deep space to foreground
        const zProgress = (normIdx + normLoopTime) % 1; // 0 (deep) -> 1 (near)
        const env = Math.sin(zProgress * Math.PI);
        const golden = i * 2.39996;
        const radialSpread = baseRadius * (0.28 + (i % 4) * 0.18) * (0.55 + zProgress * 0.65);

        x = Math.cos(golden) * radialSpread;
        y = Math.sin(golden) * radialSpread * 0.78 * openingRatio;
        z = (zProgress - 0.48) * baseRadius * 2.1;
        rotX = tiltDeg * 0.25;
        rotY = Math.cos(golden) * -10;
        isHeroFocus = zProgress > 0.62 && zProgress < 0.84;
        customScale = 0.42 + zProgress * 0.78;
        customOpacity = Math.pow(env, 0.6);
        break;
      }

      case 'cover-ring': {
        // Closed 360° horizontal cylinder ring (cards face outward around a panoramic drum)
        x = Math.sin(theta) * baseRadius * 1.12;
        y = Math.sin(tiltRad) * Math.cos(theta) * baseRadius * 0.38 * openingRatio;
        z = Math.cos(theta) * baseRadius * 0.95;
        rotY = (Math.sin(theta) * 38);
        rotX = tiltDeg * 0.3;
        isHeroFocus = Math.cos(theta) > 0.84;
        customScale = Math.cos(theta) > 0.75 ? 1.12 : 0.88;
        break;
      }

      case 'cover-ring-v': {
        // Closed 360° vertical cylinder drum rotating top-to-bottom
        x = Math.sin(tiltRad) * Math.sin(theta) * baseRadius * 0.28;
        y = Math.sin(theta) * baseRadius * 0.96 * openingRatio;
        z = Math.cos(theta) * baseRadius * 0.92;
        rotX = -Math.sin(theta) * 34 + tiltDeg * 0.25;
        rotY = 0;
        isHeroFocus = Math.cos(theta) > 0.84;
        customScale = Math.cos(theta) > 0.75 ? 1.12 : 0.86;
        break;
      }

      // ======================================================================
      // 2. MULTISCENE (14 DISTINCT FORMATIONS)
      // ======================================================================
      case 'flyby-rolodex': {
        // Bottom-hinged 3D mechanical rolodex flipping forward
        const cycle = ((i - steppedIndex) % count + count) % count;
        const normFlip = cycle / count; // 0 is front hero, Flipping down as normFlip -> 1
        // Smooth circular visibility over front 5 cards
        const vis = Math.exp(-Math.pow(normFlip * 2.6, 2)) + Math.exp(-Math.pow((1 - normFlip) * 3.8, 2)) * 0.7;
        const flipPhase = normFlip > 0.75 ? -(1 - normFlip) * 4 : normFlip * 1.8;

        x = Math.sin(tiltRad) * flipPhase * 18;
        y = flipPhase * baseRadius * 0.34 * openingRatio;
        z = (0.75 - Math.abs(flipPhase) * 0.65) * baseRadius;
        rotX = -flipPhase * 42 + tiltDeg * 0.25;
        isHeroFocus = Math.abs(flipPhase) < 0.22;
        customScale = Math.max(0.7, 1.12 - Math.abs(flipPhase) * 0.14);
        customOpacity = Math.max(0.08, Math.min(1, vis));
        break;
      }

      case 'bloom-belt': {
        // Infinity figure-8 (Lissajous) 3D ribbon belt
        x = Math.sin(theta) * baseRadius * 1.14;
        y = Math.sin(theta * 2) * baseRadius * 0.48 * openingRatio;
        z = Math.cos(theta) * baseRadius * 0.88;
        rotY = -Math.cos(theta) * 28;
        rotX = Math.cos(theta * 2) * 14 + tiltDeg * 0.25;
        rotZ = Math.sin(theta) * 8 + tiltDeg * 0.2;
        isHeroFocus = Math.cos(theta) > 0.82;
        customScale = 0.84 + Math.max(0, Math.cos(theta)) * 0.32;
        break;
      }

      case 'lens-orbit': {
        // Breathing camera-aperture iris ring
        const breath = 0.72 + 0.32 * Math.sin(continuousAngle * 2);
        const r = baseRadius * breath;
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r * 0.82 * openingRatio;
        z = Math.sin(theta - continuousAngle) * baseRadius * 0.45 + focusW * baseRadius * 0.45;
        rotZ = ((theta * 180) / Math.PI) * 0.25 + tiltDeg * 0.3;
        rotY = -Math.cos(theta) * 18;
        isHeroFocus = focusW > 0.65;
        customScale = 0.84 + focusW * 0.34;
        break;
      }

      case 'stairway': {
        // 4-column diagonal stepped architectural escalator ascending smoothly
        const cols = 4;
        const col = i % cols;
        const rows = Math.max(1, Math.ceil(count / cols));
        const row = Math.floor(i / cols);
        const vNorm = (((row / rows) - normLoopTime + col * 0.18 + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);

        x = (col - 1.5) * baseRadius * 0.62;
        y = vNorm * effH * 0.72 + (col - 1.5) * 18 * openingRatio;
        z = (1 - Math.abs(vNorm) * 1.4) * baseRadius * 0.65 + (col - 1.5) * 14;
        rotX = 12 + tiltDeg * 0.25;
        rotY = -12;
        isHeroFocus = (col === 1 || col === 2) && Math.abs(vNorm) < 0.18;
        customScale = 0.86 * (0.85 + 0.15 * env);
        customOpacity = env;
        break;
      }

      case 'grid-dive': {
        // 3×3 matrix plunging in Z-space with continuous focus wave
        const cols = 3;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const spacingX = baseRadius * 0.74;
        const spacingY = baseRadius * 0.68 * openingRatio;

        x = (col - 1) * spacingX * (1 - focusW * 0.35);
        y = (row - (rows - 1) / 2) * spacingY * (1 - focusW * 0.35);
        z = -baseRadius * 0.25 + focusW * baseRadius * 0.95;
        rotX = tiltDeg * 0.3;
        rotY = (col - 1) * -8 * (1 - focusW);
        isHeroFocus = focusW > 0.6;
        customScale = 0.84 + focusW * 0.38;
        customOpacity = 0.58 + focusW * 0.42;
        break;
      }

      case 'pop-parade': {
        // Choreographed parade arc where center card leaps up and pops forward
        const leap = Math.exp(-(relOffset * relOffset) / 1.2);
        x = relOffset * baseRadius * 0.44;
        y = (1 - leap) * baseRadius * 0.32 * openingRatio - leap * baseRadius * 0.22;
        z = (leap * 1.35 - 0.35) * baseRadius * 0.85;
        rotZ = relOffset * 4.5 + tiltDeg * 0.2;
        rotY = -relOffset * 12;
        isHeroFocus = leap > 0.7;
        customScale = (0.76 + leap * 0.44) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv * (0.4 + leap * 0.6);
        break;
      }

      case 'triple-scene': {
        // 3-window diagonal triptych stage cycling all cards smoothly
        const lane = i % 3; // 0: top-left, 1: center hero, 2: bottom-right
        const idxInLane = Math.floor(i / 3);
        const totalInLane = Math.max(1, Math.ceil(count / 3));
        const lanePhase = ((idxInLane + normLoopTime * totalInLane + lane * 0.33) % totalInLane) / totalInLane;
        const activePulse = Math.exp(-Math.pow((lanePhase - 0.5) * 3.8, 2));

        x = (lane - 1) * baseRadius * 0.76;
        y = (lane - 1) * baseRadius * 0.44 * openingRatio + (lanePhase - 0.5) * 28;
        z = (lane === 1 ? 45 : 0) + activePulse * baseRadius * 0.55 - (1 - activePulse) * baseRadius * 0.6;
        rotY = (1 - lane) * 10;
        rotX = tiltDeg * 0.25;
        isHeroFocus = lane === 1 && activePulse > 0.65;
        customScale = (lane === 1 ? 1.08 : 0.88) * (0.78 + 0.28 * activePulse);
        customOpacity = Math.max(0.08, activePulse);
        break;
      }

      case 'collage-reel': {
        // Overlapping 5-card editorial magazine montage with smooth cycling
        const anchors = [
          { ax: 0, ay: 0, az: 0.85, sc: 1.18, rz: 0 },
          { ax: -0.68, ay: -0.36, az: 0.25, sc: 0.86, rz: -4 },
          { ax: 0.68, ay: -0.32, az: 0.18, sc: 0.84, rz: 4 },
          { ax: -0.62, ay: 0.42, az: 0.12, sc: 0.82, rz: 3 },
          { ax: 0.64, ay: 0.38, az: 0.32, sc: 0.88, rz: -3 },
        ];
        const anchor = anchors[i % anchors.length];
        const groupWave = computeCircularFocusWeight(i, steppedIndex, count, 0.9);

        x = anchor.ax * baseRadius * (1.08 - groupWave * 0.22);
        y = anchor.ay * baseRadius * openingRatio * (1.08 - groupWave * 0.22);
        z = (anchor.az * 0.5 + groupWave * 0.65 - 0.2) * baseRadius;
        rotZ = anchor.rz * (1 - groupWave * 0.5) + tiltDeg * 0.2;
        rotX = tiltDeg * 0.25;
        isHeroFocus = groupWave > 0.72;
        customScale = anchor.sc * (0.82 + groupWave * 0.26);
        customOpacity = Math.max(0.15, 0.32 + groupWave * 0.68);
        break;
      }

      case 'fan-shuffle': {
        // 3-row staggered brick shuffle with alternating horizontal flow & smooth edge wrap
        const rows = 3;
        const row = i % rows;
        const colsInRow = Math.max(1, Math.ceil(count / rows));
        const col = Math.floor(i / rows);
        const dir = row === 1 ? -1 : 1;
        const hNorm = (((col / colsInRow) + normLoopTime * dir + row * 0.2 + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(hNorm, 0.33);

        x = hNorm * effW * 0.84;
        y = (row - 1) * baseRadius * 0.62 * openingRatio;
        z = (1 - Math.abs(hNorm) * 1.4) * baseRadius * 0.55;
        rotY = -hNorm * 22;
        rotX = tiltDeg * 0.25;
        isHeroFocus = row === 1 && Math.abs(hNorm) < 0.16;
        customScale = 0.88 * (0.85 + 0.15 * env);
        customOpacity = env;
        break;
      }

      case 'sweep-ring': {
        // High-banked orbital halo with dramatic camera bank angle
        const bankRad = 0.42;
        const rx = Math.cos(theta) * baseRadius * 1.12;
        const ry = Math.sin(theta) * baseRadius * 0.62 * openingRatio;
        x = rx * Math.cos(bankRad) - ry * Math.sin(bankRad);
        y = rx * Math.sin(bankRad) + ry * Math.cos(bankRad);
        z = Math.sin(theta) * baseRadius * 0.88;
        rotZ = -18 + Math.cos(theta) * 12 + tiltDeg * 0.3;
        rotY = -Math.cos(theta) * 26;
        isHeroFocus = Math.sin(theta) > 0.8;
        break;
      }

      case 'scatter-dial': {
        // Concentric dual-ring radial dial stepping in harmonic rhythm
        const isOuter = i % 2 === 0;
        const dialR = baseRadius * (isOuter ? 1.02 : 0.58);
        const dialAngle = theta * (isOuter ? 1 : -1.5);
        x = Math.cos(dialAngle) * dialR;
        y = Math.sin(dialAngle) * dialR * 0.84 * openingRatio;
        z = (isOuter ? 18 : -18) + Math.sin(dialAngle) * baseRadius * 0.38;
        rotZ = tiltDeg * 0.3;
        isHeroFocus = isOuter && Math.sin(dialAngle) > 0.8;
        customScale = isOuter ? 0.94 : 0.78;
        break;
      }

      case 'grid-zoom': {
        // Dual-panel diptych showcase with smooth continuous pair cross-zoom
        const side = i % 2 === 0 ? -1 : 1;
        const pairCount = Math.max(1, Math.ceil(count / 2));
        const pairIdx = Math.floor(i / 2);
        const pairFocus = computeCircularFocusWeight(pairIdx, steppedIndex * 0.5, pairCount, 1.8);

        x = side * baseRadius * (0.58 + (1 - pairFocus) * 0.25);
        y = (1 - pairFocus) * (pairIdx % 2 === 0 ? -24 : 24) * openingRatio;
        z = (pairFocus * 1.4 - 0.65) * baseRadius * 0.85;
        rotY = -side * (8 + (1 - pairFocus) * 14);
        rotX = tiltDeg * 0.25;
        isHeroFocus = pairFocus > 0.7;
        customScale = 0.72 + pairFocus * 0.46;
        customOpacity = Math.max(0.12, Math.pow(pairFocus, 0.75));
        break;
      }

      case 'spread-rows': {
        // 3-row horizontal strata gliding in alternating directions with smooth edge wrap
        const rows = 3;
        const row = i % rows;
        const cols = Math.max(1, Math.ceil(count / rows));
        const col = Math.floor(i / rows);
        const dir = row % 2 === 0 ? 1 : -1;
        const hNorm = (((col / cols) + normLoopTime * dir + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(hNorm, 0.33);

        x = hNorm * effW * 0.86;
        y = (row - 1) * baseRadius * 0.64 * openingRatio;
        z = (row === 1 ? 28 : -14) * env;
        rotX = tiltDeg * 0.25;
        isHeroFocus = row === 1 && Math.abs(hNorm) < 0.15;
        customScale = 0.88 * (0.86 + 0.14 * env);
        customOpacity = env;
        break;
      }

      case 'spread-columns': {
        // 4-column vertical strata gliding in alternating directions with smooth edge wrap
        const cols = 4;
        const col = i % cols;
        const rows = Math.max(1, Math.ceil(count / cols));
        const row = Math.floor(i / cols);
        const dir = col % 2 === 0 ? 1 : -1;
        const vNorm = (((row / rows) + normLoopTime * dir + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);

        x = (col - 1.5) * baseRadius * 0.62;
        y = vNorm * effH * 0.82 * openingRatio;
        z = ((col === 1 || col === 2) ? 26 : -16) * env;
        rotX = tiltDeg * 0.25;
        isHeroFocus = (col === 1 || col === 2) && Math.abs(vNorm) < 0.16;
        customScale = 0.86 * (0.86 + 0.14 * env);
        customOpacity = env;
        break;
      }

      // ======================================================================
      // 3. ISOMETRIC (3 DISTINCT FORMATIONS)
      // ======================================================================
      case 'iso-cascade': {
        // True isometric standing domino deck cascading forward with smooth edge fade
        x = relOffset * baseRadius * 0.34;
        y = relOffset * baseRadius * 0.22 * openingRatio;
        z = -relOffset * baseRadius * 0.28;
        rotY = -34;
        rotX = 20 + tiltDeg * 0.3;
        rotZ = -12;
        isHeroFocus = absOffset < 0.48;
        customScale = (0.88 + focusW * 0.22) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'iso-focus': {
        // Isometric corner stack where the active card elevates into center-right spotlight
        const stackPos = ((i - steppedIndex) % count + count) % count;
        const deckIdx = Math.min(4, stackPos);
        const deckX = -baseRadius * 0.56 - deckIdx * 14;
        const deckY = baseRadius * 0.38 * openingRatio + deckIdx * 10;
        const deckZ = -deckIdx * 28;

        const spotX = baseRadius * 0.14;
        const spotY = -baseRadius * 0.08 * openingRatio;
        const spotZ = baseRadius * 0.72;

        x = deckX * (1 - focusW) + spotX * focusW;
        y = deckY * (1 - focusW) + spotY * focusW;
        z = deckZ * (1 - focusW) + spotZ * focusW;
        rotY = -28 * (1 - focusW * 0.4);
        rotX = (18 + tiltDeg * 0.3) * (1 - focusW * 0.35);
        rotZ = -14 * (1 - focusW * 0.4);
        isHeroFocus = focusW > 0.65;
        customScale = 0.82 + focusW * 0.42;
        customOpacity = stackPos < 5 || focusW > 0.2 ? Math.max(0.22, 1 - deckIdx * 0.16 + focusW * 0.5) : 0;
        break;
      }

      case 'iso-orbit': {
        // Flat isometric tabletop 3x3 tile matrix orbiting & undulating in Z-height
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols) % 3;
        const gx = (col - 1) * baseRadius * 0.58;
        const gy = (row - 1) * baseRadius * 0.58 * openingRatio;
        const rot = continuousAngle * 0.5;
        x = gx * Math.cos(rot) - gy * Math.sin(rot);
        y = (gx * Math.sin(rot) + gy * Math.cos(rot)) * 0.66;
        z = Math.sin(continuousAngle * 2 + (col + row) * 0.8) * 34;
        rotX = 44 + tiltDeg * 0.3;
        rotZ = -32;
        isHeroFocus = col === 1 && row === 1;
        customScale = i < 9 ? 0.86 : 0;
        customOpacity = i < 9 ? 0.96 : 0;
        break;
      }

      // ======================================================================
      // 4. ORBIT (8 DISTINCT FORMATIONS)
      // ======================================================================
      case 'orbit-showcase': {
        // Low-horizon crown carousel with foreground hero magnification
        const frontW = Math.max(0, Math.sin(theta));
        x = Math.cos(theta) * baseRadius * 1.04;
        y = Math.sin(theta) * baseRadius * 0.28 * openingRatio;
        z = Math.sin(theta) * baseRadius * 0.96;
        rotY = -Math.cos(theta) * 20;
        rotX = tiltDeg * 0.25;
        isHeroFocus = frontW > 0.85;
        customScale = 0.78 + Math.pow(frontW, 2) * 0.42;
        break;
      }

      case 'orbit-bloom': {
        // Radial lotus petals pitched outward & blooming open as they spin
        const petalWave = Math.sin(theta * 2 + continuousAngle);
        const r = baseRadius * (0.72 + 0.22 * petalWave);
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r * 0.78 * openingRatio;
        z = petalWave * baseRadius * 0.55;
        rotY = -Math.sin(theta) * 36;
        rotX = Math.cos(theta) * 28 + tiltDeg * 0.25;
        rotZ = ((theta * 180) / Math.PI) * 0.35;
        isHeroFocus = petalWave > 0.7;
        break;
      }

      case 'orbit-carousel': {
        // Wide panoramic horizontal belt with tight vertical profile
        x = Math.sin(theta) * baseRadius * 1.24;
        y = Math.cos(theta) * baseRadius * 0.16 * openingRatio;
        z = Math.cos(theta) * baseRadius * 0.92;
        rotY = Math.sin(theta) * 26;
        rotX = tiltDeg * 0.25;
        isHeroFocus = Math.cos(theta) > 0.85;
        customScale = 0.8 + Math.max(0, Math.cos(theta)) * 0.36;
        break;
      }

      case 'photo-orbit': {
        // Overlapping camera-shutter aperture ring rotating in-plane
        const r = baseRadius * 0.78;
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r * 0.86 * openingRatio;
        z = Math.sin(theta) * baseRadius * 0.42 + focusW * 45;
        rotZ = ((theta * 180) / Math.PI) * 0.15 + tiltDeg * 0.25;
        rotY = -Math.cos(theta) * 12;
        isHeroFocus = focusW > 0.65;
        customScale = 0.92 + focusW * 0.24;
        break;
      }

      case 'focus-orbit': {
        // High-density 12-card chrono watch-bezel ring with smooth 6-o'clock magnification
        const r = baseRadius * 0.94;
        const frontBoost = Math.pow(Math.max(0, Math.sin(theta)), 3);
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r * 0.88 * openingRatio;
        z = Math.sin(theta) * baseRadius * 0.65 + frontBoost * 45;
        rotZ = ((theta * 180) / Math.PI + 90) * 0.28 + tiltDeg * 0.25;
        isHeroFocus = frontBoost > 0.65;
        customScale = 0.78 + frontBoost * 0.42;
        break;
      }

      case 'vortex-spin': {
        // Logarithmic spiral turbine vortex pulling cards inward & forward
        const spiralT = (normIdx + normLoopTime) % 1;
        const env = Math.sin(spiralT * Math.PI);
        const angle = spiralT * Math.PI * 4 + i * ((Math.PI * 2) / count);
        const r = baseRadius * (1.18 - spiralT * 0.82);

        x = Math.cos(angle) * r;
        y = Math.sin(angle) * r * 0.84 * openingRatio;
        z = (spiralT - 0.4) * baseRadius * 1.4;
        rotZ = ((angle * 180) / Math.PI) * 0.35 + tiltDeg * 0.25;
        rotY = -Math.cos(angle) * 20;
        isHeroFocus = spiralT > 0.6 && spiralT < 0.85;
        customScale = (0.65 + spiralT * 0.55) * (0.8 + 0.2 * env);
        customOpacity = Math.pow(env, 0.55);
        break;
      }

      case 'wheel-spin': {
        // Upright Ferris wheel where cards orbit a vertical circle while staying level
        const r = baseRadius * 0.9;
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r * 0.9 * openingRatio;
        z = Math.sin(theta) * baseRadius * 0.48;
        rotZ = tiltDeg * 0.25; // Cards stay level like Ferris wheel gondolas
        rotY = -Math.cos(theta) * 14;
        isHeroFocus = Math.sin(theta) > 0.82;
        break;
      }

      case 'wheel-spin-arc': {
        // Lower-third rainbow horizon arch with smooth boundary wrap fade
        const arcAngle = normRel * Math.PI * 1.25; // [-112°, +112°]
        const r = baseRadius * 1.16;
        x = Math.sin(arcAngle) * r;
        y = (1 - Math.cos(arcAngle)) * r * 0.68 * openingRatio - baseRadius * 0.12;
        z = Math.cos(arcAngle) * baseRadius * 0.72;
        rotZ = ((arcAngle * 180) / Math.PI) * 0.42 + tiltDeg * 0.25;
        rotY = -Math.sin(arcAngle) * 18;
        isHeroFocus = absOffset < 0.48;
        customScale = (0.82 + Math.max(0, Math.cos(arcAngle)) * 0.32) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      // ======================================================================
      // 5. CAROUSEL & FLOW (10 DISTINCT FORMATIONS)
      // ======================================================================
      case 'card-totem': {
        // Vertical film totem strip scrolling top-to-bottom with center hero zoom
        x = Math.sin(tiltRad) * relOffset * 14;
        y = relOffset * baseRadius * 0.48 * openingRatio;
        z = (focusW * 1.1 - 0.25) * baseRadius * 0.85;
        rotX = -relOffset * 16 + tiltDeg * 0.25;
        isHeroFocus = focusW > 0.65;
        customScale = (0.78 + focusW * 0.38) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'film-strip': {
        // Flat horizontal cinema contact sheet gliding smoothly with edge fade
        x = relOffset * baseRadius * 0.56;
        y = Math.sin(tiltRad) * x * 0.25;
        z = (Math.cos(normRel * Math.PI) - 0.5) * baseRadius * 0.45;
        rotY = -relOffset * 6;
        rotX = tiltDeg * 0.25;
        isHeroFocus = absOffset < 0.48;
        customScale = (0.86 + focusW * 0.22) * (0.86 + 0.14 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'wheel-carousel': {
        // Deep 3-panel paddle-wheel drum with angled side wings
        const angle = Math.max(-1.35, Math.min(1.35, relOffset * 0.58));
        x = Math.sin(angle) * baseRadius * 1.02;
        y = (1 - Math.cos(angle)) * baseRadius * 0.22 * openingRatio;
        z = Math.cos(angle) * baseRadius * 0.92 - baseRadius * 0.15;
        rotY = -((angle * 180) / Math.PI) * 0.85;
        rotX = tiltDeg * 0.25;
        isHeroFocus = absOffset < 0.48;
        customScale = (0.78 + focusW * 0.42) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'coverflow-stage':
      case 'cover-flow': {
        // Classic Apple CoverFlow: tight angled side wings + flat forward center hero
        const wing = Math.tanh(relOffset * 1.35);
        const spreadX = wing * baseRadius * 0.52 + relOffset * baseRadius * 0.24;
        x = spreadX * Math.cos(tiltRad * 0.35);
        y = spreadX * Math.sin(tiltRad * 0.35);
        z = (focusW * 1.25 - 0.35) * baseRadius * 0.88;
        rotY = -wing * 52 * (1 - focusW * 0.85);
        rotX = tiltDeg * 0.25;
        isHeroFocus = focusW > 0.65;
        customScale = (0.78 + focusW * 0.38) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'cover-flow-v': {
        // Vertical CoverFlow: top & bottom angled wings around flat center hero
        const wing = Math.tanh(relOffset * 1.35);
        const spreadY = (wing * baseRadius * 0.48 + relOffset * baseRadius * 0.22) * openingRatio;
        x = spreadY * Math.sin(tiltRad * 0.3);
        y = spreadY * Math.cos(tiltRad * 0.3);
        z = (focusW * 1.25 - 0.35) * baseRadius * 0.88;
        rotX = wing * 46 * (1 - focusW * 0.85) + tiltDeg * 0.25;
        isHeroFocus = focusW > 0.65;
        customScale = (0.78 + focusW * 0.38) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'carousel-flow': {
        // Asymmetric editorial glide: large hero on right, trailing queue on left
        const queueOffset = ((i - steppedIndex) % count + count) % count;
        const isHero = focusW > 0.55;
        const trailDepth = queueOffset > count / 2 ? 0 : queueOffset;
        const heroX = baseRadius * 0.24;
        const queueX = -baseRadius * 0.42 - Math.min(4, trailDepth) * baseRadius * 0.22;

        x = queueX * (1 - focusW) + heroX * focusW;
        y = Math.sin(tiltRad) * x * 0.25;
        z = (-Math.min(4, trailDepth) * 35) * (1 - focusW) + (baseRadius * 0.78) * focusW;
        rotY = (18 * (1 - focusW)) - 4 * focusW;
        rotX = tiltDeg * 0.25;
        isHeroFocus = isHero;
        customScale = (0.76 + focusW * 0.48) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'diagonal-cascade': {
        // Top-left to bottom-right echelon cascade with Z-depth layering & edge fade
        x = relOffset * baseRadius * 0.38;
        y = relOffset * baseRadius * 0.32 * openingRatio;
        z = (focusW * 1.1 - absOffset * 0.28) * baseRadius * 0.78;
        rotY = -relOffset * 10;
        rotX = tiltDeg * 0.25;
        rotZ = -4 + tiltDeg * 0.2;
        isHeroFocus = focusW > 0.65;
        customScale = (0.78 + focusW * 0.34) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'focus-slider': {
        // Studio 3-up Hero Slider: dominant center card flanked by two recessed previews
        x = relOffset * baseRadius * 0.74;
        y = Math.sin(tiltRad) * x * 0.25;
        z = (focusW * 1.35 - 0.45) * baseRadius * 0.88;
        rotY = -Math.tanh(relOffset) * 18 * (1 - focusW);
        rotX = tiltDeg * 0.25;
        isHeroFocus = focusW > 0.65;
        customScale = (0.72 + focusW * 0.52) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv * Math.max(0.18, 1 - Math.max(0, absOffset - 1.2) * 0.55);
        break;
      }

      case 'mosaic-marquee': {
        // Asymmetric dual-track bento marquee with smooth horizontal wrap fade
        const row = i % 2;
        const cols = Math.max(1, Math.ceil(count / 2));
        const col = Math.floor(i / 2);
        const dir = row === 0 ? -1 : 1;
        const hNorm = (((col / cols) + normLoopTime * dir + row * 0.25 + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(hNorm, 0.33);

        x = hNorm * effW * 0.84;
        y = (row === 0 ? -0.38 : 0.42) * baseRadius * openingRatio;
        z = (1 - Math.abs(hNorm) * 1.2) * baseRadius * 0.55;
        rotY = -hNorm * 12;
        rotX = tiltDeg * 0.25;
        isHeroFocus = row === 0 && Math.abs(hNorm) < 0.16;
        customScale = (row === 0 ? 1.02 : 0.84) * (0.86 + 0.14 * env);
        customOpacity = env;
        break;
      }

      case 'dock-magnifier':
      case 'hero-reel': {
        // Horizontal macOS-style dock showreel with Gaussian magnification wave
        const gaussian = Math.exp(-(relOffset * relOffset) / 1.45);
        x = relOffset * baseRadius * 0.34;
        y = (1 - gaussian) * 18 * openingRatio - gaussian * 16;
        z = (gaussian * 1.25 - 0.3) * baseRadius * 0.82;
        rotY = -relOffset * 9;
        rotX = gaussian * 6 + tiltDeg * 0.25;
        isHeroFocus = gaussian > 0.72;
        customScale = (0.68 + gaussian * 0.52) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv * (0.42 + gaussian * 0.58);
        break;
      }

      // ======================================================================
      // 6. GRID (8 DISTINCT FORMATIONS)
      // ======================================================================
      case 'bento-grid-morph':
      case 'grid-reveal': {
        // 3×3 architectural bento grid with smooth continuous focus wave & neighbor push
        const cols = 3;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const baseX = (col - 1) * baseRadius * 0.74;
        const baseY = (row - (rows - 1) / 2) * baseRadius * 0.68 * openingRatio;

        x = baseX * (1 + focusW * 0.06);
        y = baseY * (1 + focusW * 0.06);
        z = -baseRadius * 0.12 + focusW * baseRadius * 0.72;
        rotX = tiltDeg * 0.3;
        rotY = (col - 1) * -5;
        isHeroFocus = focusW > 0.65;
        customScale = 0.84 + focusW * 0.34;
        customOpacity = 0.68 + focusW * 0.32;
        break;
      }

      case 'spotlight-zoom': {
        // Macro cell zoom: focused cell smoothly expands to center stage
        const cols = 3;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const gridX = (col - 1) * baseRadius * 0.82;
        const gridY = (row - (rows - 1) / 2) * baseRadius * 0.74 * openingRatio;

        x = gridX * (1 - focusW * 0.88);
        y = gridY * (1 - focusW * 0.88);
        z = -baseRadius * 0.35 * (1 - focusW) + baseRadius * 0.88 * focusW;
        rotX = tiltDeg * 0.25;
        isHeroFocus = focusW > 0.65;
        customScale = 0.76 + focusW * 0.58;
        customOpacity = 0.42 + focusW * 0.58;
        break;
      }

      case 'flip-grid': {
        // Kinetic Flip Grid: cells perform a smooth 180° 3D Y-axis flip wave
        const cols = 3;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const wavePhase = continuousAngle - (col + row) * 0.75;
        const flipPulse = Math.pow(Math.max(0, Math.sin(wavePhase)), 3);

        x = (col - 1) * baseRadius * 0.74;
        y = (row - (rows - 1) / 2) * baseRadius * 0.68 * openingRatio;
        z = flipPulse * baseRadius * 0.55;
        rotY = flipPulse * 180;
        rotX = tiltDeg * 0.25;
        isHeroFocus = flipPulse > 0.65;
        customScale = 0.86 + flipPulse * 0.22;
        break;
      }

      case 'pop-grid': {
        // Harmonic Pop Grid: cells spring forward in a diagonal ripple wave
        const cols = 3;
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const ripple = Math.sin(continuousAngle * 2 - (col * 0.7 + row * 0.9));
        const pop = Math.max(0, ripple);

        x = (col - 1) * baseRadius * 0.74;
        y = (row - (rows - 1) / 2) * baseRadius * 0.68 * openingRatio - pop * 10;
        z = pop * baseRadius * 0.68 - (1 - pop) * 18;
        rotX = pop * 8 + tiltDeg * 0.25;
        isHeroFocus = pop > 0.75;
        customScale = 0.82 + pop * 0.32;
        customOpacity = 0.62 + pop * 0.38;
        break;
      }

      case 'ticker-loop': {
        // Slanted -8° multi-row brick ticker scrolling horizontally with smooth wrap
        const rows = 3;
        const row = i % rows;
        const cols = Math.max(1, Math.ceil(count / rows));
        const col = Math.floor(i / rows);
        const dir = row % 2 === 0 ? -1 : 1;
        const hNorm = (((col / cols) + normLoopTime * dir + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(hNorm, 0.33);
        const slantRad = (-8 * Math.PI) / 180;

        const rawX = hNorm * effW * 0.84;
        const rawY = (row - 1) * baseRadius * 0.62 * openingRatio;
        x = rawX * Math.cos(slantRad) - rawY * Math.sin(slantRad);
        y = rawX * Math.sin(slantRad) + rawY * Math.cos(slantRad);
        z = (1 - Math.abs(hNorm) * 1.1) * baseRadius * 0.45;
        rotZ = -8 + tiltDeg * 0.25;
        isHeroFocus = row === 1 && Math.abs(hNorm) < 0.16;
        customScale = 0.88 * (0.85 + 0.15 * env);
        customOpacity = env;
        break;
      }

      case 'ticker-tilt': {
        // Perspective masonry wall (rotX: 22°, rotZ: -10°) scrolling vertically
        const cols = 3;
        const col = i % cols;
        const rows = Math.max(1, Math.ceil(count / cols));
        const row = Math.floor(i / cols);
        const vNorm = (((row / rows) - normLoopTime + col * 0.28 + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);

        const rawX = (col - 1) * baseRadius * 0.72;
        const rawY = vNorm * effH * 0.82 * openingRatio;
        const slantRad = (-10 * Math.PI) / 180;
        x = rawX * Math.cos(slantRad) - rawY * Math.sin(slantRad);
        y = rawX * Math.sin(slantRad) + rawY * Math.cos(slantRad);
        z = (1 - Math.abs(vNorm) * 1.2) * baseRadius * 0.52;
        rotX = 22 + tiltDeg * 0.3;
        rotZ = -10;
        isHeroFocus = col === 1 && Math.abs(vNorm) < 0.16;
        customScale = 0.88 * (0.85 + 0.15 * env);
        customOpacity = env;
        break;
      }

      case 'column-drift': {
        // 3-column vertical parallax grid with counter-drifting columns & smooth edge fade
        const cols = 3;
        const col = i % cols;
        const rows = Math.max(1, Math.ceil(count / cols));
        const row = Math.floor(i / cols);
        const dir = col === 1 ? -1 : 1;
        const vNorm = (((row / rows) + normLoopTime * dir + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);

        x = (col - 1) * baseRadius * 0.74;
        y = vNorm * effH * 0.8 * openingRatio;
        z = (col === 1 ? 32 : -14) * env;
        rotX = tiltDeg * 0.25;
        isHeroFocus = col === 1 && Math.abs(vNorm) < 0.16;
        customScale = 0.88 * (0.86 + 0.14 * env);
        customOpacity = env;
        break;
      }

      case 'feed-scroll': {
        // Overlapping cascading social feed cards scrolling upward & lifting forward
        const vNorm = ((normIdx - normLoopTime + 10) % 1) - 0.5;
        const env = computeWrapEdgeEnvelope(vNorm, 0.33);
        const centerBoost = Math.exp(-(vNorm * vNorm) * 14);
        const laneX = ((i % 3) - 1) * baseRadius * 0.38 * (1 - centerBoost * 0.45);

        x = laneX;
        y = vNorm * effH * 0.76 * openingRatio;
        z = (centerBoost * 1.25 - 0.35) * baseRadius * 0.85;
        rotX = 10 * (1 - centerBoost) + tiltDeg * 0.25;
        isHeroFocus = centerBoost > 0.72;
        customScale = (0.78 + centerBoost * 0.42) * (0.85 + 0.15 * env);
        customOpacity = env * (0.45 + centerBoost * 0.55);
        break;
      }

      // ======================================================================
      // 7. SPOTLIGHT & FOCUS (4 DISTINCT FORMATIONS)
      // ======================================================================
      case 'center-stage': {
        // Solo Monolith: single dominant center stage card with smooth cross-zoom
        const soloFocus = computeCircularFocusWeight(i, steppedIndex, count, 2.2);
        x = relOffset * baseRadius * 0.22 * (1 - soloFocus);
        y = Math.sin(tiltRad) * relOffset * 14 * (1 - soloFocus);
        z = (soloFocus * 1.45 - 0.65) * baseRadius * 0.9;
        rotX = tiltDeg * 0.25;
        rotY = -relOffset * 8 * (1 - soloFocus);
        isHeroFocus = soloFocus > 0.7;
        customScale = 0.74 + soloFocus * 0.58;
        customOpacity = Math.max(0.06, Math.pow(soloFocus, 1.1));
        break;
      }

      case 'focus-shift': {
        // Sidebar Dock Shift: Left hero monolith + 3-card right vertical dock
        const relPos = ((i - steppedIndex) % count + count) % count;
        const heroW = computeCircularFocusWeight(i, steppedIndex, count, 2.2);
        const dockSlot = Math.min(3, Math.max(0, relPos - 1));
        const dockX = baseRadius * 0.68;
        const dockY = (dockSlot - 1) * baseRadius * 0.56 * openingRatio;
        const heroX = -baseRadius * 0.26;
        const heroY = 0;

        x = dockX * (1 - heroW) + heroX * heroW;
        y = dockY * (1 - heroW) + heroY * heroW;
        z = (-Math.max(0, dockSlot - 2) * 40) * (1 - heroW) + (baseRadius * 0.78) * heroW;
        rotY = -8 * (1 - heroW);
        rotX = tiltDeg * 0.25;
        isHeroFocus = heroW > 0.65;
        customScale = 0.74 * (1 - heroW) + 1.26 * heroW;
        const dockVis = relPos <= 3.6 ? Math.max(0, 1 - Math.max(0, relPos - 2.8) * 1.2) : 0;
        customOpacity = Math.max(heroW, dockVis * 0.88);
        break;
      }

      case 'deck-peel': {
        // Top-Card Peel: centered vertical deck where top card peels up & fades smoothly
        const depth = ((i - steppedIndex) % count + count) % count;
        const isPeeling = depth > count - 1;
        const peelT = isPeeling ? count - depth : 0; // 1 -> 0 as card peels away
        const stackDepth = isPeeling ? 0 : Math.min(4.5, depth);

        x = Math.sin(tiltRad) * stackDepth * 10;
        y = isPeeling
          ? - (1 - peelT) * baseRadius * 0.75 * openingRatio + 16
          : -stackDepth * 18 * openingRatio + 20;
        z = isPeeling
          ? baseRadius * (0.85 + (1 - peelT) * 0.35)
          : (1 - stackDepth * 0.28) * baseRadius * 0.78;
        rotX = isPeeling
          ? (1 - peelT) * 38 + tiltDeg * 0.25
          : -stackDepth * 3.5 + tiltDeg * 0.25;
        isHeroFocus = stackDepth < 0.6 && !isPeeling;
        customScale = isPeeling ? 1.14 + (1 - peelT) * 0.1 : Math.max(0.74, 1.12 - stackDepth * 0.07);
        customOpacity = isPeeling
          ? Math.sin(peelT * Math.PI * 0.5)
          : stackDepth < 4.2
          ? Math.max(0, 1 - stackDepth * 0.22)
          : 0;
        break;
      }

      case 'zoom-parallax': {
        // Depth Breath Zoom: camera dolly zoom with background counter-parallax
        const dolly = computeCircularFocusWeight(i, steppedIndex, count, 1.4);
        const angle = (i / count) * Math.PI * 2 + continuousAngle * 0.25;
        const bgR = baseRadius * 0.78 * (1 - dolly * 0.85);

        x = Math.cos(angle) * bgR;
        y = Math.sin(angle) * bgR * 0.78 * openingRatio;
        z = (dolly * 1.5 - 0.55) * baseRadius * 0.92;
        rotX = tiltDeg * 0.25;
        isHeroFocus = dolly > 0.7;
        customScale = 0.64 + dolly * 0.68;
        customOpacity = 0.28 + dolly * 0.72;
        break;
      }

      // ======================================================================
      // 8. REVEAL & WIPE (4 DISTINCT FORMATIONS)
      // ======================================================================
      case 'diagonal-wipe': {
        // Razor 45° diagonal wipe wave sweeping across a 3×3 matrix
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols) % 3;
        const diagPhase = continuousAngle - (col + row) * 0.72;
        const wave = 0.5 * (1 + Math.sin(diagPhase));

        x = (col - 1) * baseRadius * 0.72 + (1 - wave) * 18;
        y = (row - 1) * baseRadius * 0.66 * openingRatio + (1 - wave) * 18;
        z = (wave - 0.4) * baseRadius * 0.65;
        rotY = (1 - wave) * 32;
        rotZ = -6 * (1 - wave) + tiltDeg * 0.25;
        isHeroFocus = wave > 0.82 && i < 9;
        customScale = i < 9 ? 0.74 + wave * 0.34 : 0;
        customOpacity = i < 9 ? 0.25 + wave * 0.75 : 0;
        break;
      }

      case 'stripe-reveal': {
        // Venetian Louver Reveal: 4 vertical columns rotating in synchronized blinds
        const cols = 4;
        const col = i % cols;
        const row = Math.floor(i / cols) % 3;
        const blindAngle = continuousAngle - col * 0.55;
        const openFactor = 0.5 * (1 + Math.cos(blindAngle));

        x = (col - 1.5) * baseRadius * 0.58;
        y = (row - 1) * baseRadius * 0.64 * openingRatio;
        z = (openFactor - 0.4) * baseRadius * 0.55;
        rotY = Math.sin(blindAngle) * 68;
        rotX = tiltDeg * 0.25;
        isHeroFocus = openFactor > 0.85 && (col === 1 || col === 2);
        customScale = i < 12 ? 0.84 + openFactor * 0.18 : 0;
        customOpacity = i < 12 ? 0.35 + openFactor * 0.65 : 0;
        break;
      }

      case 'split-reveal': {
        // Dual Curtain Split: left & right curtains part horizontally to reveal center hero
        const isHero = i % 3 === 0;
        const side = i % 3 === 1 ? -1 : 1;
        const groupIdx = Math.floor(i / 3);
        const totalGroups = Math.max(1, Math.ceil(count / 3));
        const groupFocus = computeCircularFocusWeight(groupIdx, steppedIndex / 3, totalGroups, 1.8);
        const curtainOpen = 0.38 + groupFocus * 0.52;

        if (isHero) {
          x = 0;
          y = 0;
          z = (groupFocus * 1.35 - 0.45) * baseRadius * 0.85;
          isHeroFocus = groupFocus > 0.65;
          customScale = 0.76 + groupFocus * 0.48;
          customOpacity = Math.max(0.1, groupFocus);
        } else {
          x = side * baseRadius * curtainOpen;
          y = ((groupIdx % 2 === 0 ? -1 : 1) * baseRadius * 0.22 * openingRatio) * (1 - groupFocus * 0.5);
          z = (groupFocus * 0.6 - 0.3) * baseRadius * 0.65;
          rotY = -side * 24;
          customScale = 0.82 + groupFocus * 0.16;
          customOpacity = Math.max(0.12, groupFocus * 0.88);
        }
        rotX = tiltDeg * 0.25;
        break;
      }

      case 'mosaic-wipe': {
        // Tile Shutter Wipe: spiral chessboard shutter matrix
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols) % 3;
        const distFromCenter = Math.hypot(col - 1, row - 1);
        const shutterWave = 0.5 * (1 + Math.sin(continuousAngle * 1.5 - distFromCenter * 1.3));

        x = (col - 1) * baseRadius * 0.72;
        y = (row - 1) * baseRadius * 0.68 * openingRatio;
        z = (shutterWave - 0.4) * baseRadius * 0.68;
        rotX = (1 - shutterWave) * 35 + tiltDeg * 0.25;
        rotY = (1 - shutterWave) * -25;
        isHeroFocus = col === 1 && row === 1 && shutterWave > 0.75;
        customScale = i < 9 ? 0.72 + shutterWave * 0.36 : 0;
        customOpacity = i < 9 ? 0.28 + shutterWave * 0.72 : 0;
        break;
      }

      // ======================================================================
      // 9. STACK & SCATTER (7 DISTINCT FORMATIONS — ZERO DUPLICATES)
      // ======================================================================
      case 'stack-slide': {
        // Layered Deck Slide: top card slides smoothly right and arcs behind the stack
        const cycle = ((i - steppedIndex) % count + count) % count;
        const visibleCount = Math.min(5, count);
        if (cycle < visibleCount) {
          // Cards 0..1: card 0 slides out to the right and behind as cycle approaches 0
          const slidePhase = cycle < 1 ? 1 - cycle : 0; // 0 at top, 1 as it slides around back
          const arcAngle = slidePhase * Math.PI;
          const slideX = Math.sin(arcAngle) * baseRadius * 0.92;
          const stackIdx = cycle < 1 ? 0 : cycle - 1;

          x = slideX + stackIdx * 10;
          y = stackIdx * 8 * openingRatio;
          z = Math.cos(arcAngle) * baseRadius * 0.65 - stackIdx * 28;
          rotY = -Math.sin(arcAngle) * 24;
          rotZ = Math.sin(arcAngle) * 6 + tiltDeg * 0.25;
          isHeroFocus = cycle < 0.8 && slidePhase < 0.4;
          customScale = 1.14 - stackIdx * 0.06 - slidePhase * 0.12;
          customOpacity = Math.max(0.22, 1 - stackIdx * 0.18);
        } else {
          customScale = 0.8;
          customOpacity = 0;
        }
        break;
      }

      case 'cascade-drop': {
        // Gravity Stack Drop: cards drop smoothly from above onto an angled studio deck
        const cycle = ((i - steppedIndex) % count + count) % count;
        const activeSpan = Math.min(5, count);
        if (cycle < activeSpan) {
          const normC = cycle / activeSpan; // 0 (dropping in) -> 1 (fading at bottom of stack)
          const dropIn = Math.max(0, 1 - cycle * 1.4); // 1 -> 0 during drop-in
          const organicRot = ((i % 2 === 0 ? 1 : -1) * ((i % 3) + 1) * 2.4);

          x = (cycle - 1.5) * 8;
          y = -dropIn * baseRadius * 0.72 * openingRatio + cycle * 12 * openingRatio;
          z = (1 - normC * 1.2) * baseRadius * 0.82 + dropIn * 45;
          rotZ = organicRot + tiltDeg * 0.25;
          rotX = dropIn * 18 + tiltDeg * 0.25;
          isHeroFocus = cycle > 0.3 && cycle < 1.3;
          customScale = 1.12 - normC * 0.22 + dropIn * 0.12;
          customOpacity = Math.sin(normC * Math.PI);
        } else {
          customScale = 0.8;
          customOpacity = 0;
        }
        break;
      }

      case 'cascade-diagonal': {
        // Stepped Diagonal Trail: fanned diagonal card steps from top-left to bottom-right
        x = relOffset * baseRadius * 0.34;
        y = relOffset * baseRadius * 0.34 * openingRatio;
        z = (relOffset + count * 0.2) * 18;
        rotZ = relOffset * 3.2 + tiltDeg * 0.25;
        rotX = tiltDeg * 0.25;
        isHeroFocus = absOffset < 0.55;
        customScale = (0.86 + focusW * 0.22) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'image-trail': {
        // Echo Motion Trail: high-arcing rainbow parabolic trail across the stage
        const u = normRel; // [-0.5, +0.5]
        const archY = (4 * u * u - 0.42) * baseRadius * 0.78 * openingRatio;
        x = u * effW * 0.78;
        y = archY;
        z = (1 - Math.abs(u) * 1.8) * baseRadius * 0.78;
        rotZ = u * 34 + tiltDeg * 0.25;
        rotY = -u * 18;
        isHeroFocus = Math.abs(u) < 0.1;
        customScale = (0.72 + (1 - Math.abs(u) * 1.5) * 0.38) * (0.85 + 0.15 * edgeEnv);
        customOpacity = edgeEnv;
        break;
      }

      case 'poster-burst': {
        // Centrifugal Burst: cards burst radially outward from a center stack & contract smoothly
        const burstWave = 0.5 * (1 - Math.cos(continuousAngle)); // 0 (stacked) -> 1 (expanded burst)
        const angle = (i / count) * Math.PI * 2 + continuousAngle * 0.25;
        const ringLayer = (i % 3) + 1;
        const r = burstWave * baseRadius * (0.38 + ringLayer * 0.24);

        x = Math.cos(angle) * r;
        y = Math.sin(angle) * r * 0.84 * openingRatio;
        z = (i === 0 ? 60 : (3 - ringLayer) * 26) + burstWave * Math.sin(angle) * 35;
        rotZ = burstWave * Math.cos(angle) * 14 + tiltDeg * 0.25;
        rotY = -Math.cos(angle) * burstWave * 16;
        isHeroFocus = i === 0 || (ringLayer === 1 && burstWave < 0.4);
        customScale = i === 0 ? 1.18 - burstWave * 0.12 : 0.84 + (3 - ringLayer) * 0.08;
        break;
      }

      case 'card-toss': {
        // Physics Table Toss: cards glide in from bottom edge onto a studio desk at organic angles
        const life = ((normIdx + normLoopTime) % 1); // 0 (entering from bottom) -> 1 (fading out)
        const settleT = Math.min(1, life * 2.2);
        const easedSettle = evaluateCubicBezier(0.23, 1, 0.32, 1, settleT);
        const fadeOut = life > 0.75 ? 0.5 * (1 + Math.cos(((life - 0.75) / 0.25) * Math.PI)) : 1;
        const fadeIn = life < 0.12 ? life / 0.12 : 1;

        const targetX = Math.sin(i * 2.1) * baseRadius * 0.62;
        const targetY = Math.cos(i * 1.7) * baseRadius * 0.48 * openingRatio;
        const targetRotZ = Math.sin(i * 3.1) * 18;

        x = targetX * easedSettle;
        y = (1 - easedSettle) * effH * 0.55 + targetY * easedSettle;
        z = life * baseRadius * 0.65 - baseRadius * 0.2;
        rotZ = (1 - easedSettle) * -28 + targetRotZ * easedSettle + tiltDeg * 0.25;
        rotX = 16 * (1 - easedSettle * 0.5) + tiltDeg * 0.25;
        isHeroFocus = life > 0.35 && life < 0.68;
        customScale = 0.88 + easedSettle * 0.16;
        customOpacity = fadeIn * fadeOut;
        break;
      }

      case 'position-dance':
      default: {
        // Modular Bento Dance: 5-slot asymmetric bento layout where cards smoothly swap positions
        const bentoSlots = [
          { bx: -0.58, by: -0.54, bz: 0.15, sc: 0.86 }, // Top-left square
          { bx: 0.44, by: -0.56, bz: 0.05, sc: 0.82 },  // Top-right square
          { bx: -0.56, by: 0.12, bz: 0.22, sc: 0.88 },  // Mid-left square
          { bx: -0.56, by: 0.64, bz: -0.1, sc: 0.76 },  // Bottom-left small square
          { bx: 0.36, by: 0.28, bz: 0.68, sc: 1.18 },   // Bottom-right Hero Card
        ];
        const activeCount = Math.min(count, bentoSlots.length);
        if (i < activeCount) {
          const rawPos = (i + steppedIndex * 0.6) % activeCount;
          const idx0 = Math.floor(rawPos) % activeCount;
          const idx1 = (idx0 + 1) % activeCount;
          const frac = rawPos - Math.floor(rawPos);
          const t = evaluateCubicBezier(0.65, 0, 0.35, 1, frac);

          const s0 = bentoSlots[idx0];
          const s1 = bentoSlots[idx1];
          // Add slight curved arc during slot swap so cards never collide linearly
          const arcX = Math.sin(t * Math.PI) * (s1.by - s0.by) * 0.18;
          const arcY = -Math.sin(t * Math.PI) * (s1.bx - s0.bx) * 0.18;

          x = (s0.bx + (s1.bx - s0.bx) * t + arcX) * baseRadius;
          y = (s0.by + (s1.by - s0.by) * t + arcY) * baseRadius * openingRatio;
          z = (s0.bz + (s1.bz - s0.bz) * t) * baseRadius;
          rotZ = Math.sin(t * Math.PI) * 4 + tiltDeg * 0.25;
          rotX = tiltDeg * 0.25;
          isHeroFocus = (s0.sc + (s1.sc - s0.sc) * t) > 1.05;
          customScale = s0.sc + (s1.sc - s0.sc) * t;
          customOpacity = 0.98;
        } else {
          customScale = 0.7;
          customOpacity = 0;
        }
        break;
      }
    }

    // Normalize depth in [-1, 1] for scale and backFade
    const normDepth = Math.max(-1, Math.min(1, z / Math.max(1, baseRadius)));
    const perspectiveFactor = 0.55 + (pos.perspective / 100) * 1.05;
    const rawScale =
      customScale !== null
        ? customScale * (0.88 + (pos.perspective / 100) * 0.28)
        : Math.max(0.42, 0.82 + normDepth * 0.28 * perspectiveFactor);

    const scale =
      pos.clampScaleFloor && normDepth >= -0.15
        ? Math.max(0.86, rawScale)
        : rawScale;

    // Back-side cards fade gracefully according to `pos.backFade`
    const backAttenuation =
      normDepth < 0
        ? 1 - Math.abs(normDepth) * (pos.backFade / 100) * 0.82
        : 1;
    const opacity =
      customOpacity !== null
        ? customOpacity * Math.max(0.25, backAttenuation)
        : Math.max(0.14, Math.min(1, backAttenuation));

    const blurPx =
      normDepth < -0.35 ? Number((Math.abs(normDepth + 0.35) * 2.2).toFixed(1)) : 0;

    results.push({
      slotIndex: i,
      translateX: Number(x.toFixed(2)),
      translateY: Number(y.toFixed(2)),
      translateZ: Number(z.toFixed(2)),
      rotateX: Number(rotX.toFixed(2)),
      rotateY: Number(rotY.toFixed(2)),
      rotateZ: Number(rotZ.toFixed(2)),
      scale: Number(scale.toFixed(3)),
      opacity: Number(Math.max(0, Math.min(1, opacity)).toFixed(3)),
      zIndex: Math.round((normDepth + 2) * 100) + (isHeroFocus ? 30 : 0),
      blurPx,
      isHeroFocus,
    });
  }

  return results;
}

/**
 * Pure deterministic computation of a layer's transform & opacity at `currentTime` (in seconds).
 */
export function computeLayerFrameState(
  layer: MotionLayer,
  currentTime: number
): ComputedLayerFrame {
  if (!layer.visible) {
    return {
      visible: false,
      activeInTimeline: false,
      progress: 0,
      easedEntry: 0,
      translateX: 0,
      translateY: 0,
      scale: layer.scale,
      rotation: layer.rotation,
      opacity: 0,
      skewX: 0,
      perspectiveRotateX: 0,
    };
  }

  const endTime = layer.startTime + layer.duration;
  if (currentTime < layer.startTime || currentTime > endTime) {
    return {
      visible: false,
      activeInTimeline: false,
      progress: 0,
      easedEntry: 0,
      translateX: 0,
      translateY: 0,
      scale: layer.scale,
      rotation: layer.rotation,
      opacity: 0,
      skewX: 0,
      perspectiveRotateX: 0,
    };
  }

  const localTime = Math.max(0, currentTime - layer.startTime);
  const overallProgress = Math.min(1, localTime / Math.max(0.05, layer.duration));

  const effectiveEntryDuration = Math.max(
    0.1,
    Math.min(layer.duration * 0.85, (layer.entryDuration || 0.75) / Math.max(0.25, layer.speed))
  );

  const rawEntryT = Math.min(1, localTime / effectiveEntryDuration);
  const [p1x, p1y, p2x, p2y] = layer.bezier;
  const easedEntry = evaluateCubicBezier(p1x, p1y, p2x, p2y, rawEntryT);

  let exitFactor = 1;
  if (layer.exitAnimation && layer.duration > 0.5) {
    const exitWindow = Math.min(0.45, layer.duration * 0.22);
    const timeRemaining = endTime - currentTime;
    if (timeRemaining < exitWindow) {
      const rawExit = Math.max(0, Math.min(1, timeRemaining / exitWindow));
      exitFactor = evaluateCubicBezier(0.23, 1, 0.32, 1, rawExit);
    }
  }

  const factor = easedEntry * exitFactor;
  const invFactor = 1 - factor;

  let translateX = 0;
  let translateY = 0;
  let scale = layer.scale;
  let rotation = layer.rotation;
  let opacity = layer.opacity * Math.min(1, Math.max(0, rawEntryT * 1.6)) * exitFactor;
  let skewX = 0;
  let perspectiveRotateX = 0;

  switch (layer.animationType) {
    case 'slide-up':
      translateY = invFactor * 28;
      scale = layer.scale * (0.94 + 0.06 * factor);
      break;
    case 'fade-scale':
      scale = layer.scale * (0.94 + 0.06 * factor);
      opacity = layer.opacity * Math.min(1, Math.max(0, factor));
      break;
    case 'kinetic-pop':
      scale = layer.scale * (0.92 + 0.08 * factor);
      translateY = invFactor * 22;
      rotation = layer.rotation;
      break;
    case 'flip-3d':
      perspectiveRotateX = invFactor * 32;
      translateY = invFactor * 24;
      scale = layer.scale * (0.94 + 0.06 * factor);
      break;
    case 'glitch-snap': {
      const glitchJitter =
        rawEntryT < 0.85
          ? Math.sin(localTime * 55 * layer.speed) * (1 - rawEntryT) * 10
          : 0;
      translateX = invFactor * -48 + glitchJitter;
      skewX = invFactor * 8;
      break;
    }
    case 'float-wave':
      translateY = invFactor * 24 + Math.sin(localTime * 3.2 * layer.speed) * 6;
      rotation = layer.rotation;
      break;
    case 'spin-reveal':
      rotation = layer.rotation + invFactor * -45;
      scale = layer.scale * (0.9 + 0.1 * factor);
      break;
  }

  const loopPhase = localTime * layer.speed * Math.PI * 2;
  if (layer.loopEffect === 'pulse') {
    scale *= 1 + Math.sin(loopPhase * 0.8) * 0.03;
  } else if (layer.loopEffect === 'float') {
    translateY += Math.sin(loopPhase * 0.6) * 6;
  } else if (layer.loopEffect === 'rotate') {
    rotation += localTime * layer.speed * 18;
  } else if (layer.loopEffect === 'shimmer') {
    opacity *= 0.88 + 0.12 * Math.sin(loopPhase * 1.4);
  }

  return {
    visible: true,
    activeInTimeline: true,
    progress: overallProgress,
    easedEntry,
    translateX,
    translateY,
    scale,
    rotation,
    opacity: Math.max(0, Math.min(1, opacity)),
    skewX,
    perspectiveRotateX,
  };
}

/**
 * Pure Undo/Redo History Manager
 */
export interface HistoryStack<T> {
  past: T[];
  present: T;
  future: T[];
}

export function createHistory<T>(initialState: T): HistoryStack<T> {
  return {
    past: [],
    present: initialState,
    future: [],
  };
}

export function pushHistory<T>(
  stack: HistoryStack<T>,
  nextState: T,
  maxLimit = 50
): HistoryStack<T> {
  const nextPast = [...stack.past, stack.present];
  if (nextPast.length > maxLimit) {
    nextPast.shift();
  }
  return {
    past: nextPast,
    present: nextState,
    future: [],
  };
}

export function undoHistory<T>(stack: HistoryStack<T>): HistoryStack<T> {
  if (stack.past.length === 0) return stack;
  const previous = stack.past[stack.past.length - 1];
  const newPast = stack.past.slice(0, stack.past.length - 1);
  return {
    past: newPast,
    present: previous,
    future: [stack.present, ...stack.future],
  };
}

export function redoHistory<T>(stack: HistoryStack<T>): HistoryStack<T> {
  if (stack.future.length === 0) return stack;
  const next = stack.future[0];
  const newFuture = stack.future.slice(1);
  return {
    past: [...stack.past, stack.present],
    present: next,
    future: newFuture,
  };
}

/**
 * Pure CRUD operations for Image Assets
 */
export function addImageAsset(
  assets: ImageAsset[],
  newAsset: ImageAsset
): ImageAsset[] {
  return [newAsset, ...assets];
}

export function updateImageAsset(
  assets: ImageAsset[],
  assetId: string,
  updates: Partial<ImageAsset>
): ImageAsset[] {
  return assets.map((asset) =>
    asset.id === assetId
      ? {
          ...asset,
          ...updates,
          filters: updates.filters
            ? { ...asset.filters, ...updates.filters }
            : asset.filters,
        }
      : asset
  );
}

export function deleteImageAsset(
  assets: ImageAsset[],
  scene: MotionScene,
  assetId: string
): { assets: ImageAsset[]; scene: MotionScene } {
  const remainingAssets = assets.filter((a) => a.id !== assetId);
  const fallbackAssetId = remainingAssets[0]?.id;
  const updatedLayers = scene.layers.map((layer) => {
    if (layer.assetId === assetId) {
      return {
        ...layer,
        assetId: fallbackAssetId,
      };
    }
    return layer;
  });
  return {
    assets: remainingAssets,
    scene: {
      ...scene,
      layers: updatedLayers,
    },
  };
}

/**
 * Generates a self-contained, production-ready React component (.tsx) using `motion/react`
 */
export function generateReactComponentCode(
  scene: MotionScene,
  assets: ImageAsset[]
): string {
  const spec = PLATFORM_SPECS[scene.platform];
  const pos = scene.positionSettings || DEFAULT_POSITION_SETTINGS;
  const formation = scene.formation || 'showcase-ring';
  const slotCount = scene.slotCount ?? 12;
  const stiffness = pos.springStiffness ?? 380;
  const damping = pos.springDamping ?? 30;
  const staggerSec = ((pos.staggerMs ?? 45) / 1000).toFixed(3);

  const componentName =
    scene.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]+/, '') || 'SocialMotionShowcase';

  const assetMap: Record<string, ImageAsset> = {};
  for (const a of assets) {
    assetMap[a.id] = a;
  }

  const layersCode = scene.layers
    .filter((l) => l.visible)
    .map((layer) => {
      const [b0, b1, b2, b3] = layer.bezier;
      const entryDur = Number(
        ((layer.entryDuration || 0.75) / Math.max(0.25, layer.speed)).toFixed(2)
      );
      const asset = layer.assetId ? assetMap[layer.assetId] : undefined;

      return `      {/* Overlay Layer: ${layer.name} (Emil Kowalski scale(0.94) entrance) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94, filter: 'blur(4px)' }}
        animate={{ opacity: ${layer.opacity}, y: 0, scale: ${layer.scale}, rotate: ${layer.rotation}, filter: 'blur(0px)' }}
        transition={{
          delay: ${layer.startTime.toFixed(2)},
          duration: ${entryDur},
          ease: [${b0}, ${b1}, ${b2}, ${b3}],
        }}
        style={{
          position: 'absolute',
          left: '${layer.x}%',
          top: '${layer.y}%',
          width: '${layer.width}%',
          transform: 'translate(-50%, -50%)',
          color: '${layer.color}',
          backgroundColor: '${layer.backgroundColor}',
          borderRadius: '${layer.borderRadius}px',
          padding: '12px 16px',
          textAlign: '${layer.textAlign || 'center'}',
          zIndex: 400,
          willChange: 'transform, opacity, filter',
        }}
      >${
        layer.type === 'image' && asset
          ? `<img src="${asset.url}" alt="${asset.name}" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '${layer.borderRadius}px' }} />`
          : `<div style={{ fontSize: '${Math.round(layer.fontSize * 0.45)}px', fontWeight: ${layer.fontWeight} }}>${(layer.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
      }
      </motion.div>`;
    })
    .join('\n\n');

  const bgCss =
    scene.backgroundMode === 'gradient'
      ? `background: '${resolveSceneGradientCss(scene)}',`
      : `backgroundColor: '${scene.backgroundColor}',`;

  return `import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Generated by Kinetix Studio (Design-Engineered Motion Engine)
 * Inspired by Emil Kowalski (animations.dev) & Jakub Antalik (transitions.dev)
 * Scene: ${scene.name} (${spec.label} • ${spec.width}x${spec.height})
 * Formation: ${formation} (${slotCount} slots) • Physics: Spring(${stiffness}, ${damping})
 */
export const MOTION_TOKENS = {
  easeOutQuint: [0.23, 1, 0.32, 1] as const,
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutQuart: [0.77, 0, 0.175, 1] as const,
  spring: { type: 'spring' as const, stiffness: ${stiffness}, damping: ${damping}, mass: 1 },
  staggerChildren: ${staggerSec},
};

export function ${componentName}Motion({
  className = '',
  images = [],
}: {
  className?: string;
  images?: string[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const slotCount = ${slotCount};
  const slots = Array.from({ length: slotCount }, (_, i) => i);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '${Math.round(spec.width * 0.5)}px',
        aspectRatio: '${spec.width} / ${spec.height}',
        ${bgCss}
        overflow: 'hidden',
        borderRadius: '22px',
        perspective: '${Math.round(1350 - pos.perspective * 14)}px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Formation Stage (${formation} • Horizon Tilt ${pos.ringTilt}°) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '${pos.padding}%',
          transformStyle: 'preserve-3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {slots.map((slotIndex) => {
          const angle = (slotIndex / slotCount) * Math.PI * 2;
          const radius = ${Math.round(pos.ringSize * 2.1)};
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * ${(pos.ringOpening / 100).toFixed(2)};
          return (
            <motion.div
              key={slotIndex}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                ...MOTION_TOKENS.spring,
                delay: slotIndex * MOTION_TOKENS.staggerChildren,
              }}
              style={{
                position: 'absolute',
                width: '${pos.cardSize}%',
                aspectRatio: '${pos.cardRatio === 'Auto' ? '1 / 1' : pos.cardRatio.replace(':', ' / ')}',
                borderRadius: '${Math.round(pos.cornerRadius * 4)}px',
                transform: \`translate3d(\${x.toFixed(1)}px, \${y.toFixed(1)}px, 0px) rotateZ(${pos.ringTilt}deg)\`,
                overflow: 'hidden',
                background: '#18181b',
                border: '1px solid rgba(255,255,255,0.12)',
                willChange: 'transform, opacity',
              }}
            >
              {images[slotIndex] && (
                <img
                  src={images[slotIndex]}
                  alt={\`Slot \${slotIndex + 1}\`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

${layersCode}
    </div>
  );
}

export default ${componentName}Motion;
`;
}

/**
 * Generates copy-ready `transitions.dev` & Emil Kowalski CSS Custom Properties + Keyframes
 */
export function generateTransitionsDevCssCode(scene: MotionScene): string {
  const pos = scene.positionSettings || DEFAULT_POSITION_SETTINGS;
  const formation = scene.formation || 'showcase-ring';
  const slug = scene.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'showcase';

  return `/* ==========================================================================
 * Kinetix Studio × transitions.dev CSS Motion Tokens
 * Pattern: ${scene.name} (${formation})
 * Principles: Emil Kowalski (No scale(0), Quint Ease-Out, Compositor-Only)
 * CLI: npx transitions-dev add ${slug}
 * ========================================================================== */

:root {
  /* Core Easing Curves (Emil Kowalski & Jakub Antalik) */
  --t-ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
  --t-ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
  --t-spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Scene Timing & Layout Tokens */
  --t-loop-duration: ${scene.duration}s;
  --t-entry-duration: 420ms;
  --t-stagger-step: ${pos.staggerMs ?? 45}ms;
  --t-scale-floor: 0.94;
  --t-stage-perspective: ${Math.round(1350 - pos.perspective * 14)}px;
  --t-card-radius: ${Math.round(pos.cornerRadius * 4)}px;
  --t-horizon-tilt: ${pos.ringTilt}deg;
}

.t-${slug}-stage {
  position: relative;
  perspective: var(--t-stage-perspective);
  transform-style: preserve-3d;
  background-color: ${scene.backgroundColor};
  overflow: hidden;
}

.t-${slug}-card {
  border-radius: var(--t-card-radius);
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
  transform-origin: 50% 50%;
  transition:
    transform var(--t-entry-duration) var(--t-ease-out-quint),
    opacity var(--t-entry-duration) var(--t-ease-out-quint),
    filter var(--t-entry-duration) var(--t-ease-out-quint);
  transition-delay: calc(var(--slot-index, 0) * var(--t-stagger-step));
}

.t-${slug}-card[data-state="entering"] {
  opacity: 0;
  transform: translate3d(0, 14px, -24px) scale(var(--t-scale-floor));
  filter: blur(4px);
}

.t-${slug}-card[data-state="active"] {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1) rotateZ(var(--t-horizon-tilt));
  filter: blur(0px);
}

/* Accessibility Guard: transitions.dev & Emil Kowalski Standard */
@media (prefers-reduced-motion: reduce) {
  :root {
    --t-entry-duration: 1ms;
    --t-stagger-step: 0ms;
  }

  .t-${slug}-card,
  .t-${slug}-card[data-state="entering"] {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    transform: none !important;
    filter: none !important;
  }
}
`;
}

/**
 * Generates portable JSON representation of the scene & assets for seamless web/mobile integration
 */
export function generateSceneJson(
  scene: MotionScene,
  assets: ImageAsset[]
): string {
  const usedAssetIds = new Set(
    scene.layers.map((l) => l.assetId).filter(Boolean)
  );
  const embeddedAssets = assets.filter(
    (a) => usedAssetIds.has(a.id) || assets.indexOf(a) < (scene.slotCount ?? 12)
  );
  return JSON.stringify(
    {
      schemaVersion: '3.0.0',
      exportedAt: new Date().toISOString(),
      platformSpec: PLATFORM_SPECS[scene.platform],
      scene,
      assets: embeddedAssets,
    },
    null,
    2
  );
}
