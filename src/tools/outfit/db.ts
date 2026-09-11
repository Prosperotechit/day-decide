import { openDB, type DBSchema } from 'idb';
import type { ClothingItem } from './types';

interface WardrobeDB extends DBSchema {
  items: {
    key: string;
    value: ClothingItem;
  };
}

const dbPromise = openDB<WardrobeDB>('day-decide-wardrobe', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  },
});

export async function getAllItems(): Promise<ClothingItem[]> {
  const db = await dbPromise;
  const items = await db.getAll('items');
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function putItem(item: ClothingItem): Promise<void> {
  const db = await dbPromise;
  await db.put('items', item);
}

export async function deleteItem(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete('items', id);
}
