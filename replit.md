# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main user-facing artifact is a React/Vite MODBUS TCP/IP industrial dashboard at `artifacts/modbus-dashboard`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend artifact**: React + Vite + Tailwind CSS + Framer Motion + Recharts + lucide-react

## MODBUS Dashboard

- Artifact: `artifacts/modbus-dashboard`
- Preview path: `/`
- Purpose: professional animated SCADA/HMI-style dashboard explaining MODBUS TCP/IP.
- Main initial screen: advanced frame analysis simulation (`src/pages/AnalyseTrame.tsx`).
- Key UI features: animated TCP handshake, client/server packet transmission, MBAP/PDU byte-level frame shapes, TCP/IP layer encapsulation, KPI cards, live MODBUS log, charts, function code table, MBAP field cards, TCP parameter cards, RTU vs TCP comparison, and sequence diagrams.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/modbus-dashboard run dev` — run MODBUS dashboard locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
