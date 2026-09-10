export type Wall = 'top' | 'right' | 'bottom' | 'left';

export type RoomType = 'bedroom' | 'living-room' | 'office';

export interface RoomOpening {
  wall: Wall;
  /** Distance in cm from the wall's start corner (top/bottom measured left-to-right, left/right measured top-to-bottom) */
  offset: number;
  width: number;
}

export interface FurnitureSpec {
  key: string;
  label: string;
  /** width x depth in cm as it would sit against a wall (depth faces into the room) */
  width: number;
  depth: number;
  /** priority order for placement; lower = placed first (bigger/more important pieces first) */
  priority: number;
  /** true if this item should avoid covering a window (wardrobes, bookshelves) */
  blocksLight?: boolean;
  /** true if this item is happiest near the window (desks) */
  prefersWindow?: boolean;
  /** true if this item should default to the wall opposite the door (beds, sofas) */
  prefersOppositeDoor?: boolean;
}

export interface PlacedFurniture {
  spec: FurnitureSpec;
  x: number;
  y: number;
  width: number;
  depth: number;
  wall: Wall;
}

export interface RoomInput {
  roomType: RoomType;
  width: number;
  length: number;
  door: RoomOpening;
  window: RoomOpening | null;
  selectedKeys: string[];
}

export interface LayoutResult {
  placed: PlacedFurniture[];
  skipped: FurnitureSpec[];
  notes: string[];
}
