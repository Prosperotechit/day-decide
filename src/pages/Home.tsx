import { Link } from 'react-router-dom';
import { Card } from '../components/ui';

interface ToolCard {
  to: string;
  title: string;
  description: string;
  emoji: string;
}

const TOOLS: ToolCard[] = [
  {
    to: '/outfit',
    title: 'Outfit Match',
    description: 'Pick your occasion and the weather — rank the best combinations from your wardrobe.',
    emoji: '👕',
  },
  {
    to: '/room',
    title: 'Room Layout',
    description: 'Describe your room and furniture — get an arrangement that keeps the door clear and light open.',
    emoji: '🛋️',
  },
];

export function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Day Decide</h1>
      <p className="mt-2 text-slate-500">Small tools to take the overthinking out of everyday choices.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link key={tool.to} to={tool.to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <span className="text-3xl">{tool.emoji}</span>
              <h2 className="mt-3 text-lg font-semibold text-slate-800">{tool.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
