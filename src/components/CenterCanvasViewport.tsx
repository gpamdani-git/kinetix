import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  computeFormationSlotTransforms,
  computeLayerFrameState,
  DEFAULT_POSITION_SETTINGS,
  getCardAspectDimensions,
  ImageAsset,
  MotionLayer,
  MotionScene,
  PLATFORM_SPECS,
  PositionSettings,
  resolvePositionSettingsAtTime,
  resolveSceneGradientCss,
} from '../engine/motionEngine';

interface CenterCanvasViewportProps {
  scene: MotionScene;
  assets: ImageAsset[];
  currentTime: number;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onSelectAsset: (assetId: string) => void;
  onUpdateLayerPosition: (
    layerId: string,
    x: number,
    y: number,
    commitHistory: boolean
  ) => void;
  onUpdatePositionSetting?: (
    key: keyof PositionSettings,
    value: number | string | boolean
  ) => void;
  keyframesOpen: boolean;
  onToggleKeyframesOpen: () => void;
}

export const CenterCanvasViewport: React.FC<CenterCanvasViewportProps> = ({
  scene,
  assets,
  currentTime,
  selectedLayerId,
  onSelectLayer,
  onSelectAsset,
  onUpdateLayerPosition,
  keyframesOpen,
  onToggleKeyframesOpen,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<{
    layerId: string;
    startClientX: number;
    startClientY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const spec = PLATFORM_SPECS[scene.platform] || PLATFORM_SPECS['instagram-post'];
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  const pos = resolvePositionSettingsAtTime(
    scene.positionSettings || DEFAULT_POSITION_SETTINGS,
    scene.keyframes,
    currentTime
  );

  // Calculate stage dimensions based on aspect ratio and whether keyframes drawer is expanded
  const maxStageHeight = keyframesOpen ? 465 : 550;
  const maxStageWidth = 660;

  let stageW = maxStageHeight * spec.aspectRatio;
  let stageH = maxStageHeight;
  if (stageW > maxStageWidth) {
    stageW = maxStageWidth;
    stageH = maxStageWidth / spec.aspectRatio;
  }
  stageW = Math.round(stageW);
  stageH = Math.round(stageH);
  const fontScale = stageW / spec.width;

  const slotCount = scene.slotCount ?? 12;
  const formation = scene.formation || 'showcase-ring';
  const effectiveTime = currentTime;

  const slotTransforms = computeFormationSlotTransforms(
    formation,
    slotCount,
    pos,
    effectiveTime,
    scene.duration,
    stageW,
    stageH
  );

  const cardBaseSizePx = Math.round(
    (pos.cardSize / 100) * Math.min(stageW, stageH)
  );
  const { width: cardW, height: cardH } = getCardAspectDimensions(
    cardBaseSizePx,
    pos.cardRatio
  );
  const cardCornerRadiusPx = Math.round(
    (pos.cornerRadius / 100) * Math.min(cardW, cardH) * 2.6
  );
  const perspectivePx = Math.round(1350 - pos.perspective * 14);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - dragState.startClientX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragState.startClientY) / rect.height) * 100;
    const nextX = Math.max(
      5,
      Math.min(95, Number((dragState.initialX + dxPct).toFixed(1)))
    );
    const nextY = Math.max(
      5,
      Math.min(95, Number((dragState.initialY + dyPct).toFixed(1)))
    );
    onUpdateLayerPosition(dragState.layerId, nextX, nextY, false);
  };

  const handleStagePointerUp = () => {
    if (dragState) {
      const layer = scene.layers.find((l) => l.id === dragState.layerId);
      if (layer) {
        onUpdateLayerPosition(layer.id, layer.x, layer.y, true);
      }
      setDragState(null);
    }
  };

  const getStageBackgroundStyle = (): React.CSSProperties => {
    if (scene.backgroundMode === 'gradient') {
      return {
        background: resolveSceneGradientCss(scene),
      };
    }
    return {
      backgroundColor: scene.backgroundColor || '#101014',
    };
  };

  return (
    <section
      aria-label="Center Motion Preview Stage"
      className="flex-1 relative flex flex-col items-center justify-center bg-[#121215] min-w-0 min-h-0 select-none overflow-hidden px-4 py-3"
      style={{
        backgroundImage: 'radial-gradient(#27272e 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Main Rounded Artboard Stage */}
      <div
        ref={stageRef}
        data-testid="motion-canvas-stage"
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerLeave={handleStagePointerUp}
        style={{
          width: `${stageW}px`,
          height: `${stageH}px`,
          perspective: `${perspectivePx}px`,
          ...getStageBackgroundStyle(),
        }}
        className="relative rounded-[22px] border border-[#25252c] shadow-[0_24px_70px_rgba(0,0,0,0.65)] overflow-hidden shrink-0 transition-[width,height] duration-150"
      >
        {/* Background Image Layer + Blur + Scrim Dim (when Image mode is active) */}
        {scene.backgroundMode === 'image' && scene.backgroundImageUrl && (
          <>
            <img
              src={scene.backgroundImageUrl}
              alt="Stage Backdrop"
              referrerPolicy="no-referrer"
              style={{
                filter:
                  (scene.backgroundBlur ?? 0) > 0
                    ? `blur(${scene.backgroundBlur}px)`
                    : 'none',
                transform:
                  (scene.backgroundBlur ?? 0) > 0 ? 'scale(1.08)' : 'scale(1)',
              }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />
            <div
              aria-hidden="true"
              style={{
                backgroundColor: `rgba(8, 9, 13, ${((scene.backgroundDim ?? 20) / 100).toFixed(2)})`,
              }}
              className="absolute inset-0 pointer-events-none"
            />
          </>
        )}

        {/* Subtle Horizon Center Hairline when Grid Overlay is enabled */}
        {scene.showGridOverlay && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              backgroundImage:
                'linear-gradient(to right, #26262e 1px, transparent 1px), linear-gradient(to bottom, #26262e 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        )}

        {/* 3D & UI Transition Formation Container */}
        <div
          style={{
            position: 'absolute',
            inset: `${pos.padding}%`,
            transformStyle: 'preserve-3d',
          }}
          className="flex items-center justify-center pointer-events-none"
        >
          {slotTransforms.map((slot) => {
            const asset =
              assets.length > 0 ? assets[slot.slotIndex % assets.length] : undefined;
            const f = asset?.filters;
            const totalBlur = (f?.blur || 0) + (slot.blurPx || 0);
            const filterCss = f
              ? `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${totalBlur.toFixed(1)}px) hue-rotate(${f.hueRotate}deg)`
              : slot.blurPx
              ? `blur(${slot.blurPx}px)`
              : 'none';

            return (
              <div
                key={slot.slotIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  if (asset) onSelectAsset(asset.id);
                }}
                style={{
                  position: 'absolute',
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  borderRadius: `${cardCornerRadiusPx}px`,
                  opacity: slot.opacity,
                  zIndex: slot.zIndex,
                  transform: `translate3d(${slot.translateX}px, ${slot.translateY}px, ${slot.translateZ}px) rotateZ(${slot.rotateZ}deg) rotateX(${slot.rotateX}deg) rotateY(${slot.rotateY}deg) scale(${slot.scale})`,
                  boxShadow: pos.shadow
                    ? slot.isHeroFocus
                      ? '0 20px 48px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(255, 255, 255, 0.22)'
                      : '0 14px 32px rgba(0, 0, 0, 0.52)'
                    : 'none',
                  willChange: 'transform, opacity',
                }}
                className={`overflow-hidden bg-[#1c1d22] pointer-events-auto cursor-pointer hover:ring-2 hover:ring-[#3b66f5] transition-shadow ${
                  slot.isHeroFocus
                    ? 'border border-white/25'
                    : 'border border-white/10'
                }`}
              >
                {asset && (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                    style={{ filter: filterCss }}
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Uploaded Brand Logo Watermark (if present) */}
        {scene.logoUrl && (
          <div className="absolute top-4 right-4 z-[450] pointer-events-none">
            <img
              src={scene.logoUrl}
              alt="Brand Logo"
              className="h-9 w-auto object-contain rounded-[6px] drop-shadow"
            />
          </div>
        )}

        {/* Overlaid Kinetic Text, Metric & Custom Image Layers */}
        {scene.layers.map((layer: MotionLayer) => {
          const frame = computeLayerFrameState(layer, effectiveTime);
          const isSelected = layer.id === selectedLayerId;
          const asset = layer.assetId ? assetMap.get(layer.assetId) : undefined;

          if (!layer.visible) return null;

          const txPx = frame.translateX * fontScale;
          const tyPx = frame.translateY * fontScale;
          const filterCss = asset
            ? `brightness(${(layer.imageFilters || asset.filters).brightness}%) contrast(${
                (layer.imageFilters || asset.filters).contrast
              }%) saturate(${(layer.imageFilters || asset.filters).saturation}%) blur(${
                (layer.imageFilters || asset.filters).blur
              }px) hue-rotate(${(layer.imageFilters || asset.filters).hueRotate}deg)`
            : 'none';

          return (
            <div
              key={layer.id}
              role="button"
              tabIndex={0}
              aria-label={`Canvas layer ${layer.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectLayer(layer.id);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectLayer(layer.id);
                if (!layer.locked) {
                  setDragState({
                    layerId: layer.id,
                    startClientX: e.clientX,
                    startClientY: e.clientY,
                    initialX: layer.x,
                    initialY: layer.y,
                  });
                }
              }}
              style={{
                position: 'absolute',
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.width}%`,
                height: `${layer.height}%`,
                zIndex: 500,
                opacity: frame.activeInTimeline ? frame.opacity : 0.15,
                transform: `translate(-50%, -50%) translate3d(${txPx.toFixed(
                  1
                )}px, ${tyPx.toFixed(1)}px, 0) rotate(${frame.rotation.toFixed(
                  1
                )}deg) rotateX(${frame.perspectiveRotateX.toFixed(
                  1
                )}deg) skewX(${frame.skewX.toFixed(1)}deg) scale(${frame.scale.toFixed(3)})`,
                backgroundColor: layer.backgroundColor,
                color: layer.color,
                borderRadius: `${Math.round(layer.borderRadius * fontScale * 1.4)}px`,
                border:
                  layer.borderWidth > 0
                    ? `${Math.max(1, Math.round(layer.borderWidth * fontScale * 1.5))}px solid ${
                        layer.borderColor
                      }`
                    : undefined,
                textAlign: layer.textAlign || 'center',
              }}
              className={`flex flex-col justify-center px-3 py-2 cursor-move select-none ${
                isSelected
                  ? 'ring-2 ring-[#3b66f5] ring-offset-1 ring-offset-[#101014]'
                  : 'hover:ring-1 hover:ring-[#3b66f5]/60'
              }`}
            >
              {layer.type === 'image' && asset ? (
                <div className="relative w-full h-full overflow-hidden rounded-[inherit]">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                    style={{ filter: filterCss }}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              ) : (
                <div className="w-full pointer-events-none">
                  <div
                    style={{
                      fontSize: `${Math.max(12, Math.round(layer.fontSize * fontScale * 1.35))}px`,
                      fontWeight: layer.fontWeight,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                    }}
                    className="break-words drop-shadow"
                  >
                    {layer.text}
                  </div>
                  {layer.subtext && (
                    <div
                      style={{
                        fontSize: `${Math.max(10, Math.round(layer.fontSize * fontScale * 0.72))}px`,
                      }}
                      className="opacity-80 mt-1 font-normal"
                    >
                      {layer.subtext}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom "Keyframes" Toggle Pill */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30">
        <button
          type="button"
          onClick={onToggleKeyframesOpen}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-medium text-[#e4e4eb] bg-[#1e1e23]/95 hover:bg-[#27272e] border border-[#32323a] rounded-full shadow-lg backdrop-blur transition-colors cursor-pointer"
        >
          <span>Keyframes</span>
          {keyframesOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#8e8e98]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[#8e8e98]" />
          )}
        </button>
      </div>
    </section>
  );
};
