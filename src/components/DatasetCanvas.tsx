import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNetworkStore, DatasetType } from '@/store/networkStore';

interface DataPoint {
  x: number;
  y: number;
  label: number;
  isTest: boolean;
}

const generateDataset = (type: DatasetType, noise: number, trainTestRatio: number): DataPoint[] => {
  const points: DataPoint[] = [];
  const numPoints = 200;
  const trainCount = Math.floor(numPoints * trainTestRatio / 100);

  const generatePoint = (i: number, total: number) => {
    const isTest = i >= trainCount;
    
    switch (type) {
      case 'circles': {
        const angle = (Math.PI * 2 * i) / total;
        const isOuter = Math.random() > 0.5;
        const radius = isOuter ? (Math.random() * 0.12 + 0.36) : (Math.random() * 0.12 + 0.08);
        const noiseVal = (Math.random() - 0.5) * (noise / 100) * 0.5;
        
        return {
          x: Math.cos(angle) * radius + 0.5 + noiseVal,
          y: Math.sin(angle) * radius + 0.5 + noiseVal,
          label: isOuter ? 1 : 0,
          isTest,
        };
      }

      case 'spiral': {
        const t = i / total;
        const r = t * 0.38;
        const angle = t * Math.PI * 3.5;
        const noiseVal = (Math.random() - 0.5) * (noise / 100) * 0.3;
        
        return {
          x: Math.cos(angle) * r + 0.5 + noiseVal,
          y: Math.sin(angle) * r + 0.5 + noiseVal,
          label: i % 2,
          isTest,
        };
      }

      case 'xor': {
        const x = Math.random() * 0.9 + 0.05;
        const y = Math.random() * 0.9 + 0.05;
        const noiseVal = (Math.random() - 0.5) * (noise / 100);
        const label = ((x + noiseVal > 0.5 && y + noiseVal > 0.5) || 
                      (x + noiseVal < 0.5 && y + noiseVal < 0.5)) ? 1 : 0;
        
        return { x, y, label, isTest };
      }

      case 'gauss': {
        const label = Math.random() > 0.5 ? 1 : 0;
        const centerX = label ? 0.65 : 0.35;
        const centerY = label ? 0.65 : 0.35;
        const spread = 0.15;
        const noiseVal = (noise / 100) * 0.5;
        
        return {
          x: Math.max(0.05, Math.min(0.95, centerX + (Math.random() - 0.5) * spread + (Math.random() - 0.5) * noiseVal)),
          y: Math.max(0.05, Math.min(0.95, centerY + (Math.random() - 0.5) * spread + (Math.random() - 0.5) * noiseVal)),
          label,
          isTest,
        };
      }

      case 'linear':
      default: {
        const x = Math.random() * 0.9 + 0.05;
        const y = Math.random() * 0.9 + 0.05;
        const noiseVal = (Math.random() - 0.5) * (noise / 100) * 0.8;
        const label = y > x + noiseVal ? 1 : 0;
        
        return { x, y, label, isTest };
      }
    }
  };

  for (let i = 0; i < numPoints; i++) {
    points.push(generatePoint(i, numPoints));
  }

  return points;
};

export const DatasetCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dataset, isTraining, epoch, noiseLevel, trainTestRatio, showTestData } = useNetworkStore();
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    setDataPoints(generateDataset(dataset, noiseLevel, trainTestRatio));
  }, [dataset, noiseLevel, trainTestRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw decision boundary heatmap
    const gridSize = 50;
    const progress = Math.min(epoch / 40, 1);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = i / gridSize;
        const y = j / gridSize;
        
        let prediction = 0.5;
        
        if (progress > 0.05) {
          switch (dataset) {
            case 'circles': {
              const dist = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              const target = dist > 0.22 && dist < 0.5 ? 1 : 0;
              prediction = target * progress + 0.5 * (1 - progress);
              break;
            }
            case 'xor': {
              const xorValue = ((x > 0.5 && y > 0.5) || (x < 0.5 && y < 0.5)) ? 1 : 0;
              prediction = xorValue * progress + 0.5 * (1 - progress);
              break;
            }
            case 'linear': {
              const linearValue = y > x ? 1 : 0;
              prediction = linearValue * progress + 0.5 * (1 - progress);
              break;
            }
            case 'gauss': {
              const dist1 = Math.sqrt((x - 0.35) ** 2 + (y - 0.35) ** 2);
              const dist2 = Math.sqrt((x - 0.65) ** 2 + (y - 0.65) ** 2);
              const gaussValue = dist2 < dist1 ? 1 : 0;
              prediction = gaussValue * progress + 0.5 * (1 - progress);
              break;
            }
            case 'spiral': {
              const angle = Math.atan2(y - 0.5, x - 0.5);
              const dist = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              const spiralValue = (angle + dist * 15) % (Math.PI * 2) > Math.PI ? 1 : 0;
              prediction = spiralValue * progress * 0.7 + 0.5 * (1 - progress * 0.7);
              break;
            }
          }
        }
        
        const intensity = Math.abs(prediction - 0.5) * 0.6;
        const hue = prediction > 0.5 ? 220 : 355;
        
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${intensity})`;
        ctx.fillRect(
          (i / gridSize) * width,
          (j / gridSize) * height,
          Math.ceil(width / gridSize) + 1,
          Math.ceil(height / gridSize) + 1
        );
      }
    }

    // Draw data points
    dataPoints.forEach((point) => {
      if (point.isTest && !showTestData) return;
      
      const x = point.x * width;
      const y = point.y * height;
      const size = point.isTest ? 3.5 : 5;
      
      // Outer glow
      if (!point.isTest) {
        ctx.beginPath();
        ctx.arc(x, y, size + 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size + 3);
        
        if (point.label === 1) {
          gradient.addColorStop(0, 'hsla(220, 90%, 60%, 0.3)');
          gradient.addColorStop(1, 'hsla(220, 90%, 60%, 0)');
        } else {
          gradient.addColorStop(0, 'hsla(355, 85%, 60%, 0.3)');
          gradient.addColorStop(1, 'hsla(355, 85%, 60%, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Main circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      
      if (point.label === 1) {
        ctx.fillStyle = point.isTest ? 'hsla(220, 90%, 58%, 0.5)' : 'hsl(220, 90%, 58%)';
        ctx.strokeStyle = 'hsl(220, 90%, 45%)';
      } else {
        ctx.fillStyle = point.isTest ? 'hsla(355, 85%, 60%, 0.5)' : 'hsl(355, 85%, 60%)';
        ctx.strokeStyle = 'hsl(355, 85%, 50%)';
      }
      
      ctx.fill();
      ctx.lineWidth = point.isTest ? 1.5 : 2;
      ctx.stroke();
      
      // Highlight for training data
      if (!point.isTest) {
        ctx.beginPath();
        ctx.arc(x - 1, y - 1, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
    });
  }, [dataPoints, epoch, dataset, isTraining, showTestData]);

  return (
    <motion.div
      className="h-full bg-gradient-to-br from-card via-card/95 to-card/80 border-2 border-border rounded-2xl p-5 shadow-2xl overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-negative/20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              Output
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Live decision boundary visualization
            </p>
          </div>
          <div className="flex gap-2.5 text-[10px]">
            <motion.div 
              className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg" />
              <span className="text-foreground font-semibold">Orange</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-1.5 bg-negative/10 px-2 py-1 rounded-lg border border-negative/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-negative shadow-lg" />
              <span className="text-foreground font-semibold">Blue</span>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full h-auto rounded-xl bg-muted/30 border-2 border-border shadow-inner"
          />
          
          {/* Training progress indicator */}
          {isTraining && (
            <motion.div
              className="absolute bottom-3 right-3 bg-card/95 backdrop-blur-md border border-border rounded-lg px-3 py-2 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-positive"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-xs font-semibold text-foreground">Learning...</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Learning progress bar */}
        <motion.div
          className="mt-4 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Learning Progress</span>
            <span className="font-mono font-bold text-foreground">
              {Math.min(100, Math.round((epoch / 40) * 100))}%
            </span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden border border-border">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-positive to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (epoch / 40) * 100)}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            {epoch === 0 ? 'Click Play to start training' :
             epoch < 10 ? 'Network is learning the pattern...' :
             epoch < 25 ? 'Refining decision boundaries...' :
             epoch < 40 ? 'Almost there! Fine-tuning...' :
             'Network has learned the pattern! 🎉'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
