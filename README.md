# Mind Sync Relay

**Mind Sync Relay** is a serene yet strategic puzzle game where you act as a **Neural Relay Operator**. Your mission is to reconnect fragmented minds in a vast, broken digital consciousness network by building efficient signal pathways and creating harmonious connections.

## Features Let's Create Harmony

- **Neural Network:** Reconnect floating mind nodes by drawing signal paths.
- **Match Frequencies:** Connect paths based on node frequencies (Calm, Logic, Chaos, Emotion).
- **On-chain Integration:** Leverage Base Mainnet features to verify synchronization cascades via signatures.
- **ERC-8004 Trustless Agents:** Mind Sync Relay features an integrated AI Orchestrator Agent.
- **ERC-8021 Transaction Attribution:** Supports transaction attribution standards for builders.

## Network & Integration

This platform natively supports connection to Base networks. Connect your wallet as an Operator and use Base network to record your Mind Network synchronizations on-chain.

- **Builder Code:** `bc_9g7agms9`
- **Agent Orchestrator:** Located at `.well-known/agent-card.json`

## Local Development

The project is built using:
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Express (for the Agent MCP API and Agent Routing)
- Wagmi + Viem

To run the project locally:

```bash
npm install
npm run dev
```

*Note: Environment variables for external services should be configured in `.env.local` adhering to `.env.example`. No sensitive API keys are exposed directly into the codebase repository.*

## Trustless Agents - ERC-8004
This platform includes an endpoint describing our Agent orchestration capabilities via the `/.well-known/agent-card.json` standard. Check out the internal API for agent Model Context Protocol.

## Security
- Do not commit your own private `.env` files.
- The `GEMINI_API_KEY` operates server-side, never exposing it directly on the client.
