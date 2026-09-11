const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.85;

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

/** Downscales and re-encodes a photo so it stays small in storage. */
export async function compressImage(file: File | Blob): Promise<Blob> {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file instanceof Blob ? file : new Blob([file]);
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? (file as Blob)), 'image/jpeg', JPEG_QUALITY);
  });
}

function toHex(n: number): string {
  return Math.round(Math.max(0, Math.min(255, n)))
    .toString(16)
    .padStart(2, '0');
}

/**
 * Estimates the item's dominant color by averaging pixels from the center
 * region of the photo (avoiding background clutter near the edges).
 */
export async function detectDominantColor(blob: Blob): Promise<string> {
  const img = await loadImage(blob);
  const size = 40;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#6b7280';

  ctx.drawImage(img, 0, 0, size, size);
  const inset = Math.round(size * 0.2);
  const region = size - inset * 2;
  const { data } = ctx.getImageData(inset, inset, region, region);

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  if (count === 0) return '#6b7280';
  return `#${toHex(r / count)}${toHex(g / count)}${toHex(b / count)}`;
}
