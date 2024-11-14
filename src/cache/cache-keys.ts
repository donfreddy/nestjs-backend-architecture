export enum DynamicCacheKey {
  BLOG = 'blog',
  BLOGS_SIMILAR = 'blogs_similar',
}

export type DynamicCacheKeyType = `${DynamicCacheKey}_${string}`;

export function getDynamicCacheKey(key: DynamicCacheKey, suffix: string) {
  return `${key}_${suffix}` as DynamicCacheKeyType;
}
