import {
  computeFormationSlotTransforms,
  computeLayerFrameState,
  DEFAULT_POSITION_SETTINGS,
  getCardAspectDimensions,
  ImageAsset,
  MotionScene,
  PLATFORM_SPECS,
  resolvePositionSettingsAtTime,
} from './motionEngine';

export interface VideoExportOptions {
  durationSec?: number; // e.g., 5, 10, 15, or scene.duration
  resolution?: '1080p' | '720p';
  fps?: 30 | 60;
  signal?: AbortSignal;
}

/**
 * Preloads all ImageAssets plus optional scene background image and logo into HTMLImageElements
 * for synchronous, zero-flicker canvas rendering.
 */
export async function preloadSceneImages(
  scene: MotionScene,
  assets: ImageAsset[]
): Promise<Map<string, HTMLImageElement>> {
  const map = new Map<string, HTMLImageElement>();
  const promises: Promise<void>[] = [];

  const loadUrl = (key: string, url: string) => {
    const p = new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        map.set(key, img);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = url;
    });
    promises.push(p);
  };

  for (const asset of assets) {
    if (!map.has(asset.id)) {
      loadUrl(asset.id, asset.url);
    }
  }

  if (scene.backgroundImageUrl) {
    loadUrl('__bg_image__', scene.backgroundImageUrl);
  }

  if (scene.logoUrl) {
    loadUrl('__logo_image__', scene.logoUrl);
  }

  await Promise.all(promises);
  return map;
}

/**
 * Draws a single frame of `scene` at `timeSec` onto a 2D canvas context with 100% visual parity
 * with `CenterCanvasViewport.tsx` (including Gradients, Background Images + Blur/Dim,
 * Card Aspect Ratios, 3D Perspective Foreshortening, Drop Shadows, Logo, and Kinetic Layers).
 */
export function renderSceneFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  scene: MotionScene,
  timeSec: number,
  width: number,
  height: number,
  imageCache: Map<string, HTMLImageElement>,
  assets: ImageAsset[]
): void {
  const spec = PLATFORM_SPECS[scene.platform] || PLATFORM_SPECS['instagram-post'];
  const scaleRatio = width / spec.width;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Render Stage Background (Colour | Premade/Custom Gradient | Studio Image + Blur + Dim)
  const bgMode = scene.backgroundMode || 'colour';
  if (bgMode === 'gradient') {
    const c1 = scene.backgroundColor || '#1e3a8a';
    const c2 = scene.backgroundSecondaryColor || '#090a0f';
    const gType = scene.backgroundGradientType || 'linear';

    if (gType === 'radial') {
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
    } else {
      const angleRad = ((scene.backgroundGradientAngle ?? 135) * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.hypot(width, height) / 2;
      const x0 = cx - Math.sin(angleRad) * r;
      const y0 = cy + Math.cos(angleRad) * r;
      const x1 = cx + Math.sin(angleRad) * r;
      const y1 = cy - Math.cos(angleRad) * r;
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);
  } else if (bgMode === 'image') {
    ctx.fillStyle = scene.backgroundColor || '#101014';
    ctx.fillRect(0, 0, width, height);

    const bgImg = imageCache.get('__bg_image__');
    if (bgImg) {
      ctx.save();
      const blurPx = (scene.backgroundBlur ?? 0) * scaleRatio * 1.5;
      if (blurPx > 0) {
        ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
      }
      const expand = blurPx > 0 ? 1.08 : 1.0;
      const dw = width * expand;
      const dh = height * expand;
      ctx.drawImage(bgImg, (width - dw) / 2, (height - dh) / 2, dw, dh);
      ctx.restore();
    }

    const dimOpacity = Math.max(0, Math.min(0.9, (scene.backgroundDim ?? 20) / 100));
    if (dimOpacity > 0) {
      ctx.fillStyle = `rgba(8, 9, 13, ${dimOpacity.toFixed(2)})`;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = scene.backgroundColor || '#101014';
    ctx.fillRect(0, 0, width, height);
  }

  // Optional Studio Grid Overlay
  if (scene.showGridOverlay) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = Math.max(1, scaleRatio);
    const step = Math.max(24, Math.round(64 * scaleRatio));
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  const assetMap = new Map(assets.map((a) => [a.id, a]));

  // 2. Render 3D & Perspective Media Formation Slots (sorted back-to-front by zIndex)
  const slotCount = scene.slotCount ?? 12;
  if (slotCount > 0 && assets.length > 0) {
    const pos = resolvePositionSettingsAtTime(
      scene.positionSettings || DEFAULT_POSITION_SETTINGS,
      scene.keyframes,
      timeSec
    );
    const formation = scene.formation || 'showcase-ring';
    const transforms = computeFormationSlotTransforms(
      formation,
      slotCount,
      pos,
      timeSec,
      scene.duration,
      width,
      height
    ).sort((a, b) => a.zIndex - b.zIndex);

    const cardBaseSize = (pos.cardSize / 100) * Math.min(width, height);
    const { width: cardW, height: cardH } = getCardAspectDimensions(
      cardBaseSize,
      pos.cardRatio
    );
    const cornerRad = (pos.cornerRadius / 100) * Math.min(cardW, cardH) * 2.6;
    const perspectivePx = Math.max(350, (1350 - pos.perspective * 14) * scaleRatio * 1.6);

    for (const slot of transforms) {
      if (slot.opacity <= 0.01 || slot.scale <= 0.05) continue;
      const asset = assets[slot.slotIndex % assets.length];
      const img = asset ? imageCache.get(asset.id) : undefined;

      // 3D perspective projection factor from translateZ and rotateX/Y
      const depthPerspective = Math.max(
        0.45,
        Math.min(1.65, perspectivePx / Math.max(120, perspectivePx - slot.translateZ))
      );
      const foreshortenX = Math.max(0.38, Math.cos((slot.rotateY * Math.PI) / 180));
      const foreshortenY = Math.max(0.38, Math.cos((slot.rotateX * Math.PI) / 180));

      ctx.save();
      ctx.globalAlpha = slot.opacity;
      ctx.translate(width / 2 + slot.translateX, height / 2 + slot.translateY);
      ctx.rotate((slot.rotateZ * Math.PI) / 180);
      ctx.scale(
        slot.scale * depthPerspective * foreshortenX,
        slot.scale * depthPerspective * foreshortenY
      );

      // Card Drop Shadow
      if (pos.shadow) {
        ctx.save();
        ctx.shadowColor = slot.isHeroFocus
          ? 'rgba(0, 0, 0, 0.72)'
          : 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = (slot.isHeroFocus ? 36 : 22) * scaleRatio;
        ctx.shadowOffsetY = (slot.isHeroFocus ? 16 : 10) * scaleRatio;
        ctx.fillStyle = '#1c1d22';
        ctx.beginPath();
        ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerRad);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerRad);
      ctx.clip();

      if (img && asset) {
        const f = asset.filters;
        const totalBlur = (f.blur || 0) + (slot.blurPx || 0);
        ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${totalBlur.toFixed(1)}px) hue-rotate(${f.hueRotate}deg)`;
        ctx.drawImage(img, -cardW / 2, -cardH / 2, cardW, cardH);
      } else {
        ctx.fillStyle = '#1f2026';
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
      }
      ctx.restore();

      // Subtle Card Hairline Border
      ctx.strokeStyle = slot.isHeroFocus
        ? 'rgba(255, 255, 255, 0.28)'
        : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = Math.max(1, 1.5 * scaleRatio);
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerRad);
      ctx.stroke();

      ctx.restore();
    }
  }

  // 3. Render Uploaded Brand Logo Watermark (if present)
  const logoImg = imageCache.get('__logo_image__');
  if (logoImg) {
    ctx.save();
    const logoH = Math.round(48 * scaleRatio);
    const aspect = logoImg.width > 0 && logoImg.height > 0 ? logoImg.width / logoImg.height : 1;
    const logoW = Math.round(logoH * aspect);
    const pad = Math.round(24 * scaleRatio);
    ctx.drawImage(logoImg, width - logoW - pad, pad, logoW, logoH);
    ctx.restore();
  }

  // 4. Render Overlaid Kinetic Layers
  for (const layer of scene.layers) {
    const state = computeLayerFrameState(layer, timeSec);
    if (!state.visible || !state.activeInTimeline || state.opacity <= 0.01) {
      continue;
    }

    const cx = (layer.x / 100) * width + state.translateX * scaleRatio;
    const cy = (layer.y / 100) * height + state.translateY * scaleRatio;
    const boxW = (layer.width / 100) * width;
    const boxH = (layer.height / 100) * height;

    ctx.save();
    ctx.globalAlpha = state.opacity;
    ctx.translate(cx, cy);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.scale, state.scale);

    const halfW = boxW / 2;
    const halfH = boxH / 2;
    const radius = Math.min(halfW, halfH, layer.borderRadius * scaleRatio * 1.4);

    if (layer.backgroundColor && layer.backgroundColor !== 'transparent') {
      ctx.fillStyle = layer.backgroundColor;
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, boxW, boxH, radius);
      ctx.fill();
    }

    if (layer.borderWidth > 0 && layer.borderColor !== 'transparent') {
      ctx.strokeStyle = layer.borderColor;
      ctx.lineWidth = Math.max(1, layer.borderWidth * scaleRatio * 1.5);
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, boxW, boxH, radius);
      ctx.stroke();
    }

    if (layer.type === 'image' && layer.assetId) {
      const img = imageCache.get(layer.assetId);
      const asset = assetMap.get(layer.assetId);
      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-halfW, -halfH, boxW, boxH, radius);
        ctx.clip();
        if (asset) {
          const f = layer.imageFilters || asset.filters;
          ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) hue-rotate(${f.hueRotate}deg)`;
        }
        ctx.drawImage(img, -halfW, -halfH, boxW, boxH);
        ctx.restore();
      }
    } else if (layer.text) {
      ctx.fillStyle = layer.color || '#f7f8f8';
      const fontPx = Math.max(12, Math.round(layer.fontSize * scaleRatio * 1.35));
      ctx.font = `${layer.fontWeight || 600} ${fontPx}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = layer.textAlign || 'center';
      ctx.textBaseline = 'middle';
      const textX =
        layer.textAlign === 'left'
          ? -halfW + 16 * scaleRatio
          : layer.textAlign === 'right'
          ? halfW - 16 * scaleRatio
          : 0;
      const textY = layer.subtext ? -fontPx * 0.35 : 0;
      ctx.fillText(layer.text, textX, textY, boxW - 24 * scaleRatio);

      if (layer.subtext) {
        ctx.globalAlpha = state.opacity * 0.8;
        const subPx = Math.max(10, Math.round(fontPx * 0.52));
        ctx.font = `500 ${subPx}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(
          layer.subtext,
          textX,
          textY + fontPx * 0.85,
          boxW - 24 * scaleRatio
        );
      }
    }

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Renders the scene to a downloadable social-media-ready video Blob (MP4/WebM)
 * at up to 1080p resolution and real wall-clock duration so the exported video
 * plays for the full target duration (5s, 10s, 15s, or full scene loop).
 */
export async function exportSceneToVideoBlob(
  scene: MotionScene,
  assets: ImageAsset[],
  onProgress: (pct: number, elapsedSec?: number, totalSec?: number) => void,
  options: VideoExportOptions = {}
): Promise<{ blob: Blob; extension: string; width: number; height: number; durationSec: number }> {
  const spec = PLATFORM_SPECS[scene.platform] || PLATFORM_SPECS['instagram-post'];
  const resScale = options.resolution === '720p' ? 2 / 3 : 1;
  // Ensure even pixel dimensions for H.264/VP9 hardware encoders
  const width = Math.round((spec.width * resScale) / 2) * 2;
  const height = Math.round((spec.height * resScale) / 2) * 2;
  const fps = options.fps || scene.fps || 30;
  const targetDurationSec = Math.max(2, options.durationSec ?? scene.duration);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  const imageCache = await preloadSceneImages(scene, assets);

  const mimeTypes = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  const supportedMime =
    mimeTypes.find(
      (m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)
    ) || 'video/webm';

  // Paint initial frame at t=0 before starting MediaRecorder
  renderSceneFrameToCanvas(ctx, scene, 0, width, height, imageCache, assets);

  const stream = canvas.captureStream(fps);
  const videoTrack = stream.getVideoTracks()[0] as MediaStreamTrack & {
    requestFrame?: () => void;
  };

  const bitrate = options.resolution === '720p' ? 5_000_000 : 8_500_000;
  const recorder = new MediaRecorder(stream, {
    mimeType: supportedMime,
    videoBitsPerSecond: bitrate,
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    let timerId: ReturnType<typeof setInterval> | null = null;
    const startWallMs = performance.now();
    const totalWallMs = targetDurationSec * 1000;
    const frameIntervalMs = Math.max(16, Math.round(1000 / fps));

    const cleanup = () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
      stream.getTracks().forEach((t) => t.stop());
    };

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        cleanup();
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
        reject(new Error('Export cancelled'));
      });
    }

    recorder.onstop = () => {
      cleanup();
      const extension = supportedMime.includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob(chunks, { type: supportedMime });
      resolve({
        blob,
        extension,
        width,
        height,
        durationSec: targetDurationSec,
      });
    };

    // Start recording with 200ms timeslices so data chunks flush continuously
    recorder.start(200);

    timerId = setInterval(() => {
      const elapsedMs = performance.now() - startWallMs;
      const elapsedSec = Math.min(targetDurationSec, elapsedMs / 1000);
      const sceneTime = elapsedSec % Math.max(1, scene.duration);

      renderSceneFrameToCanvas(
        ctx,
        scene,
        sceneTime,
        width,
        height,
        imageCache,
        assets
      );

      if (typeof videoTrack?.requestFrame === 'function') {
        try {
          videoTrack.requestFrame();
        } catch {
          // Ignore if track doesn't need explicit requestFrame
        }
      }

      const pct = Math.min(99, Math.max(1, Math.round((elapsedMs / totalWallMs) * 100)));
      onProgress(pct, Number(elapsedSec.toFixed(1)), targetDurationSec);

      if (elapsedMs >= totalWallMs) {
        if (timerId !== null) {
          clearInterval(timerId);
          timerId = null;
        }
        onProgress(100, targetDurationSec, targetDurationSec);
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }
    }, frameIntervalMs);
  });
}

/**
 * Self-contained GIF89a animated encoder producing a valid animated .gif Blob directly from canvas frames.
 */
export async function exportSceneToGifBlob(
  scene: MotionScene,
  assets: ImageAsset[],
  onProgress: (pct: number) => void
): Promise<Blob> {
  const spec = PLATFORM_SPECS[scene.platform] || PLATFORM_SPECS['instagram-post'];
  const scale = 0.28;
  const width = Math.max(180, Math.round(spec.width * scale));
  const height = Math.max(180, Math.round(spec.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageCache = await preloadSceneImages(scene, assets);

  const bytes: number[] = [];
  const writeStr = (s: string) => {
    for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
  };
  const writeU16 = (v: number) => {
    bytes.push(v & 0xff, (v >> 8) & 0xff);
  };

  writeStr('GIF89a');
  writeU16(width);
  writeU16(height);
  bytes.push(0xf7, 0x00, 0x00);

  for (let i = 0; i < 256; i++) {
    const r = Math.round(((i >> 5) & 0x07) * (255 / 7));
    const g = Math.round(((i >> 2) & 0x07) * (255 / 7));
    const b = Math.round((i & 0x03) * (255 / 3));
    bytes.push(r, g, b);
  }

  bytes.push(0x21, 0xff, 0x0b);
  writeStr('NETSCAPE2.0');
  bytes.push(0x03, 0x01, 0x00, 0x00, 0x00);

  const numFrames = 20;
  for (let f = 0; f < numFrames; f++) {
    const t = (f / Math.max(1, numFrames - 1)) * scene.duration;
    renderSceneFrameToCanvas(ctx, scene, t, width, height, imageCache, assets);
    const imgData = ctx.getImageData(0, 0, width, height).data;

    bytes.push(0x21, 0xf9, 0x04, 0x00);
    writeU16(8); // 80ms per frame (~12.5 fps smooth GIF loop)
    bytes.push(0x00, 0x00);

    bytes.push(0x2c);
    writeU16(0);
    writeU16(0);
    writeU16(width);
    writeU16(height);
    bytes.push(0x00);

    bytes.push(8);
    const totalPixels = width * height;
    const indexed = new Uint8Array(totalPixels);
    for (let p = 0; p < totalPixels; p++) {
      const r = imgData[p * 4] >> 5;
      const g = imgData[p * 4 + 1] >> 5;
      const b = imgData[p * 4 + 2] >> 6;
      indexed[p] = (r << 5) | (g << 2) | b;
    }

    let bitBuf = 0;
    let bitCount = 0;
    const subBlock: number[] = [];
    const flushSubBlock = () => {
      if (subBlock.length > 0) {
        bytes.push(subBlock.length);
        for (let i = 0; i < subBlock.length; i++) bytes.push(subBlock[i]);
        subBlock.length = 0;
      }
    };
    const emitCode9 = (code: number) => {
      bitBuf |= code << bitCount;
      bitCount += 9;
      while (bitCount >= 8) {
        subBlock.push(bitBuf & 0xff);
        if (subBlock.length === 255) flushSubBlock();
        bitBuf >>= 8;
        bitCount -= 8;
      }
    };

    emitCode9(256);
    for (let p = 0; p < totalPixels; p++) {
      emitCode9(indexed[p]);
      if ((p + 1) % 240 === 0) {
        emitCode9(256);
      }
    }
    emitCode9(257);
    if (bitCount > 0) {
      subBlock.push(bitBuf & 0xff);
    }
    flushSubBlock();
    bytes.push(0x00);

    onProgress(Math.round(((f + 1) / numFrames) * 100));
    await new Promise((r) => setTimeout(r, 8));
  }

  bytes.push(0x3b);
  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
}
