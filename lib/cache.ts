/**
 * Global in-memory cache wrapper per key (e.g., "all", "01", "02", "03", "04", "05")
 * to persist dashboard statistics across RT filter changes instantly.
 */
const globalForCache = globalThis as unknown as {
  statistikCacheMap: Map<string, any> | undefined;
};

if (!globalForCache.statistikCacheMap) {
  globalForCache.statistikCacheMap = new Map<string, any>();
}

export const getStatistikCache = (key: string = "all") => {
  return globalForCache.statistikCacheMap?.get(key) || null;
};

export const setStatistikCache = (key: string = "all", data: any) => {
  globalForCache.statistikCacheMap?.set(key, data);
};

export const clearStatistikCache = () => {
  globalForCache.statistikCacheMap?.clear();
};
