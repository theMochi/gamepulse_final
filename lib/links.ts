export function buildGamesUrl(params: {
  genreIds?: number[];
  platformIds?: number[];
  developerCompanyId?: number;
  minRating?: number;
  sort?: string;
}): string {
  const url = new URL('/games', typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin);
  
  if (params.genreIds?.length) {
    url.searchParams.set('genreIds', params.genreIds.join(','));
  }
  
  if (params.platformIds?.length) {
    url.searchParams.set('platformIds', params.platformIds.join(','));
  }
  
  if (params.developerCompanyId) {
    url.searchParams.set('developerCompanyId', String(params.developerCompanyId));
  }
  
  if (typeof params.minRating === 'number') {
    url.searchParams.set('minRating', String(params.minRating));
  }
  
  url.searchParams.set('sort', params.sort ?? 'hot');
  
  return url.pathname + url.search;
}
