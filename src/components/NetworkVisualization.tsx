import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStore } from '@/store/networkStore';
import { useEffect, useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Neuron {
  x: number;
  y: number;
  value: number;
  layerIndex: number;
  neuronIndex: number;
}

interface Connection {
  from: Neuron;
  to: Neuron;
  weight: number;
}

interface FlowParticle {
  id: string;
  from: Neuron;
  to: Neuron;
  progress: number;
  value: number;
}

export const NetworkVisualization = () => {
  const { features, hiddenLayers, isTraining, showValues, addHiddenLayer, removeHiddenLayer, updateHiddenLayer, epoch } = useNetworkStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNeuron, setHoveredNeuron] = useState<Neuron | null>(null);
  const [flowParticles, setFlowParticles] = useState<FlowParticle[]>([]);

  const enabledFeatures = features.filter(f => f.enabled);
  const inputCount = enabledFeatures.length;
  const outputCount = 1;

  // Generate neurons and connections
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    const padding = 80;

    const allLayers = [
      { neurons: inputCount, type: 'input' },
      ...hiddenLayers.map(l => ({ neurons: l.neurons, type: 'hidden' })),
      { neurons: outputCount, type: 'output' },
    ];

    const layerSpacing = (width - 2 * padding) / Math.max(1, allLayers.length - 1);
    const newNeurons: Neuron[] = [];

    allLayers.forEach((layer, layerIdx) => {
      const maxNeurons = Math.max(...allLayers.map(l => l.neurons));
      const neuronSpacing = Math.min(70, (height - 2 * padding) / (maxNeurons + 1));
      const layerHeight = layer.neurons * neuronSpacing;
      const startY = (height - layerHeight) / 2;

      for (let i = 0; i < layer.neurons; i++) {
        newNeurons.push({
          x: padding + layerIdx * layerSpacing,
          y: startY + (i + 1) * neuronSpacing,
          value: Math.random() * 0.8 + 0.2,
          layerIndex: layerIdx,
          neuronIndex: i,
        });
      }
    });

    setNeurons(newNeurons);

    const newConnections: Connection[] = [];
    let fromIdx = 0;

    for (let i = 0; i < allLayers.length - 1; i++) {
      const fromCount = allLayers[i].neurons;
      const toCount = allLayers[i + 1].neurons;

      for (let j = 0; j < fromCount; j++) {
        for (let k = 0; k < toCount; k++) {
          newConnections.push({
            from: newNeurons[fromIdx + j],
            to: newNeurons[fromIdx + fromCount + k],
            weight: (Math.random() - 0.5) * 2,
          });
        }
      }

      fromIdx += fromCount;
    }

    setConnections(newConnections);
  }, [inputCount, hiddenLayers]);

  // Animate flowing particles when training
  useEffect(() => {
    if (!isTraining || connections.length === 0) {
      setFlowParticles([]);
      return;
    }

    const interval = setInterval(() => {
      // Create new particles
      const newParticles: FlowParticle[] = [];
      const numParticles = Math.min(5, connections.length);
      
      for (let i = 0; i < numParticles; i++) {
        const randomConn = connections[Math.floor(Math.random() * connections.length)];
        newParticles.push({
          id: `${Date.now()}-${i}`,
          from: randomConn.from,
          to: randomConn.to,
          progress: 0,
          value: randomConn.from.value,
        });
      }
      
      setFlowParticles(prev => [...prev, ...newParticles]);
    }, 200);

    return () => clearInterval(interval);
  }, [isTraining, connections]);

  // Update particle positions
  useEffect(() => {
    if (flowParticles.length === 0) return;

    const animation = requestAnimationFrame(() => {
      setFlowParticles(prev => 
        prev
          .map(p => ({ ...p, progress: p.progress + 0.02 }))
          .filter(p => p.progress < 1)
      );
    });

    return () => cancelAnimationFrame(animation);
  }, [flowParticles]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gradient-to-br from-background via-muted/5 to-background rounded-2xl border-2 border-border shadow-xl overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
      </div>

      {/* Layer Controls */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-30 flex items-center gap-2">
        <div className="bg-card/98 backdrop-blur-md border-2 border-border rounded-xl px-5 py-2.5 shadow-2xl flex items-center gap-4">
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">Hidden Layers</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => hiddenLayers.length > 0 && removeHiddenLayer(hiddenLayers[hiddenLayers.length - 1].id)}
              disabled={hiddenLayers.length === 0}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-bold text-primary min-w-[30px] text-center tabular-nums">
              {hiddenLayers.length}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={addHiddenLayer}
              disabled={hiddenLayers.length >= 6}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="conn-pos" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 85%, 65%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(220, 85%, 55%)" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="conn-neg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(355, 80%, 65%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(355, 80%, 55%)" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow-effect">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn, idx) => {
          const absWeight = Math.abs(conn.weight);
          const thickness = absWeight * 2.5 + 0.5;

          return (
            <motion.line
              key={idx}
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke={conn.weight > 0 ? 'url(#conn-pos)' : 'url(#conn-neg)'}
              strokeWidth={thickness}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: isTraining ? 0.7 : 0.35,
              }}
              transition={{
                duration: 1.2,
                delay: idx * 0.001,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          );
        })}

        {/* Flowing particles */}
        {flowParticles.map(particle => {
          const x = particle.from.x + (particle.to.x - particle.from.x) * particle.progress;
          const y = particle.from.y + (particle.to.y - particle.from.y) * particle.progress;
          
          return (
            <motion.circle
              key={particle.id}
              cx={x}
              cy={y}
              r="4"
              fill="hsl(var(--primary))"
              filter="url(#glow-effect)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.8] }}
              transition={{ duration: 0.8 }}
            />
          );
        })}
      </svg>

      {/* Neurons */}
      {neurons.map((neuron, idx) => {
        const isInput = neuron.layerIndex === 0;
        const isOutput = neuron.layerIndex === (hiddenLayers.length + 1);
        const isHovered = hoveredNeuron?.layerIndex === neuron.layerIndex &&
          hoveredNeuron?.neuronIndex === neuron.neuronIndex;

        const hiddenLayerIdx = neuron.layerIndex - 1;
        const isHiddenLayer = hiddenLayerIdx >= 0 && hiddenLayerIdx < hiddenLayers.length;
        const currentLayer = isHiddenLayer ? hiddenLayers[hiddenLayerIdx] : null;

        return (
          <motion.div
            key={idx}
            className="absolute z-20 pointer-events-auto"
            style={{
              left: neuron.x,
              top: neuron.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: idx * 0.015, 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            onMouseEnter={() => setHoveredNeuron(neuron)}
            onMouseLeave={() => setHoveredNeuron(null)}
          >
            <div className="relative">
              {/* Neuron with enhanced visual */}
              <motion.div
                className="relative"
                animate={isTraining ? {
                  scale: [1, 1.15, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.12,
                }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: 44,
                    height: 44,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, hsla(var(--primary), ${neuron.value * 0.4}), transparent 70%)`,
                    filter: 'blur(8px)',
                  }}
                  animate={isTraining ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  } : {}}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.1,
                  }}
                />

                {/* Main neuron body */}
                <motion.div
                  className="w-9 h-9 rounded-full border-3 border-background shadow-2xl cursor-pointer relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, 
                      hsla(var(--primary), ${Math.max(0.7, neuron.value)}), 
                      hsla(var(--primary), ${Math.max(0.4, neuron.value * 0.6)}))`,
                  }}
                  whileHover={{ scale: 1.4 }}
                  animate={isHovered ? {
                    boxShadow: '0 0 30px hsla(var(--primary), 0.8)',
                  } : {}}
                >
                  {/* Glossy highlight */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), transparent 55%)',
                    }}
                  />
                  
                  {/* Inner core */}
                  <motion.div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, hsla(var(--primary), 0.9), transparent)`,
                    }}
                    animate={isTraining ? {
                      opacity: [0.6, 1, 0.6],
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.08,
                    }}
                  />
                </motion.div>

                {/* Pulsing rings when training */}
                {isTraining && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      style={{
                        width: 44,
                        height: 44,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                      animate={{
                        scale: [1, 2.2, 2.2],
                        opacity: [0.6, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: idx * 0.06,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      style={{
                        width: 44,
                        height: 44,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                      animate={{
                        scale: [1, 1.8, 1.8],
                        opacity: [0.7, 0.4, 0],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: (idx * 0.06) + 0.4,
                      }}
                    />
                  </>
                )}
              </motion.div>

              {/* Value display */}
              {showValues && (
                <motion.div
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-mono font-bold border border-border shadow-lg whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.01 + 0.4 }}
                >
                  {neuron.value.toFixed(2)}
                </motion.div>
              )}

              {/* Enhanced tooltip on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 -top-24 bg-gradient-to-b from-card to-card/95 backdrop-blur-xl border-2 border-primary/40 rounded-2xl px-5 py-3 shadow-2xl z-50 min-w-[200px]"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
                      <p className="text-sm font-bold text-foreground">
                        {isInput ? `${enabledFeatures[neuron.neuronIndex]?.name}` :
                         isOutput ? 'Output Layer' :
                         `Hidden Layer ${hiddenLayerIdx + 1}`}
                      </p>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activation:</span>
                        <span className="font-mono font-bold text-foreground">{neuron.value.toFixed(4)}</span>
                      </div>
                      {!isInput && !isOutput && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Position:</span>
                            <span className="font-mono text-foreground">L{neuron.layerIndex} N{neuron.neuronIndex + 1}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Epoch:</span>
                            <span className="font-mono text-foreground">{epoch}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {isHiddenLayer && currentLayer && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wide font-semibold">
                          Adjust Neurons
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => currentLayer.neurons > 1 && updateHiddenLayer(currentLayer.id, currentLayer.neurons - 1)}
                            disabled={currentLayer.neurons <= 1}
                            className="h-7 w-7 p-0 rounded-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-bold font-mono flex-1 text-center bg-muted rounded px-3 py-1">
                            {currentLayer.neurons}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => currentLayer.neurons < 8 && updateHiddenLayer(currentLayer.id, currentLayer.neurons + 1)}
                            disabled={currentLayer.neurons >= 8}
                            className="h-7 w-7 p-0 rounded-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
