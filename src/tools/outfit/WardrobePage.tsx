import { useMemo, useState } from 'react';
import { Chip } from '../../components/ui';
import { AddItemModal } from './AddItemModal';
import { ItemCard } from './ItemCard';
import { CATEGORY_EMOJI, CATEGORY_LABELS, type ClothingCategory } from './types';
import { useWardrobe } from './useWardrobe';

const CATEGORIES: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'watch', 'accessory'];

export function WardrobePage() {
  const { wardrobe, loading, addItem, removeItem } = useWardrobe();
  const [filter, setFilter] = useState<ClothingCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () => (filter === 'all' ? wardrobe : wardrobe.filter((item) => item.category === filter)),
    [wardrobe, filter],
  );

  const counts = useMemo(() => {
    const map = new Map<ClothingCategory, number>();
    for (const item of wardrobe) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [wardrobe]);

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink">My Closet</h2>
          <p className="mt-0.5 text-sm text-ink-soft">
            {wardrobe.length === 0 ? 'Nothing here yet' : `${wardrobe.length} item${wardrobe.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
          ✨ All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
            {CATEGORY_EMOJI[c]} {CATEGORY_LABELS[c]}
            {counts.get(c) ? <span className="opacity-60"> · {counts.get(c)}</span> : null}
          </Chip>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-ink-soft">Loading your closet…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 py-16 text-center">
          <span className="text-5xl">🧺</span>
          <p className="font-display text-lg text-ink">
            {wardrobe.length === 0 ? 'Your closet is empty' : `No ${CATEGORY_LABELS[filter as ClothingCategory]?.toLowerCase()} yet`}
          </p>
          <p className="max-w-xs text-sm text-ink-soft">
            Snap a photo of something you own to start building your virtual wardrobe.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-1 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-clay/30 hover:bg-clay-dark"
          >
            + Add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onRemove={removeItem} />
          ))}
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        aria-label="Add item"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-clay text-2xl text-white shadow-xl shadow-clay/40 transition-transform hover:scale-105 active:scale-95"
      >
        +
      </button>

      <AddItemModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addItem} />
    </div>
  );
}
