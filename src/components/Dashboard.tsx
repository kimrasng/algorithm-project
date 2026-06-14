import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import { useSimulationStore } from '../store/simulationStore';
import ConfigPanel from './ConfigPanel';
import ResponseTimeChart from './charts/ResponseTimeChart';
import HitRatioChart from './charts/HitRatioChart';
import HitRatioLineChart from './charts/HitRatioLineChart';
import ResponseTimeLineChart from './charts/ResponseTimeLineChart';
import HitMissPieChart from './charts/HitMissPieChart';
import AnalysisReport from './AnalysisReport';
import MetricsCards from './MetricsCards';
import ActionBar from './ActionBar';

export default function Dashboard() {
  const { isRunning, progress, currentRequest, config } = useSimulationStore();

  return (
    <div id="dashboard-content">
      <SpaceBetween size="l">
        <ConfigPanel />
        <ActionBar />

        {isRunning && config.requestCount > 0 && (
          <Container>
            <ProgressBar
              value={progress}
              label="시뮬레이션 진행 상황"
              description={`${currentRequest.toLocaleString()} / ${config.requestCount.toLocaleString()} 요청 처리 중`}
              status="in-progress"
            />
          </Container>
        )}

        <MetricsCards />

        <Grid
          gridDefinition={[
            { colspan: { default: 12, m: 6 } },
            { colspan: { default: 12, m: 6 } },
          ]}
        >
          <Container header={<Header variant="h2">평균 응답시간 비교</Header>}>
            <ResponseTimeChart />
          </Container>
          <Container header={<Header variant="h2">Cache Hit Ratio 비교</Header>}>
            <HitRatioChart />
          </Container>
        </Grid>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, m: 6 } },
            { colspan: { default: 12, m: 6 } },
          ]}
        >
          <Container header={<Header variant="h2">시간별 Hit Ratio 변화</Header>}>
            <HitRatioLineChart />
          </Container>
          <Container header={<Header variant="h2">시간별 응답시간 변화</Header>}>
            <ResponseTimeLineChart />
          </Container>
        </Grid>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, m: 6 } },
            { colspan: { default: 12, m: 6 } },
          ]}
        >
          <HitMissPieChart />
          <AnalysisReport />
        </Grid>
      </SpaceBetween>
    </div>
  );
}
