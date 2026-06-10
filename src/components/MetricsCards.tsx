import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import { useSimulationStore } from '../store/simulationStore';

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
}

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Container>
      <Box variant="awsui-key-label">{title}</Box>
      <Box variant="h1" fontSize="display-l" fontWeight="bold">
        {value}
      </Box>
      {description && (
        <Box variant="small" color="text-body-secondary">
          {description}
        </Box>
      )}
    </Container>
  );
}

export default function MetricsCards() {
  const { results, selectedAlgorithms, config, currentRequest } = useSimulationStore();

  if (Object.keys(results).length === 0) return null;

  const filtered = Object.entries(results).filter(([name]) =>
    selectedAlgorithms.includes(name)
  );

  const bestHit = filtered.reduce(
    (best, [name, m]) => {
      const ratio = m.totalRequests > 0 ? m.cacheHits / m.totalRequests : 0;
      return ratio > best.ratio ? { name, ratio } : best;
    },
    { name: '', ratio: 0 }
  );

  const bestResponse = filtered.reduce(
    (best, [name, m]) => {
      const avg = m.totalRequests > 0 ? m.totalResponseTime / m.totalRequests : Infinity;
      return avg < best.avg ? { name, avg } : best;
    },
    { name: '', avg: Infinity }
  );

  const totalLookups = filtered.reduce((sum, [, m]) => sum + m.dnsLookupCount, 0);

  const elapsed = filtered.length > 0
    ? (Date.now() - filtered[0][1].startTime) / 1000
    : 0;

  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 6, m: 3 } },
        { colspan: { default: 6, m: 3 } },
        { colspan: { default: 6, m: 3 } },
        { colspan: { default: 6, m: 3 } },
      ]}
    >
      <MetricCard
        title="최고 Hit Ratio"
        value={`${(bestHit.ratio * 100).toFixed(1)}%`}
        description={bestHit.name}
      />
      <MetricCard
        title="최적 응답시간"
        value={`${bestResponse.avg.toFixed(1)}ms`}
        description={bestResponse.name}
      />
      <MetricCard
        title="처리된 요청"
        value={`${currentRequest.toLocaleString()} / ${config.requestCount.toLocaleString()}`}
      />
      <MetricCard
        title="총 DNS Lookups"
        value={totalLookups.toLocaleString()}
        description={elapsed > 0 ? `${elapsed.toFixed(1)}초 경과` : undefined}
      />
    </Grid>
  );
}
