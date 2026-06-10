import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useSimulationStore } from '../../store/simulationStore';

const COLORS: Record<string, string> = {
  'No Cache': '#ff6b6b',
  'TTL Cache': '#feca57',
  'LRU Cache': '#48dbfb',
  'LFU Cache': '#ff9ff3',
};

export default function ResponseTimeChart() {
  const { results, selectedAlgorithms } = useSimulationStore();

  const data = Object.entries(results)
    .filter(([name]) => selectedAlgorithms.includes(name))
    .map(([name, m]) => ({
      name,
      avgResponseTime:
        m.totalRequests > 0
          ? parseFloat((m.totalResponseTime / m.totalRequests).toFixed(2))
          : 0,
    }));

  if (data.length === 0) {
    return <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>시뮬레이션 실행 후 결과가 표시됩니다</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit="ms" />
        <Tooltip formatter={(value: number) => [`${value}ms`, '평균 응답시간']} />
        <Legend />
        <Bar
          dataKey="avgResponseTime"
          name="평균 응답시간 (ms)"
          fill="#48dbfb"
          radius={[4, 4, 0, 0]}
          label={{ position: 'top', formatter: (v: number) => `${v}ms` }}
        >
          {data.map((entry, index) => (
            <rect key={index} fill={COLORS[entry.name] || '#48dbfb'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
