import { useCallback, useEffect, useState } from 'react';
import { deleteItem, getAllItems, putItem } from './db';
import type { ClothingItem } from './types';

export function useWardrobe() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllItems()
      .then(setWardrobe)
      .finally(() => setLoading(false));
  }, []);

  const addItem = useCallback(async (item: ClothingItem) => {
    await putItem(item);
    setWardrobe((prev) => [item, ...prev]);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await deleteItem(id);
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { wardrobe, loading, addItem, removeItem };
}
