import { NoCache, TTLCache, LRUCache, LFUCache, CacheAlgorithm, SimulationConfig } from '../algorithms';
import { generateRequests } from '../utils/distribution';
import { generateAnalysisReport } from '../utils/analysis';
import { useSimulationStore } from '../store/simulationStore';

let abortFlag = false;

export function abortSimulation(): void {
  abortFlag = true;
}

export async function runSimulation(config: SimulationConfig): Promise<void> {
  abortFlag = false;
  const store = useSimulationStore.getState();
  store.reset();
  store.setRunning(true);

  const algorithms: CacheAlgorithm[] = [
    new NoCache(),
    new TTLCache(config.ttlValue, config.cacheSize),
    new LRUCache(config.cacheSize),
    new LFUCache(config.cacheSize),
  ];

  const requests = generateRequests(config.domainCount, config.requestCount, config.distribution);
  const batchSize = Math.max(1, Math.floor(config.requestCount / 100));
  let currentTime = 0;

  for (let i = 0; i < requests.length; i++) {
    if (abortFlag) {
      store.setRunning(false);
      return;
    }

    const domain = requests[i];
    currentTime += 10;

    for (const algo of algorithms) {
      algo.lookup(domain, currentTime);
    }

    if (i % batchSize === 0 || i === requests.length - 1) {
      const progress = ((i + 1) / requests.length) * 100;
      const results: Record<string, ReturnType<CacheAlgorithm['getMetrics']>> = {};
      for (const algo of algorithms) {
        results[algo.name] = algo.getMetrics();
      }

      const hitRatioPoint = {
        timestamp: currentTime,
        noCache: results['No Cache'].totalRequests > 0
          ? results['No Cache'].cacheHits / results['No Cache'].totalRequests
          : 0,
        ttlCache: results['TTL Cache'].totalRequests > 0
          ? results['TTL Cache'].cacheHits / results['TTL Cache'].totalRequests
          : 0,
        lruCache: results['LRU Cache'].totalRequests > 0
          ? results['LRU Cache'].cacheHits / results['LRU Cache'].totalRequests
          : 0,
        lfuCache: results['LFU Cache'].totalRequests > 0
          ? results['LFU Cache'].cacheHits / results['LFU Cache'].totalRequests
          : 0,
      };

      const responseTimePoint = {
        timestamp: currentTime,
        noCache: results['No Cache'].totalRequests > 0
          ? results['No Cache'].totalResponseTime / results['No Cache'].totalRequests
          : 0,
        ttlCache: results['TTL Cache'].totalRequests > 0
          ? results['TTL Cache'].totalResponseTime / results['TTL Cache'].totalRequests
          : 0,
        lruCache: results['LRU Cache'].totalRequests > 0
          ? results['LRU Cache'].totalResponseTime / results['LRU Cache'].totalRequests
          : 0,
        lfuCache: results['LFU Cache'].totalRequests > 0
          ? results['LFU Cache'].totalResponseTime / results['LFU Cache'].totalRequests
          : 0,
      };

      store.setProgress(progress);
      store.setCurrentRequest(i + 1);
      store.updateResults(results);
      store.appendTimeSeries(hitRatioPoint, responseTimePoint);

      await new Promise((resolve) => setTimeout(resolve, 16));
    }
  }

  const finalResults: Record<string, ReturnType<CacheAlgorithm['getMetrics']>> = {};
  for (const algo of algorithms) {
    finalResults[algo.name] = algo.getMetrics();
  }
  store.updateResults(finalResults);

  const report = generateAnalysisReport(finalResults);
  store.setAnalysisReport(report);
  store.setRunning(false);
}
