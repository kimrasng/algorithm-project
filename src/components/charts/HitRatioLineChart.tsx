import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useSimulationStore } from '../../store/simulationStore';

const COLORS: Record<string, string> = {
  noCache: '#ff6b6b',
  ttlCache: '#feca57',
  lruCache: '#48dbfb',
  lfuCache: '#ff9ff3',
};

const LABELS: Record<string, string> = {
  noCache: 'No Cache',
  ttlCache: 'TTL Cache',
  lruCache: 'LRU Cache',
  lfuCache: 'LFU Cache',
};

export default function HitRatioLineChart() {
  const { hitRatioTimeSeries, selectedAlgorithms } = useSimulationStore();

  if (hitRatioTimeSeries.length === 0) {
    return <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>시뮬레이션 실행 후 결과가 표시됩니다</div>;
  }

  const keyMap: Record<string, string> = {
    'No Cache': 'noCache',
    'TTL Cache': 'ttlCache',
    'LRU Cache': 'lruCache',
    'LFU Cache': 'lfuCache',
  };

  const activeKeys = selectedAlgorithms
    .map((name) => keyMap[name])
    .filter(Boolean);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={hitRatioTimeSeries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}s`} />
        <YAxis domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
        <Tooltip
          labelFormatter={(v: number) => `Time: ${(v / 1000).toFixed(1)}s`}
          formatter={(value: number, name: string) => [
            `${(value * 100).toFixed(1)}%`,
            LABELS[name] || name,
          ]}
        />
        <Legend formatter={(value: string) => LABELS[value] || value} />
        {activeKeys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[key]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
