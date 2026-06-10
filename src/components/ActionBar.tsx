import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { useSimulationStore } from '../store/simulationStore';
import { runSimulation, abortSimulation } from '../hooks/useSimulation';
import { exportToCsv, exportDetailedCsv, saveScreenshot } from '../utils/export';

export default function ActionBar() {
  const { isRunning, config, results } = useSimulationStore();
  const hasResults = Object.keys(results).length > 0;

  const handleStart = () => {
    const count = config.requestCount === 0 ? 10000 : config.requestCount;
    runSimulation({ ...config, requestCount: Math.max(1000, count) });
  };

  return (
    <SpaceBetween direction="horizontal" size="s">
      {!isRunning ? (
        <Button variant="primary" onClick={handleStart}>
          ▶ 시뮬레이션 시작
        </Button>
      ) : (
        <Button variant="normal" onClick={abortSimulation}>
          ⏹ 중지
        </Button>
      )}
      <Button disabled={!hasResults || isRunning} onClick={() => exportToCsv(results)}>
        CSV 다운로드 (요약)
      </Button>
      <Button disabled={!hasResults || isRunning} onClick={() => exportDetailedCsv(results)}>
        CSV 다운로드 (상세)
      </Button>
      <Button disabled={!hasResults || isRunning} onClick={saveScreenshot}>
        스크린샷 저장
      </Button>
    </SpaceBetween>
  );
}
