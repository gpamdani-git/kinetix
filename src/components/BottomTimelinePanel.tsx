import React, { useRef } from 'react';
import { Play, Pause, SkipBack, X } from 'lucide-react';
import {
  AnimatableProperty,
  MotionLayer,
  MotionScene,
  PropertyKeyframe,
} from '../engine/motionEngine';

interface BottomTimelinePanelProps {
  scene: MotionScene;
  currentTime: number;
  isPlaying: boolean;
  keyframesOpen: boolean;
  selectedLayerId: string | null;
  onTogglePlay: () => void;
  onSeek: (timeSec: number) => void;
  onSelectLayer: (layerId: string) => void;
  onRemovePropertyKeyframes: (property: AnimatableProperty) => void;
}

export const BottomTimelinePanel: React.FC<BottomTimelinePanelProps> = ({
  scene,
  currentTime,
  isPlaying,
  keyframesOpen,
  selectedLayerId,
  onTogglePlay,
  onSeek,
  onSelectLayer,
  onRemovePropertyKeyframes,
}) => {
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const totalDur = Math.max(1, scene.duration);
  const playheadPct = Math.max(0, Math.min(100, (currentTime / totalDur) * 100));

  const keyframes = scene.keyframes || [];
  const visibleLayers = scene.layers.filter((l) => l.visible);

  // Group keyframes by property
  const keyframeGroups = new Map<
    AnimatableProperty,
    { label: string; items: PropertyKeyframe[] }
  >();
  for (const kf of keyframes) {
    const existing = keyframeGroups.get(kf.property) || {
      label: kf.label,
      items: [],
    };
    existing.items.push(kf);
    keyframeGroups.set(kf.property, existing);
  }

  const totalTracks = keyframeGroups.size + visibleLayers.length;

  const ticks: number[] = [];
  const step = totalDur <= 10 ? 1 : 2;
  for (let t = 0; t <= totalDur + 0.01; t += step) {
    ticks.push(Math.round(t));
  }

  const seekFromClientX = (clientX: number) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(Number((ratio * totalDur).toFixed(2)));
  };

  return (
    <section
      aria-label="Timeline and Keyframe Editor"
      className="bg-[#141416] border-t border-[#232327] flex flex-col shrink-0 select-none"
    >
      {/* Collapsible Keyframes Track Area */}
      {keyframesOpen && (
        <div className="h-[124px] flex border-b border-[#232327] overflow-hidden">
          {/* Left Track Column Header & Track Labels */}
          <div className="w-[140px] border-r border-[#232327] flex flex-col shrink-0 bg-[#141416]">
            <div className="h-8 px-3.5 border-b border-[#232327] flex items-center text-[10px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
              {totalTracks} {totalTracks === 1 ? 'TRACK' : 'TRACKS'}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#202025]">
              {Array.from(keyframeGroups.entries()).map(([prop, group]) => (
                <div
                  key={prop}
                  className="h-7 px-3 flex items-center justify-between text-[11px] text-[#d4d4dc]"
                >
                  <span className="truncate">{group.label}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${group.label} keyframes`}
                    onClick={() => onRemovePropertyKeyframes(prop)}
                    className="p-0.5 text-[#7c7c86] hover:text-[#ef4444] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {visibleLayers.map((layer: MotionLayer) => (
                <div
                  key={layer.id}
                  onClick={() => onSelectLayer(layer.id)}
                  className={`h-7 px-3 flex items-center justify-between text-[11px] cursor-pointer ${
                    layer.id === selectedLayerId
                      ? 'bg-[#1e1e24] text-[#f5f5f7]'
                      : 'text-[#8e8e98] hover:text-[#f5f5f7]'
                  }`}
                >
                  <span className="truncate">{layer.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Time Ruler & Keyframe Canvas */}
          <div
            ref={rulerRef}
            onClick={(e) => seekFromClientX(e.clientX)}
            className="flex-1 relative flex flex-col bg-[#141416] cursor-pointer overflow-hidden"
          >
            {/* Time Ruler Row */}
            <div className="h-8 border-b border-[#232327] relative flex items-center px-3">
              {ticks.map((t, i) => {
                const leftPct = (t / totalDur) * 100;
                const alignClass =
                  i === 0
                    ? 'translate-x-0 pl-1.5'
                    : i === ticks.length - 1
                    ? '-translate-x-full pr-1.5'
                    : '-translate-x-1/2';
                return (
                  <div
                    key={t}
                    style={{ left: `${leftPct}%` }}
                    className="absolute top-0 bottom-0 flex items-center pointer-events-none"
                  >
                    <span
                      className={`text-[11px] font-mono tabular-nums text-[#7c7c86] ${alignClass}`}
                    >
                      {t}s
                    </span>
                  </div>
                );
              })}

              {/* Glowing Blue Pill Time Playhead Badge on Ruler */}
              <div
                style={{ left: `${playheadPct}%` }}
                className="absolute -translate-x-1/2 px-2 py-0.5 bg-[#2c66f6] text-white text-[11px] font-mono tabular-nums font-medium rounded-full shadow-[0_0_12px_rgba(44,102,246,0.65)] z-20 pointer-events-none"
              >
                {currentTime.toFixed(1)}s
              </div>
            </div>

            {/* Keyframe Diamond Tracks or Empty State Message */}
            <div className="flex-1 relative overflow-y-auto">
              {totalTracks === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-[12px] text-[#6e6e78] flex items-center gap-1.5">
                    <span>No keyframes yet — click the</span>
                    <span className="inline-flex items-center justify-center text-[#8e8e98]">
                      ◇
                    </span>
                    <span>next to a slider or colour to animate it.</span>
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1e1e23]">
                  {Array.from(keyframeGroups.entries()).map(([prop, group]) => (
                    <div key={prop} className="h-7 relative flex items-center">
                      {group.items.map((kf) => {
                        const kfPct = Math.max(
                          1,
                          Math.min(99, (kf.time / totalDur) * 100)
                        );
                        return (
                          <div
                            key={kf.id}
                            style={{ left: `${kfPct}%` }}
                            title={`${group.label}: ${kf.value} @ ${kf.time.toFixed(1)}s`}
                            className="absolute -translate-x-1/2 w-3 h-3 bg-[#3b66f5] border border-white rotate-45 rounded-[1px] shadow"
                          />
                        );
                      })}
                    </div>
                  ))}

                  {visibleLayers.map((layer: MotionLayer) => {
                    const startPct = Math.max(
                      0,
                      Math.min(100, (layer.startTime / totalDur) * 100)
                    );
                    const widthPct = Math.max(
                      5,
                      Math.min(100 - startPct, (layer.duration / totalDur) * 100)
                    );
                    return (
                      <div key={layer.id} className="h-7 relative flex items-center">
                        <div
                          style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                          className="absolute h-4 rounded-full bg-[#3b66f5]/30 border border-[#3b66f5] px-2 flex items-center text-[10px] font-mono text-[#e4e4eb] truncate"
                        >
                          {layer.name} · {layer.animationType}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vertical Blue Playhead Line */}
              <div
                style={{ left: `${playheadPct}%` }}
                className="absolute top-0 bottom-0 w-[1.5px] bg-[#2c66f6] pointer-events-none z-10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Transport Scrubber Row (matches Animos bottom playback bar) */}
      <div className="h-12 px-4 flex items-center gap-3 bg-[#141416]">
        {/* Play / Pause Rounded Square Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          className="w-8 h-8 rounded-[8px] bg-[#1e1e23] hover:bg-[#27272e] border border-[#2a2a32] flex items-center justify-center text-[#e4e4eb] transition-colors cursor-pointer shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>

        {/* Jump to Start Button */}
        <button
          type="button"
          onClick={() => onSeek(0)}
          aria-label="Restart timeline"
          className="w-8 h-8 rounded-[8px] bg-[#1e1e23] hover:bg-[#27272e] border border-[#2a2a32] flex items-center justify-center text-[#a0a0ab] hover:text-[#f5f5f7] transition-colors cursor-pointer shrink-0"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Full-Width Blue Scrubber Track */}
        <div className="relative flex-1 h-6 flex items-center mx-2">
          <div className="w-full h-[6px] bg-[#d4d4dc] rounded-full overflow-hidden">
            <div
              style={{ width: `${playheadPct}%` }}
              className="h-full bg-[#2c66f6]"
            />
          </div>
          <div
            style={{ left: `calc(${playheadPct}% - 7px)` }}
            className="absolute w-3.5 h-3.5 rounded-full bg-[#2c66f6] ring-2 ring-[#f5f5f7]/30 shadow pointer-events-none"
          />
          <input
            type="range"
            min={0}
            max={totalDur}
            step={0.05}
            aria-label="Timeline Playhead Scrubber"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Right Tabular Timecode Readout */}
        <div className="text-[12px] font-mono tabular-nums text-[#8e8e98] shrink-0 min-w-[82px] text-right">
          {currentTime.toFixed(1)}s / {totalDur.toFixed(1)}s
        </div>
      </div>
    </section>
  );
};
