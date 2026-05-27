export const config = {
  runtime: 'edge', // Vercel Edge Runtime for standard Request/Response support
};

const TOOLS = [
  {
    name: "get_race_status",
    description: "Get the current status of the neural race/relay",
    input_schema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "start_race",
    description: "Start a new neural relay race",
    input_schema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "get_leaderboard",
    description: "Fetch the relay leaderboard",
    input_schema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "optimize_speed",
    description: "Optimize node synchronization speed",
    input_schema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "get_track_info",
    description: "Get information about the neural pathway track",
    input_schema: { type: "object", properties: {}, required: [] }
  }
];

export async function GET(req: Request) {
  return new Response(
    JSON.stringify({
      protocol: "MCP",
      version: "1.0.0",
      name: "Mind Sync Relay MCP Endpoint",
      status: "active",
      tools: [
        "get_race_status",
        "start_race",
        "get_leaderboard",
        "optimize_speed",
        "get_track_info"
      ],
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params, id } = body;

    let result = {};

    switch (method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {},
          serverInfo: {
            name: "Mind Sync Relay MCP Endpoint",
            version: "1.0.0"
          }
        };
        break;

      case "tools/list":
        result = { tools: TOOLS };
        break;

      case "tools/call":
        result = {
          content: [
            {
              type: "text",
              text: `Successfully executed ${params?.name || "tool"}. Neural relay adjusted.`
            }
          ]
        };
        break;

      case "prompts/list":
        result = { prompts: [] };
        break;

      case "resources/list":
        result = { resources: [] };
        break;

      default:
        result = {
          success: true,
          message: "Command routed via MCP",
          method,
          data: params
        };
    }

    return new Response(
      JSON.stringify({ jsonrpc: "2.0", id: id || null, result }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid request payload" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
