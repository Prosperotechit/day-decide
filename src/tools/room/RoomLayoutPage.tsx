import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { FURNITURE_CATALOG, ROOM_TYPE_LABELS } from './catalog';
import { layoutRoom } from './layoutEngine';
import { RoomDiagram } from './RoomDiagram';
import type { RoomInput, RoomOpening, RoomType, Wall } from './types';

const ROOM_TYPES: RoomType[] = ['bedroom', 'living-room', 'office'];
const WALLS: Wall[] = ['top', 'right', 'bottom', 'left'];
const WALL_LABELS: Record<Wall, string> = { top: 'Back', right: 'Right', bottom: 'Front (entry side)', left: 'Left' };

function defaultSelection(roomType: RoomType): string[] {
  return FURNITURE_CATALOG[roomType].filter((s) => s.priority <= 3).map((s) => s.key);
}

export function RoomLayoutPage() {
  const [roomType, setRoomType] = useState<RoomType>('bedroom');
  const [width, setWidth] = useState(300);
  const [length, setLength] = useState(350);
  const [door, setDoor] = useState<RoomOpening>({ wall: 'bottom', offset: 20, width: 90 });
  const [hasWindow, setHasWindow] = useState(true);
  const [window_, setWindow] = useState<RoomOpening>({ wall: 'top', offset: 50, width: 120 });
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultSelection('bedroom'));

  function changeRoomType(next: RoomType) {
    setRoomType(next);
    setSelectedKeys(defaultSelection(next));
  }

  function toggleFurniture(key: string) {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const input: RoomInput = useMemo(
    () => ({ roomType, width, length, door, window: hasWindow ? window_ : null, selectedKeys }),
    [roomType, width, length, door, hasWindow, window_, selectedKeys],
  );

  const result = useMemo(() => layoutRoom(input), [input]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/" className="text-sm text-slate-500 hover:underline">
        ← All decision tools
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Room Layout</h1>
      <p className="mt-1 text-slate-500">
        Describe your room and I'll suggest a furniture arrangement that keeps the door clear and the light open.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <Card className="space-y-3">
            <label className="block text-xs font-medium text-slate-500">
              Room type
              <select
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={roomType}
                onChange={(e) => changeRoomType(e.target.value as RoomType)}
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ROOM_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3">
              <label className="block flex-1 text-xs font-medium text-slate-500">
                Width (cm)
                <input
                  type="number"
                  min={150}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </label>
              <label className="block flex-1 text-xs font-medium text-slate-500">
                Length (cm)
                <input
                  type="number"
                  min={150}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-xs font-semibold text-slate-600">Door</p>
              <div className="flex gap-3">
                <select
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  value={door.wall}
                  onChange={(e) => setDoor({ ...door, wall: e.target.value as Wall })}
                >
                  {WALLS.map((w) => (
                    <option key={w} value={w}>
                      {WALL_LABELS[w]}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  value={door.offset}
                  onChange={(e) => setDoor({ ...door, offset: Number(e.target.value) })}
                  aria-label="Door offset from corner"
                />
                <span className="self-center text-xs text-slate-400">cm from corner</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" checked={hasWindow} onChange={(e) => setHasWindow(e.target.checked)} />
                Window
              </label>
              {hasWindow && (
                <div className="flex gap-3">
                  <select
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={window_.wall}
                    onChange={(e) => setWindow({ ...window_, wall: e.target.value as Wall })}
                  >
                    {WALLS.map((w) => (
                      <option key={w} value={w}>
                        {WALL_LABELS[w]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={window_.offset}
                    onChange={(e) => setWindow({ ...window_, offset: Number(e.target.value) })}
                    aria-label="Window offset from corner"
                  />
                  <span className="self-center text-xs text-slate-400">cm from corner</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <p className="mb-2 text-xs font-semibold text-slate-600">Furniture to place</p>
            <div className="space-y-2">
              {FURNITURE_CATALOG[roomType].map((spec) => (
                <label key={spec.key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(spec.key)}
                    onChange={() => toggleFurniture(spec.key)}
                  />
                  {spec.label}
                  <span className="text-xs text-slate-400">
                    ({spec.width}×{spec.depth}cm)
                  </span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 rounded bg-orange-500" /> door
              </span>
              {hasWindow && (
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-4 rounded bg-sky-400" /> window
                </span>
              )}
            </div>
            <div className="mt-2">
              <RoomDiagram width={width} length={length} door={door} window={hasWindow ? window_ : null} result={result} />
            </div>
          </Card>

          {result.notes.length > 0 && (
            <Card>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Why this layout</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                {result.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
