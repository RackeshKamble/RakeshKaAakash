type CacheEntry<T> = {
  value: T;
  expires: number;
};

export class CacheStore {
  private entries = new Map<string, CacheEntry<unknown>>();
  private ttl: number;

  constructor(ttl = 600000) {
    this.ttl = ttl;
  }

  get<T>(key: string): T | null {
    const entry = this.entries.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expires) {
      this.entries.delete(key);
      return null;
    }
    return entry.value;
  }

  set<T>(key: string, value: T) {
    this.entries.set(key, { value, expires: Date.now() + this.ttl });
  }
}

export const weatherCache = new CacheStore(10 * 60 * 1000);
