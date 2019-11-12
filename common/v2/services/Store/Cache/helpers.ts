export const cachedValueIsFresh = (cached: any): boolean =>
  cached && (Date.now() < cached.ttl || cached.ttl === -1);
