import { CATEGORY_EMOJI, type ClothingItem } from './types';
import { useObjectUrl } from './useObjectUrl';

export function ItemCard({ item, onRemove }: { item: ClothingItem; onRemove?: (id: string) => void }) {
  const url = useObjectUrl(item.photo);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-ink/5">
        {url && <img src={url} alt={item.name} className="h-full w-full object-cover" />}
        <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow">
          {CATEGORY_EMOJI[item.category]}
        </span>
        <span
          className="absolute right-2 top-2 h-4 w-4 rounded-full border-2 border-white shadow"
          style={{ backgroundColor: item.color }}
        />
        {onRemove && (
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
            className="absolute bottom-2 right-2 flex h-7 w-7 translate-y-2 items-center justify-center rounded-full bg-ink/70 text-xs text-white opacity-0 shadow transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink"
          >
            ✕
          </button>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-sm font-medium text-ink">{item.name}</p>
      </div>
    </div>
  );
}
