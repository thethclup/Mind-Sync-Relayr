import { useEffect, useState } from 'react';
import { useBlockNumber } from 'wagmi';
import { BASE_MAINNET_WS_URL, baseDenim } from './wagmi';

export interface BaseDenimNetworkState {
  blockNumber: number | null;
  blockTimeMs: number;
  txCount: number | null;
  isLive: boolean;
}

/**
 * Tracks canonical Base Mainnet (Denim 200ms) blocks.
 * When a WebSocket RPC is configured, wagmi uses `eth_subscribe("newHeads")`.
 * Over HTTP, it polls the server-cached canonical `latest` block endpoint.
 */
export function useBaseDenimBlock(): BaseDenimNetworkState {
  const hasWs = Boolean(BASE_MAINNET_WS_URL);
  const { data: wsBlockNumber } = useBlockNumber({
    chainId: baseDenim.id,
    watch: hasWs,
    query: { enabled: hasWs },
  });

  const [httpSnapshot, setHttpSnapshot] = useState<BaseDenimNetworkState>({
    blockNumber: null,
    blockTimeMs: 200,
    txCount: null,
    isLive: false,
  });

  useEffect(() => {
    if (hasWs) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch('/api/network');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.blockNumber === 'number') {
          setHttpSnapshot({
            blockNumber: data.blockNumber,
            blockTimeMs: data.blockTimeMs ?? 200,
            txCount: typeof data.txCount === 'number' ? data.txCount : null,
            isLive: data.status === 'online',
          });
        }
      } catch {
        if (!cancelled) {
          setHttpSnapshot((prev) => ({ ...prev, isLive: false }));
        }
      }
    };

    poll();
    const id = setInterval(poll, 2500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [hasWs]);

  if (hasWs && wsBlockNumber !== undefined) {
    return {
      blockNumber: Number(wsBlockNumber),
      blockTimeMs: 200,
      txCount: null,
      isLive: true,
    };
  }

  return httpSnapshot;
}
