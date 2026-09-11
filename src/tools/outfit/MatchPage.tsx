import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Chip, ScoreBar } from '../../components/ui';
import { findBestOutfits } from './matcher';
import { OutfitPieceThumb } from './OutfitPieceThumb';
import { OCCASION_LABELS, SEASON_EMOJI, SEASON_LABELS, type ClothingItem, type Occasion, type Season } from './types';
import { useWardrobe } from './useWardrobe';

const OCCASIONS: Occasion[] = ['casual', 'business-casual', 'business-formal', 'formal', 'athletic'];
const SEASONS: Season[] = ['hot', 'mild', 'cold', 'rainy'];

export function MatchPage() {
  const { wardrobe, loading } = useWardrobe();
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [weather, setWeather] = useState<Season>('mild');
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => findBestOutfits(wardrobe, occasion, weather), [wardrobe, occasion, weather]);

  const hasEnoughBasics =
    wardrobe.some((i) => i.category === 'top') &&
    wardrobe.some((i) => i.category === 'bottom') &&
    wardrobe.some((i) => i.category === 'shoes');

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-ink">Find an Outfit</h2>
      <p className="mt-0.5 text-sm text-ink-soft">Tell me the occasion and the weather — I'll style you from your own closet.</p>

      {!loading && !hasEnoughBasics ? (
        <Card className="mt-6 text-center">
          <span className="text-3xl">👔</span>
          <p className="mt-2 font-display text-lg text-ink">Add a few basics first</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            I need at least one top, one bottom, and a pair of shoes in your closet before I can put a look together.
          </p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Go to My Closet</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="mt-6 space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Occasion</p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <Chip key={o} active={occasion === o} onClick={() => setOccasion(o)}>
                    {OCCASION_LABELS[o]}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Weather</p>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <Chip key={s} active={weather === s} onClick={() => setWeather(s)}>
                    {SEASON_EMOJI[s]} {SEASON_LABELS[s]}
                  </Chip>
                ))}
              </div>
            </div>
            <Button onClick={() => setSearched(true)}>✨ Style Me</Button>
          </Card>

          {searched && (
            <div className="mt-6 space-y-4">
              {results.length === 0 ? (
                <Card>
                  <p className="text-ink-soft">
                    Nothing in your closet fits that combination yet. Try a different occasion/weather, or add more pieces.
                  </p>
                </Card>
              ) : (
                results.map((result, i) => {
                  const pieces = Object.values(result.outfit).filter(Boolean) as ClothingItem[];
                  return (
                    <Card key={i}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-ink">
                          {i === 0 ? '⭐ Best Match' : `Look ${i + 1}`}
                        </h3>
                        <div className="w-28">
                          <ScoreBar score={result.score} />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                        {pieces.map((piece) => (
                          <OutfitPieceThumb key={piece.id} item={piece} />
                        ))}
                      </div>
                      {result.reasons.length > 0 && (
                        <ul className="mt-3 space-y-0.5 text-xs text-ink-soft">
                          {result.reasons.map((reason, ri) => (
                            <li key={ri}>• {reason}</li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
