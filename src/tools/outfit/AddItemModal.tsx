import { useRef, useState } from 'react';
import { Button, Chip, Modal, Swatch } from '../../components/ui';
import { compressImage, detectDominantColor } from './imageUtils';
import {
  CATEGORY_EMOJI,
  CATEGORY_LABELS,
  SEASON_EMOJI,
  SEASON_LABELS,
  type ClothingCategory,
  type ClothingItem,
  type Pattern,
  type Season,
} from './types';

const CATEGORIES: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'watch', 'accessory'];
const PATTERNS: { key: Pattern; label: string }[] = [
  { key: 'solid', label: 'Solid' },
  { key: 'subtle', label: 'Subtle pattern' },
  { key: 'bold', label: 'Bold pattern' },
];
const SEASONS: Season[] = ['hot', 'mild', 'cold', 'rainy'];

export function AddItemModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: ClothingItem) => void | Promise<void>;
}) {
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('top');
  const [color, setColor] = useState('#6b7280');
  const [pattern, setPattern] = useState<Pattern>('solid');
  const [formality, setFormality] = useState(3);
  const [seasons, setSeasons] = useState<Season[]>(['mild']);
  const [saving, setSaving] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setPhoto(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setName('');
    setCategory('top');
    setColor('#6b7280');
    setPattern('solid');
    setFormality(3);
    setSeasons(['mild']);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setDetecting(true);
    const compressed = await compressImage(file);
    setPhoto(compressed);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(compressed);
    });
    const dominant = await detectDominantColor(compressed);
    setColor(dominant);
    setDetecting(false);
  }

  function toggleSeason(season: Season) {
    setSeasons((prev) => (prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]));
  }

  async function handleSave() {
    if (!photo || seasons.length === 0) return;
    setSaving(true);
    await onAdd({
      id: crypto.randomUUID(),
      name: name.trim() || CATEGORY_LABELS[category].replace(/s$/, ''),
      category,
      color,
      pattern,
      formality: formality as ClothingItem['formality'],
      seasons,
      photo,
      createdAt: Date.now(),
    });
    setSaving(false);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add to your closet">
      {!photo ? (
        <div className="space-y-3">
          <p className="text-sm text-ink-soft">Snap a photo of the item, or pick one from your gallery.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-clay/40 bg-clay-light/40 py-8 text-clay-dark transition-colors hover:bg-clay-light/70"
            >
              <span className="text-3xl">📷</span>
              <span className="text-sm font-semibold">Take Photo</span>
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 py-8 text-ink-soft transition-colors hover:border-ink/40 hover:bg-white"
            >
              <span className="text-3xl">🖼️</span>
              <span className="text-sm font-semibold">Choose Photo</span>
            </button>
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-ink/5">
              {previewUrl && <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 space-y-2">
              <input
                className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm"
                placeholder={`e.g. ${CATEGORY_LABELS[category].replace(/s$/, '')} name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                {detecting ? (
                  <span>Detecting color…</span>
                ) : (
                  <>
                    <span>Color:</span>
                    <Swatch color={color} size={18} />
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-ink/15"
                      aria-label="Adjust detected color"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {CATEGORY_EMOJI[c]} {CATEGORY_LABELS[c]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Pattern</p>
            <div className="flex flex-wrap gap-2">
              {PATTERNS.map((p) => (
                <Chip key={p.key} active={pattern === p.key} onClick={() => setPattern(p.key)}>
                  {p.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Formality — {formality <= 2 ? 'casual' : formality === 3 ? 'smart casual' : 'formal'}
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={formality}
              onChange={(e) => setFormality(Number(e.target.value))}
              className="w-full accent-clay"
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Good for</p>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <Chip key={s} active={seasons.includes(s)} onClick={() => toggleSeason(s)}>
                  {SEASON_EMOJI[s]} {SEASON_LABELS[s]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={reset}>
              Retake
            </Button>
            <Button onClick={handleSave} disabled={saving || detecting || seasons.length === 0}>
              {saving ? 'Saving…' : 'Add to Closet'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
