import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNetworkStore } from '@/store/networkStore';

export const PlaygroundControls = () => {
  const { 
    isTraining, 
    epoch, 
    trainLoss, 
    testLoss,
    setTraining, 
    setEpoch,
    resetNetwork,
    regenerateData,
  } = useNetworkStore();

  const handleStep = () => {
    setEpoch(epoch + 1);
  };

  return (
    <motion.div
      className="bg-card border-2 border-border rounded-2xl p-5 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Play Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTraining(!isTraining)}
            size="lg"
            variant={isTraining ? "secondary" : "default"}
            className="h-12 px-6"
          >
            {isTraining ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>

          <Button
            onClick={handleStep}
            size="lg"
            variant="outline"
            disabled={isTraining}
            className="h-12 px-4"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Step
          </Button>

          <Button
            onClick={resetNetwork}
            size="lg"
            variant="outline"
            className="h-12 px-4"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={regenerateData}
            size="lg"
            variant="outline"
            className="h-12 px-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>

        {/* Metrics Display */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Epoch
            </p>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {epoch}
            </p>
          </div>

          <div className="h-12 w-px bg-border" />

          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Train Loss
            </p>
            <p className="text-2xl font-bold text-negative tabular-nums">
              {trainLoss.toFixed(3)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Test Loss
            </p>
            <p className="text-2xl font-bold text-primary tabular-nums">
              {testLoss.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
