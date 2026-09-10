import { FURNITURE_CATALOG } from './catalog';
import type { FurnitureSpec, LayoutResult, PlacedFurniture, RoomInput, RoomOpening, Wall } from './types';

const DOOR_CLEARANCE = 90; // cm the door needs to swing/walk through
const WINDOW_ZONE_DEPTH = 15; // cm — a thin strip along the window wall used to detect blocked light
const SLIDE_STEP = 10; // cm

interface Rect {
  x: number;
  y: number;
  width: number;
  depth: number;
}

function opposite(wall: Wall): Wall {
  return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[wall] as Wall;
}

function wallLabel(wall: Wall): string {
  return { top: 'back', bottom: 'front', left: 'left', right: 'right' }[wall];
}

/** Extent of the wall itself (how far you can slide along it). */
function wallSpan(wall: Wall, room: { width: number; length: number }): number {
  return wall === 'top' || wall === 'bottom' ? room.width : room.length;
}

/** Room depth available perpendicular to the wall. */
function wallClearance(wall: Wall, room: { width: number; length: number }): number {
  return wall === 'top' || wall === 'bottom' ? room.length : room.width;
}

/** Builds the room-coordinate rectangle for an item of `alongWall` x `intoRoom` size hugging `wall` at `pos`. */
function footprint(wall: Wall, pos: number, alongWall: number, intoRoom: number, room: { width: number; length: number }): Rect {
  switch (wall) {
    case 'top':
      return { x: pos, y: 0, width: alongWall, depth: intoRoom };
    case 'bottom':
      return { x: pos, y: room.length - intoRoom, width: alongWall, depth: intoRoom };
    case 'left':
      return { x: 0, y: pos, width: intoRoom, depth: alongWall };
    case 'right':
      return { x: room.width - intoRoom, y: pos, width: intoRoom, depth: alongWall };
  }
}

function posAlongWall(rect: Rect, wall: Wall): number {
  return wall === 'top' || wall === 'bottom' ? rect.x : rect.y;
}

function extentAlongWall(rect: Rect, wall: Wall): number {
  return wall === 'top' || wall === 'bottom' ? rect.width : rect.depth;
}

function overlaps(a: Rect, b: Rect): boolean {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.depth <= b.y || b.y + b.depth <= a.y);
}

function openingRect(opening: RoomOpening, depth: number, room: { width: number; length: number }): Rect {
  return footprint(opening.wall, opening.offset, opening.width, depth, room);
}

const COFFEE_TABLE_GAP = 45; // cm of walking room left between the sofa and the table

/** Centers `spec` a walking gap out from the open side of `anchor`, e.g. a coffee table in front of a sofa. */
function floatInFrontOf(anchor: PlacedFurniture, spec: FurnitureSpec, room: { width: number; length: number }): Rect | null {
  let rect: Rect;
  switch (anchor.wall) {
    case 'top':
      rect = { x: anchor.x + anchor.width / 2 - spec.width / 2, y: anchor.y + anchor.depth + COFFEE_TABLE_GAP, width: spec.width, depth: spec.depth };
      break;
    case 'bottom':
      rect = { x: anchor.x + anchor.width / 2 - spec.width / 2, y: anchor.y - COFFEE_TABLE_GAP - spec.depth, width: spec.width, depth: spec.depth };
      break;
    case 'left':
      rect = { x: anchor.x + anchor.width + COFFEE_TABLE_GAP, y: anchor.y + anchor.depth / 2 - spec.width / 2, width: spec.depth, depth: spec.width };
      break;
    case 'right':
      rect = { x: anchor.x - COFFEE_TABLE_GAP - spec.depth, y: anchor.y + anchor.depth / 2 - spec.width / 2, width: spec.depth, depth: spec.width };
      break;
  }
  if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > room.width || rect.y + rect.depth > room.length) return null;
  return rect;
}

function explain(spec: FurnitureSpec, wall: Wall, doorWall: Wall, windowWall: Wall | null): string {
  if (spec.prefersOppositeDoor) {
    return `${spec.label} placed against the ${wallLabel(wall)} wall, opposite the door, for a calm view when you walk in.`;
  }
  if (spec.prefersWindow && wall === windowWall) {
    return `${spec.label} placed by the window for natural light.`;
  }
  if (spec.blocksLight && wall !== windowWall) {
    return `${spec.label} placed on the ${wallLabel(wall)} wall, away from the window, so it doesn't block the light.`;
  }
  if (wall === doorWall) {
    return `${spec.label} tucked beside the door on the ${wallLabel(wall)} wall.`;
  }
  return `${spec.label} placed against the ${wallLabel(wall)} wall to keep the floor open.`;
}

export function layoutRoom(input: RoomInput): LayoutResult {
  const room = { width: input.width, length: input.length };
  const specs = FURNITURE_CATALOG[input.roomType]
    .filter((s) => input.selectedKeys.includes(s.key))
    .sort((a, b) => a.priority - b.priority);

  const placed: PlacedFurniture[] = [];
  const skipped: FurnitureSpec[] = [];
  const notes: string[] = [];

  const doorRect = openingRect(input.door, DOOR_CLEARANCE, room);
  const windowRect = input.window ? openingRect(input.window, WINDOW_ZONE_DEPTH, room) : null;
  const walls: Wall[] = ['top', 'right', 'bottom', 'left'];

  for (const spec of specs) {
    let best: { rect: Rect; wall: Wall; score: number; floating?: boolean } | null = null;

    if (spec.key === 'coffee-table') {
      const sofa = placed.find((p) => p.spec.key === 'sofa');
      if (sofa) {
        const rect = floatInFrontOf(sofa, spec, room);
        if (rect && !overlaps(rect, doorRect) && !placed.some((p) => overlaps(rect, p))) {
          best = { rect, wall: sofa.wall, score: Infinity, floating: true };
        }
      }
    }

    for (const wall of walls) {
      const span = wallSpan(wall, room);
      const clearance = wallClearance(wall, room);
      if (spec.width > span || spec.depth > clearance) continue;

      const candidates = new Set<number>();
      for (let pos = 0; pos <= span - spec.width; pos += SLIDE_STEP) candidates.add(pos);
      candidates.add(span - spec.width); // ensure the flush-against-far-corner position is tried

      // Nightstands (or similarly paired small items) prefer to sit right beside the bed.
      if (spec.key === 'nightstand') {
        const bed = placed.find((p) => p.spec.key === 'bed-queen' && p.wall === wall);
        if (bed) {
          const bedPos = posAlongWall(bed, wall);
          const bedExtent = extentAlongWall(bed, wall);
          candidates.add(bedPos - spec.width);
          candidates.add(bedPos + bedExtent);
        }
      }

      for (const pos of candidates) {
        if (pos < 0 || pos > span - spec.width) continue;
        const rect = footprint(wall, pos, spec.width, spec.depth, room);
        if (overlaps(rect, doorRect)) continue;
        if (placed.some((p) => overlaps(rect, p))) continue;

        let score = 1;
        if (spec.prefersOppositeDoor && wall === opposite(input.door.wall)) score += 0.6;
        if (spec.prefersWindow && windowRect && wall === input.window!.wall) score += 0.5;
        if (windowRect && spec.blocksLight && wall === input.window!.wall && overlaps(rect, windowRect)) score -= 0.7;
        if (wall === input.door.wall) score -= 0.2;
        if (spec.key === 'nightstand' && placed.some((p) => p.spec.key === 'bed-queen' && p.wall === wall)) {
          score += 1;
        }

        const center = pos + spec.width / 2;
        const wallCenter = span / 2;
        score += 0.25 * (1 - Math.abs(center - wallCenter) / wallCenter);

        if (!best || score > best.score) best = { rect, wall, score };
      }
    }

    if (best) {
      placed.push({ spec, x: best.rect.x, y: best.rect.y, width: best.rect.width, depth: best.rect.depth, wall: best.wall });
      notes.push(
        best.floating
          ? `${spec.label} centered in front of the sofa, with room to walk around it.`
          : explain(spec, best.wall, input.door.wall, input.window?.wall ?? null),
      );
    } else {
      skipped.push(spec);
    }
  }

  if (skipped.length > 0) {
    notes.push(`${skipped.map((s) => s.label).join(', ')} didn't fit — try a larger room or fewer pieces.`);
  }

  return { placed, skipped, notes };
}
