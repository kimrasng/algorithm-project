import { CacheAlgorithm, AlgorithmMetrics, LookupResult, CacheEntry } from './types';

const DNS_LOOKUP_TIME = 100;
const CACHE_HIT_TIME = 5;

export class TTLCache implements CacheAlgorithm {
  name = 'TTL Cache';
  private cache: Map<string, CacheEntry> = new Map();
  private metrics: AlgorithmMetrics;
  private ttl: number;
  private maxSize: number;

  constructor(ttl: number, maxSize: number) {
    this.ttl = ttl;
    this.maxSize = maxSize;
    this.metrics = this.createEmptyMetrics();
  }

  private createEmptyMetrics(): AlgorithmMetrics {
    return {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalResponseTime: 0,
      dnsLookupCount: 0,
      memoryUsage: 0,
      startTime: Date.now(),
      hitRatioHistory: [],
      responseTimeHistory: [],
    };
  }

  lookup(domain: string, currentTime: number): LookupResult {
    this.metrics.totalRequests++;
    const entry = this.cache.get(domain);

    if (entry && (currentTime - entry.record.createdAt) < this.ttl) {
      const responseTime = CACHE_HIT_TIME + Math.random() * 3;
      this.metrics.cacheHits++;
      this.metrics.totalResponseTime += responseTime;
      entry.lastAccessed = currentTime;
      entry.accessCount++;

      this.recordHistory(currentTime, responseTime);
      return { domain, hit: true, responseTime, timestamp: currentTime };
    }

    const responseTime = DNS_LOOKUP_TIME + Math.random() * 50;
    this.metrics.cacheMisses++;
    this.metrics.dnsLookupCount++;
    this.metrics.totalResponseTime += responseTime;

    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.findOldestEntry();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(domain, {
      record: { domain, ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, ttl: this.ttl, createdAt: currentTime },
      lastAccessed: currentTime,
      accessCount: 1,
      insertedAt: currentTime,
    });

    this.metrics.memoryUsage = this.cache.size;
    this.recordHistory(currentTime, responseTime);
    return { domain, hit: false, responseTime, timestamp: currentTime };
  }

  private findOldestEntry(): string | null {
    let oldest: string | null = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this.cache) {
      if (entry.insertedAt < oldestTime) {
        oldestTime = entry.insertedAt;
        oldest = key;
      }
    }
    return oldest;
  }

  private recordHistory(currentTime: number, responseTime: number): void {
    const ratio = this.metrics.cacheHits / this.metrics.totalRequests;
    this.metrics.hitRatioHistory.push({ timestamp: currentTime, ratio });
    this.metrics.responseTimeHistory.push({ timestamp: currentTime, time: responseTime });
  }

  getMetrics(): AlgorithmMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.cache.clear();
    this.metrics = this.createEmptyMetrics();
  }

  getSize(): number {
    return this.cache.size;
  }
}
