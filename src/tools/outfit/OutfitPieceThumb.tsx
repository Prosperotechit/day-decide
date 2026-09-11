import type { ClothingItem } from './types';
import { useObjectUrl } from './useObjectUrl';

export function OutfitPieceThumb({ item }: { item: ClothingItem }) {
  const url = useObjectUrl(item.photo);
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-1 text-center">
      <div className="h-20 w-20 overflow-hidden rounded-2xl border border-ink/10 bg-ink/5 shadow-sm">
        {url && <img src={url} alt={item.name} className="h-full w-full object-cover" />}
      </div>
      <p className="w-full truncate text-[11px] text-ink-soft">{item.name}</p>
    </div>
  );
}
