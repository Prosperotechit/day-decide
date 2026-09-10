import type { LayoutResult, RoomOpening, Wall } from './types';

const SCALE = 1.5; // px per cm

function openingLine(opening: RoomOpening, width: number, length: number) {
  switch (opening.wall as Wall) {
    case 'top':
      return { x1: opening.offset, y1: 0, x2: opening.offset + opening.width, y2: 0 };
    case 'bottom':
      return { x1: opening.offset, y1: length, x2: opening.offset + opening.width, y2: length };
    case 'left':
      return { x1: 0, y1: opening.offset, x2: 0, y2: opening.offset + opening.width };
    case 'right':
      return { x1: width, y1: opening.offset, x2: width, y2: opening.offset + opening.width };
  }
}

export function RoomDiagram({
  width,
  length,
  door,
  window,
  result,
}: {
  width: number;
  length: number;
  door: RoomOpening;
  window: RoomOpening | null;
  result: LayoutResult;
}) {
  const doorLine = openingLine(door, width, length);
  const winLine = window ? openingLine(window, width, length) : null;

  return (
    <svg
      viewBox={`-20 -20 ${width * SCALE + 40} ${length * SCALE + 40}`}
      width="100%"
      className="max-h-[520px] rounded-lg bg-slate-50"
    >
      <g transform={`scale(${SCALE})`}>
        <rect x={0} y={0} width={width} height={length} fill="white" stroke="#0f172a" strokeWidth={2 / SCALE} />

        {winLine && (
          <line
            x1={winLine.x1}
            y1={winLine.y1}
            x2={winLine.x2}
            y2={winLine.y2}
            stroke="#38bdf8"
            strokeWidth={6 / SCALE}
          />
        )}

        <line
          x1={doorLine.x1}
          y1={doorLine.y1}
          x2={doorLine.x2}
          y2={doorLine.y2}
          stroke="#f97316"
          strokeWidth={6 / SCALE}
        />

        {result.placed.map((item) => (
          <g key={item.spec.key}>
            <rect
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.depth}
              fill="#c7d2fe"
              stroke="#4338ca"
              strokeWidth={1.5 / SCALE}
              rx={3}
            />
            <text
              x={item.x + item.width / 2}
              y={item.y + item.depth / 2}
              fontSize={11 / SCALE}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#312e81"
            >
              {item.spec.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
