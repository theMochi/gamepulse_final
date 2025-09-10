import { IGDBGame } from '@/lib/igdb';

export function calculateCombinedScore(game: IGDBGame): number {
  const rating: number = game.total_rating || game.aggregated_rating || 0;
  const count: number = game.total_rating_count || game.aggregated_rating_count || 0;
  
  if (rating === 0 || count === 0) return 0;
  
  // Combined score = rating * ln(1 + count)
  // This gives weight to both rating quality and review volume
  return rating * Math.log(1 + count);
}

export function sortGamesByCombinedScore(games: IGDBGame[]): IGDBGame[] {
  return [...games].sort((a, b) => {
    const scoreA = calculateCombinedScore(a);
    const scoreB = calculateCombinedScore(b);
    return scoreB - scoreA;
  });
}

export function formatRating(rating?: number): string {
  if (!rating) return 'N/A';
  return Math.round(rating).toString();
}

export function getRatingStars(rating?: number): number {
  if (!rating) return 0;
  // Convert 0-100 rating to 0-5 stars
  return Math.round((rating / 100) * 5 * 2) / 2; // Round to nearest 0.5
}

export function formatRatingCount(count?: number): string {
  if (!count) return '';
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
}
