# Day Decide

Your virtual wardrobe. Snap or upload photos of your clothes, shoes, watches,
and accessories to build a closet, then get outfit suggestions ranked by
color harmony, formality fit, and pattern clash for any occasion and weather.

## Features

- **My Closet** — a photo grid of everything you own, filterable by category (tops, bottoms, shoes, outerwear, watches, accessories). Add items by taking a photo or picking one from your gallery; the dominant color is detected automatically from the photo.
- **Find an Outfit** — pick an occasion and the weather, and it styles a look from your own closet, shown as photos with a match score and the reasoning behind it.

Photos and item data are stored entirely in the browser (IndexedDB) — there's no backend and nothing leaves your device.

## Development

```sh
npm install
npm run dev
```

Built with Vite, React, TypeScript, and Tailwind CSS.
