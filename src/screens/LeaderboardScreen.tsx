import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function LeaderboardScreen() {
  const { setCurrentScreen } = useGame();

  // Mock data for leaderboard
  const leaders = [
    { rank: 1, address: '0x1234...abcd', syncRate: '99.8%', networks: 142 },
    { rank: 2, address: '0x8888...4444', syncRate: '97.2%', networks: 110 },
    { rank: 3, address: '0xabcd...1234', syncRate: '94.5%', networks: 89 },
    { rank: 4, address: '0xface...b00c', syncRate: '91.0%', networks: 75 },
    { rank: 5, address: '0x1111...2222', syncRate: '88.4%', networks: 60 },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8 pt-8">
        <button 
          onClick={() => setCurrentScreen('menu')}
          className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full border border-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h2 className="text-2xl font-light tracking-widest text-violet-300 uppercase flex items-center gap-3">
          <Trophy className="w-6 h-6 text-violet-400" />
          Greatest Relays
        </h2>
      </div>

      <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-2 p-4 border-b border-slate-800 text-xs font-mono text-slate-500 uppercase tracking-widest bg-slate-950/50">
          <div className="col-span-2 text-center">Rnk</div>
          <div className="col-span-5">Operator</div>
          <div className="col-span-3 text-right">Sync</div>
          <div className="col-span-2 text-right">Nets</div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {leaders.map((leader, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="grid grid-cols-12 gap-2 p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors items-center"
            >
              <div className="col-span-2 text-center text-slate-400 font-mono text-sm">#{leader.rank}</div>
              <div className="col-span-5 text-cyan-100 font-mono text-xs">{leader.address}</div>
              <div className="col-span-3 text-right text-violet-300 font-medium">{leader.syncRate}</div>
              <div className="col-span-2 text-right text-slate-400 text-sm">{leader.networks}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
