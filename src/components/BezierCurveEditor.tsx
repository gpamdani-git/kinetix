import React, { useRef, useState } from 'react';
import { CubicBezier, EASING_PRESETS } from '../engine/motionEngine';

interface BezierCurveEditorProps {
  bezier: CubicBezier;
  easingPreset: string;
  onChangeBezier: (nextBezier: CubicBezier, presetId: string) => void;
}

export const BezierCurveEditor: React.FC<BezierCurveEditorProps> = ({
  bezier,
  easingPreset,
  onChangeBezier,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<'p1' | 'p2' | null>(null);

  const [x1, y1, x2, y2] = bezier;

  // Map normalized [0..1] to SVG box [20..160] (width 140, height 100 with padding for overshoot)
  const toSvgX = (val: number) => 20 + Math.max(0, Math.min(1, val)) * 140;
  const toSvgY = (val: number) => 125 - Math.max(-0.4, Math.min(1.6, val)) * 90;

  const fromSvgCoords = (clientX: number, clientY: number): [number, number] => {
    if (!svgRef.current) return [0.5, 0.5];
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * 180;
    const relY = ((clientY - rect.top) / rect.height) * 150;
    const normX = Math.max(0, Math.min(1, Number(((relX - 20) / 140).toFixed(2))));
    const normY = Math.max(-0.35, Math.min(1.6, Number(((125 - relY) / 90).toFixed(2))));
    return [normX, normY];
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingHandle) return;
    const [nx, ny] = fromSvgCoords(e.clientX, e.clientY);
    if (draggingHandle === 'p1') {
      onChangeBezier([nx, ny, x2, y2], 'custom');
    } else {
      onChangeBezier([x1, y1, nx, ny], 'custom');
    }
  };

  const handlePointerUp = () => {
    setDraggingHandle(null);
  };

  const startX = toSvgX(0);
  const startY = toSvgY(0);
  const endX = toSvgX(1);
  const endY = toSvgY(1);
  const p1SvgX = toSvgX(x1);
  const p1SvgY = toSvgY(y1);
  const p2SvgX = toSvgX(x2);
  const p2SvgY = toSvgY(y2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#d0d6e0] whitespace-nowrap">
          Cubic-Bezier Curve
        </span>
        <span className="text-[11px] font-mono tabular-nums text-[#8a8f98] whitespace-nowrap">
          {x1.toFixed(2)}, {y1.toFixed(2)}, {x2.toFixed(2)}, {y2.toFixed(2)}
        </span>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 gap-1.5">
        {EASING_PRESETS.map((preset) => {
          const isSelected = easingPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChangeBezier([...preset.bezier] as CubicBezier, preset.id)}
              className={`px-2.5 py-1.5 text-left text-xs rounded-[6px] border transition-colors whitespace-nowrap truncate cursor-pointer ${
                isSelected
                  ? 'bg-[#18191a] text-[#f7f8f8] border-[#5e6ad2]'
                  : 'bg-[#0f1011] text-[#8a8f98] border-[#23252a] hover:text-[#f7f8f8] hover:border-[#34343a]'
              }`}
              title={preset.description}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Interactive SVG Curve Graph */}
      <div className="bg-[#010102] border border-[#23252a] rounded-[8px] p-2">
        <svg
          ref={svgRef}
          viewBox="0 0 180 150"
          className="w-full h-32 select-none touch-none cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          role="img"
          aria-label="Interactive Cubic Bezier Curve Graph"
        >
          {/* Baseline Grid */}
          <rect
            x={startX}
            y={endY}
            width={endX - startX}
            height={startY - endY}
            fill="#0f1011"
            stroke="#23252a"
            strokeWidth="1"
          />
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#23252a"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Handle Tangents */}
          <line
            x1={startX}
            y1={startY}
            x2={p1SvgX}
            y2={p1SvgY}
            stroke="#5e6ad2"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <line
            x1={endX}
            y1={endY}
            x2={p2SvgX}
            y2={p2SvgY}
            stroke="#828fff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Cubic Bezier Path */}
          <path
            d={`M ${startX} ${startY} C ${p1SvgX} ${p1SvgY}, ${p2SvgX} ${p2SvgY}, ${endX} ${endY}`}
            fill="none"
            stroke="#f7f8f8"
            strokeWidth="2.25"
            strokeLinecap="round"
          />

          {/* Endpoints */}
          <circle cx={startX} cy={startY} r="3.5" fill="#8a8f98" />
          <circle cx={endX} cy={endY} r="3.5" fill="#8a8f98" />

          {/* Draggable Control Point P1 */}
          <circle
            cx={p1SvgX}
            cy={p1SvgY}
            r="6.5"
            fill="#5e6ad2"
            stroke="#f7f8f8"
            strokeWidth="1.5"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingHandle('p1');
            }}
          />

          {/* Draggable Control Point P2 */}
          <circle
            cx={p2SvgX}
            cy={p2SvgY}
            r="6.5"
            fill="#828fff"
            stroke="#f7f8f8"
            strokeWidth="1.5"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingHandle('p2');
            }}
          />
        </svg>

        {/* Numeric Coordinate Fine-Tuners */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#23252a] mt-1">
          {[
            { label: 'X1', idx: 0, min: 0, max: 1 },
            { label: 'Y1', idx: 1, min: -0.5, max: 1.8 },
            { label: 'X2', idx: 2, min: 0, max: 1 },
            { label: 'Y2', idx: 3, min: -0.5, max: 1.8 },
          ].map((coord) => (
            <label key={coord.label} className="flex flex-col text-[10px] text-[#8a8f98]">
              <span>{coord.label}</span>
              <input
                type="number"
                step="0.05"
                min={coord.min}
                max={coord.max}
                aria-label={`Bezier ${coord.label}`}
                value={bezier[coord.idx]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (Number.isNaN(val)) return;
                  const next = [...bezier] as CubicBezier;
                  next[coord.idx] = Math.max(coord.min, Math.min(coord.max, val));
                  onChangeBezier(next, 'custom');
                }}
                className="mt-0.5 bg-[#0f1011] border border-[#23252a] rounded-[4px] px-1.5 py-1 text-[11px] font-mono tabular-nums text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2]"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
