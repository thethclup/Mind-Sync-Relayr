export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Mind Sync Relay Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Mind Sync Relay",
      version: "1.0.0"
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
