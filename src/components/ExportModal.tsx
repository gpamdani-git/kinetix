import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Code2,
  Film,
  FileJson,
  Sparkles,
  Copy,
  Check,
  Download,
  Upload,
  Terminal,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  DEFAULT_POSITION_SETTINGS,
  generateReactComponentCode,
  generateSceneJson,
  generateTransitionsDevCssCode,
  ImageAsset,
  MotionScene,
  PLATFORM_SPECS,
} from '../engine/motionEngine';
import {
  exportSceneToGifBlob,
  exportSceneToVideoBlob,
  preloadSceneImages,
  renderSceneFrameToCanvas,
} from '../engine/videoExporter';

interface ExportModalProps {
  isOpen: boolean;
  initialTab?: 'react' | 'css' | 'mp4' | 'gif' | 'json';
  scene: MotionScene;
  assets: ImageAsset[];
  onClose: () => void;
  onImportSceneJson: (
    importedScene: MotionScene,
    importedAssets?: ImageAsset[]
  ) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  initialTab = 'mp4',
  scene,
  assets,
  onClose,
  onImportSceneJson,
}) => {
  const [activeTab, setActiveTab] = useState<
    'react' | 'css' | 'mp4' | 'gif' | 'json'
  >(initialTab);
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [elapsedRenderSec, setElapsedRenderSec] = useState<number>(0);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Social Media 1080p Video Export Settings
  const [exportDurationMode, setExportDurationMode] = useState<
    'scene' | '5' | '10' | '15'
  >('5');
  const [exportResolution, setExportResolution] = useState<'1080p' | '720p'>(
    '1080p'
  );
  const [exportFps, setExportFps] = useState<30 | 60>(30);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [videoResult, setVideoResult] = useState<{
    url: string;
    ext: string;
    width: number;
    height: number;
    durationSec: number;
  } | null>(null);
  const [gifResultUrl, setGifResultUrl] = useState<string | null>(null);
  const [jsonImportText, setJsonImportText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);

  // Live Mini-Stage Canvas Preview inside Export Modal
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let rafId: number;
    let isCancelled = false;
    let imageMap = new Map<string, HTMLImageElement>();

    const drawSingleFrame = (tSec: number) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      renderSceneFrameToCanvas(
        ctx,
        scene,
        tSec,
        canvas.width,
        canvas.height,
        imageMap,
        assets
      );
    };

    // Draw initial frame immediately, then redraw once all images (including background image) finish loading
    drawSingleFrame(4.2);
    preloadSceneImages(scene, assets).then((loaded) => {
      if (isCancelled) return;
      imageMap = loaded;
      drawSingleFrame(4.2);
    });

    if (isPreviewPlaying) {
      const startTime = performance.now();
      const tick = (now: number) => {
        if (isCancelled) return;
        const elapsedSec =
          ((now - startTime) / 1000 + 4.2) % Math.max(1, scene.duration);
        drawSingleFrame(elapsedSec);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isOpen, scene, assets, isPreviewPlaying]);

  if (!isOpen) return null;

  const spec = PLATFORM_SPECS[scene.platform] || PLATFORM_SPECS['instagram-post'];
  const pos = scene.positionSettings || DEFAULT_POSITION_SETTINGS;
  const reactCode = generateReactComponentCode(scene, assets);
  const cssCode = generateTransitionsDevCssCode(scene);
  const sceneJson = generateSceneJson(scene, assets);
  const safeFilename =
    scene.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'kinetix-motion';
  const cliCommand = `npx transitions-dev add ${safeFilename}`;

  const targetVideoDuration =
    exportDurationMode === 'scene'
      ? Math.round(scene.duration)
      : Number(exportDurationMode);

  const resScale = exportResolution === '720p' ? 2 / 3 : 1;
  const outW = Math.round((spec.width * resScale) / 2) * 2;
  const outH = Math.round((spec.height * resScale) / 2) * 2;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback copy
    }
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadText = (
    content: string,
    filename: string,
    mime: string
  ) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleRenderVideo = async () => {
    setIsRendering(true);
    setRenderProgress(2);
    setElapsedRenderSec(0);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await exportSceneToVideoBlob(
        scene,
        assets,
        (pct, elapsedSec) => {
          setRenderProgress(pct);
          if (typeof elapsedSec === 'number') {
            setElapsedRenderSec(elapsedSec);
          }
        },
        {
          durationSec: targetVideoDuration,
          resolution: exportResolution,
          fps: exportFps,
          signal: controller.signal,
        }
      );
      if (videoResult?.url) URL.revokeObjectURL(videoResult.url);
      const url = URL.createObjectURL(result.blob);
      setVideoResult({
        url,
        ext: result.extension,
        width: result.width,
        height: result.height,
        durationSec: result.durationSec,
      });
      triggerDownload(
        url,
        `${safeFilename}-${exportResolution}-${targetVideoDuration}s.${result.extension}`
      );
    } catch {
      // Cancelled or interrupted
    } finally {
      setIsRendering(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelRender = () => {
    abortControllerRef.current?.abort();
    setIsRendering(false);
  };

  const handleRenderGif = async () => {
    setIsRendering(true);
    setRenderProgress(5);
    try {
      const blob = await exportSceneToGifBlob(scene, assets, (pct) =>
        setRenderProgress(pct)
      );
      if (gifResultUrl) URL.revokeObjectURL(gifResultUrl);
      const url = URL.createObjectURL(blob);
      setGifResultUrl(url);
      triggerDownload(url, `${safeFilename}.gif`);
    } finally {
      setIsRendering(false);
    }
  };

  const handleImportJson = () => {
    setImportError(null);
    if (!jsonImportText.trim()) {
      setImportError('Paste a valid Kinetix JSON scene blueprint first.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonImportText);
      const targetScene: MotionScene = parsed.scene || parsed;
      if (!targetScene.id || !Array.isArray(targetScene.layers)) {
        setImportError('Invalid scene structure: missing layers array.');
        return;
      }
      onImportSceneJson(targetScene, parsed.assets);
      setJsonImportText('');
      onClose();
    } catch {
      setImportError('Could not parse JSON. Check syntax and try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Motion & React Component"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
    >
      <div className="w-full max-w-[960px] bg-[#141416] border border-[#27272f] rounded-[20px] shadow-[0_32px_90px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Studio Bar Header */}
        <div className="px-6 py-4 bg-[#17171b] border-b border-[#232327] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#3b66f5]/15 border border-[#3b66f5]/40 flex items-center justify-center text-[#70b5f9]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7] tracking-tight">
                  Export Studio &amp; Code Suite
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#1f2437] text-[#70b5f9] border border-[#31416b] rounded-full">
                  1080p Social Ready
                </span>
              </div>
              <p className="text-[11px] text-[#8e8e98] mt-0.5 font-mono tabular-nums">
                {scene.name} · {spec.width}×{spec.height} ({spec.ratioLabel}) ·{' '}
                {scene.duration.toFixed(1)}s Loop · Horizon {pos.ringTilt}°
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="w-8 h-8 flex items-center justify-center text-[#8e8e98] hover:text-[#f5f5f7] bg-[#1d1d22] hover:bg-[#26262e] border border-[#2a2a32] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Split-Pane Studio Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* LEFT PANE: Live Mini-Stage Preview + Motion Telemetry Specs */}
          <div className="w-[290px] bg-[#101013] border-r border-[#232327] p-5 flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
                  STAGE PARITY PREVIEW
                </span>
                <button
                  type="button"
                  onClick={() => setIsPreviewPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-[#27a644] bg-[#16231b] hover:bg-[#1d2f24] border border-[#254230] rounded-full cursor-pointer transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                  <span>{isPreviewPlaying ? 'Pause' : 'Play'} · {scene.fps} FPS</span>
                </button>
              </div>

              {/* Live Canvas Container */}
              <div className="w-full aspect-square rounded-[14px] bg-[#0a0a0d] border border-[#23242c] flex items-center justify-center p-2.5 overflow-hidden shadow-inner">
                <canvas
                  ref={previewCanvasRef}
                  width={Math.round(240 * Math.min(1, spec.aspectRatio))}
                  height={Math.round(240 / Math.max(1, spec.aspectRatio))}
                  className="rounded-[10px] border border-[#25262e] shadow-lg max-w-full max-h-full"
                />
              </div>

              {/* Design-Engineering Telemetry Specs */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#7c7c86]">
                  EXPORT CONFIGURATION
                </div>

                <div className="p-2.5 rounded-[10px] bg-[#16161b] border border-[#232329] space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e8e98]">Output Dimensions</span>
                    <span className="font-mono text-[#f5f5f7]">
                      {outW}×{outH} ({exportResolution})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e8e98]">Surface Mode</span>
                    <span className="font-mono text-[#70b5f9] capitalize">
                      {scene.backgroundMode || 'colour'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e8e98]">Card Ratio</span>
                    <span className="font-mono text-[#27a644]">
                      {pos.cardRatio} ({scene.slotCount ?? 12} slots)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e8e98]">Physics Solver</span>
                    <span className="font-mono text-[#f5f5f7]">
                      Spring({pos.springStiffness ?? 380}, {pos.springDamping ?? 30})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility & Compositor Compliance Footer */}
            <div className="p-3 rounded-[10px] bg-[#151824] border border-[#26314d] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#70b5f9] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#b4bdd4] leading-snug">
                100% stage parity including gradients, blurred backdrops, custom card ratios, and 3D perspective.
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Segmented Pill Format Switcher & Code/Render Output */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#141416]">
            {/* Segmented Pill Format Switcher */}
            <div className="px-6 pt-4 pb-3 border-b border-[#232327]">
              <div className="grid grid-cols-5 gap-1 p-1 bg-[#1b1b1f] border border-[#26262c] rounded-[12px]">
                {[
                  { id: 'mp4' as const, label: 'MP4 Video', icon: Film },
                  { id: 'gif' as const, label: 'GIF89a', icon: Sparkles },
                  { id: 'react' as const, label: 'React (.tsx)', icon: Code2 },
                  { id: 'css' as const, label: 'transitions.dev', icon: Terminal },
                  { id: 'json' as const, label: 'JSON Blueprint', icon: FileJson },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[11.5px] font-medium rounded-[9px] border transition-all whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#22232a] text-[#f5f5f7] border-[#3b66f5] shadow-[0_0_12px_rgba(59,102,245,0.25)]'
                          : 'bg-transparent text-[#8e8e98] border-transparent hover:text-[#f5f5f7]'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          active ? 'text-[#70b5f9]' : 'text-[#7c7c86]'
                        }`}
                      />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === 'mp4' && (
                <div className="space-y-4">
                  {/* Social Media 1080p Settings Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Duration Selector */}
                    <div className="p-3 bg-[#18181d] border border-[#26262f] rounded-[12px] space-y-2">
                      <span className="text-[11px] font-medium text-[#a0a0ab]">
                        Clip Duration
                      </span>
                      <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#111115] border border-[#25252c] rounded-[8px]">
                        {(
                          [
                            { id: '5', label: '5s' },
                            { id: '10', label: '10s' },
                            { id: '15', label: '15s' },
                            { id: 'scene', label: `${Math.round(scene.duration)}s` },
                          ] as const
                        ).map((opt) => {
                          const active = exportDurationMode === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setExportDurationMode(opt.id)}
                              className={`py-1 text-[11px] font-mono rounded-[6px] cursor-pointer ${
                                active
                                  ? 'bg-[#3b66f5] text-white font-semibold'
                                  : 'text-[#8e8e98] hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Resolution Selector */}
                    <div className="p-3 bg-[#18181d] border border-[#26262f] rounded-[12px] space-y-2">
                      <span className="text-[11px] font-medium text-[#a0a0ab]">
                        Resolution Quality
                      </span>
                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#111115] border border-[#25252c] rounded-[8px]">
                        {(
                          [
                            { id: '1080p', label: '1080p HD' },
                            { id: '720p', label: '720p Fast' },
                          ] as const
                        ).map((opt) => {
                          const active = exportResolution === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setExportResolution(opt.id)}
                              className={`py-1 text-[11px] font-mono rounded-[6px] cursor-pointer ${
                                active
                                  ? 'bg-[#3b66f5] text-white font-semibold'
                                  : 'text-[#8e8e98] hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Frame Rate Selector */}
                    <div className="p-3 bg-[#18181d] border border-[#26262f] rounded-[12px] space-y-2">
                      <span className="text-[11px] font-medium text-[#a0a0ab]">
                        Frame Rate
                      </span>
                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#111115] border border-[#25252c] rounded-[8px]">
                        {([30, 60] as const).map((fpsVal) => {
                          const active = exportFps === fpsVal;
                          return (
                            <button
                              key={fpsVal}
                              type="button"
                              onClick={() => setExportFps(fpsVal)}
                              className={`py-1 text-[11px] font-mono rounded-[6px] cursor-pointer ${
                                active
                                  ? 'bg-[#3b66f5] text-white font-semibold'
                                  : 'text-[#8e8e98] hover:text-white'
                              }`}
                            >
                              {fpsVal} FPS
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Card */}
                  <div className="p-4 bg-[#18181d] border border-[#26262f] rounded-[14px] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
                          Social Media Video Render ({outW}×{outH} · {targetVideoDuration}s)
                        </h3>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[#232530] text-[#70b5f9] rounded-full">
                          {exportResolution === '1080p' ? '8.5 Mbps' : '5.0 Mbps'}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8e8e98]">
                        Records a full {targetVideoDuration}-second stream at {exportFps} FPS with exact visual parity to your stage edits.
                      </p>
                    </div>
                    {isRendering ? (
                      <button
                        type="button"
                        onClick={handleCancelRender}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold text-white bg-[#ef4444] hover:bg-[#dc2626] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel ({renderProgress}%)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRenderVideo}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4c75ff] rounded-full shadow-[0_2px_12px_rgba(59,102,245,0.4)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Film className="w-4 h-4" />
                        <span>Render {targetVideoDuration}s Video</span>
                      </button>
                    )}
                  </div>

                  {isRendering && (
                    <div className="p-4 bg-[#101014] border border-[#23242c] rounded-[12px] space-y-2">
                      <div className="flex justify-between text-xs font-mono tabular-nums text-[#d4d8e4]">
                        <span>
                          Recording {outW}×{outH} stream ({elapsedRenderSec.toFixed(1)}s /{' '}
                          {targetVideoDuration.toFixed(1)}s)...
                        </span>
                        <span>{renderProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1b1b22] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${renderProgress}%` }}
                          className="h-full bg-[#3b66f5] transition-all duration-150"
                        />
                      </div>
                    </div>
                  )}

                  {videoResult && (
                    <div className="p-4 bg-[#101014] border border-[#23242c] rounded-[14px] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#27a644]">
                          Exported {videoResult.width}×{videoResult.height} ({videoResult.durationSec}s ·{' '}
                          {videoResult.ext.toUpperCase()})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerDownload(
                              videoResult.url,
                              `${safeFilename}-${exportResolution}-${videoResult.durationSec}s.${videoResult.ext}`
                            )
                          }
                          className="text-xs font-medium text-[#70b5f9] hover:underline cursor-pointer"
                        >
                          Download Video Again
                        </button>
                      </div>
                      <video
                        src={videoResult.url}
                        controls
                        autoPlay
                        loop
                        muted
                        className="max-h-52 mx-auto rounded-[10px] border border-[#25262e]"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'react' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] text-[#a0a0ab]">
                      Self-contained{' '}
                      <code className="text-[#70b5f9] font-mono">motion/react</code>{' '}
                      component with Emil Kowalski spring physics &amp;{' '}
                      <code className="text-[#70b5f9] font-mono">
                        useReducedMotion()
                      </code>
                      .
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(reactCode, 'react')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium text-[#f5f5f7] bg-[#1b1b20] hover:bg-[#24242b] border border-[#2d2d36] rounded-full transition-colors cursor-pointer"
                      >
                        {copiedState === 'react' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#27a644]" />
                            <span>Copied JSX</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadText(
                            reactCode,
                            `${safeFilename}-motion.tsx`,
                            'text/typescript'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4c75ff] rounded-full shadow-[0_2px_10px_rgba(59,102,245,0.4)] transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .tsx</span>
                      </button>
                    </div>
                  </div>

                  <pre
                    data-testid="exported-react-code"
                    className="p-4 bg-[#0c0c0f] border border-[#23242c] rounded-[14px] text-[11.5px] font-mono text-[#d4d8e4] overflow-x-auto max-h-[340px] select-text leading-relaxed"
                  >
                    <code>{reactCode}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'css' && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-[#101116] border border-[#252732] rounded-[12px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Terminal className="w-4 h-4 text-[#70b5f9] shrink-0" />
                      <code className="text-[12px] font-mono text-[#f5f5f7] truncate">
                        {cliCommand}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(cliCommand, 'cli')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-[#d4d4dc] bg-[#1b1c24] hover:bg-[#252732] border border-[#2f3240] rounded-full cursor-pointer shrink-0"
                    >
                      {copiedState === 'cli' ? (
                        <>
                          <Check className="w-3 h-3 text-[#27a644]" />
                          <span>Copied CLI</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy CLI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-[#a0a0ab]">
                      Copy-ready <code className="text-[#70b5f9] font-mono">--t-*</code>{' '}
                      CSS tokens with automatic reduced-motion fallback.
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(cssCode, 'css')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium text-[#f5f5f7] bg-[#1b1b20] hover:bg-[#24242b] border border-[#2d2d36] rounded-full cursor-pointer"
                      >
                        {copiedState === 'css' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#27a644]" />
                            <span>Copied CSS</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy CSS</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadText(
                            cssCode,
                            `${safeFilename}-transitions.css`,
                            'text/css'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4c75ff] rounded-full cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .css</span>
                      </button>
                    </div>
                  </div>

                  <pre
                    data-testid="exported-css-code"
                    className="p-4 bg-[#0c0c0f] border border-[#23242c] rounded-[14px] text-[11.5px] font-mono text-[#d4d8e4] overflow-x-auto max-h-[290px] select-text leading-relaxed"
                  >
                    <code>{cssCode}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'gif' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#18181d] border border-[#26262f] rounded-[14px] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
                        Looping Animated GIF89a Encoder
                      </h3>
                      <p className="text-[12px] text-[#8e8e98]">
                        Generates an infinite-looping GIF binary with full stage parity for GitHub READMEs, X, and Threads.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isRendering}
                      onClick={handleRenderGif}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4c75ff] disabled:opacity-50 rounded-full shadow-[0_2px_12px_rgba(59,102,245,0.4)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isRendering
                          ? `Encoding GIF (${renderProgress}%)`
                          : 'Encode & Download .GIF'}
                      </span>
                    </button>
                  </div>

                  {gifResultUrl && (
                    <div className="p-4 bg-[#101014] border border-[#23242c] rounded-[14px] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#27a644]">
                          Animated GIF89a generated successfully
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerDownload(gifResultUrl, `${safeFilename}.gif`)
                          }
                          className="text-xs font-medium text-[#70b5f9] hover:underline cursor-pointer"
                        >
                          Download .GIF Again
                        </button>
                      </div>
                      <img
                        src={gifResultUrl}
                        alt="Exported Animated GIF Preview"
                        className="max-h-56 mx-auto rounded-[10px] border border-[#25262e]"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'json' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-[#a0a0ab]">
                      Portable JSON project blueprint containing all layers, keyframes,
                      spring parameters, and embedded studio cards.
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(sceneJson, 'json')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium text-[#f5f5f7] bg-[#1b1b20] hover:bg-[#24242b] border border-[#2d2d36] rounded-full cursor-pointer"
                      >
                        {copiedState === 'json' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#27a644]" />
                            <span>Copied JSON</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadText(
                            sceneJson,
                            `${safeFilename}.json`,
                            'application/json'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4c75ff] rounded-full cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .json</span>
                      </button>
                    </div>
                  </div>

                  <pre
                    data-testid="exported-json-code"
                    className="p-4 bg-[#0c0c0f] border border-[#23242c] rounded-[14px] text-[11.5px] font-mono text-[#d4d8e4] overflow-x-auto max-h-[190px] select-text leading-relaxed"
                  >
                    <code>{sceneJson}</code>
                  </pre>

                  {/* Round-Trip JSON Importer */}
                  <div className="p-3.5 bg-[#101014] border border-[#23242c] rounded-[14px] space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#f5f5f7]">
                      <Layers className="w-3.5 h-3.5 text-[#70b5f9]" />
                      <span>Restore / Import Scene from JSON Blueprint</span>
                    </div>
                    <textarea
                      rows={2}
                      value={jsonImportText}
                      onChange={(e) => setJsonImportText(e.target.value)}
                      placeholder="Paste Kinetix JSON scene blueprint here to load..."
                      aria-label="Paste JSON Scene Blueprint"
                      className="w-full bg-[#16161b] border border-[#282932] rounded-[8px] p-2.5 text-xs font-mono text-[#f5f5f7] focus:outline-none focus:border-[#3b66f5]"
                    />
                    {importError && (
                      <p className="text-xs text-[#ef4444]">{importError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleImportJson}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-[#f5f5f7] bg-[#1e1f26] hover:bg-[#282932] border border-[#323440] rounded-full cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#70b5f9]" />
                      <span>Load JSON into Studio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
