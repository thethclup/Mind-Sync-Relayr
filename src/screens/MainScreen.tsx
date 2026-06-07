import React from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { useGame } from '../context/GameContext';
import MenuScreen from './MenuScreen';
import GameplayScreen from './GameplayScreen';
import LeaderboardScreen from './LeaderboardScreen';
import { Network, Sun } from 'lucide-react';
import { parseEther } from 'viem';

export default function MainScreen() {
  const { currentScreen } = useGame();
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    if (!address) return;
    try {
      sendTransaction({
        to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
        value: parseEther('0'),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#050508] text-slate-200 overflow-hidden font-sans select-none">
      {/* Header Navigation */}
      <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-white/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm md:text-lg font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
            Mind Sync Relay
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          {isConnected && (
            <button
              onClick={sendGMTransaction}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun className="w-4 h-4" />
              Say GM
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-xs font-mono text-cyan-400">BASE MAINNET</span>
          </div>
          <div className="px-3 md:px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs md:text-sm font-medium cursor-default">
            {isConnected && address ? `${address.slice(0, 5)}...${address.slice(-4)}` : 'DISCONNECTED'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentScreen === 'menu' && <MenuScreen />}
        {currentScreen === 'game' && <GameplayScreen />}
        {currentScreen === 'leaderboard' && <LeaderboardScreen />}
      </main>

      {/* Footer Ticker */}
      <footer className="h-10 bg-black flex items-center px-4 md:px-8 border-t border-white/5 text-[10px] font-mono text-white/40 uppercase gap-8 overflow-hidden shrink-0">
        <div className="whitespace-nowrap flex gap-8 items-center animate-[scroll_20s_linear_infinite]">
          <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> NETWORK STATUS: NOMINAL</span>
          <span>OPERATOR: BC_9G7AGMS9</span>
          <span>SYNC LATENCY: {Math.floor(Math.random() * 20 + 10)}ms</span>
          <span>PENDING SIGNALS: {Math.floor(Math.random() * 5 + 1)}</span>
          {address && <span>LAST RELAY: {address.slice(0, 6)}...</span>}
          <span className="text-cyan-500/50">RESONANCE LEVEL: OPTIMAL</span>
          <span>TRUSTLESS AGENTS ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
