import React from 'react';
import { motion } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useGame } from '../context/GameContext';
import { BrainCircuit, Play, Trophy, Hexagon, LogOut, MessageCircle } from 'lucide-react';
import { encodeAttributionData } from '../lib/erc8021';

export default function MenuScreen() {
  const { setCurrentScreen } = useGame();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();

  const handleSayGM = () => {
    if (!isConnected) return;
    
    try {
      sendTransaction({
        to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
        value: parseEther('0'),
        data: encodeAttributionData() as `0x${string}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20 animate-[pulse_10s_ease-in-out_infinite]">
      <div className="absolute inset-0 bg-slate-950/80 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full" />
          <BrainCircuit className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" strokeWidth={1} />
          <motion.div 
            animate={{ rotate: [-360, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Hexagon className="w-32 h-32 text-violet-500 opacity-50 absolute inset-0" strokeWidth={0.5} />
          </motion.div>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-violet-300 mb-2 text-center uppercase">
          Mind Sync
        </h1>
        <p className="text-cyan-200/60 tracking-[0.3em] font-mono text-sm mb-12 uppercase drop-shadow-md">
          Neural Relay Protocol
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => setCurrentScreen('game')}
            className="group relative flex items-center justify-center gap-3 w-full py-4 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 hover:border-cyan-400/80 rounded-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
            <span className="text-cyan-100 font-medium tracking-wide">Enter Relay</span>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity m-2" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity m-2" />
          </button>

          <button 
            onClick={() => setCurrentScreen('leaderboard')}
            className="flex items-center justify-center gap-3 w-full py-3 bg-violet-950/30 hover:bg-violet-900/50 border border-violet-900/50 hover:border-violet-500/50 rounded-xl transition-all duration-300"
          >
            <Trophy className="w-4 h-4 text-violet-300" />
            <span className="text-violet-200 text-sm tracking-wide">Greatest Relays</span>
          </button>
        </div>

        <div className="mt-12 w-full max-w-xs border-t border-slate-800 pt-8 flex flex-col gap-3">
          {isConnected ? (
            <div className="flex flex-col gap-3">
              <div className="text-xs text-center text-slate-400 font-mono bg-slate-900/50 py-2 rounded-lg border border-slate-800">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSayGM}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-800/50 hover:border-blue-500/50 rounded-lg transition-all text-sm text-blue-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Say GM (On-chain)
                </button>
                <button 
                  onClick={() => disconnect()}
                  className="p-2.5 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 hover:border-red-500/50 rounded-lg transition-all text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full py-3 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-500 rounded-xl transition-all text-sm text-slate-300 flex items-center justify-center gap-2"
              >
                Connect Operator Wallet
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
