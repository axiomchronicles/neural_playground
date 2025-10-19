import { create } from 'zustand';

export type ActivationType = 'relu' | 'sigmoid' | 'tanh' | 'linear';
export type DatasetType = 'circles' | 'spiral' | 'xor' | 'linear' | 'gauss' | 'exclusive';
export type ProblemType = 'classification' | 'regression';
export type RegularizationType = 'none' | 'L1' | 'L2';

export interface Layer {
  id: string;
  neurons: number;
  activation: ActivationType;
}

export interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  formula: string;
}

export interface TrainingHistory {
  epoch: number;
  trainLoss: number;
  testLoss: number;
}

export interface NetworkState {
  // Network Architecture
  layers: Layer[];
  hiddenLayers: Layer[];
  
  // Training State
  isTraining: boolean;
  epoch: number;
  trainLoss: number;
  testLoss: number;
  
  // Hyperparameters
  learningRate: number;
  activation: ActivationType;
  regularization: RegularizationType;
  regularizationRate: number;
  batchSize: number;
  
  // Data Configuration
  dataset: DatasetType;
  problemType: ProblemType;
  noiseLevel: number;
  trainTestRatio: number;
  
  // Features
  features: Feature[];
  
  // Visualization
  trainingHistory: TrainingHistory[];
  showTestData: boolean;
  discretizeOutput: boolean;
  playbackSpeed: number;
  showValues: boolean;
  
  // Actions
  addHiddenLayer: () => void;
  removeHiddenLayer: (id: string) => void;
  updateHiddenLayer: (id: string, neurons: number) => void;
  setTraining: (training: boolean) => void;
  setEpoch: (epoch: number) => void;
  setTrainLoss: (loss: number) => void;
  setTestLoss: (loss: number) => void;
  setLearningRate: (rate: number) => void;
  setActivation: (activation: ActivationType) => void;
  setRegularization: (type: RegularizationType) => void;
  setRegularizationRate: (rate: number) => void;
  setBatchSize: (size: number) => void;
  setDataset: (dataset: DatasetType) => void;
  setProblemType: (type: ProblemType) => void;
  setNoiseLevel: (noise: number) => void;
  setTrainTestRatio: (ratio: number) => void;
  toggleFeature: (id: string) => void;
  addToHistory: (entry: TrainingHistory) => void;
  setShowTestData: (show: boolean) => void;
  setDiscretizeOutput: (discretize: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setShowValues: (show: boolean) => void;
  resetNetwork: () => void;
  regenerateData: () => void;
}

const createDefaultFeatures = (): Feature[] => [
  { id: 'x1', name: 'X₁', enabled: true, formula: 'x1' },
  { id: 'x2', name: 'X₂', enabled: true, formula: 'x2' },
  { id: 'x1sq', name: 'X₁²', enabled: false, formula: 'x1^2' },
  { id: 'x2sq', name: 'X₂²', enabled: false, formula: 'x2^2' },
  { id: 'x1x2', name: 'X₁X₂', enabled: false, formula: 'x1*x2' },
  { id: 'sinx1', name: 'sin(X₁)', enabled: false, formula: 'sin(x1)' },
  { id: 'sinx2', name: 'sin(X₂)', enabled: false, formula: 'sin(x2)' },
];

const createDefaultHiddenLayers = (): Layer[] => [
  { id: '1', neurons: 4, activation: 'tanh' },
  { id: '2', neurons: 2, activation: 'tanh' },
];

export const useNetworkStore = create<NetworkState>((set) => ({
  // Initial state
  layers: [],
  hiddenLayers: createDefaultHiddenLayers(),
  isTraining: false,
  epoch: 0,
  trainLoss: 0.5,
  testLoss: 0.5,
  learningRate: 0.03,
  activation: 'tanh',
  regularization: 'none',
  regularizationRate: 0,
  batchSize: 10,
  dataset: 'circles',
  problemType: 'classification',
  noiseLevel: 0,
  trainTestRatio: 50,
  features: createDefaultFeatures(),
  trainingHistory: [],
  showTestData: true,
  discretizeOutput: false,
  playbackSpeed: 1,
  showValues: true,
  
  // Actions
  addHiddenLayer: () =>
    set((state) => ({
      hiddenLayers: [...state.hiddenLayers, { 
        id: Date.now().toString(), 
        neurons: 4, 
        activation: state.activation 
      }],
    })),
    
  removeHiddenLayer: (id) =>
    set((state) => ({
      hiddenLayers: state.hiddenLayers.filter((layer) => layer.id !== id),
    })),
    
  updateHiddenLayer: (id, neurons) =>
    set((state) => ({
      hiddenLayers: state.hiddenLayers.map((layer) =>
        layer.id === id ? { ...layer, neurons } : layer
      ),
    })),
    
  setTraining: (training) => set({ isTraining: training }),
  setEpoch: (epoch) => set({ epoch }),
  setTrainLoss: (loss) => set({ trainLoss: loss }),
  setTestLoss: (loss) => set({ testLoss: loss }),
  setLearningRate: (rate) => set({ learningRate: rate }),
  setActivation: (activation) => 
    set((state) => ({ 
      activation,
      hiddenLayers: state.hiddenLayers.map(layer => ({ ...layer, activation }))
    })),
  setRegularization: (type) => set({ regularization: type }),
  setRegularizationRate: (rate) => set({ regularizationRate: rate }),
  setBatchSize: (size) => set({ batchSize: size }),
  setDataset: (dataset) => set({ dataset, trainingHistory: [], epoch: 0 }),
  setProblemType: (type) => set({ problemType: type }),
  setNoiseLevel: (noise) => set({ noiseLevel: noise }),
  setTrainTestRatio: (ratio) => set({ trainTestRatio: ratio }),
  
  toggleFeature: (id) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      ),
    })),
    
  addToHistory: (entry) =>
    set((state) => ({
      trainingHistory: [...state.trainingHistory.slice(-199), entry],
    })),
    
  setShowTestData: (show) => set({ showTestData: show }),
  setDiscretizeOutput: (discretize) => set({ discretizeOutput: discretize }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setShowValues: (show) => set({ showValues: show }),
  
  resetNetwork: () =>
    set({
      hiddenLayers: createDefaultHiddenLayers(),
      epoch: 0,
      trainLoss: 0.5,
      testLoss: 0.5,
      isTraining: false,
      trainingHistory: [],
    }),
    
  regenerateData: () =>
    set({
      epoch: 0,
      trainLoss: 0.5,
      testLoss: 0.5,
      trainingHistory: [],
    }),
}));
