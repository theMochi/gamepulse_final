# GamePulse

A modern game discovery platform built with Next.js 14, TypeScript, and the IGDB API. Discover the best games of 2025, browse by genre and platform, and stay updated with the latest releases.

## Features

- **Featured Games**: Best rated games released in 2025
- **Top Games**: Ranked by combined score using rating and review count
- **Coming Soon**: Upcoming 2025 releases with release dates and platforms
- **Advanced Filtering**: Filter by rating, release date, platforms, genres, and developers
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Data**: Live game data from IGDB (Internet Game Database)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Data Fetching**: SWR for client-side caching
- **API**: IGDB via Twitch App Access Token
- **Validation**: Zod for response schema validation

## Prerequisites

Before running this project, you need to obtain Twitch API credentials for IGDB access:

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Note down your **Client ID** and **Client Secret**

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gamepulse
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your Twitch credentials to `.env.local`:
```env
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gamepulse/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   └── igdb/         # IGDB proxy endpoints
│   ├── games/            # Games browse page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── game-card.tsx     # Game display card
│   ├── filters.tsx       # Filter sidebar
│   ├── section.tsx       # Page sections
│   └── stars.tsx         # Star rating display
├── lib/                   # Core utilities
│   ├── igdb.ts           # IGDB API integration
│   ├── twitch.ts         # Twitch auth handling
│   └── utils.ts          # General utilities
└── utils/                 # Helper functions
    ├── date.ts           # Date formatting
    ├── img.ts            # Image URL generation
    └── score.ts          # Rating calculations
```

## API Integration

### IGDB (Internet Game Database)

The app uses IGDB's API through Twitch authentication:

1. **Token Management**: Automatic Twitch App Access Token generation and caching
2. **APICalypse Queries**: Uses IGDB's query language for efficient data fetching
3. **Data Validation**: Zod schemas ensure type safety and data consistency

### Available Endpoints

- `GET /api/igdb/games` - Search and filter games
- `GET /api/igdb/platforms` - Get gaming platforms
- `GET /api/igdb/genres` - Get game genres

### Query Examples

```javascript
// Featured games (best of 2025)
const featuredGames = await fetch('/api/igdb/games?type=featured');

// Search with filters
const searchResults = await fetch('/api/igdb/games?type=search&minRating=80&platforms=6,167');

// Raw APICalypse query
const customQuery = await fetch('/api/igdb/games', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'fields name,rating; where rating > 90; limit 10;'
  })
});
```

## Game Data Model

The app fetches and displays the following game information:

- **Basic Info**: ID, name, summary, release date
- **Ratings**: Aggregated rating, total rating, review counts
- **Media**: Cover images (via IGDB CDN)
- **Classification**: Genres, platforms, involved companies
- **Computed**: Combined scores (rating × ln(1 + review_count))

## Filtering & Sorting

### Available Filters
- **Minimum Rating**: 0-100 scale
- **Release Date Range**: Custom date picker
- **Platforms**: PC, PlayStation, Xbox, Switch, etc.
- **Genres**: Action, RPG, Strategy, etc.
- **Developer**: Text search in company names

### Sorting Options
- **Rating**: By combined score (default)
- **Reviews**: By review count
- **Release Date**: Newest first
- **Title**: Alphabetical

## Performance Optimizations

- **Server-side Rendering**: Initial data fetched on server
- **Client-side Caching**: SWR for efficient data fetching
- **Image Optimization**: Next.js Image component with IGDB CDN
- **Token Caching**: In-memory Twitch token caching with expiry
- **Lazy Loading**: Infinite scroll pagination

## Development

### Adding New Features

1. **New API Endpoints**: Add to `app/api/igdb/`
2. **UI Components**: Follow shadcn/ui patterns in `components/ui/`
3. **Game Data**: Update Zod schemas in `lib/igdb.ts`
4. **Utilities**: Add helpers to respective `utils/` files

### Testing

```bash
npm run test
# or
pnpm test
```

### Building for Production

```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TWITCH_CLIENT_ID` | Your Twitch application Client ID | Yes |
| `TWITCH_CLIENT_SECRET` | Your Twitch application Client Secret | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [IGDB](https://www.igdb.com/) for providing comprehensive game data
- [Twitch](https://dev.twitch.tv/) for API access
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## Troubleshooting

### Common Issues

1. **"TWITCH_CLIENT_ID must be set" Error**
   - Ensure your `.env.local` file exists and contains valid Twitch credentials
   - Restart the development server after adding environment variables

2. **Games Not Loading**
   - Check your internet connection
   - Verify Twitch API credentials are correct
   - Check browser console for specific error messages

3. **Images Not Displaying**
   - IGDB images are served from `images.igdb.com`
   - Check if the domain is accessible from your network
   - Placeholder images will show if covers are unavailable

4. **Slow Loading**
   - IGDB API responses can be slow during peak times
   - The app includes loading states and error handling
   - Try refreshing or waiting a moment

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Ensure you have a stable internet connection
4. Try clearing your browser cache and restarting the development server

For additional support, please open an issue in the repository.
