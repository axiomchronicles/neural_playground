# 🧠 NeuroPlayground  
**An interactive, story-driven clone of TensorFlow Playground — built with React, Vite, Tailwind, shadcn, and Framer Motion.**

---

## 🚀 Overview
**NeuroPlayground** is a modern web app that lets users **build, train, and visualize neural networks** directly in the browser.  
It recreates the TensorFlow Playground experience with a **clean Meta-inspired design**, **smooth animations**, and **real-time interactivity**.

Users can explore how neural networks learn by watching data flow through layers, activations light up, and weights adapt — all visualized as calm, story-like animations.

---

## ✨ Features
- 🧩 **Interactive Network Builder** – Add layers, adjust neurons, and choose activation functions.  
- 🎬 **Story-Driven Animations** – Visualize forward pass, backpropagation, and weight updates with smooth, cinematic motion.  
- 📊 **Real-Time Data Playground** – Experiment with toy datasets like spirals, circles, and moons.  
- ⚙️ **Hyperparameter Control** – Adjust learning rate, optimizer, batch size, and more live.  
- 🪄 **Meta-Style UI** – Clean, minimal interface with soft colors and modern design.  
- 🧵 **Web Worker Support** – Keeps training off the main thread for a responsive experience.  
- 💾 **Export & Share** – Save and share configurations or replay training animations.  

---

## 🧠 Tech Stack
- **React + Vite (TypeScript)** – Fast, modular front-end foundation  
- **Tailwind CSS + shadcn/ui** – Utility-first styling and accessible UI components  
- **Framer Motion** – Smooth timeline-based animations  
- **TensorFlow.js / Custom Engine** – Neural network math and simulation  
- **Zustand** – Lightweight state management  
- **Web Workers / WASM** – Non-blocking training computations  

---

## 🖥️ Installation & Setup
```bash
# Clone the repository
git clone https://github.com/axiomchronicles/neural_playground.git
cd neural_playgroundß

# Install dependencies
npm install

# Start the development server
npm run dev
````

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧩 Project Structure

```
src/
├── components/        # UI components (network, layers, sidebar, charts)
├── hooks/             # Zustand stores, custom hooks
├── workers/           # Web Worker logic for training
├── utils/             # Math, animation, and rendering helpers
├── pages/             # Main views (Playground, Compare, Tutorials)
├── assets/            # Icons, logos, data samples
└── App.tsx            # Root app entry
```

---

## 🧪 Roadmap

* [ ] Add comparison mode for multiple networks
* [ ] Implement 3D latent space visualization
* [ ] Add guided tutorials for beginners
* [ ] Export animation as MP4 / GIF
* [ ] Collaborative classroom mode

---

## 🎨 Design Philosophy

* 🩶 **No funky or bright colors** — use calm, neutral tones for clarity.
* 🧘‍♂️ **Smooth and purposeful motion** — clean, minimal animations using Framer Motion.
* 🧩 **Focus on understanding** — visuals should explain how neural networks learn.

---

## 🧰 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint codebase
npm run test      # Run tests (if configured)
```

---

## 📜 License

MIT License © 2025 [Your Name]

---

## 💡 Inspiration

Inspired by [TensorFlow Playground](https://playground.tensorflow.org/), rebuilt with a modern stack and smooth, story-like animations to make learning neural networks more intuitive and visually engaging.

```