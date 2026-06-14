import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Tabs from '@cloudscape-design/components/tabs';
import { useSimulationStore } from '../../store/simulationStore';

const HIT_COLOR = '#00d2d3';
const MISS_COLOR = '#ee5a24';

export default function HitMissPieChart() {
  const { results, selectedAlgorithms } = useSimulationStore();

  const algos = Object.entries(results).filter(([name]) =>
    selectedAlgorithms.includes(name)
  );

  if (algos.length === 0) {
    return (
      <Container header={<Header variant="h2">Hit / Miss 비율</Header>}>
        <div style={{ height: 310, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          시뮬레이션 실행 후 결과가 표시됩니다
        </div>
      </Container>
    );
  }

  const tabs = algos.map(([name, m]) => {
    const data = [
      { name: 'Hit', value: m.cacheHits },
      { name: 'Miss', value: m.cacheMisses },
    ];

    return {
      id: name,
      label: name,
      content: (
        <ResponsiveContainer width="100%" height={262}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name: n, percent }) => `${n}: ${(percent * 100).toFixed(1)}%`}
            >
              <Cell fill={HIT_COLOR} />
              <Cell fill={MISS_COLOR} />
            </Pie>
            <Tooltip formatter={(value: number, n: string) => [value.toLocaleString(), n]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ),
    };
  });

  return (
    <Container header={<Header variant="h2">Hit / Miss 비율</Header>}>
      <div style={{ height: 310 }}>
        <Tabs tabs={tabs} />
      </div>
    </Container>
  );
}
