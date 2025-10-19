import { motion } from 'framer-motion';
import { useNetworkStore, ActivationType, RegularizationType, ProblemType } from '@/store/networkStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export const TopControls = () => {
  const {
    learningRate,
    activation,
    regularization,
    regularizationRate,
    problemType,
    setLearningRate,
    setActivation,
    setRegularization,
    setRegularizationRate,
    setProblemType,
  } = useNetworkStore();

  return (
    <motion.div
      className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {/* Learning Rate */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Learning Rate
          </Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[learningRate]}
              onValueChange={(v) => setLearningRate(v[0])}
              min={0.00001}
              max={10}
              step={0.00001}
              className="flex-1"
            />
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded min-w-[60px] text-center">
              {learningRate.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Activation */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Activation
          </Label>
          <Select value={activation} onValueChange={(v) => setActivation(v as ActivationType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relu">ReLU</SelectItem>
              <SelectItem value="tanh">Tanh</SelectItem>
              <SelectItem value="sigmoid">Sigmoid</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Regularization */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Regularization
          </Label>
          <Select value={regularization} onValueChange={(v) => setRegularization(v as RegularizationType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="L1">L1</SelectItem>
              <SelectItem value="L2">L2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Regularization Rate */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Reg. Rate
          </Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[regularizationRate]}
              onValueChange={(v) => setRegularizationRate(v[0])}
              min={0}
              max={0.1}
              step={0.001}
              disabled={regularization === 'none'}
              className="flex-1"
            />
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded min-w-[50px] text-center">
              {regularizationRate.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Problem Type */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Problem Type
          </Label>
          <Select value={problemType} onValueChange={(v) => setProblemType(v as ProblemType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classification">Classification</SelectItem>
              <SelectItem value="regression">Regression</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};
