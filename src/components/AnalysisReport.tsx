import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import { useSimulationStore } from '../store/simulationStore';

export default function AnalysisReport() {
  const { analysisReport } = useSimulationStore();

  return (
    <Container header={<Header variant="h2">분석 리포트</Header>}>
      <div style={{ height: 310, overflowY: 'auto' }}>
        {analysisReport ? (
          <Box>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, lineHeight: '1.6' }}>
              {analysisReport}
            </pre>
          </Box>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
            시뮬레이션 완료 후 분석 리포트가 생성됩니다
          </div>
        )}
      </div>
    </Container>
  );
}
