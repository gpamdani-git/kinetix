import {
  DEFAULT_POSITION_SETTINGS,
  FormationType,
  ImageAsset,
  ImageFilters,
  MotionLayer,
  MotionScene,
  PositionSettings,
  SocialPlatform,
  TemplateCategoryGroup,
} from './motionEngine';

export const DEFAULT_IMAGE_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hueRotate: 0,
  tintColor: '#3b66f5',
  tintOpacity: 0,
};

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export interface StudioGradientPreset {
  id: string;
  name: string;
  startColor: string;
  endColor: string;
  angle: number;
  type: 'linear' | 'radial';
}

export const STUDIO_GRADIENT_PRESETS: StudioGradientPreset[] = [
  {
    id: 'grad-obsidian-night',
    name: 'Obsidian Night',
    startColor: '#1f2436',
    endColor: '#090a0f',
    angle: 135,
    type: 'radial',
  },
  {
    id: 'grad-cobalt-pulse',
    name: 'Cobalt Pulse',
    startColor: '#1e3a8a',
    endColor: '#090b14',
    angle: 145,
    type: 'linear',
  },
  {
    id: 'grad-violet-velvet',
    name: 'Violet Velvet',
    startColor: '#3b1d5e',
    endColor: '#0b0914',
    angle: 135,
    type: 'linear',
  },
  {
    id: 'grad-emerald-cyber',
    name: 'Emerald Studio',
    startColor: '#0f3d33',
    endColor: '#070c0b',
    angle: 150,
    type: 'linear',
  },
  {
    id: 'grad-sunset-ember',
    name: 'Sunset Ember',
    startColor: '#5c231c',
    endColor: '#0f0a0c',
    angle: 135,
    type: 'linear',
  },
  {
    id: 'grad-titanium-mist',
    name: 'Titanium Mist',
    startColor: '#2d313b',
    endColor: '#101217',
    angle: 160,
    type: 'linear',
  },
  {
    id: 'grad-crimson-noir',
    name: 'Crimson Noir',
    startColor: '#4c1122',
    endColor: '#09070a',
    angle: 130,
    type: 'radial',
  },
  {
    id: 'grad-deep-ocean',
    name: 'Deep Ocean',
    startColor: '#0f3156',
    endColor: '#060c17',
    angle: 180,
    type: 'linear',
  },
  {
    id: 'grad-gold-luxe',
    name: 'Champagne Noir',
    startColor: '#4a3b1c',
    endColor: '#0c0b09',
    angle: 140,
    type: 'linear',
  },
  {
    id: 'grad-arctic-aurora',
    name: 'Arctic Slate',
    startColor: '#1b3b4b',
    endColor: '#0a0e14',
    angle: 120,
    type: 'radial',
  },
  {
    id: 'grad-plum-dusk',
    name: 'Plum Dusk',
    startColor: '#451a3e',
    endColor: '#0b080d',
    angle: 135,
    type: 'linear',
  },
  {
    id: 'grad-carbon-monolith',
    name: 'Carbon Monolith',
    startColor: '#232429',
    endColor: '#08080a',
    angle: 180,
    type: 'linear',
  },
];

export interface StudioBackdropPreset {
  id: string;
  name: string;
  subtitle: string;
  url: string;
}

export const STUDIO_BACKDROP_PRESETS: StudioBackdropPreset[] = [
  {
    id: 'bg-arch-concrete',
    name: 'Architectural Concrete',
    subtitle: 'Minimalist dark gallery wall',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <radialGradient id="g1" cx="50%" cy="32%" r="68%">
            <stop offset="0%" stop-color="#2a2d37"/>
            <stop offset="60%" stop-color="#15171d"/>
            <stop offset="100%" stop-color="#0b0c10"/>
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="url(#g1)"/>
        <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
          <line x1="0" y1="200" x2="800" y2="200"/>
          <line x1="0" y1="400" x2="800" y2="400"/>
          <line x1="0" y1="600" x2="800" y2="600"/>
          <line x1="200" y1="0" x2="200" y2="800"/>
          <line x1="400" y1="0" x2="400" y2="800"/>
          <line x1="600" y1="0" x2="600" y2="800"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'bg-cobalt-cyclorama',
    name: 'Cobalt Cyclorama',
    subtitle: 'Soft studio keylight vignette',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <radialGradient id="g2" cx="50%" cy="28%" r="72%">
            <stop offset="0%" stop-color="#264078"/>
            <stop offset="52%" stop-color="#121c36"/>
            <stop offset="100%" stop-color="#080a12"/>
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="url(#g2)"/>
        <ellipse cx="400" cy="690" rx="340" ry="70" fill="#3b66f5" fill-opacity="0.12"/>
      </svg>
    `),
  },
  {
    id: 'bg-amber-bokeh',
    name: 'Warm Studio Dusk',
    subtitle: 'Golden atmospheric depth',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2d1c15"/>
            <stop offset="50%" stop-color="#171214"/>
            <stop offset="100%" stop-color="#09090c"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#g3)"/>
        <circle cx="220" cy="240" r="160" fill="#e67e22" fill-opacity="0.14"/>
        <circle cx="580" cy="520" r="210" fill="#d35400" fill-opacity="0.1"/>
      </svg>
    `),
  },
  {
    id: 'bg-emerald-botanical',
    name: 'Nordic Forest Mist',
    subtitle: 'Deep botanical sage backdrop',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <radialGradient id="g4" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stop-color="#24382e"/>
            <stop offset="60%" stop-color="#111b16"/>
            <stop offset="100%" stop-color="#080c0a"/>
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="url(#g4)"/>
        <circle cx="540" cy="240" r="180" fill="#52796f" fill-opacity="0.15"/>
      </svg>
    `),
  },
  {
    id: 'bg-titanium-grid',
    name: 'Precision Blueprint',
    subtitle: 'Subtle isometric CAD grid',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#101218"/>
        <g stroke="#3b66f5" stroke-opacity="0.11" stroke-width="1">
          <circle cx="400" cy="400" r="140" fill="none"/>
          <circle cx="400" cy="400" r="260" fill="none"/>
          <circle cx="400" cy="400" r="380" fill="none"/>
          <line x1="0" y1="400" x2="800" y2="400"/>
          <line x1="400" y1="0" x2="400" y2="800"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'bg-velvet-cinema',
    name: 'Cinema Velvet',
    subtitle: 'Anamorphic crimson & slate',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <radialGradient id="g6" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#3a1926"/>
            <stop offset="65%" stop-color="#140d14"/>
            <stop offset="100%" stop-color="#09080b"/>
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="url(#g6)"/>
      </svg>
    `),
  },
];

export const INITIAL_IMAGE_ASSETS: ImageAsset[] = [
  {
    id: 'asset-slot-thu-ave',
    name: '01 · Linear Release v4.2',
    category: 'Product',
    width: 600,
    height: 600,
    createdAt: '2026-11-01',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#191b22"/>
            <stop offset="100%" stop-color="#0d0e12"/>
          </linearGradient>
          <linearGradient id="accent1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3b66f5"/>
            <stop offset="100%" stop-color="#70b5f9"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" rx="44" fill="url(#bg1)" stroke="#2e313d" stroke-width="4"/>
        <rect x="44" y="44" width="136" height="36" rx="18" fill="#212531"/>
        <circle cx="68" cy="62" r="6" fill="#3b66f5"/>
        <text x="86" y="68" fill="#d4d8e2" font-family="sans-serif" font-size="16" font-weight="700" letter-spacing="1">SPRING 380</text>
        <text x="44" y="168" fill="#ffffff" font-family="sans-serif" font-size="68" font-weight="800" letter-spacing="-2">60 FPS</text>
        <text x="44" y="220" fill="#8b92a5" font-family="sans-serif" font-size="26" font-weight="600">Sub-millisecond UI Physics</text>
        <rect x="44" y="276" width="512" height="276" rx="24" fill="#14161c" stroke="#262934" stroke-width="3"/>
        <path d="M 84 488 C 160 488, 175 336, 260 336 C 345 336, 360 336, 516 336" fill="none" stroke="url(#accent1)" stroke-width="10" stroke-linecap="round"/>
        <circle cx="260" cy="336" r="11" fill="#ffffff" stroke="#3b66f5" stroke-width="5"/>
        <text x="84" y="344" fill="#70b5f9" font-family="monospace" font-size="20" font-weight="700">cubic-bezier(0.23, 1, 0.32, 1)</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-2026-nov',
    name: '02 · Editorial Meadow 2026',
    category: 'Brand',
    width: 600,
    height: 600,
    createdAt: '2026-11-01',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="meadow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#c9d6df"/>
            <stop offset="50%" stop-color="#8fa399"/>
            <stop offset="100%" stop-color="#3a4e3d"/>
          </linearGradient>
          <radialGradient id="sun" cx="70%" cy="25%" r="55%">
            <stop offset="0%" stop-color="#fff5e4" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="#d9a773" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#2c3a2e" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" rx="44" fill="url(#meadow)"/>
        <rect width="600" height="600" rx="44" fill="url(#sun)"/>
        <circle cx="190" cy="430" r="14" fill="#d95338" opacity="0.85"/>
        <circle cx="340" cy="470" r="18" fill="#e67e22" opacity="0.8"/>
        <circle cx="430" cy="390" r="11" fill="#d95338" opacity="0.9"/>
        <text x="54" y="128" fill="#ffffff" font-family="sans-serif" font-size="76" font-weight="800" letter-spacing="-2">THU</text>
        <text x="54" y="536" fill="#f4f6f0" font-family="sans-serif" font-size="62" font-weight="700" letter-spacing="-1">0316 AVE</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-12k-worldwide',
    name: '03 · Sonner Toast Stack',
    category: 'Product',
    width: 600,
    height: 600,
    createdAt: '2026-11-02',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#121318" stroke="#282a34" stroke-width="4"/>
        <rect x="84" y="130" width="432" height="96" rx="20" fill="#191b22" stroke="#2d303d" stroke-width="2" opacity="0.55"/>
        <rect x="64" y="185" width="472" height="106" rx="22" fill="#1e2029" stroke="#363a4a" stroke-width="2" opacity="0.8"/>
        <rect x="44" y="250" width="512" height="132" rx="24" fill="#242733" stroke="#3b66f5" stroke-width="3"/>
        <circle cx="96" cy="316" r="20" fill="#27a644"/>
        <path d="M 88 316 L 94 322 L 106 310" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <text x="136" y="308" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="700">Deployment Ready</text>
        <text x="136" y="344" fill="#9ca3b5" font-family="monospace" font-size="19">scale(0.94 → 1.0) · 380/30</text>
        <text x="54" y="520" fill="#f5f5f7" font-family="sans-serif" font-size="44" font-weight="800" letter-spacing="-1">SONNER STACK</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-ultimate-taste',
    name: '04 · Framed Botanical 2026',
    category: 'Brand',
    width: 600,
    height: 600,
    createdAt: '2026-11-02',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="innerSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d8e2eb"/>
            <stop offset="65%" stop-color="#8b9c87"/>
            <stop offset="100%" stop-color="#354230"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" rx="44" fill="#6b7455"/>
        <rect x="88" y="88" width="424" height="424" rx="22" fill="url(#innerSky)"/>
        <circle cx="240" cy="410" r="12" fill="#e05a3a"/>
        <circle cx="360" cy="440" r="10" fill="#f08a4b"/>
        <text x="300" y="255" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="56" font-weight="700" letter-spacing="1">2026</text>
        <text x="300" y="425" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="48" font-weight="700" letter-spacing="2">NOV</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-natural-fresh',
    name: '05 · Dynamic Island Morph',
    category: 'Product',
    width: 600,
    height: 600,
    createdAt: '2026-11-03',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#15171e" stroke="#2b2e3b" stroke-width="4"/>
        <rect x="70" y="90" width="460" height="240" rx="48" fill="#090a0d" stroke="#3b66f5" stroke-width="3"/>
        <circle cx="150" cy="210" r="42" fill="#3b66f5"/>
        <text x="220" y="198" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="700">Morphing Card</text>
        <text x="220" y="240" fill="#70b5f9" font-family="monospace" font-size="20">transitions.dev</text>
        <text x="70" y="445" fill="#ffffff" font-family="sans-serif" font-size="52" font-weight="800" letter-spacing="-1">ORIGIN AWARE</text>
        <text x="70" y="500" fill="#8b92a5" font-family="sans-serif" font-size="28" font-weight="500">Seamless bounds interpolation</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-botanical-oval',
    name: '06 · Botanical Bloom Card',
    category: 'Product',
    width: 600,
    height: 600,
    createdAt: '2026-11-03',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#d7ddd8"/>
        <ellipse cx="300" cy="215" rx="185" ry="125" fill="#899a8c"/>
        <circle cx="300" cy="215" r="46" fill="#d96b43"/>
        <circle cx="300" cy="215" r="18" fill="#f7d08a"/>
        <text x="300" y="430" text-anchor="middle" fill="#222923" font-family="sans-serif" font-size="38" font-weight="700">Maple Street Studio</text>
        <text x="300" y="480" text-anchor="middle" fill="#475449" font-family="sans-serif" font-size="30" font-weight="600">Architectural Lookbook</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-barcelona',
    name: '07 · European Tour Typo',
    category: 'Brand',
    width: 600,
    height: 600,
    createdAt: '2026-11-03',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#1e2024"/>
        <text x="300" y="185" text-anchor="middle" fill="#a0a8b4" font-family="sans-serif" font-size="44" font-weight="700" letter-spacing="2">MADRID</text>
        <line x1="90" y1="240" x2="510" y2="240" stroke="#383d47" stroke-width="3"/>
        <text x="300" y="325" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="52" font-weight="800" letter-spacing="2">BARCELONA</text>
        <line x1="90" y1="380" x2="510" y2="380" stroke="#383d47" stroke-width="3"/>
        <text x="300" y="465" text-anchor="middle" fill="#70b5f9" font-family="sans-serif" font-size="44" font-weight="700" letter-spacing="2">ZÜRICH</text>
      </svg>
    `),
  },
  {
    id: 'asset-slot-checker-portrait',
    name: '08 · Studio Archive Grid',
    category: 'Avatar',
    width: 600,
    height: 600,
    createdAt: '2026-11-04',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#5e6850"/>
        <circle cx="300" cy="195" r="78" fill="#22261e"/>
        <g fill="#e9ede4">
          <rect x="180" y="310" width="60" height="60" rx="10"/>
          <rect x="300" y="310" width="60" height="60" rx="10"/>
          <rect x="240" y="370" width="60" height="60" rx="10"/>
          <rect x="360" y="370" width="60" height="60" rx="10"/>
          <rect x="180" y="430" width="60" height="60" rx="10"/>
          <rect x="300" y="430" width="60" height="60" rx="10"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'asset-linear-ui',
    name: '09 · Raycast Command Dock',
    category: 'Product',
    width: 800,
    height: 520,
    createdAt: '2026-11-01',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
        <rect width="800" height="520" rx="32" fill="#141518" stroke="#2d3039" stroke-width="4"/>
        <rect x="36" y="36" width="210" height="448" rx="16" fill="#1b1c20"/>
        <circle cx="68" cy="68" r="14" fill="#3b66f5"/>
        <rect x="96" y="60" width="110" height="16" rx="5" fill="#f7f8f8"/>
        <rect x="276" y="36" width="488" height="180" rx="16" fill="#1b1c20"/>
        <text x="308" y="92" fill="#8a8f98" font-family="sans-serif" font-size="18" font-weight="600">FRAME LOCK</text>
        <text x="308" y="152" fill="#ffffff" font-family="sans-serif" font-size="44" font-weight="800">99.8% 60FPS Sync</text>
        <rect x="276" y="242" width="488" height="242" rx="16" fill="#1b1c20"/>
        <circle cx="520" cy="363" r="68" fill="none" stroke="#3b66f5" stroke-width="16" stroke-dasharray="310 420" stroke-linecap="round"/>
        <text x="520" y="372" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="700">60 FPS</text>
      </svg>
    `),
  },
  {
    id: 'asset-kinetic-prism',
    name: '10 · Obsidian Spatial Prism',
    category: 'Background',
    width: 600,
    height: 600,
    createdAt: '2026-11-02',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#131519"/>
        <polygon points="300,85 500,435 100,435" fill="none" stroke="#3b66f5" stroke-width="8"/>
        <circle cx="300" cy="300" r="76" fill="#1c1f26" stroke="#ffffff" stroke-width="6"/>
        <circle cx="300" cy="300" r="32" fill="#3b66f5"/>
        <text x="300" y="525" text-anchor="middle" fill="#d4d8e2" font-family="monospace" font-size="24" font-weight="700">PERSPECTIVE 1200PX</text>
      </svg>
    `),
  },
  {
    id: 'asset-waveform-card',
    name: '11 · Audio Telemetry Spectrum',
    category: 'Brand',
    width: 600,
    height: 600,
    createdAt: '2026-11-03',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#16181d" stroke="#2c303a" stroke-width="4"/>
        <text x="54" y="100" fill="#8b92a5" font-family="monospace" font-size="22" font-weight="700">KEYFRAME SPECTRUM</text>
        <g fill="#3b66f5">
          <rect x="64" y="240" width="24" height="170" rx="12"/>
          <rect x="112" y="180" width="24" height="290" rx="12"/>
          <rect x="160" y="140" width="24" height="370" rx="12" fill="#688bfa"/>
          <rect x="208" y="210" width="24" height="230" rx="12"/>
          <rect x="256" y="155" width="24" height="340" rx="12" fill="#ffffff"/>
          <rect x="304" y="195" width="24" height="260" rx="12"/>
          <rect x="352" y="245" width="24" height="160" rx="12"/>
          <rect x="400" y="170" width="24" height="310" rx="12" fill="#688bfa"/>
          <rect x="448" y="215" width="24" height="220" rx="12"/>
          <rect x="496" y="160" width="24" height="330" rx="12"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'asset-creator-badge',
    name: '12 · North Ave Lookbook',
    category: 'Avatar',
    width: 600,
    height: 600,
    createdAt: '2026-11-04',
    filters: { ...DEFAULT_IMAGE_FILTERS },
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" rx="44" fill="#707a5e"/>
        <rect x="75" y="75" width="450" height="350" rx="22" fill="#293325"/>
        <circle cx="300" cy="250" r="95" fill="#4f6346"/>
        <text x="75" y="515" fill="#ffffff" font-family="sans-serif" font-size="52" font-weight="800" letter-spacing="-1">NORTH AVE</text>
      </svg>
    `),
  },
];

const DEFAULT_STARTER_LAYERS: MotionLayer[] = [
  {
    id: 'layer-eyebrow',
    name: 'Release Tagline',
    type: 'text',
    visible: false,
    locked: false,
    x: 50,
    y: 13,
    width: 80,
    height: 8,
    rotation: 0,
    scale: 1,
    opacity: 1,
    borderRadius: 8,
    text: 'KINETIX STUDIO · SPRING 380/30',
    subtext: '',
    fontSize: 26,
    fontWeight: 600,
    textAlign: 'center',
    color: '#70b5f9',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    animationType: 'slide-up',
    startTime: 0.0,
    duration: 15.8,
    entryDuration: 0.65,
    exitAnimation: false,
    speed: 1.2,
    bezier: [0.23, 1, 0.32, 1],
    easingPreset: 'emil-quint-out',
    loopEffect: 'none',
  },
  {
    id: 'layer-hero-title',
    name: 'Main Display Headline',
    type: 'text',
    visible: false,
    locked: false,
    x: 50,
    y: 84,
    width: 84,
    height: 16,
    rotation: 0,
    scale: 1,
    opacity: 1,
    borderRadius: 12,
    text: 'Design-Engineered Motion.',
    subtext: 'cubic-bezier(0.23, 1, 0.32, 1) · Zero crooked transforms',
    fontSize: 44,
    fontWeight: 700,
    textAlign: 'center',
    color: '#f5f5f7',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    animationType: 'fade-scale',
    startTime: 0.2,
    duration: 15.0,
    entryDuration: 0.75,
    exitAnimation: false,
    speed: 1.0,
    bezier: [0.23, 1, 0.32, 1],
    easingPreset: 'emil-quint-out',
    loopEffect: 'none',
  },
  {
    id: 'layer-ui-showcase',
    name: 'Product UI Capture',
    type: 'image',
    visible: false,
    locked: false,
    x: 50,
    y: 50,
    width: 72,
    height: 36,
    rotation: 0,
    scale: 1,
    opacity: 1,
    borderRadius: 16,
    fontSize: 32,
    fontWeight: 600,
    color: '#f7f8f8',
    backgroundColor: '#0f1011',
    borderColor: '#34343a',
    borderWidth: 1,
    assetId: 'asset-linear-ui',
    animationType: 'flip-3d',
    startTime: 0.5,
    duration: 4.5,
    entryDuration: 0.85,
    exitAnimation: true,
    speed: 1.0,
    bezier: [0.23, 1, 0.32, 1],
    easingPreset: 'emil-quint-out',
    loopEffect: 'float',
  },
];

interface TemplateSeed {
  id: string;
  name: string;
  referenceSubtitle: string;
  group: TemplateCategoryGroup;
  formation: FormationType;
  isNew?: boolean;
  platform?: SocialPlatform;
  slotCount?: number;
  pos?: Partial<PositionSettings>;
  includeStarterLayers?: boolean;
}

const TEMPLATE_SEEDS: TemplateSeed[] = [
  // ==========================================================================
  // 1. 3D & PERSPECTIVE · 12
  // ==========================================================================
  {
    id: 'preset-showcase-ring',
    name: 'Orbital Ring',
    referenceSubtitle: 'Showcase Ring',
    group: '3d-perspective',
    formation: 'showcase-ring',
    includeStarterLayers: true,
    pos: { ringTilt: -18, ringOpening: 52, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-sphere-wall',
    name: 'Dome Matrix',
    referenceSubtitle: 'Sphere Wall',
    group: '3d-perspective',
    formation: 'sphere-wall',
    pos: { ringTilt: 0, ringOpening: 64, ringSize: 88, cardSize: 21 },
  },
  {
    id: 'preset-card-globe',
    name: 'Geodesic Sphere',
    referenceSubtitle: 'Card Globe',
    group: '3d-perspective',
    formation: 'card-globe',
    pos: { ringTilt: 0, ringOpening: 72, ringSize: 86, cardSize: 20 },
  },
  {
    id: 'preset-orbit-globe',
    name: 'Core Cluster',
    referenceSubtitle: 'Orbit Globe',
    group: '3d-perspective',
    formation: 'orbit-globe',
    pos: { ringTilt: 0, ringOpening: 66, ringSize: 80, cardSize: 24 },
  },
  {
    id: 'preset-sphere-cascade',
    name: 'Meridian Cascade',
    referenceSubtitle: 'Sphere Cascade',
    group: '3d-perspective',
    formation: 'sphere-cascade',
    pos: { ringTilt: 0, ringOpening: 68, ringSize: 86, cardSize: 19 },
  },
  {
    id: 'preset-totem-wall',
    name: 'Monolith Wall',
    referenceSubtitle: 'Totem Wall',
    group: '3d-perspective',
    formation: 'totem-wall',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-parallax-totem',
    name: 'Depth Pillars',
    referenceSubtitle: 'Parallax Totem',
    group: '3d-perspective',
    formation: 'parallax-totem',
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 86, cardSize: 24 },
  },
  {
    id: 'preset-card-tunnel',
    name: 'Infinity Corridor',
    referenceSubtitle: 'Card Tunnel',
    group: '3d-perspective',
    formation: 'card-tunnel',
    pos: { ringTilt: 0, ringOpening: 68, ringSize: 90, cardSize: 24, perspective: 30 },
  },
  {
    id: 'preset-spiral-stream',
    name: 'Helix Ribbon',
    referenceSubtitle: 'Spiral Stream',
    group: '3d-perspective',
    formation: 'spiral-stream',
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 82, cardSize: 22 },
  },
  {
    id: 'preset-depth-stack',
    name: 'Z-Space Drift',
    referenceSubtitle: 'Depth Stack',
    group: '3d-perspective',
    formation: 'depth-stack',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 25 },
  },
  {
    id: 'preset-cover-ring',
    name: 'Panoramic Ring H',
    referenceSubtitle: 'Cover Ring',
    group: '3d-perspective',
    formation: 'cover-ring',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 28 },
  },
  {
    id: 'preset-cover-ring-v',
    name: 'Panoramic Ring V',
    referenceSubtitle: 'Cover Ring V',
    group: '3d-perspective',
    formation: 'cover-ring-v',
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 84, cardSize: 26 },
  },

  // ==========================================================================
  // 2. MULTISCENE · 14
  // ==========================================================================
  {
    id: 'preset-flyby-rolodex',
    name: 'Aero Rolodex',
    referenceSubtitle: 'Flyby Rolodex',
    group: 'multiscene',
    formation: 'flyby-rolodex',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 86, cardSize: 30 },
  },
  {
    id: 'preset-bloom-belt',
    name: 'Petal Belt',
    referenceSubtitle: 'Bloom Belt',
    group: 'multiscene',
    formation: 'bloom-belt',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 26 },
  },
  {
    id: 'preset-lens-orbit',
    name: 'Aperture Orbit',
    referenceSubtitle: 'Lens Orbit',
    group: 'multiscene',
    formation: 'lens-orbit',
    isNew: true,
    pos: { ringTilt: -8, ringOpening: 52, ringSize: 86, cardSize: 24 },
  },
  {
    id: 'preset-stairway',
    name: 'Stepped Ascent',
    referenceSubtitle: 'Stairway',
    group: 'multiscene',
    formation: 'stairway',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-grid-dive',
    name: 'Matrix Plunge',
    referenceSubtitle: 'Grid Dive',
    group: 'multiscene',
    formation: 'grid-dive',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 50, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-pop-parade',
    name: 'Kinetic Parade',
    referenceSubtitle: 'Pop Parade',
    group: 'multiscene',
    formation: 'pop-parade',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 82, cardSize: 24 },
  },
  {
    id: 'preset-triple-scene',
    name: 'Triptych Stage',
    referenceSubtitle: 'Triple Scene',
    group: 'multiscene',
    formation: 'triple-scene',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 26 },
  },
  {
    id: 'preset-collage-reel',
    name: 'Editorial Montage',
    referenceSubtitle: 'Collage Reel',
    group: 'multiscene',
    formation: 'collage-reel',
    pos: { ringTilt: 0, ringOpening: 50, ringSize: 82, cardSize: 28 },
  },
  {
    id: 'preset-fan-shuffle',
    name: 'Deck Fanning',
    referenceSubtitle: 'Fan Shuffle',
    group: 'multiscene',
    formation: 'fan-shuffle',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 24 },
  },
  {
    id: 'preset-sweep-ring',
    name: 'Sweeping Halo',
    referenceSubtitle: 'Sweep Ring',
    group: 'multiscene',
    formation: 'sweep-ring',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 86, cardSize: 22 },
  },
  {
    id: 'preset-scatter-dial',
    name: 'Radial Dial',
    referenceSubtitle: 'Scatter Dial',
    group: 'multiscene',
    formation: 'scatter-dial',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 60, ringSize: 82, cardSize: 21 },
  },
  {
    id: 'preset-grid-zoom',
    name: 'Macro Split Zoom',
    referenceSubtitle: 'Grid Zoom',
    group: 'multiscene',
    formation: 'grid-zoom',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 86, cardSize: 30 },
  },
  {
    id: 'preset-spread-rows',
    name: 'Horizontal Strata',
    referenceSubtitle: 'Spread Rows',
    group: 'multiscene',
    formation: 'spread-rows',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-spread-columns',
    name: 'Vertical Columns',
    referenceSubtitle: 'Spread Columns',
    group: 'multiscene',
    formation: 'spread-columns',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 22 },
  },

  // ==========================================================================
  // 3. ISOMETRIC · 3
  // ==========================================================================
  {
    id: 'preset-iso-cascade',
    name: 'Iso Domino Cascade',
    referenceSubtitle: 'Iso Cascade',
    group: 'isometric',
    formation: 'iso-cascade',
    pos: { ringTilt: 12, ringOpening: 54, ringSize: 84, cardSize: 26 },
  },
  {
    id: 'preset-iso-focus',
    name: 'Iso Spotlight Deck',
    referenceSubtitle: 'Iso Focus',
    group: 'isometric',
    formation: 'iso-focus',
    pos: { ringTilt: 12, ringOpening: 54, ringSize: 86, cardSize: 28 },
  },
  {
    id: 'preset-iso-orbit',
    name: 'Iso Tabletop Orbit',
    referenceSubtitle: 'Iso Orbit',
    group: 'isometric',
    formation: 'iso-orbit',
    slotCount: 9,
    pos: { ringTilt: 14, ringOpening: 58, ringSize: 82, cardSize: 22 },
  },

  // ==========================================================================
  // 4. ORBIT · 8
  // ==========================================================================
  {
    id: 'preset-orbit-showcase',
    name: 'Crown Carousel',
    referenceSubtitle: 'Orbit Showcase',
    group: 'orbit',
    formation: 'orbit-showcase',
    pos: { ringTilt: 0, ringOpening: 48, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-orbit-bloom',
    name: 'Starburst Bloom',
    referenceSubtitle: 'Orbit Bloom',
    group: 'orbit',
    formation: 'orbit-bloom',
    pos: { ringTilt: -10, ringOpening: 56, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-orbit-carousel',
    name: 'Panoramic Belt',
    referenceSubtitle: 'Orbit Carousel',
    group: 'orbit',
    formation: 'orbit-carousel',
    pos: { ringTilt: 0, ringOpening: 36, ringSize: 86, cardSize: 26 },
  },
  {
    id: 'preset-photo-orbit',
    name: 'Aperture Ring',
    referenceSubtitle: 'Photo Orbit',
    group: 'orbit',
    formation: 'photo-orbit',
    pos: { ringTilt: 0, ringOpening: 66, ringSize: 82, cardSize: 23 },
  },
  {
    id: 'preset-focus-orbit',
    name: 'Chrono Ring',
    referenceSubtitle: 'Focus Orbit',
    group: 'orbit',
    formation: 'focus-orbit',
    pos: { ringTilt: 0, ringOpening: 72, ringSize: 86, cardSize: 21 },
  },
  {
    id: 'preset-vortex-spin',
    name: 'Turbine Vortex',
    referenceSubtitle: 'Vortex Spin',
    group: 'orbit',
    formation: 'vortex-spin',
    pos: { ringTilt: 0, ringOpening: 68, ringSize: 84, cardSize: 20 },
  },
  {
    id: 'preset-wheel-spin',
    name: 'Ferris Wheel',
    referenceSubtitle: 'Wheel Spin',
    group: 'orbit',
    formation: 'wheel-spin',
    pos: { ringTilt: 0, ringOpening: 70, ringSize: 82, cardSize: 22 },
  },
  {
    id: 'preset-wheel-spin-arc',
    name: 'Horizon Arc',
    referenceSubtitle: 'Wheel Spin Arc',
    group: 'orbit',
    formation: 'wheel-spin-arc',
    pos: { ringTilt: 0, ringOpening: 60, ringSize: 88, cardSize: 22 },
  },

  // ==========================================================================
  // 5. CAROUSEL & FLOW · 10
  // ==========================================================================
  {
    id: 'preset-card-totem',
    name: 'Vertical Totem',
    referenceSubtitle: 'Card Totem',
    group: 'carousel-flow',
    formation: 'card-totem',
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 84, cardSize: 28 },
  },
  {
    id: 'preset-film-strip',
    name: 'Cinema Strip',
    referenceSubtitle: 'Film Strip',
    group: 'carousel-flow',
    formation: 'film-strip',
    pos: { ringTilt: 0, ringOpening: 50, ringSize: 86, cardSize: 26 },
  },
  {
    id: 'preset-wheel-carousel',
    name: 'Paddle Wheel',
    referenceSubtitle: 'Wheel Carousel',
    group: 'carousel-flow',
    formation: 'wheel-carousel',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 86, cardSize: 30 },
  },
  {
    id: 'preset-cover-flow',
    name: 'Studio Coverflow H',
    referenceSubtitle: 'Cover Flow',
    group: 'carousel-flow',
    formation: 'cover-flow',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 28 },
  },
  {
    id: 'preset-cover-flow-v',
    name: 'Studio Coverflow V',
    referenceSubtitle: 'Cover Flow V',
    group: 'carousel-flow',
    formation: 'cover-flow-v',
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 28 },
  },
  {
    id: 'preset-carousel-flow',
    name: 'Asymmetric Glide',
    referenceSubtitle: 'Carousel Flow',
    group: 'carousel-flow',
    formation: 'carousel-flow',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 86, cardSize: 30 },
  },
  {
    id: 'preset-diagonal-cascade',
    name: 'Echelon Cascade',
    referenceSubtitle: 'Diagonal Cascade',
    group: 'carousel-flow',
    formation: 'diagonal-cascade',
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 25 },
  },
  {
    id: 'preset-focus-slider',
    name: 'Hero Slider',
    referenceSubtitle: 'Focus Slider',
    group: 'carousel-flow',
    formation: 'focus-slider',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 86, cardSize: 32 },
  },
  {
    id: 'preset-mosaic-marquee',
    name: 'Bento Marquee',
    referenceSubtitle: 'Mosaic Marquee',
    group: 'carousel-flow',
    formation: 'mosaic-marquee',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-hero-reel',
    name: 'Ribbon Showreel',
    referenceSubtitle: 'Hero Reel',
    group: 'carousel-flow',
    formation: 'hero-reel',
    pos: { ringTilt: 0, ringOpening: 48, ringSize: 84, cardSize: 22 },
  },

  // ==========================================================================
  // 6. GRID · 8
  // ==========================================================================
  {
    id: 'preset-grid-reveal',
    name: 'Bento Reveal',
    referenceSubtitle: 'Grid Reveal',
    group: 'grid',
    formation: 'grid-reveal',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-spotlight-zoom',
    name: 'Macro Cell Zoom',
    referenceSubtitle: 'Spotlight Zoom',
    group: 'grid',
    formation: 'spotlight-zoom',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 86, cardSize: 32 },
  },
  {
    id: 'preset-flip-grid',
    name: 'Kinetic Flip Grid',
    referenceSubtitle: 'Flip Grid',
    group: 'grid',
    formation: 'flip-grid',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-pop-grid',
    name: 'Harmonic Pop Grid',
    referenceSubtitle: 'Pop Grid',
    group: 'grid',
    formation: 'pop-grid',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-ticker-loop',
    name: 'Slanted Ticker',
    referenceSubtitle: 'Ticker Loop',
    group: 'grid',
    formation: 'ticker-loop',
    pos: { ringTilt: -4, ringOpening: 56, ringSize: 84, cardSize: 23 },
  },
  {
    id: 'preset-ticker-tilt',
    name: 'Perspective Masonry',
    referenceSubtitle: 'Ticker Tilt',
    group: 'grid',
    formation: 'ticker-tilt',
    pos: { ringTilt: -6, ringOpening: 56, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-column-drift',
    name: 'Parallax Columns',
    referenceSubtitle: 'Column Drift',
    group: 'grid',
    formation: 'column-drift',
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-feed-scroll',
    name: 'Social Feed Scroll',
    referenceSubtitle: 'Feed Scroll',
    group: 'grid',
    formation: 'feed-scroll',
    isNew: true,
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 24 },
  },

  // ==========================================================================
  // 7. SPOTLIGHT & FOCUS · 4
  // ==========================================================================
  {
    id: 'preset-center-stage',
    name: 'Solo Monolith',
    referenceSubtitle: 'Center Stage',
    group: 'spotlight-focus',
    formation: 'center-stage',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 86, cardSize: 34 },
  },
  {
    id: 'preset-focus-shift',
    name: 'Sidebar Dock Shift',
    referenceSubtitle: 'Focus Shift',
    group: 'spotlight-focus',
    formation: 'focus-shift',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 86, cardSize: 28 },
  },
  {
    id: 'preset-deck-peel',
    name: 'Top-Card Peel',
    referenceSubtitle: 'Deck Peel',
    group: 'spotlight-focus',
    formation: 'deck-peel',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 30 },
  },
  {
    id: 'preset-zoom-parallax',
    name: 'Depth Breath Zoom',
    referenceSubtitle: 'Zoom Parallax',
    group: 'spotlight-focus',
    formation: 'zoom-parallax',
    pos: { ringTilt: 0, ringOpening: 52, ringSize: 86, cardSize: 34 },
  },

  // ==========================================================================
  // 8. REVEAL & WIPE · 4
  // ==========================================================================
  {
    id: 'preset-diagonal-wipe',
    name: 'Razor Diagonal Wipe',
    referenceSubtitle: 'Diagonal Wipe',
    group: 'reveal-wipe',
    formation: 'diagonal-wipe',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 24 },
  },
  {
    id: 'preset-stripe-reveal',
    name: 'Venetian Louver Reveal',
    referenceSubtitle: 'Stripe Reveal',
    group: 'reveal-wipe',
    formation: 'stripe-reveal',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 24 },
  },
  {
    id: 'preset-split-reveal',
    name: 'Dual Curtain Split',
    referenceSubtitle: 'Split Reveal',
    group: 'reveal-wipe',
    formation: 'split-reveal',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 86, cardSize: 28 },
  },
  {
    id: 'preset-mosaic-wipe',
    name: 'Tile Shutter Wipe',
    referenceSubtitle: 'Mosaic Wipe',
    group: 'reveal-wipe',
    formation: 'mosaic-wipe',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 24 },
  },

  // ==========================================================================
  // 9. STACK & SCATTER · 7
  // ==========================================================================
  {
    id: 'preset-stack-slide',
    name: 'Layered Deck Slide',
    referenceSubtitle: 'Stack Slide',
    group: 'stack-scatter',
    formation: 'stack-slide',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 30 },
  },
  {
    id: 'preset-cascade-drop',
    name: 'Gravity Stack Drop',
    referenceSubtitle: 'Cascade Drop',
    group: 'stack-scatter',
    formation: 'cascade-drop',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 30 },
  },
  {
    id: 'preset-cascade-diagonal',
    name: 'Stepped Trail',
    referenceSubtitle: 'Cascade Diagonal',
    group: 'stack-scatter',
    formation: 'cascade-diagonal',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 24 },
  },
  {
    id: 'preset-image-trail',
    name: 'Echo Motion Trail',
    referenceSubtitle: 'Image Trail',
    group: 'stack-scatter',
    formation: 'image-trail',
    pos: { ringTilt: 0, ringOpening: 54, ringSize: 84, cardSize: 22 },
  },
  {
    id: 'preset-poster-burst',
    name: 'Centrifugal Burst',
    referenceSubtitle: 'Poster Burst',
    group: 'stack-scatter',
    formation: 'poster-burst',
    pos: { ringTilt: 0, ringOpening: 58, ringSize: 86, cardSize: 26 },
  },
  {
    id: 'preset-card-toss',
    name: 'Physics Table Toss',
    referenceSubtitle: 'Card Toss',
    group: 'stack-scatter',
    formation: 'card-toss',
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 24 },
  },
  {
    id: 'preset-position-dance',
    name: 'Modular Bento Dance',
    referenceSubtitle: 'Position Dance',
    group: 'stack-scatter',
    formation: 'position-dance',
    pos: { ringTilt: 0, ringOpening: 56, ringSize: 84, cardSize: 24 },
  },
];

export const MOTION_PRESET_GALLERY: MotionScene[] = TEMPLATE_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  referenceSubtitle: seed.referenceSubtitle,
  category: 'Instagram',
  templateGroup: seed.group,
  motionBadge: seed.isNew ? 'NEW' : undefined,
  isNew: seed.isNew,
  formation: seed.formation,
  description: `${seed.name} (${seed.referenceSubtitle}) — Kinetix Pro studio choreography.`,
  platform: seed.platform || 'instagram-post',
  fps: 60,
  duration: 16.0,
  backgroundMode: 'colour',
  backgroundColor: '#101014',
  backgroundSecondaryColor: '#090a0f',
  backgroundGradientAngle: 135,
  backgroundGradientType: 'radial',
  backgroundBlur: 0,
  backgroundDim: 20,
  accentColor: '#3b66f5',
  showGridOverlay: false,
  slotCount: seed.slotCount ?? 12,
  positionSettings: {
    ...DEFAULT_POSITION_SETTINGS,
    ...(seed.pos || {}),
  },
  keyframes: [],
  layers: seed.includeStarterLayers
    ? JSON.parse(JSON.stringify(DEFAULT_STARTER_LAYERS))
    : [],
}));
