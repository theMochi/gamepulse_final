export function getIGDBImageUrl(
  imageId: string, 
  size: 'cover_small' | 'cover_big' | 'cover_big_2x' | 'screenshot_med' | 'screenshot_big' | 'screenshot_huge' | 'thumb' = 'cover_big'
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

export function getGameCoverUrl(imageId?: string): string {
  if (!imageId) {
    // Return a placeholder image URL or empty string
    return '/placeholder-game-cover.svg';
  }
  
  return getIGDBImageUrl(imageId, 'cover_big');
}

export function getGameCoverSmallUrl(imageId?: string): string {
  if (!imageId) {
    return '/placeholder-game-cover.svg';
  }
  
  return getIGDBImageUrl(imageId, 'cover_small');
}

export function getGameCoverLargeUrl(imageId?: string): string {
  if (!imageId) {
    return '/placeholder-game-cover.svg';
  }
  
  return getIGDBImageUrl(imageId, 'cover_big_2x');
}

export function getScreenshotUrl(imageId?: string, size: 'screenshot_med' | 'screenshot_big' | 'screenshot_huge' = 'screenshot_huge'): string {
  if (!imageId) {
    return '/placeholder-game-cover.svg';
  }
  
  return getIGDBImageUrl(imageId, size);
}

export function getThumbnailUrl(imageId?: string): string {
  if (!imageId) {
    return '/placeholder-game-cover.svg';
  }
  
  return getIGDBImageUrl(imageId, 'thumb');
}
