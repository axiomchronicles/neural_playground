import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { TopControls } from '@/components/TopControls';
import { FeaturesPanel } from '@/components/FeaturesPanel';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { DatasetCanvas } from '@/components/DatasetCanvas';
import { DataPanel } from '@/components/DataPanel';
import { PlaygroundControls } from '@/components/PlaygroundControls';
import { Documentation } from '@/components/Documentation';
import { useNetworkStore } from '@/store/networkStore';
import { useEffect } from 'react';

const Index = () => {
  const { 
    isTraining, 
    setEpoch, 
    setTrainLoss, 
    setTestLoss,
    epoch, 
    addToHistory, 
    playbackSpeed 
  } = useNetworkStore();

  useEffect(() => {
    if (!isTraining) return;

    const baseDelay = 300 / playbackSpeed;
    const interval = setInterval(() => {
      const newEpoch = epoch + 1;
      setEpoch(newEpoch);
      
      // Simulate training and test loss
      const baseLoss = 1.2;
      const convergenceFactor = 1 + newEpoch * 0.12;
      const randomNoise = (Math.random() - 0.5) * 0.1;
      const newTrainLoss = Math.max(0.02, (baseLoss / convergenceFactor) + randomNoise);
      
      // Test loss is typically higher and more volatile
      const testNoise = (Math.random() - 0.5) * 0.15;
      const newTestLoss = Math.max(0.03, newTrainLoss * 1.15 + testNoise);
      
      setTrainLoss(newTrainLoss);
      setTestLoss(newTestLoss);
      
      addToHistory({
        epoch: newEpoch,
        trainLoss: newTrainLoss,
        testLoss: newTestLoss,
      });
    }, baseDelay);

    return () => clearInterval(interval);
  }, [isTraining, epoch, setEpoch, setTrainLoss, setTestLoss, addToHistory, playbackSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <Header />
      
      <main className="container mx-auto px-6 py-6 max-w-[2000px]">
        {/* Top Controls Bar */}
        <TopControls />

        {/* Main Playground Area */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* Left Sidebar - Features */}
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FeaturesPanel />
          </motion.div>

          {/* Center - Network Visualization */}
          <motion.div
            className="col-span-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="h-[600px]">
              <NetworkVisualization />
            </div>
          </motion.div>

          {/* Right - Output Visualization */}
          <motion.div
            className="col-span-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DatasetCanvas />
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-2">
            <DataPanel />
          </div>
          
          <div className="col-span-10">
            <PlaygroundControls />
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mt-12">
          <Documentation />
        </div>
      </main>
    </div>
  );
};

export default Index;
