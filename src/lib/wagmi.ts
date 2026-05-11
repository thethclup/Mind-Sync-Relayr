import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, safe, walletConnect } from 'wagmi/connectors'

export const projectId = 'mind-sync-relay' // Replace with your WalletConnect ID if using WC

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    safe(),
  ],
  transports: {
    [base.id]: http(),
  },
})
