export const hotScore = (rating?: number, count?: number) => {
  const r = rating ?? 0;          // 0..100
  const c = count ?? 0;
  return r * Math.log1p(c);
};

export const compact = (n?: number) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(n ?? 0);

export const starsFromTotal = (total_rating?: number) =>
  Math.max(0, Math.min(10, Math.round((total_rating ?? 0) / 10)));

// Utility for consistent date formatting
export const fmtDate = (s?: number) => s ? new Date(s * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export function sortGamesByHotScore(games: any[]): any[] {
  return [...games].sort((a, b) => {
    const scoreA = hotScore(a.total_rating, a.total_rating_count);
    const scoreB = hotScore(b.total_rating, b.total_rating_count);
    return scoreB - scoreA;
  });
}

// Legacy functions for backward compatibility
export function getRatingStars(rating?: number): number {
  return starsFromTotal(rating);
}

export function formatRatingCount(count?: number): string {
  return compact(count);
}

export function calculateCombinedScore(game: any): number {
  return hotScore(game.total_rating, game.total_rating_count);
}

export function sortGamesByCombinedScore(games: any[]): any[] {
  return sortGamesByHotScore(games);
}
