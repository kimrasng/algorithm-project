export interface DnsRecord {
  domain: string;
  ip: string;
  ttl: number;
  createdAt: number;
}

export interface CacheEntry {
  record: DnsRecord;
  lastAccessed: number;
  accessCount: number;
  insertedAt: number;
}

export interface LookupResult {
  domain: string;
  hit: boolean;
  responseTime: number;
  timestamp: number;
}

export interface AlgorithmMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  totalResponseTime: number;
  dnsLookupCount: number;
  memoryUsage: number;
  startTime: number;
  hitRatioHistory: Array<{ timestamp: number; ratio: number }>;
  responseTimeHistory: Array<{ timestamp: number; time: number }>;
}

export interface CacheAlgorithm {
  name: string;
  lookup(domain: string, currentTime: number): LookupResult;
  getMetrics(): AlgorithmMetrics;
  reset(): void;
  getSize(): number;
}

export type DistributionType = 'uniform' | 'zipf' | 'random';

export interface SimulationConfig {
  requestCount: number;
  domainCount: number;
  ttlValue: number;
  cacheSize: number;
  distribution: DistributionType;
}
