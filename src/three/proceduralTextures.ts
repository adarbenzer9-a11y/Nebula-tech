import * as THREE from 'three';

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createKaptonFoilTexture(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const [colorCanvas, cCtx] = createCanvas(512, 512);
  const [bumpCanvas, bCtx] = createCanvas(512, 512);

  cCtx.fillStyle = '#c88a28';
  cCtx.fillRect(0, 0, 512, 512);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  // Crinkled faceted thermal foil triangles
  for (let i = 0; i < 420; i++) {
    const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 512;
    const y = (Math.cos(i * 78.233) * 0.5 + 0.5) * 512;
    const size = 18 + (i % 34);
    const angle = (i * 1.37) % (Math.PI * 2);
    const shade = 0.72 + ((i * 19) % 50) / 100;

    cCtx.save();
    cCtx.translate(x, y);
    cCtx.rotate(angle);
    cCtx.beginPath();
    cCtx.moveTo(0, -size);
    cCtx.lineTo(size * 0.9, size * 0.6);
    cCtx.lineTo(-size * 0.8, size * 0.7);
    cCtx.closePath();
    cCtx.fillStyle = `rgba(${Math.round(230 * shade)}, ${Math.round(162 * shade)}, ${Math.round(
      46 * shade
    )}, 0.42)`;
    cCtx.fill();
    cCtx.restore();

    const bVal = Math.round(90 + ((i * 31) % 135));
    bCtx.save();
    bCtx.translate(x, y);
    bCtx.rotate(angle);
    bCtx.beginPath();
    bCtx.moveTo(0, -size);
    bCtx.lineTo(size * 0.9, size * 0.6);
    bCtx.lineTo(-size * 0.8, size * 0.7);
    bCtx.closePath();
    bCtx.fillStyle = `rgba(${bVal}, ${bVal}, ${bVal}, 0.55)`;
    bCtx.fill();
    bCtx.restore();
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createSolarPanelTexture(
  variant: 'lunar' | 'mars',
  dustAmount: number,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);

  ctx.fillStyle = variant === 'mars' ? '#131d33' : '#101b2e';
  ctx.fillRect(0, 0, 512, 512);

  // Photovoltaic wafer grid
  const cols = 8;
  const rows = 12;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#182848' : '#152340';
      ctx.fillRect(c * cellW + 3, r * cellH + 3, cellW - 6, cellH - 6);

      // Fine silver collector fingers
      ctx.strokeStyle = 'rgba(205, 220, 240, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(c * cellW + cellW * 0.5, r * cellH + 3);
      ctx.lineTo(c * cellW + cellW * 0.5, (r + 1) * cellH - 3);
      ctx.stroke();
    }
  }

  if (dustAmount > 0.02) {
    ctx.fillStyle =
      variant === 'mars'
        ? `rgba(176, 86, 46, ${dustAmount * 0.68})`
        : `rgba(130, 128, 122, ${dustAmount * 0.45})`;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createPlanetaryGroundTexture(
  body: 'moon' | 'mars',
  maxAnisotropy: number
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);

  if (body === 'moon') {
    ctx.fillStyle = '#4c4e52';
    ctx.fillRect(0, 0, 512, 512);
  } else {
    ctx.fillStyle = '#7c3f27';
    ctx.fillRect(0, 0, 512, 512);
  }

  // Fine regolith grain & micro-craters
  for (let i = 0; i < 2400; i++) {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * 512;
    const y = (Math.cos(i * 47.3) * 0.5 + 0.5) * 512;
    const r = 0.6 + (i % 4) * 0.55;
    const light = i % 2 === 0;
    if (body === 'moon') {
      ctx.fillStyle = light ? 'rgba(130, 132, 136, 0.25)' : 'rgba(34, 36, 40, 0.3)';
    } else {
      ctx.fillStyle = light ? 'rgba(178, 102, 62, 0.28)' : 'rgba(64, 28, 16, 0.28)';
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wind ripples on Mars or subtle impact rings on Moon
  if (body === 'mars') {
    ctx.strokeStyle = 'rgba(165, 86, 50, 0.22)';
    ctx.lineWidth = 2;
    for (let y = 16; y < 512; y += 26) {
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 16) {
        const wy = y + Math.sin(x * 0.04 + y) * 3.5;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < 18; i++) {
      const cx = (Math.sin(i * 23.1) * 0.5 + 0.5) * 440 + 36;
      const cy = (Math.cos(i * 57.9) * 0.5 + 0.5) * 440 + 36;
      const cr = 8 + (i % 16);
      ctx.strokeStyle = 'rgba(145, 148, 152, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
