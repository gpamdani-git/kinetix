import React, { useEffect, useRef, useState } from 'react';
import {
  addImageAsset,
  AnimatableProperty,
  createHistory,
  DEFAULT_POSITION_SETTINGS,
  deleteImageAsset,
  generateSceneJson,
  HistoryStack,
  ImageAsset,
  MotionLayer,
  MotionScene,
  PositionSettings,
  PropertyKeyframe,
  pushHistory,
  redoHistory,
  SocialPlatform,
  undoHistory,
  updateImageAsset,
} from './engine/motionEngine';
import { INITIAL_IMAGE_ASSETS, MOTION_PRESET_GALLERY } from './engine/presets';
import { TopBar } from './components/TopBar';
import { LeftGalleryPanel } from './components/LeftGalleryPanel';
import { CenterCanvasViewport } from './components/CenterCanvasViewport';
import { RightInspectorPanel } from './components/RightInspectorPanel';
import { BottomTimelinePanel } from './components/BottomTimelinePanel';
import { ExportModal } from './components/ExportModal';
import { ProjectsDashboard } from './components/ProjectsDashboard';
import { SignInModal } from './components/SignInModal';

export default function App() {
  const [presets, setPresets] = useState<MotionScene[]>(MOTION_PRESET_GALLERY);
  const [assets, setAssets] = useState<ImageAsset[]>(INITIAL_IMAGE_ASSETS);
  const [history, setHistory] = useState<HistoryStack<MotionScene>>(() =>
    createHistory({
      ...MOTION_PRESET_GALLERY[0],
      name: 'Untitled showcase',
    })
  );

  const scene = history.present;

  const [activeView, setActiveView] = useState<'editor' | 'projects'>('editor');
  const [leftTab, setLeftTab] = useState<'presets' | 'assets'>('presets');
  const [keyframesOpen, setKeyframesOpen] = useState<boolean>(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    scene.layers[0]?.id || null
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    INITIAL_IMAGE_ASSETS[0]?.id || null
  );

  // Playback state (start at 4.2s to match the golden angle in the reference screenshot)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(4.2);

  // Modals state
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const commitSceneUpdate = (nextScene: MotionScene) => {
    setHistory((prev) => pushHistory(prev, nextScene));
  };

  const replacePresentScene = (nextScene: MotionScene) => {
    setHistory((prev) => ({
      ...prev,
      present: nextScene,
    }));
  };

  // High-frame-rate 60fps animation loop
  const lastFrameTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isPlaying || activeView !== 'editor' || exportModalOpen || signInModalOpen) {
      lastFrameTimeRef.current = null;
      return;
    }

    let rafId: number;
    const tick = (now: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
      }
      const deltaSec = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      setCurrentTime((prevTime) => {
        const nextTime = prevTime + deltaSec;
        if (nextTime >= scene.duration) {
          return 0;
        }
        return nextTime;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, scene.duration, activeView, exportModalOpen, signInModalOpen]);

  // Global keyboard shortcuts (Undo/Redo & Spacebar Play/Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (isInput) return;
        e.preventDefault();
        if (e.shiftKey) {
          setHistory((prev) => redoHistory(prev));
        } else {
          setHistory((prev) => undoHistory(prev));
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        if (isInput) return;
        e.preventDefault();
        setHistory((prev) => redoHistory(prev));
      } else if (e.code === 'Space' && !isInput) {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPreset = (preset: MotionScene) => {
    const cloned: MotionScene = JSON.parse(JSON.stringify(preset));
    commitSceneUpdate(cloned);
    setSelectedLayerId(cloned.layers[0]?.id || null);
    setActiveView('editor');
  };

  const handleSaveCurrentAsPreset = (customName: string) => {
    const saved: MotionScene = {
      ...JSON.parse(JSON.stringify(scene)),
      id: `preset-custom-${Date.now()}`,
      name: customName,
      category: 'Launch',
      templateGroup: '3d-perspective',
    };
    setPresets((prev) => [saved, ...prev]);
    commitSceneUpdate(saved);
  };

  const handleUpdatePositionSetting = (
    key: keyof PositionSettings,
    value: number | string | boolean
  ) => {
    const currentPos = scene.positionSettings || DEFAULT_POSITION_SETTINGS;
    const nextPos: PositionSettings = {
      ...currentPos,
      [key]: value,
    };

    // If this property already has keyframes, update or insert keyframe at currentTime
    let nextKeyframes = scene.keyframes || [];
    if (typeof value === 'number' && nextKeyframes.some((k) => k.property === key)) {
      const existingNear = nextKeyframes.find(
        (k) => k.property === key && Math.abs(k.time - currentTime) < 0.35
      );
      if (existingNear) {
        nextKeyframes = nextKeyframes.map((k) =>
          k.id === existingNear.id ? { ...k, value } : k
        );
      } else {
        nextKeyframes = [
          ...nextKeyframes,
          {
            id: `kf-${key}-${Date.now()}`,
            property: key as AnimatableProperty,
            label: key,
            time: Number(currentTime.toFixed(2)),
            value,
          },
        ];
      }
    }

    commitSceneUpdate({
      ...scene,
      positionSettings: nextPos,
      keyframes: nextKeyframes,
    });
  };

  const handleToggleKeyframe = (
    property: AnimatableProperty,
    label: string,
    value: number
  ) => {
    const existing = scene.keyframes || [];
    const hasAtTime = existing.find(
      (k) => k.property === property && Math.abs(k.time - currentTime) < 0.35
    );

    let nextKeyframes: PropertyKeyframe[];
    if (hasAtTime) {
      nextKeyframes = existing.filter((k) => k.id !== hasAtTime.id);
    } else {
      // Create a smooth 2-point keyframe animation if this is the first keyframe on the property
      const hasAnyOnProp = existing.some((k) => k.property === property);
      if (!hasAnyOnProp) {
        const startT = 0;
        const targetT = Math.max(2, Number(currentTime.toFixed(1)));
        const delta = property === 'ringTilt' ? 24 : 18;
        nextKeyframes = [
          ...existing,
          {
            id: `kf-${property}-start-${Date.now()}`,
            property,
            label,
            time: startT,
            value,
          },
          {
            id: `kf-${property}-target-${Date.now() + 1}`,
            property,
            label,
            time: targetT,
            value: value + delta,
          },
        ];
      } else {
        nextKeyframes = [
          ...existing,
          {
            id: `kf-${property}-${Date.now()}`,
            property,
            label,
            time: Number(currentTime.toFixed(1)),
            value,
          },
        ];
      }
    }

    setKeyframesOpen(true);
    commitSceneUpdate({
      ...scene,
      keyframes: nextKeyframes,
    });
  };

  const handleRemovePropertyKeyframes = (property: AnimatableProperty) => {
    commitSceneUpdate({
      ...scene,
      keyframes: (scene.keyframes || []).filter((k) => k.property !== property),
    });
  };

  const handleResetPositionSettings = () => {
    commitSceneUpdate({
      ...scene,
      positionSettings: { ...DEFAULT_POSITION_SETTINGS },
      keyframes: [],
    });
  };

  const handleAddLayer = (type: 'text' | 'image' | 'metric') => {
    const newId = `layer-${type}-${Date.now()}`;
    const defaultAsset = assets[0];
    const visibleCount = scene.layers.filter((l) => l.visible).length;
    const staggeredY = 24 + ((visibleCount * 18) % 52);

    const newLayer: MotionLayer = {
      id: newId,
      name:
        type === 'text'
          ? `Kinetic Text ${visibleCount + 1}`
          : type === 'image'
          ? `Image Overlay ${visibleCount + 1}`
          : `Metric Badge ${visibleCount + 1}`,
      type,
      visible: true,
      locked: false,
      x: 50,
      y: staggeredY,
      width: type === 'image' ? 48 : 72,
      height: type === 'image' ? 32 : 14,
      rotation: 0,
      scale: 1,
      opacity: 1,
      borderRadius: 12,
      text:
        type === 'text'
          ? 'ORBIT SHOWREEL 2026'
          : type === 'metric'
          ? '60 FPS · 3D STREAM'
          : undefined,
      subtext: type === 'metric' ? 'Interactive Perspective Engine' : '',
      fontSize: type === 'text' ? 44 : 32,
      fontWeight: 700,
      textAlign: 'center',
      color: '#ffffff',
      backgroundColor:
        type === 'metric' ? '#3b66f5' : 'rgba(20, 20, 24, 0.82)',
      borderColor: type === 'metric' ? '#70b5f9' : '#34343d',
      borderWidth: 1,
      assetId: type === 'image' ? defaultAsset?.id : undefined,
      animationType: type === 'image' ? 'flip-3d' : 'kinetic-pop',
      startTime: 0,
      duration: scene.duration,
      entryDuration: 0.8,
      exitAnimation: false,
      speed: 1.0,
      bezier: [0.34, 1.56, 0.64, 1],
      easingPreset: 'spring-overshoot',
      loopEffect: 'float',
    };

    commitSceneUpdate({
      ...scene,
      layers: [...scene.layers, newLayer],
    });
    setSelectedLayerId(newId);
  };

  const handleInsertAssetLayer = (asset: ImageAsset) => {
    const newId = `layer-asset-${Date.now()}`;
    const newLayer: MotionLayer = {
      id: newId,
      name: asset.name,
      type: 'image',
      visible: true,
      locked: false,
      x: 50,
      y: 50,
      width: 45,
      height: 45,
      rotation: 0,
      scale: 1,
      opacity: 1,
      borderRadius: 16,
      fontSize: 32,
      fontWeight: 600,
      color: '#f7f8f8',
      backgroundColor: '#141418',
      borderColor: '#34343d',
      borderWidth: 1,
      assetId: asset.id,
      animationType: 'kinetic-pop',
      startTime: 0,
      duration: scene.duration,
      entryDuration: 0.8,
      exitAnimation: false,
      speed: 1.0,
      bezier: [0.16, 1, 0.3, 1],
      easingPreset: 'linear-snap',
      loopEffect: 'float',
    };

    commitSceneUpdate({
      ...scene,
      layers: [...scene.layers, newLayer],
    });
    setSelectedLayerId(newId);
    setSelectedAssetId(asset.id);
  };

  const handleUpdateLayer = (
    layerId: string,
    updates: Partial<MotionLayer>
  ) => {
    commitSceneUpdate({
      ...scene,
      layers: scene.layers.map((l) =>
        l.id === layerId ? { ...l, ...updates } : l
      ),
    });
  };

  const handleUpdateLayerPosition = (
    layerId: string,
    x: number,
    y: number,
    commitHistoryFlag: boolean
  ) => {
    const nextScene: MotionScene = {
      ...scene,
      layers: scene.layers.map((l) => (l.id === layerId ? { ...l, x, y } : l)),
    };
    if (commitHistoryFlag) {
      commitSceneUpdate(nextScene);
    } else {
      replacePresentScene(nextScene);
    }
  };

  const handleDuplicateLayer = (layerId: string) => {
    const target = scene.layers.find((l) => l.id === layerId);
    if (!target) return;
    const dupId = `${target.id}-copy-${Date.now()}`;
    const duplicated: MotionLayer = {
      ...JSON.parse(JSON.stringify(target)),
      id: dupId,
      name: `${target.name} Copy`,
      visible: true,
      x: Math.min(88, target.x + 5),
      y: Math.min(88, target.y + 5),
    };
    commitSceneUpdate({
      ...scene,
      layers: [...scene.layers, duplicated],
    });
    setSelectedLayerId(dupId);
  };

  const handleDeleteLayer = (layerId: string) => {
    const remaining = scene.layers.filter((l) => l.id !== layerId);
    commitSceneUpdate({
      ...scene,
      layers: remaining,
    });
    if (selectedLayerId === layerId) {
      setSelectedLayerId(remaining[0]?.id || null);
    }
  };

  const handleReorderLayer = (layerId: string, direction: 'up' | 'down') => {
    const idx = scene.layers.findIndex((l) => l.id === layerId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= scene.layers.length) return;
    const nextLayers = [...scene.layers];
    const [moved] = nextLayers.splice(idx, 1);
    nextLayers.splice(targetIdx, 0, moved);
    commitSceneUpdate({
      ...scene,
      layers: nextLayers,
    });
  };

  const handleAddAsset = (newAsset: ImageAsset) => {
    setAssets((prev) => {
      const withoutDup = prev.filter((a) => a.id !== newAsset.id);
      return addImageAsset(withoutDup, newAsset);
    });
    setSelectedAssetId(newAsset.id);
  };

  const handleUpdateAsset = (
    assetId: string,
    updates: Partial<ImageAsset>
  ) => {
    setAssets((prev) => updateImageAsset(prev, assetId, updates));
  };

  const handleDeleteAsset = (assetId: string) => {
    const result = deleteImageAsset(assets, scene, assetId);
    setAssets(result.assets);
    commitSceneUpdate(result.scene);
    if (selectedAssetId === assetId) {
      setSelectedAssetId(result.assets[0]?.id || null);
    }
  };

  const handleDownloadBackup = () => {
    const json = generateSceneJson(scene, assets);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scene.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'kinetix'}-backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.scene) {
          commitSceneUpdate(parsed.scene);
          setActiveView('editor');
        }
      } catch {
        // Ignore invalid backup file
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#141416] text-[#f5f5f7] overflow-hidden">
      {/* Top Bar */}
      <TopBar
        projectName={scene.name}
        onRenameProject={(nextName) =>
          commitSceneUpdate({ ...scene, name: nextName })
        }
        activeView={activeView}
        onToggleProjectsView={() =>
          setActiveView((v) => (v === 'editor' ? 'projects' : 'editor'))
        }
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onUndo={() => setHistory((prev) => undoHistory(prev))}
        onRedo={() => setHistory((prev) => redoHistory(prev))}
        onToggleGridOverlay={() =>
          commitSceneUpdate({
            ...scene,
            showGridOverlay: !scene.showGridOverlay,
          })
        }
        onOpenExport={() => setExportModalOpen(true)}
        onOpenSignIn={() => setSignInModalOpen(true)}
        userEmail={userEmail}
      />

      {activeView === 'projects' ? (
        <ProjectsDashboard
          projects={presets}
          activeProjectId={scene.id}
          onSelectProject={handleSelectPreset}
          onCreateNewProject={() => {
            const fresh: MotionScene = {
              ...JSON.parse(JSON.stringify(MOTION_PRESET_GALLERY[0])),
              id: `project-${Date.now()}`,
              name: `Untitled showcase ${presets.length + 1}`,
            };
            setPresets((prev) => [fresh, ...prev]);
            commitSceneUpdate(fresh);
            setActiveView('editor');
          }}
          onDownloadBackup={handleDownloadBackup}
          onRestoreBackup={handleRestoreBackup}
          onOpenSignIn={() => setSignInModalOpen(true)}
        />
      ) : (
        <main className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Sidebar: Templates (3D & Perspective + Multiscene) | Layers */}
          <LeftGalleryPanel
            activeTab={leftTab}
            onChangeTab={setLeftTab}
            presets={presets}
            currentSceneId={scene.id}
            onSelectPreset={handleSelectPreset}
            onSaveCurrentAsPreset={handleSaveCurrentAsPreset}
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onInsertAssetLayer={handleInsertAssetLayer}
            layers={scene.layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onAddLayer={handleAddLayer}
            onUpdateLayer={handleUpdateLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onDeleteLayer={handleDeleteLayer}
            onReorderLayer={handleReorderLayer}
          />

          {/* Center Column: 3D Perspective Stage + Keyframe Timeline & Transport */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <CenterCanvasViewport
              scene={scene}
              assets={assets}
              currentTime={currentTime}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onSelectAsset={setSelectedAssetId}
              onUpdateLayerPosition={handleUpdateLayerPosition}
              onUpdatePositionSetting={handleUpdatePositionSetting}
              keyframesOpen={keyframesOpen}
              onToggleKeyframesOpen={() => setKeyframesOpen((v) => !v)}
            />

            <BottomTimelinePanel
              scene={scene}
              currentTime={currentTime}
              isPlaying={isPlaying}
              keyframesOpen={keyframesOpen}
              selectedLayerId={selectedLayerId}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onSeek={(t) => {
                setIsPlaying(false);
                setCurrentTime(t);
              }}
              onSelectLayer={setSelectedLayerId}
              onRemovePropertyKeyframes={handleRemovePropertyKeyframes}
            />
          </div>

          {/* Right Settings Inspector: Frame, Media Slots, Timing, Text, Logo, Showcase Stream, Position */}
          <RightInspectorPanel
            scene={scene}
            currentTime={currentTime}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onAddLayer={handleAddLayer}
            onDeleteLayer={handleDeleteLayer}
            onChangePlatform={(platform: SocialPlatform) =>
              commitSceneUpdate({ ...scene, platform })
            }
            onUpdateScene={(updates) =>
              commitSceneUpdate({ ...scene, ...updates })
            }
            onUpdatePositionSetting={handleUpdatePositionSetting}
            onToggleKeyframe={handleToggleKeyframe}
            onResetPositionSettings={handleResetPositionSettings}
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onAddAsset={handleAddAsset}
          />
        </main>
      )}

      {/* Export Modal (MP4/WebM 1080p, GIF, React .tsx, JSON) */}
      <ExportModal
        isOpen={exportModalOpen}
        initialTab="mp4"
        scene={scene}
        assets={assets}
        onClose={() => setExportModalOpen(false)}
        onImportSceneJson={(importedScene, importedAssets) => {
          if (Array.isArray(importedAssets) && importedAssets.length > 0) {
            setAssets((prev) => {
              const existingIds = new Set(prev.map((a) => a.id));
              const merged = [...prev];
              for (const ia of importedAssets) {
                if (!existingIds.has(ia.id)) merged.push(ia);
              }
              return merged;
            });
          }
          commitSceneUpdate(importedScene);
          setSelectedLayerId(importedScene.layers[0]?.id || null);
        }}
      />

      {/* Editorial Split-Screen Sign In Modal */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSuccessSignIn={(email) => setUserEmail(email)}
      />
    </div>
  );
}
