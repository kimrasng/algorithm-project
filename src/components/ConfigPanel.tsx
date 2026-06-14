import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import Multiselect from '@cloudscape-design/components/multiselect';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useSimulationStore } from '../store/simulationStore';
import { DistributionType } from '../algorithms/types';

const distributionOptions = [
  { label: 'Zipf Distribution', value: 'zipf' },
  { label: 'Uniform Distribution', value: 'uniform' },
  { label: 'Random Distribution', value: 'random' },
];

const algorithmOptions = [
  { label: 'No Cache', value: 'No Cache' },
  { label: 'TTL Cache', value: 'TTL Cache' },
  { label: 'LRU Cache', value: 'LRU Cache' },
  { label: 'LFU Cache', value: 'LFU Cache' },
];

export default function ConfigPanel() {
  const { config, setConfig, isRunning, selectedAlgorithms, setSelectedAlgorithms } =
    useSimulationStore();

  return (
    <Container header={<Header variant="h2">시뮬레이션 설정</Header>}>
      <Form>
        <SpaceBetween size="l">
          <ColumnLayout columns={3} variant="text-grid">
            <FormField label="요청 개수" description="0 = 무한 (중지 버튼으로 종료)">
              <Input
                type="number"
                value={config.requestCount.toString()}
                onChange={({ detail }) =>
                  setConfig({ requestCount: Math.max(0, parseInt(detail.value) || 0) })
                }
                disabled={isRunning}
              />
            </FormField>
            <FormField label="도메인 수">
              <Input
                type="number"
                value={config.domainCount.toString()}
                onChange={({ detail }) =>
                  setConfig({ domainCount: Math.max(1, parseInt(detail.value) || 1) })
                }
                disabled={isRunning}
              />
            </FormField>
            <FormField label="요청 분포">
              <Select
                selectedOption={
                  distributionOptions.find((o) => o.value === config.distribution) ?? null
                }
                onChange={({ detail }) =>
                  setConfig({
                    distribution: detail.selectedOption.value as DistributionType,
                  })
                }
                options={distributionOptions}
                disabled={isRunning}
              />
            </FormField>
          </ColumnLayout>

          <ColumnLayout columns={3} variant="text-grid">
            <FormField label="캐시 크기">
              <Input
                type="number"
                value={config.cacheSize.toString()}
                onChange={({ detail }) =>
                  setConfig({ cacheSize: Math.max(1, parseInt(detail.value) || 1) })
                }
                disabled={isRunning}
              />
            </FormField>
            <FormField label="TTL 값 (ms)">
              <Input
                type="number"
                value={config.ttlValue.toString()}
                onChange={({ detail }) =>
                  setConfig({ ttlValue: Math.max(1, parseInt(detail.value) || 1) })
                }
                disabled={isRunning}
              />
            </FormField>
            <FormField label="비교 알고리즘">
              <Multiselect
                selectedOptions={algorithmOptions.filter((o) =>
                  selectedAlgorithms.includes(o.value)
                )}
                onChange={({ detail }) =>
                  setSelectedAlgorithms(
                    detail.selectedOptions.map((o) => o.value ?? '')
                  )
                }
                options={algorithmOptions}
                disabled={isRunning}
                placeholder="알고리즘 선택"
              />
            </FormField>
          </ColumnLayout>
        </SpaceBetween>
      </Form>
    </Container>
  );
}
