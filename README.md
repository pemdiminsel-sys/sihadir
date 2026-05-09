# SIHADIR MINSEL - Regional GovTech Platform

Welcome to the **SIHADIR MINSEL** (Sistem Kehadiran Kegiatan Pemerintah Kabupaten Minahasa Selatan). This is a foundational digital governance platform designed for regional government modernization.

## Project Structure

```text
sihadir/
├── apps/
│   ├── backend/          # NestJS API (Prisma, PostgreSQL, Redis, BullMQ)
│   └── frontend/         # Next.js Dashboard (Tailwind, ShadCN, PWA)
├── docker-compose.yml    # Infrastructure Stack (Postgres, Redis, MinIO)
├── ENTERPRISE_ARCHITECTURE.md # Strategic Architectural Principles
├── PROJECT_SUMMARY.md    # Executive Summary & SPBE Alignment
└── walkthrough.md        # Technical Implementation Walkthrough
```

## Quick Start

### 1. Infrastructure
Ensure Docker is installed and running:
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd apps/backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

### 3. Frontend Setup
```bash
cd apps/frontend
npm install
npm run dev
```

## Key Documentation
- **Architecture**: [ENTERPRISE_ARCHITECTURE.md](file:///c:/Users/hence/.gemini/antigravity/scratch/sihadir/ENTERPRISE_ARCHITECTURE.md)
- **Executive Summary**: [PROJECT_SUMMARY.md](file:///c:/Users/hence/.gemini/antigravity/scratch/sihadir/PROJECT_SUMMARY.md)
- **Technical Walkthrough**: [walkthrough.md](file:///C:/Users/hence/.gemini/antigravity/brain/a551cfb8-f977-49a8-8bb0-28dc8fab5969/walkthrough.md)

## Enterprise Features
- ✅ **Multi-tenancy**: Scoped data access for each OPD department.
- ✅ **Command Center**: Futuristic real-time monitoring dashboard.
- ✅ **PWA Support**: Offline-first attendance capability.
- ✅ **Audit Trail**: Immutable system activity logging.
- ✅ **SPBE Analytics**: Digitalization maturity monitoring.

---
*Developed for the Government of Minahasa Selatan.*
