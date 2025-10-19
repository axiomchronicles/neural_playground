import { motion } from 'framer-motion';
import { useNetworkStore } from '@/store/networkStore';
import { Button } from '@/components/ui/button';

export const FeaturesPanel = () => {
  const { features, toggleFeature } = useNetworkStore();
  const enabledCount = features.filter(f => f.enabled).length;

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="bg-muted/50 rounded-xl px-3 py-2 border border-border">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">
          Features
        </h3>
        <p className="text-[10px] text-muted-foreground">
          {enabledCount} of {features.length} active
        </p>
      </div>

      <div className="space-y-2">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Button
              onClick={() => toggleFeature(feature.id)}
              variant={feature.enabled ? 'default' : 'outline'}
              className="w-full h-auto py-3 px-4 justify-start relative overflow-hidden group"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-2 h-2 rounded-full transition-all ${
                  feature.enabled ? 'bg-primary-foreground shadow-lg' : 'bg-muted-foreground/30'
                }`} />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{feature.name}</div>
                  <div className="text-[10px] opacity-70 font-mono">{feature.formula}</div>
                </div>
              </div>
              {feature.enabled && (
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'linear',
                  }}
                />
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
