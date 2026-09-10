import type { FurnitureSpec, RoomType } from './types';

export const FURNITURE_CATALOG: Record<RoomType, FurnitureSpec[]> = {
  bedroom: [
    { key: 'bed-queen', label: 'Queen Bed', width: 160, depth: 210, priority: 1, prefersOppositeDoor: true },
    { key: 'wardrobe', label: 'Wardrobe', width: 120, depth: 60, priority: 2, blocksLight: true },
    { key: 'desk', label: 'Desk', width: 120, depth: 60, priority: 3, prefersWindow: true },
    { key: 'nightstand', label: 'Nightstand', width: 45, depth: 40, priority: 4 },
    { key: 'dresser', label: 'Dresser', width: 100, depth: 45, priority: 5, blocksLight: true },
  ],
  'living-room': [
    { key: 'sofa', label: 'Sofa', width: 200, depth: 90, priority: 1, prefersOppositeDoor: true },
    { key: 'tv-stand', label: 'TV Stand', width: 140, depth: 40, priority: 2 },
    { key: 'coffee-table', label: 'Coffee Table', width: 100, depth: 55, priority: 3 },
    { key: 'armchair', label: 'Armchair', width: 80, depth: 80, priority: 4 },
    { key: 'bookshelf', label: 'Bookshelf', width: 90, depth: 35, priority: 5, blocksLight: true },
  ],
  office: [
    { key: 'desk', label: 'Desk', width: 140, depth: 70, priority: 1, prefersWindow: true },
    { key: 'bookshelf', label: 'Bookshelf', width: 90, depth: 35, priority: 2, blocksLight: true },
    { key: 'filing-cabinet', label: 'Filing Cabinet', width: 45, depth: 45, priority: 3 },
    { key: 'guest-chair', label: 'Guest Chair', width: 55, depth: 55, priority: 4 },
    { key: 'reading-nook', label: 'Reading Chair', width: 80, depth: 80, priority: 5, prefersOppositeDoor: true },
  ],
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  bedroom: 'Bedroom',
  'living-room': 'Living Room',
  office: 'Home Office',
};
