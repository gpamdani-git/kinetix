import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateCubicBezier,
  evaluateSpringPhysics,
  computeLayerFrameState,
  computeFormationSlotTransforms,
  resolvePositionSettingsAtTime,
  resolveSceneGradientCss,
  getCardAspectDimensions,
  DEFAULT_POSITION_SETTINGS,
  createHistory,
  pushHistory,
  undoHistory,
  redoHistory,
  addImageAsset,
  updateImageAsset,
  deleteImageAsset,
  generateReactComponentCode,
  generateTransitionsDevCssCode,
  generateSceneJson,
} from './motionEngine';
import {
  INITIAL_IMAGE_ASSETS,
  MOTION_PRESET_GALLERY,
  DEFAULT_IMAGE_FILTERS,
  STUDIO_GRADIENT_PRESETS,
  STUDIO_BACKDROP_PRESETS,
} from './presets';

test('evaluateCubicBezier and evaluateSpringPhysics handle boundaries and realistic settle', () => {
  assert.equal(evaluateCubicBezier(0.23, 1, 0.32, 1, 0), 0);
  assert.equal(evaluateCubicBezier(0.23, 1, 0.32, 1, 1), 1);
  const midLinear = evaluateCubicBezier(0, 0, 1, 1, 0.5);
  assert.ok(Math.abs(midLinear - 0.5) < 1e-4);

  assert.equal(evaluateSpringPhysics(0, 380, 30, 1), 0);
  assert.equal(evaluateSpringPhysics(1, 380, 30, 1), 1);
  const midSpring = evaluateSpringPhysics(0.5, 380, 30, 1);
  assert.ok(midSpring > 0.85, `Expected spring at t=0.5 to be > 0.85, got ${midSpring}`);
});

test('MOTION_PRESET_GALLERY contains all 70 Kinetix Pro templates across 9 categories', () => {
  assert.equal(MOTION_PRESET_GALLERY.length, 70);

  const expectedCategoryCounts: Record<string, number> = {
    '3d-perspective': 12,
    multiscene: 14,
    isometric: 3,
    orbit: 8,
    'carousel-flow': 10,
    grid: 8,
    'spotlight-focus': 4,
    'reveal-wipe': 4,
    'stack-scatter': 7,
  };

  for (const [group, expectedCount] of Object.entries(expectedCategoryCounts)) {
    const count = MOTION_PRESET_GALLERY.filter((p) => p.templateGroup === group).length;
    assert.equal(
      count,
      expectedCount,
      `Expected category ${group} to have ${expectedCount} templates, found ${count}`
    );
  }

  assert.equal(STUDIO_GRADIENT_PRESETS.length, 12);
  assert.equal(STUDIO_BACKDROP_PRESETS.length, 6);
});

test('All 70 templates produce finite 3D slot transforms and respond to PositionSettings', () => {
  for (const preset of MOTION_PRESET_GALLERY) {
    const slotCount = preset.slotCount || 12;
    const transforms = computeFormationSlotTransforms(
      preset.formation || 'showcase-ring',
      slotCount,
      preset.positionSettings || DEFAULT_POSITION_SETTINGS,
      4.2,
      preset.duration,
      560,
      560
    );

    assert.equal(
      transforms.length,
      slotCount,
      `Template ${preset.name} (${preset.formation}) should return ${slotCount} slot transforms`
    );

    for (const slot of transforms) {
      assert.ok(Number.isFinite(slot.translateX), `Non-finite translateX in ${preset.formation}`);
      assert.ok(Number.isFinite(slot.translateY), `Non-finite translateY in ${preset.formation}`);
      assert.ok(Number.isFinite(slot.translateZ), `Non-finite translateZ in ${preset.formation}`);
      assert.ok(Number.isFinite(slot.scale), `Non-finite scale in ${preset.formation}`);
      assert.ok(slot.opacity >= 0 && slot.opacity <= 1, `Invalid opacity in ${preset.formation}`);
    }
  }

  // Test PositionSettings sensitivity (ringSize, ringTilt, perspective, backFade)
  const compactRing = computeFormationSlotTransforms(
    'showcase-ring',
    12,
    { ...DEFAULT_POSITION_SETTINGS, ringSize: 40, ringTilt: -25, backFade: 90 },
    2.5,
    16,
    560,
    560
  );
  const wideRing = computeFormationSlotTransforms(
    'showcase-ring',
    12,
    { ...DEFAULT_POSITION_SETTINGS, ringSize: 80, ringTilt: 25, backFade: 10 },
    2.5,
    16,
    560,
    560
  );
  const maxXCompact = Math.max(...compactRing.map((s) => Math.abs(s.translateX)));
  const maxXWide = Math.max(...wideRing.map((s) => Math.abs(s.translateX)));
  assert.ok(
    maxXWide > maxXCompact,
    'Larger ringSize setting should increase formation radius'
  );

  // Verify Continuous ('linear') is the default physicsMode
  assert.equal(DEFAULT_POSITION_SETTINGS.physicsMode, 'linear');

  // Verify all 70 formations produce unique, non-duplicated choreography signatures
  const signatures = new Set<string>();
  for (const preset of MOTION_PRESET_GALLERY) {
    const formation = preset.formation || 'showcase-ring';
    const slots = computeFormationSlotTransforms(
      formation,
      12,
      DEFAULT_POSITION_SETTINGS,
      3.7,
      16,
      560,
      560
    );
    const sig = slots
      .slice(0, 6)
      .map(
        (s) =>
          `${s.translateX.toFixed(1)},${s.translateY.toFixed(1)},${s.translateZ.toFixed(
            1
          )},${s.rotateZ.toFixed(1)},${s.scale.toFixed(2)}`
      )
      .join('|');
    assert.ok(
      !signatures.has(sig),
      `Duplicate formation choreography detected for ${preset.name} (${formation})`
    );
    signatures.add(sig);
  }
});

test('resolveSceneGradientCss and getCardAspectDimensions compute valid studio styling', () => {
  const scene = MOTION_PRESET_GALLERY[0];
  const gradientCss = resolveSceneGradientCss({
    ...scene,
    backgroundGradient: undefined,
    backgroundColor: '#1e1b4b',
    backgroundSecondaryColor: '#ec4899',
    backgroundGradientAngle: 135,
    backgroundGradientType: 'linear',
  });
  assert.equal(gradientCss, 'linear-gradient(135deg, #1e1b4b 0%, #ec4899 100%)');

  const radialCss = resolveSceneGradientCss({
    ...scene,
    backgroundGradient: undefined,
    backgroundColor: '#042f2e',
    backgroundSecondaryColor: '#09090b',
    backgroundGradientType: 'radial',
  });
  assert.equal(
    radialCss,
    'radial-gradient(circle at 50% 35%, #042f2e 0%, #09090b 85%)'
  );

  const portraitCard = getCardAspectDimensions(140, '9:16');
  assert.ok(portraitCard.height > portraitCard.width);

  const landscapeCard = getCardAspectDimensions(140, '16:9');
  assert.ok(landscapeCard.width > landscapeCard.height);
});

test('resolvePositionSettingsAtTime interpolates keyframed parameters smoothly', () => {
  const keyframes = [
    { id: 'k1', property: 'ringTilt' as const, label: 'Horizon tilt', time: 0, value: 0 },
    { id: 'k2', property: 'ringTilt' as const, label: 'Horizon tilt', time: 10, value: 20 },
  ];
  const atStart = resolvePositionSettingsAtTime(DEFAULT_POSITION_SETTINGS, keyframes, 0);
  assert.equal(atStart.ringTilt, 0);

  const atMid = resolvePositionSettingsAtTime(DEFAULT_POSITION_SETTINGS, keyframes, 5);
  assert.ok(atMid.ringTilt > 0 && atMid.ringTilt < 20);

  const atEnd = resolvePositionSettingsAtTime(DEFAULT_POSITION_SETTINGS, keyframes, 10);
  assert.equal(atEnd.ringTilt, 20);
});

test('computeLayerFrameState respects Emil Kowalski scale(0.94) floor and timeline bounds', () => {
  const sampleScene = MOTION_PRESET_GALLERY[0];
  const heroLayer = { ...sampleScene.layers[1], visible: true };

  const beforeStart = computeLayerFrameState(heroLayer, 0.1);
  assert.equal(beforeStart.activeInTimeline, false);
  assert.equal(beforeStart.opacity, 0);

  const atEntryStart = computeLayerFrameState(heroLayer, heroLayer.startTime + 0.01);
  assert.equal(atEntryStart.activeInTimeline, true);
  assert.ok(
    atEntryStart.scale >= 0.93,
    `Expected scale floor >= 0.93, got ${atEntryStart.scale}`
  );

  const midClip = computeLayerFrameState(heroLayer, 1.5);
  assert.equal(midClip.activeInTimeline, true);
  assert.ok(midClip.opacity > 0.9);
});

test('Undo and Redo history stack transitions deterministically', () => {
  let history = createHistory<number>(10);
  history = pushHistory(history, 20);
  history = pushHistory(history, 30);

  assert.equal(history.present, 30);
  assert.equal(history.past.length, 2);

  history = undoHistory(history);
  assert.equal(history.present, 20);
  assert.equal(history.future.length, 1);

  history = undoHistory(history);
  assert.equal(history.present, 10);

  history = redoHistory(history);
  assert.equal(history.present, 20);
});

test('Image asset CRUD operations add, update filters, and safely delete assets', () => {
  const baseAssets = [...INITIAL_IMAGE_ASSETS];
  const newAsset = {
    id: 'asset-custom-test',
    name: 'Custom Studio Graphic',
    category: 'Custom' as const,
    url: 'data:image/svg+xml;utf8,<svg></svg>',
    width: 600,
    height: 600,
    createdAt: '2026-11-07',
    filters: { ...DEFAULT_IMAGE_FILTERS },
  };

  const afterAdd = addImageAsset(baseAssets, newAsset);
  assert.equal(afterAdd.length, baseAssets.length + 1);
  assert.equal(afterAdd[0].id, 'asset-custom-test');

  const afterUpdate = updateImageAsset(afterAdd, 'asset-custom-test', {
    name: 'Updated Graphic Name',
    filters: { ...DEFAULT_IMAGE_FILTERS, brightness: 125 },
  });
  assert.equal(afterUpdate[0].name, 'Updated Graphic Name');
  assert.equal(afterUpdate[0].filters.brightness, 125);

  const sceneWithAsset = {
    ...MOTION_PRESET_GALLERY[0],
    layers: MOTION_PRESET_GALLERY[0].layers.map((l, idx) =>
      idx === 2 ? { ...l, assetId: 'asset-custom-test' } : l
    ),
  };

  const afterDelete = deleteImageAsset(afterUpdate, sceneWithAsset, 'asset-custom-test');
  assert.equal(afterDelete.assets.length, baseAssets.length);
  assert.notEqual(afterDelete.scene.layers[2].assetId, 'asset-custom-test');
});

test('React component, transitions.dev CSS, and JSON generators output valid code', () => {
  const scene = MOTION_PRESET_GALLERY[0];
  const jsxCode = generateReactComponentCode(scene, INITIAL_IMAGE_ASSETS);
  assert.ok(jsxCode.includes("import { motion, useReducedMotion } from 'motion/react';"));
  assert.ok(jsxCode.includes('MOTION_TOKENS'));
  assert.ok(jsxCode.includes('OrbitalRingMotion'));

  const cssCode = generateTransitionsDevCssCode(scene);
  assert.ok(cssCode.includes('--t-ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);'));
  assert.ok(cssCode.includes('@media (prefers-reduced-motion: reduce)'));

  const jsonOutput = generateSceneJson(scene, INITIAL_IMAGE_ASSETS);
  const parsed = JSON.parse(jsonOutput);
  assert.equal(parsed.schemaVersion, '3.0.0');
  assert.equal(parsed.scene.id, scene.id);
  assert.ok(Array.isArray(parsed.assets));
});
