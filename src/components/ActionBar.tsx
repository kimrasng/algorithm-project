import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { useSimulationStore } from '../store/simulationStore';
import { runSimulation, abortSimulation } from '../hooks/useSimulation';

export default function ActionBar() {
  const { isRunning, config } = useSimulationStore();

  const handleStart = () => {
    runSimulation(config);
  };

  return (
    <SpaceBetween direction="horizontal" size="s">
      {!isRunning ? (
        <Button variant="primary" onClick={handleStart}>
          시뮬레이션 시작
        </Button>
      ) : (
        <Button variant="normal" onClick={abortSimulation}>
          중지
        </Button>
      )}
    </SpaceBetween>
  );
}
