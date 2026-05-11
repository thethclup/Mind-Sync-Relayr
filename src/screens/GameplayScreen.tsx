import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Activity, Settings, Maximize2, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAccount, useSignMessage, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { encodeAttributionData } from '../lib/erc8021';

// Basic Mind Node interface
interface Node {
  id: string;
  x: number;
  y: number;
  type: 'calm' | 'chaos' | 'logic' | 'emotion';
  connectedTo: string[];
  active: boolean;
}

const COLORS = {
  calm: '#38bdf8', // Light blue
  chaos: '#f43f5e', // Rose
  logic: '#a855f7', // Purple
  emotion: '#fbbf24', // Amber
};

export default function GameplayScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentScreen, syncRate, setSyncRate, networksBuilt, setNetworksBuilt } = useGame();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [draggingFrom, setDraggingFrom] = useState<Node | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showFullSync, setShowFullSync] = useState(false);
  
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { sendTransaction } = useSendTransaction();

  // Initialize level
  useEffect(() => {
    generateLevel();
  }, []);

  const generateLevel = () => {
    setSyncRate(0);
    setShowFullSync(false);
    const newNodes: Node[] = [];
    const types: ('calm' | 'chaos' | 'logic' | 'emotion')[] = ['calm', 'logic', 'emotion', 'calm', 'logic', 'chaos', 'emotion', 'chaos', 'calm'];
    
    const count = Math.min(4 + networksBuilt * 2, 8); // Progressively add more nodes up to 8
    
    // Generate some random relative positions
    for (let i = 0; i < count; i++) {
      newNodes.push({
        id: `node_${i}`,
        x: Math.random() * 0.8 + 0.1, // 0.1 to 0.9
        y: Math.random() * 0.8 + 0.1,
        type: types[i % types.length],
        connectedTo: [],
        active: false,
      });
    }
    setNodes(newNodes);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find(n => {
      const px = n.x * rect.width;
      const py = n.y * rect.height;
      return Math.hypot(px - x, py - y) < 30;
    });
    
    if (clickedNode) {
      setDraggingFrom(clickedNode);
      setMousePos({ x, y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingFrom) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingFrom) return;
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setDraggingFrom(null);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const targetNode = nodes.find(n => {
      const px = n.x * rect.width;
      const py = n.y * rect.height;
      return n.id !== draggingFrom.id && Math.hypot(px - x, py - y) < 30;
    });
    
    if (targetNode) {
      // Connect nodes
      const isMatch = draggingFrom.type === targetNode.type || draggingFrom.type === 'calm' || targetNode.type === 'calm';
      
      if (isMatch && !draggingFrom.connectedTo.includes(targetNode.id)) {
        setNodes(curr => curr.map(n => {
          if (n.id === draggingFrom.id) return { ...n, connectedTo: [...n.connectedTo, targetNode.id], active: true };
          if (n.id === targetNode.id) return { ...n, connectedTo: [...n.connectedTo, draggingFrom.id], active: true };
          return n;
        }));
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        // Increase sync rate
        setSyncRate(prev => {
          const maxConnections = nodes.length - 1; // Simplify formula: you don't need all connections, just enough to reach 100
          const step = Math.ceil(100 / maxConnections);
          const next = prev + step;
          if (next >= 100) setShowFullSync(true);
          return Math.min(next, 100);
        });
      }
    }
    
    setDraggingFrom(null);
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      
      // Handle resizing issues (retina displays)
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw active connections
      ctx.lineWidth = 2;
      nodes.forEach(node => {
        const nx = node.x * canvas.width;
        const ny = node.y * canvas.height;
        
        node.connectedTo.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (target && node.id < target.id) { // Draw once per pair
            const tx = target.x * canvas.width;
            const ty = target.y * canvas.height;
            
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(tx, ty);
            
            // Flowing effect
            const gradient = ctx.createLinearGradient(nx, ny, tx, ty);
            gradient.addColorStop(0, COLORS[node.type]);
            gradient.addColorStop(0.5, `rgba(255,255,255,${Math.sin(time) * 0.5 + 0.5})`);
            gradient.addColorStop(1, COLORS[target.type]);
            
            ctx.strokeStyle = gradient;
            ctx.shadowBlur = 10;
            ctx.shadowColor = COLORS[node.type];
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw dragging line
      if (draggingFrom) {
        const dx = draggingFrom.x * canvas.width;
        const dy = draggingFrom.y * canvas.height;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw nodes
      nodes.forEach(node => {
        const nx = node.x * canvas.width;
        const ny = node.y * canvas.height;

        ctx.beginPath();
        ctx.arc(nx, ny, 20, 0, Math.PI * 2);
        
        ctx.fillStyle = '#0f172a'; // slate-950
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLORS[node.type];
        ctx.stroke();

        // Pulsing core if active
        if (node.active || draggingFrom?.id === node.id) {
          ctx.beginPath();
          ctx.arc(nx, ny, 8 + Math.sin(time + nx) * 2, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[node.type];
          ctx.fill();
          
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS[node.type];
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(nx, ny, 4, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[node.type];
          ctx.globalAlpha = 0.5;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [nodes, draggingFrom, mousePos]);

  const handleRecordOnChain = async () => {
    if (!isConnected || !address) {
      alert("Connect wallet from Menu to record on-chain!");
      return;
    }
    
    try {
      const message = `Mind Sync Relay\n\nI synchronized a neural network with ${syncRate}% efficiency!\nTimestamp: ${Date.now()}`;
      await signMessageAsync({ message, account: address });
      setNetworksBuilt(prev => prev + 1);
      generateLevel(); // restart
      alert("Synchronization verified and recorded successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSayGM = () => {
    if (!isConnected || !address) {
      alert("Connect wallet from Menu to record on-chain!");
      return;
    }
    
    // Simulate a simple "Say GM" transaction on Base
    try {
      sendTransaction({
        to: address, // sending to self as a dummy action
        value: parseEther('0'),
        data: encodeAttributionData() as `0x${string}`,
      });
      alert('GM Transaction sent to network!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-y-auto md:overflow-hidden" ref={containerRef}>
      {/* Central Gameplay / Mind Relay Chamber */}
      <div className="md:col-span-7 flex flex-col gap-4 relative h-full min-h-[50vh]">
        <div className="relative flex-1 bg-gradient-to-b from-black to-[#0a0a15] rounded-3xl border border-white/5 overflow-hidden">
          {/* Mock Canvas Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}
          ></div>
          
          {/* HUD (Overlay Game HUD) */}
          <div className="absolute top-6 left-6 flex flex-col gap-1 z-10 pointer-events-none">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Current Status</span>
            <h2 className="text-xl md:text-2xl font-light text-white">Neural Connection: <span className="text-cyan-400 font-bold">{syncRate === 100 ? 'SYNCED' : 'ACTIVE'}</span></h2>
          </div>

          <div className="absolute top-6 right-6 z-10">
            <button 
              onClick={() => setCurrentScreen('menu')}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Game Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none absolute inset-0 z-0"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        </div>
      </div>

      {/* Sidebar Controls & Stats */}
      <div className="flex flex-col md:grid md:col-span-5 grid-rows-6 gap-4 mt-4 md:mt-0">
        {/* Top Stats Bento */}
        <div className="row-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Sync Rate</span>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{syncRate}</span>
              <span className="text-lg text-white/40 mb-1">%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-300" 
                style={{ width: `${syncRate}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">Active Nodes</span>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{nodes.filter(n => n.active).length}</span>
            </div>
            <span className="text-xs text-white/40">of {nodes.length} total</span>
          </div>
        </div>

        {/* Resonance System */}
        <div className="row-span-2 bg-[#0d0d1a] border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <h3 className="text-sm font-bold text-violet-300 uppercase tracking-widest">Frequency Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">LOGIC (Stable)</span>
                <span className="text-cyan-400 font-mono">44.1 Hz</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">EMOTION (Chaotic)</span>
                <span className="text-pink-400 font-mono">72.9 Hz</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">MEMORY (Legacy)</span>
                <span className="text-amber-400 font-mono">12.5 Hz</span>
              </div>
            </div>
          </div>
          {/* Decorative Pulse */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* On-Chain Actions */}
        <div className="row-span-2 bg-gradient-to-br from-cyan-900/40 to-violet-900/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Relay Operator Panel</h3>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={handleSayGM}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="p-2 bg-cyan-400/20 rounded-lg">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <span className="text-[10px] font-bold">SAY GM</span>
            </button>
            <button 
              onClick={handleRecordOnChain}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="p-2 bg-amber-400/20 rounded-lg">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c0 3.517-1.009 6.799-2.753 9.571m0 0c-1.744 2.772-4.664 4.312-7.247 4.312m7.247-4.312c1.744-2.772 4.664-4.312 7.247-4.312M12 21c-1.744-2.772-4.664-4.312-7.247-4.312M12 3c1.744 2.772 4.664 4.312 7.247 4.312"></path></svg>
              </div>
              <span className="text-[10px] font-bold">MINT NETWORK</span>
            </button>
          </div>
          <p className="mt-4 text-[9px] text-center text-white/30 tracking-tight">
            ERC-8021 ATTRIBUTION CODE: [bc_9g7agms9]
          </p>
        </div>
      </div>

      {/* Full Sync Overlay */}
      <AnimatePresence>
        {showFullSync && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-black border border-cyan-500/30 p-8 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(34,211,238,0.1)] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}
              ></div>
              <Zap className="w-16 h-16 text-cyan-400 mb-4 animate-pulse relative z-10" />
              <h2 className="text-3xl font-light tracking-widest text-white mb-2 uppercase relative z-10">Full Sync</h2>
              <p className="text-white/60 text-sm mb-8 relative z-10">Neural network aligned perfectly. The consciousness is stabilized.</p>
              
              <button 
                onClick={handleRecordOnChain}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 mb-3 relative z-10 uppercase"
              >
                <Network className="w-4 h-4" />
                Record On-Chain
              </button>
              
              <button 
                onClick={generateLevel}
                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 font-bold tracking-widest text-xs rounded-xl transition-all relative z-10 uppercase"
              >
                Proceed to Next Relay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
