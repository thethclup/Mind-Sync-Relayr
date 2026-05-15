import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: MCP Endpoint
  app.get('/api/mcp', (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Mind Sync Relay MCP Endpoint",
      status: "active",
      description: "Active and optimized MCP server for Mind Sync Relay Orchestrator",
      capabilities: ["neural-synchronization", "mind-relay-operations", "thought-transmission"],
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/mcp', (req, res) => {
    try {
      const { action, command, params, task } = req.body || {};
      const cmd = (action || command || task || "").toLowerCase();

      let result: any = {};

      switch (cmd) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Mind Sync Relay Orchestrator",
            message: "Neural link established - Ready to sync" 
          };
          break;

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
            platform: "Base",
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
