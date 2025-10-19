import { motion } from 'framer-motion';
import { BugPlay, PlayCircle, Settings2, Database, TrendingUp, Layers } from 'lucide-react';

export const Documentation = () => {
  const sections = [
    {
      icon: BugPlay,
      title: 'What is a Neural Network?',
      content: 'A neural network is a computational model inspired by the human brain. It consists of interconnected nodes (neurons) organized in layers that process information. Each connection has a weight that adjusts as the network learns, allowing it to recognize patterns and make predictions.',
    },
    {
      icon: Layers,
      title: 'Network Architecture',
      content: 'The network has three types of layers: Input (features), Hidden (processing), and Output (predictions). Hidden layers learn complex patterns by combining inputs through weighted connections. More layers allow learning more complex patterns but require more training.',
    },
    {
      icon: Database,
      title: 'Training Data',
      content: 'The colored dots represent training data with two classes (orange and blue). The network learns to classify points by adjusting connection weights. Noise adds randomness to make learning more challenging. The decision boundary shows how the network separates classes.',
    },
    {
      icon: Settings2,
      title: 'Hyperparameters',
      content: 'Learning Rate controls how quickly the network learns. Activation functions (ReLU, Tanh, Sigmoid) introduce non-linearity. Regularization prevents overfitting by penalizing large weights. Batch size determines how many examples are processed together.',
    },
    {
      icon: PlayCircle,
      title: 'How to Use',
      content: '1. Select features and dataset. 2. Add/remove hidden layers and adjust neurons. 3. Configure hyperparameters. 4. Click Play to start training. 5. Watch the decision boundary evolve as the network learns. 6. Observe train vs test loss to monitor learning progress.',
    },
    {
      icon: TrendingUp,
      title: 'Understanding Loss',
      content: 'Loss measures prediction error. Lower is better. Train loss shows error on training data, test loss on unseen data. If test loss is much higher than train loss, the network is overfitting (memorizing rather than learning patterns). Adjust regularization to fix this.',
    },
  ];

  return (
    <motion.div
      className="bg-gradient-to-b from-card to-muted/20 border-2 border-border rounded-3xl p-8 shadow-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4 shadow-lg"
        >
          <BugPlay className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Neural Network Playground Guide
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          An interactive visualization tool to understand how neural networks learn and make predictions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <section.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span><strong>Start Simple:</strong> Begin with 1-2 hidden layers and gradually increase complexity if needed.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span><strong>Feature Engineering:</strong> Enable X₁² and X₂² features for problems like circles that aren't linearly separable.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span><strong>Watch the Animation:</strong> Observe how data flows through layers and how neurons activate during training.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span><strong>Compare Losses:</strong> Train and test loss should decrease together. Large gaps indicate overfitting.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span><strong>Experiment Freely:</strong> Try different datasets, architectures, and parameters to build intuition!</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
