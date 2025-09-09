export function epochToDate(epoch: number): Date {
  return new Date(epoch * 1000);
}

export function dateToEpoch(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function formatReleaseDate(epoch?: number): string {
  if (!epoch) return 'TBA';
  
  const date = epochToDate(epoch);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatReleaseDateShort(epoch?: number): string {
  if (!epoch) return 'TBA';
  
  const date = epochToDate(epoch);
  const now = new Date();
  const isThisYear = date.getFullYear() === now.getFullYear();
  
  if (isThisYear) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function isComingSoon(epoch?: number): boolean {
  if (!epoch) return false;
  return epoch > Math.floor(Date.now() / 1000);
}

export function getYear2025Range(): { start: number; end: number } {
  return {
    start: 1735689600, // Jan 1, 2025 00:00:00 UTC
    end: 1767225600,   // Dec 31, 2025 23:59:59 UTC
  };
}
