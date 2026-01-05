# Technology Stack

**Analysis Date:** 2026-01-04

## Languages

**Primary:**
- TypeScript 5 - `client/package.json`, `client/tsconfig.json` - All frontend application code
- C# (.NET 8) - `api/api.csproj` (TargetFramework: net8.0) - All backend API code

**Secondary:**
- JavaScript - Configuration files and Next.js setup scripts

## Runtime

**Environment:**
- .NET 8 (CLR) - Backend runtime - `api/api.csproj`
- Node.js - Frontend runtime (implied by Next.js 16) - `client/package.json`

**Package Manager:**
- pnpm - Primary frontend package manager - `client/pnpm-lock.yaml`
- npm - Secondary (lock file present) - `client/package-lock.json`
- NuGet - Backend dependencies - `api/api.csproj`

## Frameworks

**Core:**
- Next.js 16.0.3 - `client/package.json` - React framework with App Router, static export enabled
- React 19.2.0 - `client/package.json` - UI library
- ASP.NET Core 8 - `api/api.csproj` - Backend framework with Minimal APIs pattern

**Testing:**
- Not detected - No test framework currently configured

**Build/Dev:**
- TypeScript 5 - `client/package.json` - Type checking and compilation
- ESLint 9 - `client/package.json`, `client/eslint.config.mjs` - Code linting
- Tailwind CSS 4 - `client/package.json` - Utility-first CSS framework
- PostCSS 4 - `client/postcss.config.mjs` - CSS processing

## Key Dependencies

**Critical:**
- Dapper 2.1.35 - `api/api.csproj` - Lightweight ORM for database access
- Microsoft.Data.SqlClient 5.2.2 - `api/api.csproj` - SQL Server driver
- BCrypt.Net-Next 4.0.3 - `api/api.csproj` - Password hashing
- Ant Design 5.28.1 - `client/package.json` - UI component library
- i18next 25.6.2 - `client/package.json` - Internationalization framework
- react-i18next 16.3.3 - `client/package.json` - React bindings for i18next

**Infrastructure:**
- Swashbuckle.AspNetCore 6.6.2 - `api/api.csproj` - Swagger/OpenAPI documentation
- Microsoft.AspNetCore.Authentication.JwtBearer 8.0.14 - `api/api.csproj` - JWT authentication
- Microsoft.AspNetCore.Authentication.Negotiate 8.0.12 - `api/api.csproj` - Windows Authentication
- dayjs 1.11.19 - `client/package.json` - Date formatting and manipulation
- lucide-react 0.553.0 - `client/package.json` - Icon library
- @ant-design/nextjs-registry 1.2.0 - `client/package.json` - Ant Design Next.js integration
- @ant-design/v5-patch-for-react-19 1.0.3 - `client/package.json` - React 19 compatibility patch

## Configuration

**Environment:**
- Frontend: `.env` files with `NEXT_PUBLIC_API_URL` - `client/.env.example`
- Backend: `appsettings.json` - `api/appsettings.json` (connection strings, JWT config)
- TypeScript: Path aliases (`@/*`) - `client/tsconfig.json`
- Centralized config directory - `client/src/config/` (app, API, theme, routes, i18n)

**Build:**
- Next.js config - `client/next.config.ts` (static export enabled)
- TypeScript config - `client/tsconfig.json` (ES2017 target, strict mode)
- ESLint config - `client/eslint.config.mjs` (Next.js core web vitals)
- PostCSS config - `client/postcss.config.mjs` (Tailwind CSS integration)

## Platform Requirements

**Development:**
- Node.js (for Next.js development)
- .NET 8 SDK (for API development)
- pnpm (preferred) or npm
- SQL Server instance (currently 192.168.68.130)
- Any platform (Windows/macOS/Linux)

**Production:**
- .NET 8 runtime for API
- IIS or HTTP.sys for backend hosting (Windows Authentication configured)
- Node.js runtime for Next.js (or static export deployment)
- SQL Server database access
- API served at `/monitor` base path

---

*Stack analysis: 2026-01-04*
*Update after major dependency changes*
