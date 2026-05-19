// @ts-nocheck
import { NextResponse } from 'next/server';

const AGENT_INFO = {
  name: "Mind Sync Relay Orchestrator",
  status: "active",
  wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
  platform: "Mind Sync Relay",
  version: "1.0.0"
};

export async function GET() {
  return NextResponse.json(AGENT_INFO, {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    return NextResponse.json(
      {
        ...AGENT_INFO,
        received: body.action || "ping",
        message: "Agent received request natively via App Router"
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
