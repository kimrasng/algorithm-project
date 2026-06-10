import { AlgorithmMetrics } from '../algorithms/types';

export function exportToCsv(results: Record<string, AlgorithmMetrics>): void {
  const headers = [
    'Algorithm',
    'Total Requests',
    'Cache Hits',
    'Cache Misses',
    'Hit Ratio (%)',
    'Avg Response Time (ms)',
    'DNS Lookups',
    'Memory Usage (entries)',
    'Throughput (q/s)',
  ];

  const rows = Object.entries(results).map(([name, m]) => {
    const hitRatio = m.totalRequests > 0 ? ((m.cacheHits / m.totalRequests) * 100).toFixed(2) : '0';
    const avgResponse = m.totalRequests > 0 ? (m.totalResponseTime / m.totalRequests).toFixed(2) : '0';
    const throughput = m.totalRequests > 0
      ? (m.totalRequests / ((Date.now() - m.startTime) / 1000)).toFixed(2)
      : '0';

    return [
      name,
      m.totalRequests.toString(),
      m.cacheHits.toString(),
      m.cacheMisses.toString(),
      hitRatio,
      avgResponse,
      m.dnsLookupCount.toString(),
      m.memoryUsage.toString(),
      throughput,
    ];
  });

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  downloadFile(csvContent, 'dns-simulation-results.csv', 'text/csv');
}

export function exportDetailedCsv(results: Record<string, AlgorithmMetrics>): void {
  const headers = ['Algorithm', 'Timestamp', 'Hit Ratio', 'Response Time (ms)'];
  const rows: string[][] = [];

  for (const [name, m] of Object.entries(results)) {
    const maxLen = Math.max(m.hitRatioHistory.length, m.responseTimeHistory.length);
    for (let i = 0; i < maxLen; i++) {
      const hr = m.hitRatioHistory[i];
      const rt = m.responseTimeHistory[i];
      rows.push([
        name,
        (hr?.timestamp ?? rt?.timestamp ?? 0).toString(),
        (hr?.ratio ?? 0).toFixed(4),
        (rt?.time ?? 0).toFixed(2),
      ]);
    }
  }

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  downloadFile(csvContent, 'dns-simulation-detailed.csv', 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function saveScreenshot(): void {
  import('html2canvas').then(({ default: html2canvas }) => {
    const el = document.getElementById('dashboard-content');
    if (!el) return;
    html2canvas(el).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'dns-simulation-screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });
}
