import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const BASE_MAINNET_RPC = process.env.BASE_RPC_URL || process.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';

interface CanonicalBlockSnapshot {
  chainId: number;
  network: string;
  upgrade: string;
  blockTimeMs: number;
  blockNumber: number;
  blockHash: string | null;
  timestamp: number | null;
  txCount: number;
  fetchedAt: number;
}

let cachedBlock: CanonicalBlockSnapshot | null = null;
const CACHE_TTL_MS = 1500;

async function fetchLatestCanonicalBlock(): Promise<CanonicalBlockSnapshot> {
  const now = Date.now();
  if (cachedBlock && now - cachedBlock.fetchedAt < CACHE_TTL_MS) {
    return cachedBlock;
  }

  const response = await fetch(BASE_MAINNET_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
    }),
  });

  if (!response.ok) {
    throw new Error(`Base Mainnet RPC returned HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: {
      number?: string;
      hash?: string;
      timestamp?: string;
      transactions?: string[];
    };
    error?: { message?: string };
  };

  if (data.error || !data.result?.number) {
    throw new Error(data.error?.message || 'Invalid canonical block response');
  }

  const snapshot: CanonicalBlockSnapshot = {
    chainId: 8453,
    network: 'Base Mainnet',
    upgrade: 'denim-200ms',
    blockTimeMs: 200,
    blockNumber: parseInt(data.result.number, 16),
    blockHash: data.result.hash ?? null,
    timestamp: data.result.timestamp ? parseInt(data.result.timestamp, 16) : null,
    txCount: Array.isArray(data.result.transactions) ? data.result.transactions.length : 0,
    fetchedAt: now,
  };

  cachedBlock = snapshot;
  return snapshot;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Canonical Base Mainnet (Denim 200ms) network status
  app.get('/api/network', async (req, res) => {
    try {
      const snapshot = await fetchLatestCanonicalBlock();
      res.json({
        status: 'online',
        ...snapshot,
        flashblocksRetired: true,
        canonicalBlockTag: 'latest',
        blockhashWindowSeconds: 51.2,
      });
    } catch (error) {
      res.status(502).json({
        status: 'degraded',
        chainId: 8453,
        network: 'Base Mainnet',
        upgrade: 'denim-200ms',
        blockTimeMs: 200,
        error: error instanceof Error ? error.message : 'Unable to reach Base Mainnet RPC',
      });
    }
  });

  // API 1: MCP Endpoint
  app.get('/api/mcp', (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Mind Sync Relay MCP Endpoint",
      status: "active",
      description: "Active and optimized MCP server for Mind Sync Relay Orchestrator on Base Mainnet (Denim 200ms)",
      network: {
        name: "Base Mainnet",
        chainId: 8453,
        upgrade: "denim-200ms",
        blockTimeMs: 200,
        flashblocksRetired: true,
        canonicalBlockTag: "latest"
      },
      capabilities: ["neural-synchronization", "mind-relay-operations", "thought-transmission"],
      tools: [
        {
          name: "sync_nodes",
          description: "Initialize synchronization between two neural nodes",
          input_schema: {
            type: "object",
            properties: {
              targetId: { type: "string" },
              intensity: { type: "number" }
            },
            required: ["targetId"]
          }
        }
      ],
      prompts: [
        {
          name: "start_relay",
          description: "Provide initialization commands for a new neural relay flow"
        }
      ],
      resources: [
        {
          uri: "mind://network/status",
          name: "Neural Network Status",
          description: "Real-time canonical 200ms block state of Base Mainnet Denim"
        }
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/mcp', async (req, res) => {
    try {
      const { action, command, params, task } = req.body || {};
      const cmd = (action || command || task || "").toLowerCase();

      let result: any = {};

      switch (cmd) {
        case "status":
        case "ping": {
          let latestBlock: number | null = null;
          try {
            const snapshot = await fetchLatestCanonicalBlock();
            latestBlock = snapshot.blockNumber;
          } catch {
            latestBlock = null;
          }
          result = { 
            status: "online", 
            agent: "Mind Sync Relay Orchestrator",
            network: "Base Mainnet (Denim)",
            chainId: 8453,
            blockTimeMs: 200,
            latestCanonicalBlock: latestBlock,
            message: "Neural link established on Base Mainnet Denim (200ms canonical blocks)" 
          };
          break;
        }

        case "execute":
          result = {
            success: true,
            executed: params || command,
            executedAt: new Date().toISOString(),
            message: "Mind sync command transmitted successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Mind Sync Relay Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base Mainnet",
            chainId: 8453,
            upgrade: "denim-200ms",
            blockTimeMs: 200,
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Thought received and processed",
            data: req.body
          };
      }

      res.json({
        status: "success",
        agent: "Mind Sync Relay Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process mind sync command"
      });
    }
  });

  // API 2: Agent API
  app.get('/api/agent', (req, res) => {
    res.json({
      name: "Mind Sync Relay Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Mind Sync Relay",
      network: "Base Mainnet",
      chainId: 8453,
      upgrade: "denim-200ms",
      blockTimeMs: 200,
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
