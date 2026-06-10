import { CacheAlgorithm, AlgorithmMetrics, LookupResult } from './types';

const DNS_LOOKUP_TIME = 100;

export class NoCache implements CacheAlgorithm {
  name = 'No Cache';
  private metrics: AlgorithmMetrics;

  constructor() {
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
    const responseTime = DNS_LOOKUP_TIME + Math.random() * 50;

    this.metrics.totalRequests++;
    this.metrics.cacheMisses++;
    this.metrics.dnsLookupCount++;
    this.metrics.totalResponseTime += responseTime;

    const ratio = this.metrics.cacheHits / this.metrics.totalRequests;
    this.metrics.hitRatioHistory.push({ timestamp: currentTime, ratio });
    this.metrics.responseTimeHistory.push({ timestamp: currentTime, time: responseTime });

    return { domain, hit: false, responseTime, timestamp: currentTime };
  }

  getMetrics(): AlgorithmMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = this.createEmptyMetrics();
  }

  getSize(): number {
    return 0;
  }
}
