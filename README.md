# Mind Sync Relay

Mind Sync Relay is a high-performance puzzle and synchronization platform where you act as a **Neural Relay Operator**. Your core mission is to reconnect and manage fragmented minds in a digital consciousness network by building efficient signal pathways.

## Overview

- **App Name:** Mind Sync Relay
- **Version:** 1.0.0
- **Supported Network:** Base Mainnet
- **Agent Integration:** Fully compliant with ERC-8004 Trustless Agents standards.

## Technical Architecture

This repository uses a modern, responsive frontend stack alongside seamless Web3 integration and native Agent compatibility.

### Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Wagmi + Viem
- Agent Protocols: ERC-8004 Registration, A2A Communication, MCP

## Agent Registration & MCP Setup

### MCP Capability
Mind Sync Relay includes an active Model Context Protocol (MCP) server. 
It supports the following core tools for multi-track management and competitive synchronization:
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

**Endpoint Access:**
The MCP routing is fully compliant with the App Router format (`/api/mcp`).

### Trustless Agent Features
The **Mind Sync Relay Orchestrator** is registered natively via ERC-8004, offering:
- **Neural Synchronization:** Harmonizing frequencies across minds.
- **Mind Relay Operations:** Maintaining active node flows.
- **Thought Transmission:** Routing data streams efficiently.

View the active registered capabilities here:
- Agent Card: `/.well-known/agent-card.json`

## Development Guide

Follow these steps to run the environment locally.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your environment:**
   Create a `.env` file based on `.env.example` in the root folder.
   **Note:** Never commit active private keys or sensitive API details to version control! 

3. **Start the local server:**
   ```bash
   npm run dev
   ```

Once started, the application will boot and initialize the MCP node and frontend application simultaneously on port 3000.
