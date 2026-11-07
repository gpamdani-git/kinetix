import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Plus,
  Upload,
  Check,
  Edit3,
  Layers,
  Search,
  Type,
  Image as ImageIcon,
  Hash,
} from 'lucide-react';
import {
  FormationType,
  ImageAsset,
  MotionLayer,
  MotionScene,
  TemplateCategoryGroup,
} from '../engine/motionEngine';
import { DEFAULT_IMAGE_FILTERS } from '../engine/presets';

interface LeftGalleryPanelProps {
  activeTab: 'presets' | 'assets';
  onChangeTab: (tab: 'presets' | 'assets') => void;
  presets: MotionScene[];
  currentSceneId: string;
  onSelectPreset: (scene: MotionScene) => void;
  onSaveCurrentAsPreset: (customName: string) => void;
  assets: ImageAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
  onAddAsset: (newAsset: ImageAsset) => void;
  onUpdateAsset: (assetId: string, updates: Partial<ImageAsset>) => void;
  onDeleteAsset: (assetId: string) => void;
  onInsertAssetLayer: (asset: ImageAsset) => void;
  layers: MotionLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onAddLayer: (type: 'text' | 'image' | 'metric') => void;
  onUpdateLayer: (layerId: string, updates: Partial<MotionLayer>) => void;
  onDuplicateLayer: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onReorderLayer: (layerId: string, direction: 'up' | 'down') => void;
}

const CATEGORY_SECTIONS: {
  id: TemplateCategoryGroup;
  title: string;
}[] = [
  { id: '3d-perspective', title: '3D & PERSPECTIVE' },
  { id: 'multiscene', title: 'MULTISCENE' },
  { id: 'isometric', title: 'ISOMETRIC' },
  { id: 'orbit', title: 'ORBIT' },
  { id: 'carousel-flow', title: 'CAROUSEL & FLOW' },
  { id: 'grid', title: 'GRID' },
  { id: 'spotlight-focus', title: 'SPOTLIGHT & FOCUS' },
  { id: 'reveal-wipe', title: 'REVEAL & WIPE' },
  { id: 'stack-scatter', title: 'STACK & SCATTER' },
];

/**
 * Lightweight, GPU-composited animated schematic thumbnails matching all 9 categories
 * and 70 templates from the reference screenshots.
 * Uses pure CSS compositor classes (`.kx-anim-*`) for subtle continuous motion + faster hover preview.
 */
function FormationThumbnailSvg({
  formation,
  isSelected,
}: {
  formation?: FormationType;
  isSelected?: boolean;
}) {
  const cDark = '#3a3c46';
  const cMid = '#585b6a';
  const cLight = isSelected ? '#6d8cff' : '#858999';
  const cHero = isSelected ? '#3b66f5' : '#9ca1b4';

  switch (formation) {
    // 1. 3D & PERSPECTIVE (12)
    case 'showcase-ring':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="18" y="18" width="11" height="9" rx="2.5" fill={cDark} transform="rotate(-18 23 22)" />
            <rect x="31" y="16" width="11" height="9" rx="2.5" fill={cDark} transform="rotate(-8 36 20)" />
            <rect x="44" y="19" width="11" height="9" rx="2.5" fill={cDark} transform="rotate(8 49 23)" />
            <rect x="55" y="27" width="11" height="10" rx="2.5" fill={cMid} transform="rotate(22 60 32)" />
            <rect x="11" y="29" width="13" height="13" rx="3" fill={cMid} transform="rotate(-24 17 35)" />
            <rect x="52" y="40" width="13" height="13" rx="3" fill={cMid} transform="rotate(15 58 46)" />
            <rect x="17" y="42" width="16" height="16" rx="3.5" fill={cLight} transform="rotate(-14 25 50)" />
            <rect x="34" y="46" width="17" height="16" rx="3.5" fill={cHero} className="kx-anim-hero" transform="rotate(-6 42 54)" />
          </g>
        </svg>
      );

    case 'sphere-wall':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            {[0, 1, 2, 3, 4].map((r) =>
              [0, 1, 2, 3].map((c) => {
                const archY = Math.abs(c - 1.5) * 1.6 * (r < 2 ? 1 : -1);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={8 + c * 17}
                    y={8 + r * 13 + archY}
                    width="13.5"
                    height="9.5"
                    rx="2"
                    fill={(r + c) % 3 === 0 ? cLight : (r + c) % 2 === 0 ? cMid : cDark}
                  />
                );
              })
            )}
          </g>
        </svg>
      );

    case 'card-globe':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="30" fill="#23252d" />
          <g className="kx-anim-x">
            {[-20, -10, 0, 10, 20].map((dy, rIdx) => {
              const rowW = Math.sqrt(Math.max(0, 900 - dy * dy)) * 1.75;
              const startX = 40 - rowW / 2;
              return [0, 1, 2, 3].map((cIdx) => (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={startX + (cIdx * rowW) / 4 + 1}
                  y={36 + dy}
                  width={Math.max(4, rowW / 4 - 2.5)}
                  height="7.5"
                  rx="1.5"
                  fill={(rIdx + cIdx) % 2 === 0 ? cLight : cMid}
                />
              ));
            })}
          </g>
        </svg>
      );

    case 'orbit-globe':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="20" y="14" width="18" height="18" rx="2.5" fill={cDark} />
            <rect x="42" y="16" width="18" height="18" rx="2.5" fill={cLight} />
            <rect x="12" y="28" width="20" height="20" rx="3" fill={cMid} />
            <rect x="46" y="32" width="20" height="20" rx="3" fill={cDark} />
            <rect x="24" y="24" width="22" height="22" rx="3" fill={cMid} opacity="0.9" />
            <rect x="34" y="30" width="24" height="24" rx="3.5" fill={cHero} />
            <rect x="24" y="48" width="18" height="18" rx="2.5" fill={cLight} />
          </g>
        </svg>
      );

    case 'sphere-cascade':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 6 }).map((__, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={7 + c * 11.2}
                  y={7 + r * 11.2}
                  width="8"
                  height="7"
                  rx="1.5"
                  fill={(r + c) % 3 === 0 ? cLight : (r + c) % 2 === 0 ? cMid : cDark}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'totem-wall':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            {[0, 1, 2, 3].map((c) =>
              [0, 1, 2, 3, 4].map((r) => (
                <rect
                  key={`${c}-${r}`}
                  x={8 + c * 17}
                  y={6 + r * 13 + (c % 2 === 0 ? 0 : 3)}
                  width="13.5"
                  height="10"
                  rx="2"
                  fill={c % 2 === 0 ? (r % 2 === 0 ? cLight : cMid) : r % 2 === 0 ? cMid : cDark}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'parallax-totem':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="6" y="10" width="24" height="16" rx="2" fill={cMid} />
            <rect x="24" y="16" width="34" height="20" rx="2.5" fill={cLight} />
            <rect x="6" y="34" width="16" height="12" rx="2" fill={cMid} />
            <rect x="28" y="39" width="24" height="16" rx="2" fill={cDark} />
            <rect x="48" y="42" width="26" height="18" rx="2.5" fill={cHero} />
            <rect x="8" y="58" width="26" height="16" rx="2" fill={cLight} />
          </g>
        </svg>
      );

    case 'card-tunnel':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="6" y="6" width="68" height="68" rx="4" fill="none" stroke={cLight} strokeWidth="4" />
            <rect x="15" y="15" width="50" height="50" rx="3" fill="none" stroke={cMid} strokeWidth="3.5" />
            <rect x="23" y="23" width="34" height="34" rx="2.5" fill="none" stroke={cDark} strokeWidth="3" />
            <line x1="6" y1="6" x2="28" y2="28" stroke="#111216" strokeWidth="2.5" />
            <line x1="74" y1="6" x2="52" y2="28" stroke="#111216" strokeWidth="2.5" />
            <line x1="6" y1="74" x2="28" y2="52" stroke="#111216" strokeWidth="2.5" />
            <line x1="74" y1="74" x2="52" y2="52" stroke="#111216" strokeWidth="2.5" />
          </g>
        </svg>
      );

    case 'spiral-stream':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="38" y="8" width="16" height="12" rx="2.5" fill={cDark} transform="skewY(-14)" />
            <rect x="22" y="22" width="16" height="14" rx="2.5" fill={cMid} transform="skewY(12)" />
            <rect x="30" y="31" width="20" height="16" rx="3" fill={cHero} transform="skewY(10)" />
            <rect x="46" y="40" width="15" height="14" rx="2.5" fill={cLight} transform="skewY(-12)" />
            <rect x="24" y="56" width="18" height="12" rx="2.5" fill={cDark} transform="skewY(-14)" />
          </g>
        </svg>
      );

    case 'depth-stack':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="46" y="8" width="16" height="12" rx="2.5" fill={cLight} />
            <rect x="64" y="18" width="10" height="14" rx="2" fill={cMid} />
            <rect x="26" y="28" width="7" height="7" rx="1.5" fill={cLight} />
            <rect x="49" y="46" width="10" height="10" rx="2" fill={cHero} />
            <rect x="36" y="44" width="5" height="5" rx="1" fill={cMid} />
            <rect x="10" y="64" width="6" height="6" rx="1.5" fill={cDark} />
          </g>
        </svg>
      );

    case 'cover-ring':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="3" y="23" width="16" height="34" rx="3" fill={cDark} />
            <rect x="13" y="21" width="16" height="38" rx="3" fill={cMid} />
            <rect x="51" y="21" width="16" height="38" rx="3" fill={cMid} />
            <rect x="61" y="23" width="16" height="34" rx="3" fill={cDark} />
            <rect x="22" y="18" width="36" height="44" rx="5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'cover-ring-v':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="24" y="4" width="32" height="13" rx="3" fill={cMid} />
            <rect x="24" y="63" width="32" height="13" rx="3" fill={cDark} />
            <rect x="20" y="19" width="40" height="42" rx="5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    // 2. MULTISCENE (14)
    case 'flyby-rolodex':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <polygon points="12,18 68,18 62,62 18,62" fill={cMid} />
            <polygon points="8,64 72,64 76,72 4,72" fill={cLight} />
          </g>
        </svg>
      );

    case 'bloom-belt':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="6" y="28" width="16" height="24" rx="3" fill={cDark} transform="rotate(-12 14 40)" />
            <rect x="58" y="28" width="16" height="24" rx="3" fill={cDark} transform="rotate(12 66 40)" />
            <rect x="19" y="19" width="42" height="42" rx="6" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'lens-orbit':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="26" fill="none" stroke={cDark} strokeWidth="1.5" strokeDasharray="3 3" />
          <g className="kx-anim-spin">
            <rect x="34" y="9" width="12" height="10" rx="2" fill={cMid} />
            <rect x="34" y="61" width="12" height="10" rx="2" fill={cDark} />
          </g>
          <rect x="26" y="26" width="28" height="28" rx="4.5" fill={cHero} className="kx-anim-hero" />
        </svg>
      );

    case 'stairway':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            {[0, 1, 2, 3].map((c) =>
              [0, 1, 2].map((r) => (
                <rect
                  key={`${c}-${r}`}
                  x={8 + c * 16}
                  y={10 + r * 20 + (c % 2) * 6}
                  width="15"
                  height="17"
                  rx="2.5"
                  fill={(c + r) % 2 === 0 ? cLight : cMid}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'grid-dive':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={7 + c * 23}
                  y={7 + r * 23}
                  width="20"
                  height="20"
                  rx="3"
                  fill={r === 1 && c === 1 ? cHero : (r + c) % 2 === 0 ? cLight : cMid}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'pop-parade':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="8" y="42" width="20" height="22" rx="3" fill={cDark} opacity="0.6" />
            <rect x="46" y="18" width="22" height="24" rx="3.5" fill={cMid} opacity="0.8" />
            <rect x="24" y="26" width="28" height="28" rx="4.5" fill={cHero} />
          </g>
        </svg>
      );

    case 'triple-scene':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="8" y="18" width="22" height="15" rx="3" fill={cLight} />
            <rect x="29" y="33" width="22" height="15" rx="3" fill={cHero} />
            <rect x="50" y="48" width="22" height="15" rx="3" fill={cMid} />
          </g>
        </svg>
      );

    case 'collage-reel':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="8" y="16" width="24" height="18" rx="3" fill={cDark} />
            <rect x="48" y="46" width="24" height="18" rx="3" fill={cMid} />
            <rect x="18" y="26" width="44" height="28" rx="4.5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'fan-shuffle':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={6 + c * 23 + (r % 2) * 5}
                  y={8 + r * 16}
                  width="20"
                  height="13"
                  rx="2.5"
                  fill={(r + c) % 2 === 0 ? cMid : cDark}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'sweep-ring':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2;
              const rx = 40 + Math.cos(a) * 23 - 8;
              const ry = 40 + Math.sin(a) * 21 - 5.5;
              return (
                <rect
                  key={i}
                  x={rx}
                  y={ry}
                  width="16"
                  height="11"
                  rx="2.2"
                  fill={i === 0 ? cHero : i % 2 === 0 ? cLight : cMid}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'scatter-dial':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2;
              const r = i % 2 === 0 ? 23 : 15;
              const rx = 40 + Math.cos(a) * r - 6;
              const ry = 40 + Math.sin(a) * r - 4.5;
              return (
                <rect
                  key={i}
                  x={rx}
                  y={ry}
                  width="12"
                  height="9"
                  rx="2"
                  fill={i % 2 === 0 ? cLight : cDark}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'grid-zoom':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="6" y="18" width="32" height="44" rx="3.5" fill={cLight} />
            <rect x="42" y="18" width="32" height="44" rx="3.5" fill={cMid} />
          </g>
        </svg>
      );

    case 'spread-rows':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={7 + c * 22 + (r === 1 ? -3 : 3)}
                  y={8 + r * 22}
                  width="19"
                  height="19"
                  rx="3"
                  fill={r === 1 ? cLight : (r + c) % 2 === 0 ? cMid : cDark}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'spread-columns':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={8 + c * 22}
                  y={7 + r * 22 + (c === 1 ? -3 : 3)}
                  width="19"
                  height="19"
                  rx="3"
                  fill={c === 1 ? cLight : (r + c) % 2 === 0 ? cMid : cDark}
                />
              ))
            )}
          </g>
        </svg>
      );

    // 3. ISOMETRIC (3)
    case 'iso-cascade':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-iso">
            {[0, 1, 2, 3, 4].map((i) => (
              <polygon
                key={i}
                points={`${12 + i * 11},${28 - i * 3} ${28 + i * 11},${16 - i * 3} ${28 + i * 11},${64 - i * 3} ${12 + i * 11},${74 - i * 3}`}
                fill={i % 2 === 0 ? cLight : cMid}
                opacity={0.65 + i * 0.08}
              />
            ))}
          </g>
        </svg>
      );

    case 'iso-focus':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-iso">
            <polygon points="8,52 26,56 26,76 8,72" fill={cMid} />
            <polygon points="28,28 58,34 54,60 24,54" fill={cHero} className="kx-anim-hero" />
            <polygon points="50,12 76,18 72,46 46,40" fill={cDark} />
          </g>
        </svg>
      );

    case 'iso-orbit':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-iso">
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => {
                const cx = 40 + (c - r) * 12;
                const cy = 26 + (c + r) * 7;
                return (
                  <polygon
                    key={`${r}-${c}`}
                    points={`${cx},${cy} ${cx + 9},${cy + 4} ${cx},${cy + 9} ${cx - 9},${cy + 4}`}
                    fill={(r + c) % 2 === 0 ? cLight : cMid}
                  />
                );
              })
            )}
          </g>
        </svg>
      );

    // 4. ORBIT (8)
    case 'orbit-showcase':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="14" y="28" width="16" height="18" rx="3" fill={cMid} />
            <rect x="50" y="28" width="16" height="18" rx="3" fill={cMid} />
            <rect x="22" y="32" width="18" height="20" rx="3.5" fill={cLight} />
            <rect x="40" y="32" width="18" height="20" rx="3.5" fill={cLight} />
            <rect x="29" y="34" width="22" height="22" rx="4" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'orbit-bloom':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x="32"
                y="18"
                width="16"
                height="24"
                rx="2.5"
                fill={i % 2 === 0 ? cLight : cMid}
                opacity="0.78"
                transform={`rotate(${i * 30 - 45} 40 40)`}
              />
            ))}
          </g>
        </svg>
      );

    case 'orbit-carousel':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="6" y="25" width="18" height="30" rx="3" fill={cDark} />
            <rect x="16" y="22" width="22" height="36" rx="3.5" fill={cMid} />
            <rect x="28" y="20" width="26" height="40" rx="4" fill={cHero} className="kx-anim-hero" />
            <rect x="50" y="24" width="22" height="32" rx="3" fill={cMid} />
          </g>
        </svg>
      );

    case 'photo-orbit':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2;
              const cx = 40 + Math.cos(a) * 18 - 8;
              const cy = 40 + Math.sin(a) * 18 - 8;
              return (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width="16"
                  height="16"
                  rx="2.5"
                  fill={i === 0 ? cHero : i % 2 === 0 ? cLight : cMid}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'focus-orbit':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const cx = 40 + Math.cos(a) * 22 - 6;
              const cy = 40 + Math.sin(a) * rOrDefault(22) - 6;
              return (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width="12"
                  height="12"
                  rx="2.5"
                  fill={i % 3 === 0 ? cLight : i % 2 === 0 ? cMid : cDark}
                  transform={`rotate(${i * 30} ${cx + 6} ${cy + 6})`}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'vortex-spin':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {[14, 24].map((ringR, rIdx) =>
              Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2 + rIdx * 0.4;
                const cx = 40 + Math.cos(a) * ringR - 4.5;
                const cy = 40 + Math.sin(a) * ringR - 4.5;
                return (
                  <rect
                    key={`${rIdx}-${i}`}
                    x={cx}
                    y={cy}
                    width="9"
                    height="9"
                    rx="2"
                    fill={rIdx === 0 ? cMid : i % 2 === 0 ? cLight : cDark}
                    transform={`rotate(${(a * 180) / Math.PI + 45} ${cx + 4.5} ${cy + 4.5})`}
                  />
                );
              })
            )}
          </g>
        </svg>
      );

    case 'wheel-spin':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-spin">
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const cx = 40 + Math.cos(a) * 20 - 8;
              const cy = 40 + Math.sin(a) * 20 - 8;
              return (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width="16"
                  height="16"
                  rx="3"
                  fill={i % 2 === 0 ? cLight : cMid}
                  transform={`rotate(${(i * 45) + 25} ${cx + 8} ${cy + 8})`}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'wheel-spin-arc':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            {[-3, -2, -1, 0, 1, 2, 3].map((step) => {
              const a = step * 0.36;
              const cx = 40 + Math.sin(a) * 28 - 6;
              const cy = 62 - Math.cos(a) * 24 - 6;
              return (
                <rect
                  key={step}
                  x={cx}
                  y={cy}
                  width="12"
                  height="12"
                  rx="2.5"
                  fill={step === 0 ? cHero : Math.abs(step) === 1 ? cLight : cMid}
                  transform={`rotate(${step * 15} ${cx + 6} ${cy + 6})`}
                />
              );
            })}
          </g>
        </svg>
      );

    // 5. CAROUSEL & FLOW (10)
    case 'card-totem':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <polygon points="28,4 52,4 54,18 26,18" fill={cMid} />
            <rect x="24" y="21" width="32" height="26" rx="3.5" fill={cHero} className="kx-anim-hero" />
            <polygon points="26,50 54,50 51,70 29,70" fill={cDark} />
            <rect x="29" y="72" width="22" height="5" rx="1.5" fill={cMid} />
          </g>
        </svg>
      );

    case 'film-strip':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="4" y="26" width="18" height="28" rx="2.5" fill={cMid} />
            <rect x="25" y="25" width="24" height="30" rx="3" fill={cHero} />
            <rect x="52" y="26" width="20" height="28" rx="2.5" fill={cMid} />
            <rect x="74" y="27" width="6" height="26" rx="1.5" fill={cDark} />
          </g>
        </svg>
      );

    case 'wheel-carousel':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <polygon points="4,22 20,16 20,64 4,72" fill={cMid} />
            <polygon points="60,16 76,22 76,72 60,64" fill={cMid} />
            <rect x="16" y="14" width="48" height="50" rx="5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'cover-flow':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <polygon points="4,24 13,28 13,52 4,56" fill={cMid} />
            <polygon points="67,28 76,24 76,56 67,52" fill={cMid} />
            <rect x="20" y="20" width="40" height="40" rx="4.5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'cover-flow-v':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <polygon points="24,4 56,4 52,12 28,12" fill={cMid} />
            <polygon points="28,68 52,68 56,76 24,76" fill={cMid} />
            <rect x="20" y="20" width="40" height="40" rx="4.5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'carousel-flow':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="4" y="12" width="12" height="56" rx="3" fill={cMid} />
            <rect x="22" y="12" width="54" height="56" rx="5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'diagonal-cascade':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-iso">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={6 + i * 11}
                y={6 + i * 11}
                width="25"
                height="25"
                rx="3.5"
                fill={i === 2 ? cHero : i % 2 === 0 ? cLight : cMid}
              />
            ))}
          </g>
        </svg>
      );

    case 'focus-slider':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="4" y="18" width="10" height="44" rx="2.5" fill={cDark} />
            <rect x="66" y="26" width="10" height="36" rx="2.5" fill={cDark} />
            <rect x="16" y="14" width="48" height="52" rx="5.5" fill={cMid} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'mosaic-marquee':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            <rect x="6" y="20" width="18" height="42" rx="3" fill={cMid} />
            <rect x="28" y="20" width="18" height="19" rx="3" fill={cLight} />
            <rect x="50" y="20" width="18" height="19" rx="3" fill={cHero} />
            <rect x="50" y="43" width="18" height="19" rx="3" fill={cMid} />
            <rect x="71" y="43" width="8" height="19" rx="2" fill={cLight} />
          </g>
        </svg>
      );

    case 'hero-reel':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect
                key={i}
                x={6 + i * 10}
                y={i === 3 ? 33 : 35}
                width="8"
                height={i === 3 ? 14 : 10}
                rx="2"
                fill={i === 3 ? cHero : cMid}
              />
            ))}
          </g>
        </svg>
      );

    // 6. GRID (8)
    case 'grid-reveal':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="8" y="8" width="30" height="30" rx="4" fill={cMid} />
            <rect x="42" y="8" width="30" height="30" rx="4" fill={cLight} />
            <rect x="8" y="42" width="30" height="30" rx="4" fill={cHero} />
            <rect x="46" y="46" width="22" height="22" rx="3.5" fill={cDark} opacity="0.55" />
          </g>
        </svg>
      );

    case 'spotlight-zoom':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="10" y="10" width="60" height="60" rx="6" fill={cMid} />
            <rect x="16" y="16" width="48" height="48" rx="4.5" fill={cHero} opacity="0.35" />
          </g>
        </svg>
      );

    case 'flip-grid':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="8" y="8" width="30" height="30" rx="4" fill={cMid} />
            <rect x="42" y="8" width="30" height="30" rx="4" fill={cLight} />
            <rect x="14" y="42" width="18" height="30" rx="3.5" fill={cMid} />
            <rect x="42" y="42" width="30" height="30" rx="4" fill={cHero} />
          </g>
        </svg>
      );

    case 'pop-grid':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            {[0, 1, 2].map((c) => (
              <rect key={`t-${c}`} x={8 + c * 22} y="8" width="19" height="28" rx="3.5" fill={c === 2 ? cLight : cMid} />
            ))}
            <rect x="8" y="42" width="19" height="28" rx="3.5" fill={cMid} />
            <rect x="37" y="53" width="5" height="6" rx="1.5" fill={cDark} />
            <rect x="52" y="42" width="19" height="28" rx="3.5" fill={cHero} />
          </g>
        </svg>
      );

    case 'ticker-loop':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y" transform="rotate(-6 40 40)">
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={6 + c * 23}
                  y={6 + r * 23}
                  width="20"
                  height="20"
                  rx="3"
                  fill={(r + c) % 2 === 0 ? cLight : cMid}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'ticker-tilt':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x" transform="rotate(5 40 40)">
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={5 + c * 18 + (r % 2) * 4}
                  y={7 + r * 17}
                  width="15"
                  height="14"
                  rx="2.5"
                  fill={(r + c) % 2 === 0 ? cLight : cMid}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'column-drift':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            {[0, 1, 2].map((c) =>
              [0, 1, 2, 3].map((r) => (
                <rect
                  key={`${c}-${r}`}
                  x={8 + c * 22}
                  y={4 + r * 19 + (c === 1 ? 3 : 0)}
                  width="19"
                  height={r === 0 || r === 3 ? 11 : 16}
                  rx="2.5"
                  fill={(r + c) % 2 === 0 ? cLight : cMid}
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'feed-scroll':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="20" y="10" width="22" height="16" rx="3" fill={cDark} opacity="0.75" />
            <rect x="12" y="24" width="26" height="20" rx="3.5" fill={cMid} opacity="0.85" />
            <rect x="24" y="34" width="28" height="20" rx="3.5" fill={cHero} />
            <rect x="38" y="52" width="28" height="18" rx="3.5" fill={cDark} opacity="0.8" />
          </g>
        </svg>
      );

    // 7. SPOTLIGHT & FOCUS (4)
    case 'center-stage':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="18" y="18" width="44" height="44" rx="6" fill={cHero} />
            <rect x="10" y="10" width="60" height="60" rx="8" fill="none" stroke={cMid} strokeWidth="2" opacity="0.5" />
          </g>
        </svg>
      );

    case 'focus-shift':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="6" y="8" width="46" height="64" rx="5" fill={cHero} className="kx-anim-hero" />
          <g className="kx-anim-y">
            <rect x="56" y="8" width="18" height="19" rx="3" fill={cMid} />
            <rect x="56" y="30.5" width="18" height="19" rx="3" fill={cMid} />
            <rect x="56" y="53" width="18" height="19" rx="3" fill={cLight} />
          </g>
        </svg>
      );

    case 'deck-peel':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="22" y="14" width="36" height="36" rx="4" fill={cDark} />
            <rect x="20" y="19" width="40" height="38" rx="4.5" fill={cMid} />
            <rect x="18" y="25" width="44" height="42" rx="5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'zoom-parallax':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="10" y="10" width="60" height="60" rx="6" fill={cDark} />
            <rect x="16" y="16" width="48" height="48" rx="5" fill={cLight} />
          </g>
        </svg>
      );

    // 8. REVEAL & WIPE (4)
    case 'diagonal-wipe':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-wipe">
            <polygon points="10,10 64,10 10,64" fill={cLight} />
            <polygon points="70,16 70,70 16,70" fill={cMid} />
          </g>
        </svg>
      );

    case 'stripe-reveal':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-wipe">
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={10 + i * 15.5}
                y={10 + (i % 2) * 4}
                width="13"
                height="56"
                rx="2.5"
                fill={i % 2 === 0 ? cLight : cMid}
              />
            ))}
          </g>
        </svg>
      );

    case 'split-reveal':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-wipe">
            <rect x="8" y="8" width="30" height="64" rx="4" fill={cLight} />
            <rect x="41" y="8" width="14" height="64" rx="2" fill={cMid} />
            <rect x="56" y="8" width="16" height="64" rx="3" fill={cDark} />
          </g>
        </svg>
      );

    case 'mosaic-wipe':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-wipe">
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={10 + c * 21}
                  y={10 + r * 21}
                  width="18"
                  height="18"
                  rx="3"
                  fill={r + c < 2 ? cHero : r + c === 2 ? cLight : cDark}
                  opacity={r + c > 3 ? 0.35 : 0.95}
                />
              ))
            )}
          </g>
        </svg>
      );

    // 9. STACK & SCATTER (7)
    case 'stack-slide':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="13" y="10" width="54" height="54" rx="5" fill={cMid} />
            <rect x="11" y="14" width="58" height="56" rx="5.5" fill={cHero} />
          </g>
        </svg>
      );

    case 'cascade-drop':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="14" y="10" width="50" height="52" rx="4.5" fill={cLight} transform="rotate(-3 39 36)" />
            <rect x="16" y="18" width="50" height="52" rx="4.5" fill={cMid} transform="rotate(2.5 41 44)" />
          </g>
        </svg>
      );

    case 'cascade-diagonal':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-iso">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={12 + i * 7.5}
                y={10 + i * 7.5}
                width="17"
                height="17"
                rx="3"
                fill={i % 2 === 0 ? cLight : cMid}
              />
            ))}
            <rect x="12" y="46" width="17" height="17" rx="3" fill={cMid} />
            <rect x="28" y="42" width="19" height="19" rx="3.5" fill={cHero} />
          </g>
        </svg>
      );

    case 'image-trail':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-x">
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((step) => {
              const cx = 36 + step * 5.2;
              const cy = 12 + Math.abs(step) * 3.6 + (step > 0 ? step * 1.6 : 0);
              return (
                <rect
                  key={step}
                  x={cx - 8}
                  y={cy}
                  width="16"
                  height="16"
                  rx="2.5"
                  fill={step === 0 ? cHero : Math.abs(step) % 2 === 0 ? cLight : cMid}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'poster-burst':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="6" y="6" width="68" height="68" rx="7" fill={cMid} opacity="0.65" />
            <rect x="16" y="16" width="48" height="48" rx="5.5" fill={cHero} />
          </g>
        </svg>
      );

    case 'card-toss':
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-y">
            <rect x="12" y="54" width="18" height="18" rx="3" fill={cDark} transform="rotate(-8 21 63)" />
            <rect x="20" y="46" width="20" height="24" rx="3.5" fill={cMid} transform="rotate(-5 30 58)" />
            <rect x="44" y="20" width="20" height="26" rx="3.5" fill={cHero} className="kx-anim-hero" />
          </g>
        </svg>
      );

    case 'position-dance':
    default:
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <g className="kx-anim-hero">
            <rect x="8" y="8" width="22" height="22" rx="3.5" fill={cLight} />
            <rect x="46" y="6" width="20" height="20" rx="3.5" fill={cDark} />
            <rect x="12" y="34" width="22" height="22" rx="3.5" fill={cDark} />
            <rect x="40" y="36" width="28" height="28" rx="4.5" fill={cHero} />
            <rect x="12" y="54" width="18" height="18" rx="3" fill={cMid} />
          </g>
        </svg>
      );
  }
}

function rOrDefault(val: number): number {
  return val;
}

export const LeftGalleryPanel: React.FC<LeftGalleryPanelProps> = ({
  activeTab,
  onChangeTab,
  presets,
  currentSceneId,
  onSelectPreset,
  assets,
  selectedAssetId,
  onSelectAsset,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onInsertAssetLayer,
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onUpdateLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onReorderLayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editingAssetTitle, setEditingAssetTitle] = useState('');

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const created: ImageAsset = {
          id: `asset-upload-${Date.now()}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          category: 'Custom',
          url: reader.result,
          width: 600,
          height: 600,
          createdAt: new Date().toISOString().slice(0, 10),
          filters: { ...DEFAULT_IMAGE_FILTERS },
        };
        onAddAsset(created);
        onSelectAsset(created.id);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPresets = normalizedQuery
    ? presets.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          (p.referenceSubtitle || '').toLowerCase().includes(normalizedQuery) ||
          (p.formation || '').toLowerCase().includes(normalizedQuery)
      )
    : presets;

  const renderPresetCard = (preset: MotionScene) => {
    const isSelected = preset.id === currentSceneId;
    return (
      <button
        key={preset.id}
        type="button"
        onClick={() => onSelectPreset(preset)}
        title={`${preset.name}${preset.referenceSubtitle ? ` (${preset.referenceSubtitle})` : ''}`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        className={`group flex flex-col items-start p-1.5 rounded-[14px] border transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'kx-card-active bg-[#1c1e26] border-[#6b7080] shadow-[0_0_16px_rgba(59,102,245,0.18)]'
            : 'bg-transparent border-transparent hover:bg-[#191a20] hover:border-[#2c2e38]'
        }`}
      >
        <div className="relative w-full aspect-square rounded-[11px] bg-[#101014] border border-[#22232b] overflow-hidden p-2 flex items-center justify-center group-hover:border-[#383b48] transition-colors">
          <div
            style={{
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            className="w-full h-full transition-transform duration-300 group-hover:scale-[1.04]"
          >
            <FormationThumbnailSvg
              formation={preset.formation}
              isSelected={isSelected}
            />
          </div>

          {preset.isNew && (
            <span className="absolute top-1.5 right-1.5 px-2 py-0.5 text-[9px] font-sans font-bold tracking-wider uppercase rounded-full bg-[#1976f3] text-white shadow-sm">
              NEW
            </span>
          )}
        </div>
        <span
          className={`mt-1.5 text-[11.5px] font-medium truncate w-full text-left px-1 transition-colors ${
            isSelected
              ? 'text-[#ffffff]'
              : 'text-[#d4d4dc] group-hover:text-white'
          }`}
        >
          {preset.name}
        </span>
      </button>
    );
  };

  return (
    <aside
      aria-label="Templates and Layers Sidebar"
      className="w-[260px] bg-[#141416] border-r border-[#232327] flex flex-col h-full shrink-0 select-none"
    >
      {/* Top Segmented Pill Switcher: Templates | Layers */}
      <div className="p-3 border-b border-[#232327] space-y-2.5">
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#1b1b1f] border border-[#26262c] rounded-[10px]">
          <button
            type="button"
            onClick={() => onChangeTab('presets')}
            className={`py-1.5 px-3 text-[12px] font-medium rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-[#202026] text-[#f5f5f7] border border-[#3b66f5] shadow-[0_0_12px_rgba(59,102,245,0.25)]'
                : 'text-[#8e8e98] hover:text-[#f5f5f7] border border-transparent'
            }`}
          >
            Templates · {presets.length}
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('assets')}
            className={`py-1.5 px-3 text-[12px] font-medium rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'assets'
                ? 'bg-[#202026] text-[#f5f5f7] border border-[#3b66f5] shadow-[0_0_12px_rgba(59,102,245,0.25)]'
                : 'text-[#8e8e98] hover:text-[#f5f5f7] border border-transparent'
            }`}
          >
            Layers · {layers.length}
          </button>
        </div>

        {activeTab === 'presets' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6e6e78] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter 70 templates..."
              aria-label="Filter motion templates"
              className="w-full bg-[#19191e] border border-[#26262e] focus:border-[#3b66f5] rounded-[8px] pl-8 pr-2.5 py-1.5 text-[11.5px] text-[#f5f5f7] placeholder-[#6e6e78] focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {activeTab === 'presets' ? (
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {CATEGORY_SECTIONS.map((sec, idx) => {
            const sectionPresets = filteredPresets.filter(
              (p) => (p.templateGroup || '3d-perspective') === sec.id
            );
            if (sectionPresets.length === 0) return null;
            const isOpen = !collapsedGroups[sec.id];

            return (
              <div
                key={sec.id}
                className={idx > 0 ? 'pt-3 border-t border-[#222226]' : ''}
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(sec.id)}
                  className="w-full flex items-center justify-between text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86] hover:text-[#d4d4dc] mb-2.5 cursor-pointer"
                >
                  <span>
                    {sec.title} · {sectionPresets.length}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    {sectionPresets.map(renderPresetCard)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Redesigned Inspector-Grade Layers & Studio Assets Tab */
        <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
          {/* 1. SCENE OVERLAY LAYERS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
                SCENE LAYERS · {layers.length}
              </span>
            </div>

            {/* Quick Add Layer Bar matching Right Inspector style */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onAddLayer('text')}
                className="flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] font-medium text-[#e4e4eb] bg-[#1b1b20] hover:bg-[#24242c] border border-[#2a2a33] rounded-[8px] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#70b5f9] shrink-0" />
                <span>Text</span>
              </button>
              <button
                type="button"
                onClick={() => onAddLayer('image')}
                className="flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] font-medium text-[#e4e4eb] bg-[#1b1b20] hover:bg-[#24242c] border border-[#2a2a33] rounded-[8px] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#70b5f9] shrink-0" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => onAddLayer('metric')}
                className="flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] font-medium text-[#e4e4eb] bg-[#1b1b20] hover:bg-[#24242c] border border-[#2a2a33] rounded-[8px] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#70b5f9] shrink-0" />
                <span>Badge</span>
              </button>
            </div>

            {layers.length === 0 ? (
              <div className="p-4 rounded-[10px] bg-[#18181c] border border-[#25252b] text-center space-y-1.5">
                <p className="text-[12px] text-[#a0a0ab]">No overlay layers yet</p>
                <p className="text-[11px] text-[#6e6e78]">
                  Add kinetic typography, logos, or floating callouts above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {layers.map((layer, idx) => {
                  const isSelected = layer.id === selectedLayerId;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`p-2.5 rounded-[10px] border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#1d1e26] border-[#3b66f5] shadow-[0_0_12px_rgba(59,102,245,0.16)]'
                          : 'bg-[#18181c] border-[#25252b] hover:border-[#34343d]'
                      }`}
                    >
                      {/* Row 1: Layer Icon + Single-line Title + Status Dot */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-[5px] bg-[#24252e] border border-[#32333f] flex items-center justify-center text-[10px] font-mono text-[#70b5f9] shrink-0">
                            {layer.type === 'text'
                              ? 'T'
                              : layer.type === 'image'
                              ? 'IM'
                              : '#'}
                          </span>
                          <span className="text-[12px] font-medium text-[#f5f5f7] truncate">
                            {layer.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono tabular-nums text-[#7c7c86] shrink-0">
                          {layer.startTime.toFixed(1)}s–
                          {(layer.startTime + layer.duration).toFixed(1)}s
                        </span>
                      </div>

                      {/* Row 2: Clean Segmented Action Bar (Zero Overlap) */}
                      <div
                        className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-[#24242b]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="px-1.5 py-0.5 rounded bg-[#222229] text-[10px] font-mono text-[#a0a0ab] whitespace-nowrap shrink-0">
                          {layer.animationType}
                        </span>

                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            aria-label={`Move layer ${layer.name} up`}
                            disabled={idx === 0}
                            onClick={() => onReorderLayer(layer.id, 'up')}
                            className="w-5 h-5 rounded-[5px] bg-[#222229] hover:bg-[#2c2c35] flex items-center justify-center text-[#a0a0ab] hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move layer ${layer.name} down`}
                            disabled={idx === layers.length - 1}
                            onClick={() => onReorderLayer(layer.id, 'down')}
                            className="w-5 h-5 rounded-[5px] bg-[#222229] hover:bg-[#2c2c35] flex items-center justify-center text-[#a0a0ab] hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Toggle visibility for ${layer.name}`}
                            onClick={() =>
                              onUpdateLayer(layer.id, { visible: !layer.visible })
                            }
                            className={`w-5 h-5 rounded-[5px] flex items-center justify-center cursor-pointer ${
                              layer.visible
                                ? 'bg-[#1f2942] text-[#70b5f9]'
                                : 'bg-[#222229] text-[#6e6e78] hover:text-white'
                            }`}
                          >
                            {layer.visible ? (
                              <Eye className="w-3 h-3" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={`Toggle lock for ${layer.name}`}
                            onClick={() =>
                              onUpdateLayer(layer.id, { locked: !layer.locked })
                            }
                            className={`w-5 h-5 rounded-[5px] flex items-center justify-center cursor-pointer ${
                              layer.locked
                                ? 'bg-[#1f2942] text-[#70b5f9]'
                                : 'bg-[#222229] text-[#8e8e98] hover:text-white'
                            }`}
                          >
                            {layer.locked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Unlock className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={`Duplicate layer ${layer.name}`}
                            onClick={() => onDuplicateLayer(layer.id)}
                            className="w-5 h-5 rounded-[5px] bg-[#222229] hover:bg-[#2c2c35] flex items-center justify-center text-[#a0a0ab] hover:text-white cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete layer ${layer.name}`}
                            onClick={() => onDeleteLayer(layer.id)}
                            className="w-5 h-5 rounded-[5px] bg-[#222229] hover:bg-[#3a1d22] flex items-center justify-center text-[#8e8e98] hover:text-[#ef4444] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. STUDIO MEDIA CARDS LIBRARY */}
          <div className="pt-4 border-t border-[#232327] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
                MEDIA CARDS · {assets.length}
              </span>
              <label className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white bg-[#3b66f5] hover:bg-[#4e76ff] rounded-full cursor-pointer transition-colors">
                <Upload className="w-3 h-3" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                const id = `asset-custom-${Date.now()}`;
                const created: ImageAsset = {
                  id,
                  name: `Studio Card ${assets.length + 1}`,
                  category: 'Brand',
                  url: assets[0].url,
                  width: 600,
                  height: 600,
                  createdAt: new Date().toISOString().slice(0, 10),
                  filters: {
                    ...DEFAULT_IMAGE_FILTERS,
                    hueRotate: (assets.length * 45) % 360,
                  },
                };
                onAddAsset(created);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-medium text-[#e4e4eb] bg-[#1a1a1f] hover:bg-[#23232a] border border-[#2b2b33] rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#3b66f5]" />
              <span>Generate Studio Card</span>
            </button>

            <div className="space-y-2">
              {assets.map((asset) => {
                const isSelected = asset.id === selectedAssetId;
                const isEditing = editingAssetId === asset.id;
                const f = asset.filters;
                const filterStyle = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) hue-rotate(${f.hueRotate}deg)`;

                return (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset.id)}
                    className={`p-2.5 rounded-[10px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1d1d23] border-[#3b66f5]'
                        : 'bg-[#18181c] border-[#25252b] hover:border-[#34343d]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        referrerPolicy="no-referrer"
                        style={{ filter: filterStyle }}
                        className="w-11 h-11 rounded-[7px] object-cover border border-[#2e2e36] shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {isEditing ? (
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editingAssetTitle}
                              onChange={(e) => setEditingAssetTitle(e.target.value)}
                              aria-label="Edit asset name"
                              className="w-full bg-[#101014] border border-[#3b66f5] rounded px-2 py-0.5 text-xs text-white"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (editingAssetTitle.trim()) {
                                  onUpdateAsset(asset.id, {
                                    name: editingAssetTitle.trim(),
                                  });
                                }
                                setEditingAssetId(null);
                              }}
                              className="p-1 text-[#27a644]"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-[12px] font-medium text-[#f5f5f7] truncate">
                            {asset.name}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInsertAssetLayer(asset);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-[#222430] hover:bg-[#2b2e3d] text-[10px] font-medium text-[#70b5f9] cursor-pointer"
                          >
                            <Layers className="w-2.5 h-2.5" />
                            <span>+ Overlay</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label={`Rename ${asset.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAssetId(asset.id);
                                setEditingAssetTitle(asset.name);
                              }}
                              className="w-6 h-6 rounded-[5px] bg-[#222229] hover:bg-[#2c2c35] flex items-center justify-center text-[#8e8e98] hover:text-white cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            {assets.length > 1 && (
                              <button
                                type="button"
                                aria-label={`Delete ${asset.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteAsset(asset.id);
                                }}
                                className="w-6 h-6 rounded-[5px] bg-[#222229] hover:bg-[#3a1d22] flex items-center justify-center text-[#8e8e98] hover:text-[#ef4444] cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
