import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useGame } from '../context/GameContext';
import MenuScreen from './MenuScreen';
import GameplayScreen from './GameplayScreen';
import LeaderboardScreen from './LeaderboardScreen';
import { Sun, ArrowRightLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { parseEther } from 'viem';
import { baseDenim } from '../lib/wagmi';
import { encodeAttributionData } from '../lib/erc8021';
import { useBaseDenimBlock } from '../lib/useBaseDenimBlock';

export default function MainScreen() {
  const { currentScreen } = useGame();
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();
  const [gmHash, setGmHash] = useState<`0x${string}` | undefined>(undefined);
  const [notice, setNotice] = useState<string | null>(null);
  const denimBlock = useBaseDenimBlock();

  const isWrongChain = isConnected && chainId !== baseDenim.id;

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } =
    useWaitForTransactionReceipt({
      hash: gmHash,
      chainId: baseDenim.id,
      pollingInterval: 200,
    });

  useEffect(() => {
    if (isConfirmed && receipt) {
      setNotice(
        `GM confirmed on Base Mainnet (Denim) in canonical block #${receipt.blockNumber.toString()}`
      );
      setGmHash(undefined);
    }
  }, [isConfirmed, receipt]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const handleSwitchToDenimMainnet = async () => {
    try {
      await switchChainAsync({ chainId: baseDenim.id });
      setNotice('Switched to Base Mainnet (Denim 200ms)');
    } catch (err) {
      console.error(err);
      setNotice('Please confirm network switch to Base Mainnet (8453) in your wallet.');
    }
  };

  const sendGMTransaction = async () => {
    if (!address) return;
    try {
      if (chainId !== baseDenim.id) {
        await switchChainAsync({ chainId: baseDenim.id });
      }
      const hash = await sendTransactionAsync({
        chainId: baseDenim.id,
        to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
        value: parseEther('0'),
        data: encodeAttributionData() as `0x${string}`,
      });
      setGmHash(hash);
      setNotice('GM submitted to Base Mainnet — awaiting 200ms canonical block...');
    } catch (err) {
      console.error(err);
      setNotice('Transaction cancelled or failed.');
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
        <div className="flex items-center gap-2 md:gap-4">
          {isWrongChain && (
            <button
              onClick={handleSwitchToDenimMainnet}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Switch to Base Mainnet
            </button>
          )}
          {isConnected && (
            <button
              onClick={sendGMTransaction}
              disabled={isSending || isConfirming}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 disabled:opacity-60 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              {isSending || isConfirming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              {isConfirming ? 'Confirming...' : 'Say GM'}
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${denimBlock.isLive ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-500/60'}`}></div>
            <span className="text-xs font-mono text-cyan-400">
              BASE MAINNET · DENIM 200ms
              {denimBlock.blockNumber ? ` · #${denimBlock.blockNumber.toLocaleString()}` : ''}
            </span>
          </div>
          <div className="px-3 md:px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs md:text-sm font-medium cursor-default">
            {isConnected && address ? `${address.slice(0, 5)}...${address.slice(-4)}` : 'DISCONNECTED'}
          </div>
        </div>
      </header>

      {/* Non-blocking status notification */}
      {notice && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-xs font-mono text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.2)] backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentScreen === 'menu' && <MenuScreen />}
        {currentScreen === 'game' && <GameplayScreen />}
        {currentScreen === 'leaderboard' && <LeaderboardScreen />}
      </main>

      {/* Footer Ticker */}
      <footer className="h-10 bg-black flex items-center px-4 md:px-8 border-t border-white/5 text-[10px] font-mono text-white/40 uppercase gap-8 overflow-hidden shrink-0">
        <div className="whitespace-nowrap flex gap-8 items-center animate-[scroll_20s_linear_infinite]">
          <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> NETWORK: BASE MAINNET (DENIM)</span>
          <span>OPERATOR: BC_9G7AGMS9</span>
          <span>BLOCK TIME: 200MS CANONICAL</span>
          <span>
            CANONICAL BLOCK: {denimBlock.blockNumber ? `#${denimBlock.blockNumber.toLocaleString()}` : 'SYNCING'}
          </span>
          {address && <span>LAST RELAY: {address.slice(0, 6)}...</span>}
          <span className="text-cyan-500/50">FINALITY: LATEST CANONICAL BLOCK</span>
          <span>TRUSTLESS AGENTS ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
