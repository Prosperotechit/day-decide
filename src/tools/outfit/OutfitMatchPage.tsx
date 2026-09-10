import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ScoreBar, Swatch } from '../../components/ui';
import { findBestOutfits } from './matcher';
import {
  OCCASION_LABELS,
  SEASON_LABELS,
  type ClothingCategory,
  type ClothingItem,
  type Occasion,
  type Pattern,
  type Season,
} from './types';
import { useWardrobe } from './useWardrobe';

const CATEGORIES: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'accessory'];
const PATTERNS: Pattern[] = ['solid', 'subtle', 'bold'];
const SEASONS: Season[] = ['hot', 'mild', 'cold', 'rainy'];
const OCCASIONS: Occasion[] = ['casual', 'business-casual', 'business-formal', 'formal', 'athletic'];

function AddItemForm({ onAdd }: { onAdd: (item: ClothingItem) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('top');
  const [color, setColor] = useState('#4b5563');
  const [pattern, setPattern] = useState<Pattern>('solid');
  const [formality, setFormality] = useState(3);
  const [seasons, setSeasons] = useState<Season[]>(['mild']);

  function toggleSeason(season: Season) {
    setSeasons((prev) => (prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]));
  }

  function submit() {
    if (!name.trim() || seasons.length === 0) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      color,
      pattern,
      formality: formality as ClothingItem['formality'],
      seasons,
    });
    setName('');
  }

  return (
    <Card className="space-y-3">
      <h3 className="font-semibold text-slate-800">Add a piece</h3>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        placeholder="e.g. Grey Hoodie"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value as ClothingCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="color"
          className="h-9 w-12 cursor-pointer rounded border border-slate-300"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <select
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          value={pattern}
          onChange={(e) => setPattern(e.target.value as Pattern)}
        >
          {PATTERNS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <label className="block text-xs text-slate-500">
        Formality: {formality} ({formality <= 2 ? 'casual' : formality === 3 ? 'smart casual' : 'formal'})
        <input
          type="range"
          min={1}
          max={5}
          value={formality}
          onChange={(e) => setFormality(Number(e.target.value))}
          className="mt-1 block w-full"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {SEASONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleSeason(s)}
            className={`rounded-full border px-3 py-1 text-xs ${
              seasons.includes(s)
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 text-slate-600'
            }`}
          >
            {SEASON_LABELS[s]}
          </button>
        ))}
      </div>
      <Button onClick={submit} disabled={!name.trim() || seasons.length === 0}>
        Add to wardrobe
      </Button>
    </Card>
  );
}

export function OutfitMatchPage() {
  const { wardrobe, addItem, removeItem } = useWardrobe();
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [weather, setWeather] = useState<Season>('mild');
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(
    () => findBestOutfits(wardrobe, occasion, weather),
    [wardrobe, occasion, weather],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="text-sm text-slate-500 hover:underline">
        ← All decision tools
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Outfit Match</h1>
      <p className="mt-1 text-slate-500">
        Pick your occasion and the weather, and I'll rank your best combinations from your wardrobe.
      </p>

      <Card className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Occasion</label>
            <select
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
            >
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  {OCCASION_LABELS[o]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Weather</label>
            <div className="flex gap-2">
              {SEASONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setWeather(s)}
                  className={`rounded-full border px-3 py-2 text-xs ${
                    weather === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  {SEASON_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowResults(true)}>Find my outfit</Button>
      </Card>

      {showResults && (
        <div className="mt-6 space-y-4">
          {results.length === 0 ? (
            <Card>
              <p className="text-slate-500">
                No combination in your wardrobe fits that occasion and weather. Try adding more pieces below.
              </p>
            </Card>
          ) : (
            results.map((result, i) => {
              const pieces = Object.values(result.outfit).filter(Boolean) as ClothingItem[];
              return (
                <Card key={i}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Option {i + 1}</h3>
                    <div className="w-32">
                      <ScoreBar score={result.score} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4">
                    {pieces.map((piece) => (
                      <div key={piece.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <Swatch color={piece.color} />
                        {piece.name}
                      </div>
                    ))}
                  </div>
                  {result.reasons.length > 0 && (
                    <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
                      {result.reasons.map((reason, ri) => (
                        <li key={ri}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      <h2 className="mt-10 mb-3 text-lg font-semibold text-slate-800">Your wardrobe ({wardrobe.length})</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {wardrobe.map((item) => (
          <Card key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Swatch color={item.color} />
              <div>
                <p className="text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">
                  {item.category} · formality {item.formality} · {item.seasons.join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-xs text-slate-400 hover:text-rose-500"
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <AddItemForm onAdd={addItem} />
      </div>
    </div>
  );
}
