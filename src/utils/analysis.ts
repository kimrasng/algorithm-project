import { AlgorithmMetrics } from '../algorithms/types';

export function generateAnalysisReport(
  results: Record<string, AlgorithmMetrics>
): string {
  const entries = Object.entries(results);

  if (entries.length === 0) return '';

  const lines: string[] = [];
  lines.push('=== 시뮬레이션 분석 리포트 ===\n');

  const sorted = entries
    .map(([name, m]) => ({
      name,
      hitRatio: m.totalRequests > 0 ? m.cacheHits / m.totalRequests : 0,
      avgResponse: m.totalRequests > 0 ? m.totalResponseTime / m.totalRequests : 0,
      memory: m.memoryUsage,
      lookups: m.dnsLookupCount,
      throughput: m.totalRequests > 0
        ? m.totalRequests / ((Date.now() - m.startTime) / 1000)
        : 0,
    }))
    .sort((a, b) => b.hitRatio - a.hitRatio);

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  lines.push(`최고 Cache Hit Ratio: ${best.name} (${(best.hitRatio * 100).toFixed(1)}%)`);
  lines.push(`최저 Cache Hit Ratio: ${worst.name} (${(worst.hitRatio * 100).toFixed(1)}%)\n`);

  for (const s of sorted) {
    lines.push(`[${s.name}]`);
    lines.push(`  - Cache Hit Ratio: ${(s.hitRatio * 100).toFixed(1)}%`);
    lines.push(`  - 평균 응답시간: ${s.avgResponse.toFixed(2)}ms`);
    lines.push(`  - 메모리 사용량: ${s.memory} entries`);
    lines.push(`  - DNS Lookup 횟수: ${s.lookups}`);
    lines.push(`  - Throughput: ${s.throughput.toFixed(1)} queries/sec`);
    lines.push('');
  }

  const bestMem = sorted.reduce((a, b) => (a.memory > b.memory ? a : b));
  const bestResp = sorted.reduce((a, b) => (a.avgResponse < b.avgResponse ? a : b));

  lines.push('--- 종합 분석 ---');

  if (best.name !== 'No Cache') {
    lines.push(
      `${best.name}는 가장 높은 Cache Hit Ratio(${(best.hitRatio * 100).toFixed(1)}%)를 기록했습니다.`
    );
  }

  if (bestMem.name !== bestResp.name) {
    lines.push(
      `${bestResp.name}는 가장 빠른 평균 응답시간(${bestResp.avgResponse.toFixed(2)}ms)을 보였지만, ` +
        `${bestMem.name}는 가장 많은 메모리(${bestMem.memory} entries)를 사용했습니다.`
    );
  }

  const lru = sorted.find((s) => s.name === 'LRU Cache');
  if (lru) {
    lines.push(
      `LRU Cache는 응답시간(${lru.avgResponse.toFixed(2)}ms)과 메모리 사용량(${lru.memory} entries) 사이에서 균형 잡힌 성능을 보였습니다.`
    );
  }

  return lines.join('\n');
}
