import React, { useState } from 'react';
import {
  Minus,
  Plus,
  ChevronUp,
  ChevronDown,
  GripVertical,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  AnimatableProperty,
  AnimationType,
  CubicBezier,
  DEFAULT_POSITION_SETTINGS,
  ImageAsset,
  MotionLayer,
  MotionPhysicsMode,
  MotionScene,
  PositionSettings,
  resolveSceneGradientCss,
  SocialPlatform,
} from '../engine/motionEngine';
import {
  DEFAULT_IMAGE_FILTERS,
  STUDIO_BACKDROP_PRESETS,
  STUDIO_GRADIENT_PRESETS,
} from '../engine/presets';
import { BezierCurveEditor } from './BezierCurveEditor';

interface RightInspectorPanelProps {
  scene: MotionScene;
  currentTime: number;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onUpdateLayer: (layerId: string, updates: Partial<MotionLayer>) => void;
  onAddLayer: (type: 'text' | 'image' | 'metric') => void;
  onDeleteLayer: (layerId: string) => void;
  onChangePlatform: (platform: SocialPlatform) => void;
  onUpdateScene: (updates: Partial<MotionScene>) => void;
  onUpdatePositionSetting: (
    key: keyof PositionSettings,
    value: number | string | boolean
  ) => void;
  onToggleKeyframe: (property: AnimatableProperty, label: string, value: number) => void;
  onResetPositionSettings: () => void;
  assets: ImageAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
  onUpdateAsset: (assetId: string, updates: Partial<ImageAsset>) => void;
  onDeleteAsset: (assetId: string) => void;
  onAddAsset: (asset: ImageAsset) => void;
}

/**
 * Custom Studio Slider with the signature white capsule thumb containing two vertical grip bars `( || )`.
 */
interface CapsuleSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  ariaLabel: string;
  onChange: (val: number) => void;
}

const CapsuleSlider: React.FC<CapsuleSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  ariaLabel,
  onChange,
}) => {
  const pct = Math.max(
    0,
    Math.min(100, ((value - min) / Math.max(0.0001, max - min)) * 100)
  );

  return (
    <div className="relative flex-1 h-6 flex items-center select-none">
      {/* Underlying Track */}
      <div className="w-full h-[6px] bg-[#25252b] rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className="h-full bg-[#383842] rounded-full"
        />
      </div>

      {/* Visual White Capsule Thumb with `( || )` Grip Lines */}
      <div
        style={{ left: `calc(${pct}% - 14px)` }}
        className="absolute w-7 h-[18px] bg-[#f5f5f7] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.65)] flex items-center justify-center gap-[3px] pointer-events-none"
      >
        <span className="w-[1.5px] h-2 bg-[#52525b] rounded-full" />
        <span className="w-[1.5px] h-2 bg-[#52525b] rounded-full" />
      </div>

      {/* Native Range Input Overlay for Full Accessibility & Keyboard/Pointer Control */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
};

const FRAME_OPTIONS: {
  platform: SocialPlatform;
  ratioLabel: string;
  boxW: number;
  boxH: number;
}[] = [
  { platform: 'x-landscape', ratioLabel: '16:9', boxW: 20, boxH: 12 },
  { platform: 'standard-4-3', ratioLabel: '4:3', boxW: 18, boxH: 14 },
  { platform: 'instagram-post', ratioLabel: '1:1', boxW: 16, boxH: 16 },
  { platform: 'threads-portrait', ratioLabel: '4:5', boxW: 14, boxH: 18 },
  { platform: 'editorial-3-4', ratioLabel: '3:4', boxW: 14, boxH: 19 },
  { platform: 'instagram-reel', ratioLabel: '9:16', boxW: 11, boxH: 20 },
];

const POSITION_SLIDERS: {
  key: AnimatableProperty;
  label: string;
  shortLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'padding', label: 'Padding', shortLabel: 'Padding', min: 0, max: 20, step: 0.5, unit: '%' },
  { key: 'cornerRadius', label: 'Corner radius', shortLabel: 'Corner rad...', min: 0, max: 15, step: 0.5, unit: '%' },
  { key: 'ringTilt', label: 'Ring tilt', shortLabel: 'Ring tilt', min: -45, max: 45, step: 1, unit: '°' },
  { key: 'ringOpening', label: 'Ring opening', shortLabel: 'Ring openi...', min: 15, max: 100, step: 1, unit: '%' },
  { key: 'ringSize', label: 'Ring size', shortLabel: 'Ring size', min: 35, max: 125, step: 1, unit: '%' },
  { key: 'cardSize', label: 'Card size', shortLabel: 'Card size', min: 10, max: 40, step: 1, unit: '%' },
  { key: 'backFade', label: 'Back fade', shortLabel: 'Back fade', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'perspective', label: 'Perspective', shortLabel: 'Perspective', min: 5, max: 55, step: 1, unit: '%' },
];

export const RightInspectorPanel: React.FC<RightInspectorPanelProps> = ({
  scene,
  selectedLayerId,
  onUpdateLayer,
  onAddLayer,
  onDeleteLayer,
  onChangePlatform,
  onUpdateScene,
  onUpdatePositionSetting,
  onToggleKeyframe,
  onResetPositionSettings,
  assets,
  selectedAssetId,
  onSelectAsset,
  onUpdateAsset,
  onDeleteAsset,
  onAddAsset,
}) => {
  const [openPhysicsSection, setOpenPhysicsSection] = useState(true);
  const [openTextSection, setOpenTextSection] = useState(true);
  const [openLogoSection, setOpenLogoSection] = useState(true);
  const [openPositionSection, setOpenPositionSection] = useState(true);
  const [openGradingSection, setOpenGradingSection] = useState(true);

  const pos = scene.positionSettings || DEFAULT_POSITION_SETTINGS;
  const slotCount = scene.slotCount ?? 12;
  const keyframes = scene.keyframes || [];

  const visibleLayers = scene.layers.filter((l) => l.visible);
  const selectedLayer =
    scene.layers.find((l) => l.id === selectedLayerId && l.visible) ||
    visibleLayers[0] ||
    null;

  const activeAsset =
    assets.find((a) => a.id === selectedAssetId) || assets[0] || null;

  const handleSlotFileUpload = (
    slotIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const created: ImageAsset = {
          id: `asset-slot-${slotIndex}-${Date.now()}`,
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateScene({ logoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBackgroundImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateScene({
          backgroundMode: 'image',
          backgroundImageUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const applyCustomGradient = (
    c1: string,
    c2: string,
    angle: number,
    type: 'linear' | 'radial'
  ) => {
    const nextGrad =
      type === 'radial'
        ? `radial-gradient(circle at 50% 35%, ${c1} 0%, ${c2} 85%)`
        : `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
    onUpdateScene({
      backgroundMode: 'gradient',
      backgroundColor: c1,
      backgroundSecondaryColor: c2,
      backgroundGradientAngle: angle,
      backgroundGradientType: type,
      backgroundGradient: nextGrad,
    });
  };

  return (
    <aside
      aria-label="Frame, Media Slots, and Position Inspector"
      className="w-[336px] bg-[#141416] border-l border-[#232327] flex flex-col h-full shrink-0 select-none overflow-y-auto"
    >
      {/* 1. FRAME ASPECT RATIO SELECTOR */}
      <div className="p-4 border-b border-[#232327] space-y-3">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
          FRAME
        </div>
        <div
          role="group"
          aria-label="Frame Aspect Ratio"
          className="grid grid-cols-6 gap-1 p-1.5 bg-[#1b1b1f] border border-[#25252b] rounded-[12px]"
        >
          {FRAME_OPTIONS.map((opt) => {
            const active = scene.platform === opt.platform;
            return (
              <button
                key={opt.platform}
                type="button"
                onClick={() => onChangePlatform(opt.platform)}
                className={`flex flex-col items-center justify-between py-2 px-1 rounded-[8px] border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#232329] border-[#52525e] text-[#f5f5f7]'
                    : 'border-transparent text-[#7c7c86] hover:text-[#d4d4dc]'
                }`}
              >
                <div className="h-6 flex items-center justify-center">
                  <div
                    style={{ width: `${opt.boxW}px`, height: `${opt.boxH}px` }}
                    className={`rounded-[2px] border-[1.5px] ${
                      active ? 'border-[#f5f5f7]' : 'border-[#6e6e78]'
                    }`}
                  />
                </div>
                <span className="mt-1.5 text-[10px] font-mono tabular-nums">
                  {opt.ratioLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MOTION PHYSICS (Emil Kowalski & transitions.dev Engine) */}
      <div className="p-4 border-b border-[#232327] space-y-3">
        <button
          type="button"
          onClick={() => setOpenPhysicsSection((v) => !v)}
          className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] uppercase text-[#70b5f9] hover:text-[#93c5fd] cursor-pointer"
        >
          <span>MOTION PHYSICS · PRO</span>
          {openPhysicsSection ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {openPhysicsSection && (
          <div className="space-y-3">
            {/* Physics Solver Switcher (Continuous first & default) */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#1b1b1f] border border-[#25252b] rounded-[10px]">
              {(
                [
                  { id: 'linear', label: 'Continuous' },
                  { id: 'spring', label: 'Spring 380' },
                  { id: 'ease-out', label: 'Quint Out' },
                ] as { id: MotionPhysicsMode; label: string }[]
              ).map((m) => {
                const active = (pos.physicsMode || 'linear') === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onUpdatePositionSetting('physicsMode', m.id)}
                    className={`py-1.5 text-[11px] font-medium rounded-[7px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#262834] text-[#f5f5f7] border border-[#3b66f5]/60'
                        : 'text-[#8e8e98] hover:text-[#f5f5f7]'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {(pos.physicsMode || 'linear') === 'spring' && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between gap-2.5">
                  <span className="w-20 text-[12px] text-[#a0a0ab] shrink-0">
                    Stiffness
                  </span>
                  <CapsuleSlider
                    min={140}
                    max={560}
                    step={10}
                    value={pos.springStiffness ?? 380}
                    ariaLabel="Spring stiffness"
                    onChange={(val) =>
                      onUpdatePositionSetting('springStiffness', val)
                    }
                  />
                  <span className="w-11 text-right text-[12px] font-mono tabular-nums text-[#a0a0ab]">
                    {pos.springStiffness ?? 380}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2.5">
                  <span className="w-20 text-[12px] text-[#a0a0ab] shrink-0">
                    Damping
                  </span>
                  <CapsuleSlider
                    min={14}
                    max={54}
                    step={1}
                    value={pos.springDamping ?? 30}
                    ariaLabel="Spring damping"
                    onChange={(val) =>
                      onUpdatePositionSetting('springDamping', val)
                    }
                  />
                  <span className="w-11 text-right text-[12px] font-mono tabular-nums text-[#a0a0ab]">
                    {pos.springDamping ?? 30}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2.5">
              <span className="w-20 text-[12px] text-[#a0a0ab] shrink-0">
                Stagger step
              </span>
              <CapsuleSlider
                min={15}
                max={100}
                step={5}
                value={pos.staggerMs ?? 45}
                ariaLabel="Stagger step ms"
                onChange={(val) => onUpdatePositionSetting('staggerMs', val)}
              />
              <span className="w-11 text-right text-[12px] font-mono tabular-nums text-[#a0a0ab]">
                {pos.staggerMs ?? 45}ms
              </span>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[11px] text-[#a0a0ab] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pos.clampScaleFloor ?? true}
                  onChange={(e) =>
                    onUpdatePositionSetting('clampScaleFloor', e.target.checked)
                  }
                  className="w-3.5 h-3.5 rounded accent-[#3b66f5] cursor-pointer"
                />
                <span>Emil Kowalski Scale ≥ 0.94 Guard</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 3. MEDIA · N SLOTS */}
      <div className="p-4 border-b border-[#232327] space-y-3">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
          MEDIA · {slotCount} SLOTS
        </div>

        {/* Number of images stepper */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#a0a0ab]">Number of images</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease number of slots"
              onClick={() =>
                onUpdateScene({ slotCount: Math.max(4, slotCount - 1) })
              }
              className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-[#1e1e23] hover:bg-[#27272e] border border-[#2c2c34] text-[#d4d4dc] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-[13px] font-mono tabular-nums text-[#f5f5f7]">
              {slotCount}
            </span>
            <button
              type="button"
              aria-label="Increase number of slots"
              onClick={() =>
                onUpdateScene({ slotCount: Math.min(16, slotCount + 1) })
              }
              className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-[#1e1e23] hover:bg-[#27272e] border border-[#2c2c34] text-[#d4d4dc] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slot List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {Array.from({ length: slotCount }, (_, idx) => {
            const slotAsset =
              assets.length > 0 ? assets[idx % assets.length] : undefined;
            const isSelected = slotAsset && slotAsset.id === selectedAssetId;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (slotAsset) onSelectAsset(slotAsset.id);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-[10px] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d1d23] border-[#3b66f5]'
                    : 'bg-[#18181c] border-[#25252b] hover:border-[#34343d]'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-[#52525c] shrink-0" />

                {/* Slot Thumbnail / Upload Box */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-12 h-10 rounded-[7px] bg-[#222228] border border-[#2e2e36] hover:border-[#4e76ff] overflow-hidden flex items-center justify-center shrink-0 cursor-pointer group"
                  title="Click to upload image for this slot"
                >
                  {slotAsset ? (
                    <>
                      <img
                        src={slotAsset.url}
                        alt={slotAsset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-40 transition-opacity"
                      />
                      <Plus className="w-4 h-4 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <Plus className="w-4 h-4 text-[#8e8e98]" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    aria-label={`Upload image for Slot ${idx + 1}`}
                    onChange={(e) => handleSlotFileUpload(idx, e)}
                    className="hidden"
                  />
                </label>

                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-[#f5f5f7]">
                    Slot {idx + 1}
                  </div>
                  <div className="text-[11px] text-[#7c7c86] truncate">
                    {slotAsset ? slotAsset.name : 'Drop or click to add'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cycle Images Pill Button */}
        <button
          type="button"
          onClick={() => {
            if (assets.length > 1) {
              const rotated = [...assets.slice(1), assets[0]];
              onAddAsset(rotated[0]);
            }
          }}
          className="w-full py-2 px-4 text-[12px] font-medium text-[#d4d4dc] bg-[#1a1a1f] hover:bg-[#222228] border border-[#2b2b33] rounded-full transition-colors cursor-pointer"
        >
          Cycle slot images
        </button>
      </div>

      {/* 4. TIMING */}
      <div className="p-4 border-b border-[#232327] space-y-3">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
          TIMING
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#a0a0ab]">Loop duration</span>
          <span className="text-[13px] font-mono tabular-nums text-[#f5f5f7]">
            {Math.round(scene.duration)}s
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1 p-1 bg-[#1b1b1f] border border-[#25252b] rounded-[10px]">
          {[5, 10, 15, 20, 30].map((sec) => {
            const active = Math.abs(scene.duration - sec) < 1.2;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => onUpdateScene({ duration: sec })}
                className={`py-1.5 text-[12px] font-mono tabular-nums rounded-[7px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#26262e] text-[#f5f5f7] font-medium'
                    : 'text-[#8e8e98] hover:text-[#f5f5f7]'
                }`}
              >
                {sec}s
              </button>
            );
          })}
        </div>

        <CapsuleSlider
          min={3}
          max={30}
          step={0.5}
          value={scene.duration}
          ariaLabel="Loop duration slider"
          onChange={(val) => onUpdateScene({ duration: val })}
        />
      </div>

      {/* 5. TEXT OVERLAY SECTION */}
      <div className="p-4 border-b border-[#232327] space-y-3">
        <button
          type="button"
          onClick={() => setOpenTextSection((v) => !v)}
          className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86] hover:text-[#b4b4be] cursor-pointer"
        >
          <span>TEXT</span>
          {openTextSection ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {openTextSection && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onAddLayer('text')}
              className="w-full py-2 px-4 text-[12px] font-medium text-[#d4d4dc] bg-[#1a1a1f] hover:bg-[#222228] border border-[#2b2b33] rounded-full transition-colors cursor-pointer"
            >
              + Add text
            </button>

            {selectedLayer && (
              <div className="p-3 bg-[#18181c] border border-[#25252b] rounded-[10px] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#a0a0ab]">
                    Active Layer: {selectedLayer.name}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove layer ${selectedLayer.name}`}
                    onClick={() => onDeleteLayer(selectedLayer.id)}
                    className="text-[#8e8e98] hover:text-[#ef4444] p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {selectedLayer.type !== 'image' && (
                  <input
                    type="text"
                    aria-label="Primary Copy"
                    value={selectedLayer.text || ''}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, { text: e.target.value })
                    }
                    placeholder="Enter kinetic headline..."
                    className="w-full bg-[#101014] border border-[#2a2a32] focus:border-[#3b66f5] rounded-[6px] px-2.5 py-1.5 text-xs text-[#f5f5f7] focus:outline-none"
                  />
                )}

                <div className="grid grid-cols-2 gap-2">
                  <label className="text-[11px] text-[#8e8e98] space-y-1">
                    <span>Animation</span>
                    <select
                      aria-label="Entrance Choreography"
                      value={selectedLayer.animationType}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          animationType: e.target.value as AnimationType,
                        })
                      }
                      className="w-full bg-[#101014] border border-[#2a2a32] rounded-[6px] px-2 py-1 text-xs text-[#f5f5f7]"
                    >
                      <option value="slide-up">Slide Up (0.94→1)</option>
                      <option value="fade-scale">Fade Scale (0.94→1)</option>
                      <option value="kinetic-pop">Kinetic Pop</option>
                      <option value="flip-3d">3D Tilt</option>
                      <option value="glitch-snap">Glitch Snap</option>
                      <option value="spin-reveal">Spin Reveal</option>
                    </select>
                  </label>
                  <label className="text-[11px] text-[#8e8e98] space-y-1">
                    <span>Speed ({selectedLayer.speed.toFixed(1)}x)</span>
                    <input
                      type="range"
                      min="0.25"
                      max="3.0"
                      step="0.05"
                      aria-label="Motion Speed Multiplier"
                      value={selectedLayer.speed}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          speed: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-[#3b66f5] mt-1.5"
                    />
                  </label>
                </div>

                {/* Cubic-Bezier Curve Graph */}
                <BezierCurveEditor
                  bezier={selectedLayer.bezier}
                  easingPreset={selectedLayer.easingPreset}
                  onChangeBezier={(nextBezier: CubicBezier, presetId: string) =>
                    onUpdateLayer(selectedLayer.id, {
                      bezier: nextBezier,
                      easingPreset: presetId,
                    })
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. LOGO SECTION */}
      <div className="p-4 border-b border-[#232327] space-y-3">
        <button
          type="button"
          onClick={() => setOpenLogoSection((v) => !v)}
          className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86] hover:text-[#b4b4be] cursor-pointer"
        >
          <span>LOGO</span>
          {openLogoSection ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {openLogoSection && (
          <div className="space-y-2">
            <label className="w-full flex items-center justify-center py-2 px-4 text-[12px] font-medium text-[#d4d4dc] bg-[#1a1a1f] hover:bg-[#222228] border border-[#2b2b33] rounded-full transition-colors cursor-pointer">
              <span>
                {scene.logoUrl
                  ? 'Replace logo (max 5 MB)'
                  : 'Upload logo (max 5 MB)'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {scene.logoUrl && (
              <button
                type="button"
                onClick={() => onUpdateScene({ logoUrl: undefined })}
                className="w-full text-[11px] text-[#8e8e98] hover:text-[#ef4444] cursor-pointer"
              >
                Remove uploaded logo
              </button>
            )}
          </div>
        )}
      </div>

      {/* 7. SCENE SURFACE STUDIO (Colour / Premade + Custom Gradient / Studio Image + Blur) */}
      <div className="p-4 border-b border-[#232327] space-y-3.5">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
          {(scene.referenceSubtitle || scene.name).toUpperCase()}
        </div>

        {/* Segmented Mode Switcher: Colour | Gradient | Image */}
        <div
          role="tablist"
          aria-label="Background surface mode"
          className="grid grid-cols-3 gap-1 p-1 bg-[#1b1b1f] border border-[#25252b] rounded-[10px]"
        >
          {(['colour', 'gradient', 'image'] as const).map((mode) => {
            const active = (scene.backgroundMode || 'colour') === mode;
            return (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  if (mode === 'gradient' && !scene.backgroundGradient) {
                    const preset = STUDIO_GRADIENT_PRESETS[0];
                    applyCustomGradient(
                      preset.startColor,
                      preset.endColor,
                      preset.angle,
                      preset.type
                    );
                  } else if (mode === 'image' && !scene.backgroundImageUrl) {
                    onUpdateScene({
                      backgroundMode: 'image',
                      backgroundImageUrl: STUDIO_BACKDROP_PRESETS[0].url,
                      backgroundBlur: scene.backgroundBlur ?? 0,
                      backgroundDim: scene.backgroundDim ?? 20,
                    });
                  } else {
                    onUpdateScene({ backgroundMode: mode });
                  }
                }}
                className={`py-1.5 text-[12px] font-medium capitalize rounded-[7px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#26262e] text-[#f5f5f7] border border-[#3c3c46]'
                    : 'text-[#8e8e98] hover:text-[#f5f5f7]'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {/* MODE A: SOLID COLOUR */}
        {(scene.backgroundMode || 'colour') === 'colour' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] text-[#a0a0ab]">Colour</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  aria-label="Stage background hex colour"
                  value={scene.backgroundColor}
                  onChange={(e) =>
                    onUpdateScene({ backgroundColor: e.target.value })
                  }
                  className="w-24 bg-[#18181c] border border-[#2a2a32] rounded-[8px] px-2.5 py-1.5 text-[12px] font-mono tabular-nums text-[#f5f5f7] text-center focus:outline-none focus:border-[#3b66f5]"
                />
                <label className="w-9 h-8 rounded-[8px] border border-[#2e2e36] overflow-hidden cursor-pointer shrink-0 flex items-center justify-center">
                  <input
                    type="color"
                    aria-label="Pick stage background colour"
                    value={
                      scene.backgroundColor.startsWith('#')
                        ? scene.backgroundColor
                        : '#101014'
                    }
                    onChange={(e) =>
                      onUpdateScene({ backgroundColor: e.target.value })
                    }
                    className="w-12 h-12 -m-2 bg-transparent border-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Quick Solid Swatches */}
            <div className="grid grid-cols-8 gap-1.5">
              {[
                '#101014',
                '#060608',
                '#151926',
                '#1d1626',
                '#11211d',
                '#241815',
                '#22242a',
                '#f4f5f7',
              ].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  title={`Apply ${hex}`}
                  onClick={() => onUpdateScene({ backgroundColor: hex })}
                  style={{ backgroundColor: hex }}
                  className={`h-6 rounded-[6px] border transition-transform hover:scale-105 cursor-pointer ${
                    scene.backgroundColor.toLowerCase() === hex
                      ? 'border-[#3b66f5] ring-1 ring-[#3b66f5]'
                      : 'border-[#2e2e36]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* MODE B: PREMADE + CUSTOM GRADIENT STUDIO */}
        {scene.backgroundMode === 'gradient' && (
          <div className="space-y-3.5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#a0a0ab]">
                  Premade Studio Gradients
                </span>
                <span className="text-[10px] font-mono text-[#7c7c86]">
                  12 Presets
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {STUDIO_GRADIENT_PRESETS.map((preset) => {
                  const previewCss =
                    preset.type === 'radial'
                      ? `radial-gradient(circle at 50% 35%, ${preset.startColor} 0%, ${preset.endColor} 85%)`
                      : `linear-gradient(${preset.angle}deg, ${preset.startColor} 0%, ${preset.endColor} 100%)`;
                  const isCurrent =
                    scene.backgroundColor === preset.startColor &&
                    scene.backgroundSecondaryColor === preset.endColor;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        applyCustomGradient(
                          preset.startColor,
                          preset.endColor,
                          preset.angle,
                          preset.type
                        )
                      }
                      title={preset.name}
                      className={`group flex flex-col items-center p-1 rounded-[9px] border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#20222c] border-[#3b66f5]'
                          : 'bg-[#18181c] border-[#26262e] hover:border-[#3e404e]'
                      }`}
                    >
                      <div
                        style={{ background: previewCss }}
                        className="w-full h-7 rounded-[6px] border border-white/10"
                      />
                      <span className="mt-1 text-[9.5px] text-[#c8c8d2] truncate w-full text-center">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Gradient Builder */}
            <div className="p-3 rounded-[10px] bg-[#18181c] border border-[#25252b] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#d4d4dc]">
                  Custom Gradient Builder
                </span>
                <div className="inline-flex p-0.5 bg-[#111115] border border-[#26262e] rounded-[6px]">
                  {(['linear', 'radial'] as const).map((gType) => {
                    const active =
                      (scene.backgroundGradientType || 'linear') === gType;
                    return (
                      <button
                        key={gType}
                        type="button"
                        onClick={() =>
                          applyCustomGradient(
                            scene.backgroundColor || '#1e3a8a',
                            scene.backgroundSecondaryColor || '#090a0f',
                            scene.backgroundGradientAngle ?? 135,
                            gType
                          )
                        }
                        className={`px-2 py-0.5 text-[10px] capitalize rounded-[4px] cursor-pointer ${
                          active
                            ? 'bg-[#262834] text-white font-medium'
                            : 'text-[#8e8e98] hover:text-white'
                        }`}
                      >
                        {gType}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start & End Color Pickers */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[10.5px] text-[#8e8e98]">Start Stop</span>
                  <div className="flex items-center gap-1.5">
                    <label className="w-7 h-7 rounded-[6px] border border-[#2e2e36] overflow-hidden cursor-pointer shrink-0">
                      <input
                        type="color"
                        aria-label="Gradient start colour"
                        value={
                          scene.backgroundColor.startsWith('#')
                            ? scene.backgroundColor
                            : '#1e3a8a'
                        }
                        onChange={(e) =>
                          applyCustomGradient(
                            e.target.value,
                            scene.backgroundSecondaryColor || '#090a0f',
                            scene.backgroundGradientAngle ?? 135,
                            scene.backgroundGradientType || 'linear'
                          )
                        }
                        className="w-10 h-10 -m-1.5 cursor-pointer"
                      />
                    </label>
                    <input
                      type="text"
                      aria-label="Gradient start hex"
                      value={scene.backgroundColor}
                      onChange={(e) =>
                        applyCustomGradient(
                          e.target.value,
                          scene.backgroundSecondaryColor || '#090a0f',
                          scene.backgroundGradientAngle ?? 135,
                          scene.backgroundGradientType || 'linear'
                        )
                      }
                      className="w-full bg-[#101014] border border-[#2a2a32] rounded-[6px] px-2 py-1 text-[11px] font-mono text-[#f5f5f7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10.5px] text-[#8e8e98]">End Stop</span>
                  <div className="flex items-center gap-1.5">
                    <label className="w-7 h-7 rounded-[6px] border border-[#2e2e36] overflow-hidden cursor-pointer shrink-0">
                      <input
                        type="color"
                        aria-label="Gradient end colour"
                        value={
                          (scene.backgroundSecondaryColor || '#090a0f').startsWith(
                            '#'
                          )
                            ? scene.backgroundSecondaryColor || '#090a0f'
                            : '#090a0f'
                        }
                        onChange={(e) =>
                          applyCustomGradient(
                            scene.backgroundColor || '#1e3a8a',
                            e.target.value,
                            scene.backgroundGradientAngle ?? 135,
                            scene.backgroundGradientType || 'linear'
                          )
                        }
                        className="w-10 h-10 -m-1.5 cursor-pointer"
                      />
                    </label>
                    <input
                      type="text"
                      aria-label="Gradient end hex"
                      value={scene.backgroundSecondaryColor || '#090a0f'}
                      onChange={(e) =>
                        applyCustomGradient(
                          scene.backgroundColor || '#1e3a8a',
                          e.target.value,
                          scene.backgroundGradientAngle ?? 135,
                          scene.backgroundGradientType || 'linear'
                        )
                      }
                      className="w-full bg-[#101014] border border-[#2a2a32] rounded-[6px] px-2 py-1 text-[11px] font-mono text-[#f5f5f7]"
                    />
                  </div>
                </div>
              </div>

              {/* Gradient Angle Slider */}
              {(scene.backgroundGradientType || 'linear') === 'linear' && (
                <div className="flex items-center justify-between gap-2.5 pt-1">
                  <span className="w-16 text-[11px] text-[#a0a0ab] shrink-0">
                    Angle
                  </span>
                  <CapsuleSlider
                    min={0}
                    max={360}
                    step={5}
                    value={scene.backgroundGradientAngle ?? 135}
                    ariaLabel="Gradient angle"
                    onChange={(angle) =>
                      applyCustomGradient(
                        scene.backgroundColor || '#1e3a8a',
                        scene.backgroundSecondaryColor || '#090a0f',
                        angle,
                        'linear'
                      )
                    }
                  />
                  <span className="w-10 text-right text-[11px] font-mono tabular-nums text-[#a0a0ab]">
                    {scene.backgroundGradientAngle ?? 135}°
                  </span>
                </div>
              )}

              {/* Live Gradient Bar Preview */}
              <div
                style={{ background: resolveSceneGradientCss(scene) }}
                className="w-full h-5 rounded-[6px] border border-white/15"
              />
            </div>
          </div>
        )}

        {/* MODE C: STUDIO BACKGROUND IMAGE + UPLOAD + BLUR & DIM */}
        {scene.backgroundMode === 'image' && (
          <div className="space-y-3.5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#a0a0ab]">
                  Curated Studio Backdrops
                </span>
                <label className="inline-flex items-center gap-1 px-2.5 py-1 text-[10.5px] font-medium text-white bg-[#3b66f5] hover:bg-[#4e76ff] rounded-full cursor-pointer transition-colors">
                  <Upload className="w-3 h-3" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Upload custom background image"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STUDIO_BACKDROP_PRESETS.map((bg) => {
                  const isCurrent = scene.backgroundImageUrl === bg.url;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() =>
                        onUpdateScene({
                          backgroundMode: 'image',
                          backgroundImageUrl: bg.url,
                        })
                      }
                      className={`group flex flex-col items-start p-1.5 rounded-[10px] border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#20222c] border-[#3b66f5]'
                          : 'bg-[#18181c] border-[#26262e] hover:border-[#3e404e]'
                      }`}
                    >
                      <img
                        src={bg.url}
                        alt={bg.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-11 rounded-[6px] object-cover border border-white/10"
                      />
                      <span className="mt-1 text-[10px] font-medium text-[#d4d4dc] truncate w-full text-left">
                        {bg.name.split(' ')[0]} {bg.name.split(' ')[1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Backdrop Blur & Dim Sliders */}
            <div className="p-3 rounded-[10px] bg-[#18181c] border border-[#25252b] space-y-2.5">
              <div className="flex items-center justify-between gap-2.5">
                <span className="w-20 text-[12px] text-[#a0a0ab] shrink-0">
                  Backdrop blur
                </span>
                <CapsuleSlider
                  min={0}
                  max={36}
                  step={1}
                  value={scene.backgroundBlur ?? 0}
                  ariaLabel="Background image blur"
                  onChange={(val) => onUpdateScene({ backgroundBlur: val })}
                />
                <span className="w-10 text-right text-[11px] font-mono tabular-nums text-[#a0a0ab]">
                  {scene.backgroundBlur ?? 0}px
                </span>
              </div>

              <div className="flex items-center justify-between gap-2.5">
                <span className="w-20 text-[12px] text-[#a0a0ab] shrink-0">
                  Scrim dim
                </span>
                <CapsuleSlider
                  min={0}
                  max={85}
                  step={5}
                  value={scene.backgroundDim ?? 20}
                  ariaLabel="Background dim scrim"
                  onChange={(val) => onUpdateScene({ backgroundDim: val })}
                />
                <span className="w-10 text-right text-[11px] font-mono tabular-nums text-[#a0a0ab]">
                  {scene.backgroundDim ?? 20}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. POSITION (With Keyframe Diamonds ◇ and Capsule Grip Sliders) */}
      <div className="p-4 border-b border-[#232327] space-y-3.5">
        <button
          type="button"
          onClick={() => setOpenPositionSection((v) => !v)}
          className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86] hover:text-[#b4b4be] cursor-pointer"
        >
          <span>POSITION</span>
          {openPositionSection ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {openPositionSection && (
          <div className="space-y-3">
            {POSITION_SLIDERS.map((slider) => {
              const val = pos[slider.key] as number;
              const hasKeyframe = keyframes.some((k) => k.property === slider.key);

              return (
                <div
                  key={slider.key}
                  className="flex items-center justify-between gap-2.5"
                >
                  {/* Diamond Keyframe Button ◇ */}
                  <button
                    type="button"
                    aria-label={`Animate ${slider.label} keyframe`}
                    title={`Add/update keyframe for ${slider.label}`}
                    onClick={() => onToggleKeyframe(slider.key, slider.label, val)}
                    className={`w-4 h-4 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      hasKeyframe
                        ? 'text-[#3b66f5]'
                        : 'text-[#52525c] hover:text-[#a0a0ab]'
                    }`}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5"
                      fill={hasKeyframe ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <polygon points="8,1.5 14.5,8 8,14.5 1.5,8" />
                    </svg>
                  </button>

                  {/* Property Label */}
                  <span
                    className="w-20 text-[12px] text-[#a0a0ab] truncate shrink-0"
                    title={slider.label}
                  >
                    {slider.shortLabel}
                  </span>

                  {/* Capsule Slider with `( || )` Grip */}
                  <CapsuleSlider
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={val}
                    ariaLabel={slider.label}
                    onChange={(nextVal) =>
                      onUpdatePositionSetting(slider.key, nextVal)
                    }
                  />

                  {/* Right Tabular Value */}
                  <span className="w-11 text-right text-[12px] font-mono tabular-nums text-[#a0a0ab] shrink-0">
                    {slider.step < 1 ? val.toFixed(1) : Math.round(val)}
                    {slider.unit}
                  </span>
                </div>
              );
            })}

            {/* Card Ratio Bar */}
            <div className="pt-2 space-y-2">
              <div className="text-[12px] text-[#a0a0ab]">Card ratio</div>
              <div className="grid grid-cols-7 gap-1 p-1 bg-[#1b1b1f] border border-[#25252b] rounded-[10px]">
                {(['Auto', '1:1', '4:3', '3:4', '4:5', '16:9', '9:16'] as const).map(
                  (r) => {
                    const active = pos.cardRatio === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => onUpdatePositionSetting('cardRatio', r)}
                        className={`py-1.5 text-[10px] font-mono tabular-nums rounded-[6px] transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#26262e] text-[#f5f5f7] font-semibold'
                            : 'text-[#8e8e98] hover:text-[#f5f5f7]'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* SHADOW Checkbox Row */}
            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pos.shadow}
                  onChange={(e) =>
                    onUpdatePositionSetting('shadow', e.target.checked)
                  }
                  className="w-3.5 h-3.5 rounded accent-[#3b66f5] cursor-pointer"
                />
                <span>SHADOW</span>
              </label>
            </div>

            {/* Reset Settings Pill Button */}
            <button
              type="button"
              onClick={onResetPositionSettings}
              className="w-full mt-2 py-2 px-4 text-[12px] font-medium text-[#d4d4dc] bg-[#1a1a1f] hover:bg-[#222228] border border-[#2b2b33] rounded-full transition-colors cursor-pointer"
            >
              Reset settings
            </button>
          </div>
        )}
      </div>

      {/* 9. SELECTED CARD COLOR GRADING STUDIO */}
      {activeAsset && (
        <div className="p-4 space-y-3">
          <button
            type="button"
            onClick={() => setOpenGradingSection((v) => !v)}
            className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86] hover:text-[#b4b4be] cursor-pointer"
          >
            <span>CARD GRADING · {activeAsset.name.slice(0, 14)}</span>
            {openGradingSection ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {openGradingSection && (
            <div className="space-y-2.5 p-3 bg-[#18181c] border border-[#25252b] rounded-[12px]">
              <input
                type="text"
                aria-label="Selected Asset Name"
                value={activeAsset.name}
                onChange={(e) =>
                  onUpdateAsset(activeAsset.id, { name: e.target.value })
                }
                className="w-full bg-[#101014] border border-[#2a2a32] rounded-[6px] px-2.5 py-1 text-xs text-[#f5f5f7]"
              />

              {[
                { key: 'brightness' as const, label: 'Brightness', min: 50, max: 150, unit: '%' },
                { key: 'contrast' as const, label: 'Contrast', min: 50, max: 150, unit: '%' },
                { key: 'saturation' as const, label: 'Saturation', min: 0, max: 200, unit: '%' },
                { key: 'hueRotate' as const, label: 'Hue Shift', min: 0, max: 360, unit: '°' },
              ].map((ctrl) => (
                <div key={ctrl.key} className="flex items-center justify-between gap-2">
                  <span className="w-20 text-[11px] text-[#8e8e98] shrink-0">
                    {ctrl.label}
                  </span>
                  <CapsuleSlider
                    min={ctrl.min}
                    max={ctrl.max}
                    step={1}
                    value={activeAsset.filters[ctrl.key]}
                    ariaLabel={`Asset ${ctrl.label}`}
                    onChange={(val) =>
                      onUpdateAsset(activeAsset.id, {
                        filters: {
                          ...activeAsset.filters,
                          [ctrl.key]: val,
                        },
                      })
                    }
                  />
                  <span className="w-10 text-right text-[11px] font-mono tabular-nums text-[#a0a0ab]">
                    {activeAsset.filters[ctrl.key]}
                    {ctrl.unit}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 border-t border-[#25252b]">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateAsset(activeAsset.id, {
                      filters: { ...DEFAULT_IMAGE_FILTERS },
                    })
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-[#a0a0ab] hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset grading</span>
                </button>
                {assets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteAsset(activeAsset.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#ef4444] hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete card</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
