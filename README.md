# Mind Sync Relay

Mind Sync Relay is a high-performance puzzle and synchronization platform where you act as a **Neural Relay Operator**. Your core mission is to reconnect and manage fragmented minds in a digital consciousness network by building efficient signal pathways.

## Overview

- **App Name:** Mind Sync Relay Orchestrator
- **Description:** High-performance AI Agent specialized in mind synchronization, neural relay operations, thought transmission, multi-mind orchestration and cognitive automation on Base.
- **Version:** 1.0.0
- **Primary URLs:** 
  - Vercel App: `https://mind-sync-relayr.vercel.app`
  - Agent Card: `https://mind-sync-relayr.vercel.app/.well-known/agent-card.json`
- **Supported Chains:** Base Mainnet (`eip155:8453`)

## Technical Architecture

This application consists of a modern, responsive frontend working in tandem with seamless Web3 integration and native Agent compatibility.

### Tech Stack
- Next.js 14 App Router
- React & TypeScript
- Tailwind CSS
- Wagmi + Viem
- Agent Protocols: ERC-8004 Registration, A2A Communication, MCP

## Agent Capabilities & Skills

The **Mind Sync Relay Orchestrator** is registered natively via ERC-8004, offering the following capabilities:
- Neural Synchronization
- Mind Relay Operations
- Thought Transmission
- Multi-Mind Orchestration
- Consciousness Linking
- Cognitive Automation
- MCP Command Execution

## MCP Setup Guide

The system includes an active Model Context Protocol (MCP) server for deep AI connectivity.

### Provided MCP Tools
- `get_race_status`: Get the current status of the neural race/relay.
- `start_race`: Start a new neural relay race.
- `get_leaderboard`: Fetch the relay leaderboard.
- `optimize_speed`: Optimize node synchronization speed.
- `get_track_info`: Get information about the neural pathway track.

**Endpoint Access:**
The MCP routing runs on `/api/mcp`. With Next.js 14, this uses the App Router format (`app/api/mcp/route.ts`), which ensures native streaming, strict response serialization, and compatibility with edge deployments.

## How to Run Locally

Follow these steps to run the environment locally.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your environment:**
   Create a `.env.local` file based on the default configurations.
   **Note:** Keep this file out of source control. Never commit private keys or secrets.

3. **Start the local server:**
   ```bash
   npm run dev
   ```

The application will start on port `3000`. You can test the MCP endpoint at `http://localhost:3000/api/mcp` using any compliant Model Context Protocol client.

