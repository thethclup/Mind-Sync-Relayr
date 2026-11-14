import { http, webSocket, fallback, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const projectId = 'mind-sync-relay'

export const BASE_MAINNET_RPC_URL =
  import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org'
export const BASE_MAINNET_WS_URL = import.meta.env.VITE_BASE_WS_URL || ''

/**
 * Base Mainnet configured for the Denim upgrade (200ms canonical native blocks).
 * Flashblocks and preconfirmation endpoints are retired on Base Mainnet.
 */
export const baseDenim = defineChain({
  ...base,
  blockTime: 200,
  rpcUrls: {
    default: {
      http: [BASE_MAINNET_RPC_URL],
      ...(BASE_MAINNET_WS_URL ? { webSocket: [BASE_MAINNET_WS_URL] } : {}),
    },
  },
})

export const DENIM_MAINNET_INFO = {
  chainId: baseDenim.id,
  name: 'Base Mainnet (Denim)',
  blockTimeMs: 200,
  blockhashWindowBlocks: 256,
  blockhashWindowSeconds: 51.2,
  rpcUrl: BASE_MAINNET_RPC_URL,
  wsUrl: BASE_MAINNET_WS_URL || null,
  explorerUrl: 'https://basescan.org',
} as const

export const config = createConfig({
  chains: [baseDenim],
  pollingInterval: 200,
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Mind Sync Relay Orchestrator',
    }),
  ],
  transports: {
    [baseDenim.id]: BASE_MAINNET_WS_URL
      ? fallback([webSocket(BASE_MAINNET_WS_URL), http(BASE_MAINNET_RPC_URL)])
      : http(BASE_MAINNET_RPC_URL),
  },
})
