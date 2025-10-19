import { motion } from 'framer-motion';
import { useNetworkStore, DatasetType } from '@/store/networkStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const datasets: { type: DatasetType; name: string; emoji: string }[] = [
  { type: 'circles', name: 'Circle', emoji: '⭕' },
  { type: 'xor', name: 'XOR', emoji: '✖️' },
  { type: 'gauss', name: 'Gauss', emoji: '🎯' },
  { type: 'spiral', name: 'Spiral', emoji: '🌀' },
];

export const DataPanel = () => {
  const {
    dataset,
    noiseLevel,
    trainTestRatio,
    batchSize,
    showTestData,
    setDataset,
    setNoiseLevel,
    setTrainTestRatio,
    setBatchSize,
    setShowTestData,
  } = useNetworkStore();

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="bg-muted/50 rounded-xl px-3 py-2 border border-border">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">
          Data
        </h3>
        <p className="text-[10px] text-muted-foreground">
          Configure dataset
        </p>
      </div>

      {/* Dataset Selection */}
      <div className="grid grid-cols-2 gap-2">
        {datasets.map((ds) => (
          <Button
            key={ds.type}
            onClick={() => setDataset(ds.type)}
            variant={dataset === ds.type ? 'default' : 'outline'}
            className="h-auto py-3 flex-col gap-1"
          >
            <span className="text-xl">{ds.emoji}</span>
            <span className="text-xs font-medium">{ds.name}</span>
          </Button>
        ))}
      </div>

      {/* Noise */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-foreground">Noise</Label>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {noiseLevel}%
          </span>
        </div>
        <Slider
          value={[noiseLevel]}
          onValueChange={(v) => setNoiseLevel(v[0])}
          min={0}
          max={50}
          step={5}
          className="w-full"
        />
      </div>

      {/* Ratio of training to test data */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-foreground">Train/Test Ratio</Label>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {trainTestRatio}%
          </span>
        </div>
        <Slider
          value={[trainTestRatio]}
          onValueChange={(v) => setTrainTestRatio(v[0])}
          min={10}
          max={90}
          step={10}
          className="w-full"
        />
      </div>

      {/* Batch Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-foreground">Batch Size</Label>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {batchSize}
          </span>
        </div>
        <Slider
          value={[batchSize]}
          onValueChange={(v) => setBatchSize(v[0])}
          min={1}
          max={30}
          step={1}
          className="w-full"
        />
      </div>

      {/* Show test data */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Label className="text-xs font-medium text-foreground">Show test data</Label>
        <Switch checked={showTestData} onCheckedChange={setShowTestData} />
      </div>
    </motion.div>
  );
};
