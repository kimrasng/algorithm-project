import { create } from 'zustand';
import { AlgorithmMetrics, DistributionType, SimulationConfig } from '../algorithms/types';

interface TimeSeriesPoint {
  timestamp: number;
  noCache: number;
  ttlCache: number;
  lruCache: number;
  lfuCache: number;
}

interface SimulationStore {
  config: SimulationConfig;
  isRunning: boolean;
  progress: number;
  currentRequest: number;
  results: Record<string, AlgorithmMetrics>;
  hitRatioTimeSeries: TimeSeriesPoint[];
  responseTimeTimeSeries: TimeSeriesPoint[];
  analysisReport: string;
  darkMode: boolean;
  selectedAlgorithms: string[];

  setConfig: (config: Partial<SimulationConfig>) => void;
  setRunning: (running: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentRequest: (n: number) => void;
  updateResults: (results: Record<string, AlgorithmMetrics>) => void;
  appendTimeSeries: (hitRatio: TimeSeriesPoint, responseTime: TimeSeriesPoint) => void;
  setAnalysisReport: (report: string) => void;
  toggleDarkMode: () => void;
  setSelectedAlgorithms: (algos: string[]) => void;
  reset: () => void;
}

const defaultConfig: SimulationConfig = {
  requestCount: 1000,
  domainCount: 50,
  ttlValue: 300,
  cacheSize: 20,
  distribution: 'zipf' as DistributionType,
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  config: defaultConfig,
  isRunning: false,
  progress: 0,
  currentRequest: 0,
  results: {},
  hitRatioTimeSeries: [],
  responseTimeTimeSeries: [],
  analysisReport: '',
  darkMode: false,
  selectedAlgorithms: ['No Cache', 'TTL Cache', 'LRU Cache', 'LFU Cache'],

  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  setRunning: (running) => set({ isRunning: running }),

  setProgress: (progress) => set({ progress }),

  setCurrentRequest: (n) => set({ currentRequest: n }),

  updateResults: (results) => set({ results }),

  appendTimeSeries: (hitRatio, responseTime) =>
    set((state) => ({
      hitRatioTimeSeries: [...state.hitRatioTimeSeries, hitRatio].slice(-200),
      responseTimeTimeSeries: [...state.responseTimeTimeSeries, responseTime].slice(-200),
    })),

  setAnalysisReport: (report) => set({ analysisReport: report }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setSelectedAlgorithms: (algos) => set({ selectedAlgorithms: algos }),

  reset: () =>
    set({
      isRunning: false,
      progress: 0,
      currentRequest: 0,
      results: {},
      hitRatioTimeSeries: [],
      responseTimeTimeSeries: [],
      analysisReport: '',
    }),
}));
