# Codebase Structure

**Analysis Date:** 2026-01-04

## Directory Layout

```
next-app/                      # Monorepo root
├── api/                       # .NET 8 backend - Minimal API
├── client/                    # Next.js 16 frontend - SPA
├── database/                  # Database schemas/scripts (assumed)
├── .planning/                 # Planning documents (GSD workflow)
│   └── codebase/             # This directory
├── .claude/                   # Claude-specific configuration
├── CLAUDE.md                  # Project guidance for Claude Code
├── README.md                  # Project documentation
├── GEMINI.md                  # Additional documentation
├── .git/                      # Version control
└── .gitignore                 # Ignored files
```

## Directory Purposes

### `api/` - Backend (.NET 8 Minimal API)

**Purpose:** ASP.NET Core Web API serving at `/monitor` base path
**Contains:** C# source files, configuration, endpoints
**Key Pattern:** Minimal APIs with reflection-based endpoint discovery

```
api/
├── Program.cs                 # Application entry point
│                              # - CORS policy (localhost:3000)
│                              # - DapperContext singleton
│                              # - Windows Authentication + JWT infrastructure
│                              # - Swagger UI (/monitor/swagger)
│                              # - Auto-discover endpoints via reflection
│                              # - Base path: /monitor
│
├── appsettings.json           # Configuration
│                              # - ConnectionStrings:Default (SQL Server)
│                              # - JWT:Key (secret key)
│                              # - Logging configuration
│
├── api.csproj                 # Project file
│                              # Dependencies: Dapper, SqlClient, BCrypt, Swagger, JWT, Negotiate
│
├── Endpoints/                 # Route handlers implementing IEndpointRouteHandler
│   ├── UserEndpoints.cs       # /api/users CRUD + /me + /inactivate
│   ├── EmployeeEndpoints.cs   # /api/employees CRUD + /without-access
│   ├── UserRoleEndpoints.cs   # /api/users/roles
│   └── UserSettingsEndpoints.cs  # /api/users/{userId}/settings
│
├── Models/                    # Domain objects (POCOs)
│   ├── User.cs                # User + Employee + Role joined properties
│   ├── Employee.cs            # Employee entity
│   ├── UserRole.cs            # Role information
│   └── UserSettings.cs        # User preferences
│
├── Utils/                     # Infrastructure utilities
│   ├── DapperContext.cs       # Database connection factory
│   ├── IDapperContext.cs      # Interface for DI
│   ├── IEndpointRouteHandler.cs  # Endpoint handler interface
│   └── EndpointRouteBuilderExtensions.cs  # Auto-discovery via reflection
│
├── Properties/
│   └── launchSettings.json    # IIS profiles (http, https, IIS Express)
│
├── .config/
│   └── dotnet-tools.json      # dotnet-ef 9.0.1
│
├── bin/, obj/                 # Build output (ignored)
└── wwwroot/                   # Static files
```

### `client/` - Frontend (Next.js 16 + React 19)

**Purpose:** Next.js App Router SPA with static export capability
**Contains:** TypeScript/React source, configuration, static assets
**Key Pattern:** Feature-based routing with centralized configuration

```
client/
├── src/
│   ├── app/                   # Next.js App Router - pages & routes
│   │   ├── layout.tsx         # Root layout (AntdRegistry → ThemeProvider → UserProvider)
│   │   ├── page.tsx           # Dashboard (/) - stats cards, recent jobs table
│   │   ├── globals.css        # Global styles
│   │   │
│   │   ├── users/             # User management feature
│   │   │   ├── page.tsx       # Main users page with table/form
│   │   │   ├── UserForm.tsx   # Create/edit modal form
│   │   │   ├── UserTable.tsx  # Data table
│   │   │   ├── UserToolbar.tsx  # Search + add button
│   │   │   └── UserAvatar.tsx   # Avatar component
│   │   │
│   │   ├── jobs/page.tsx      # Job tracking feature
│   │   ├── approvals/page.tsx # Approval workflow feature
│   │   ├── templates/page.tsx # Template library feature
│   │   ├── items/page.tsx     # Item management feature
│   │   ├── upload/page.tsx    # File upload feature
│   │   ├── settings/page.tsx  # User settings/preferences
│   │   └── help/page.tsx      # Help documentation
│   │
│   ├── components/            # Shared UI components
│   │   ├── AppLayout.tsx      # Main shell (sidebar, header, breadcrumbs, content)
│   │   └── ThemeToggle.tsx    # Light/dark mode switcher
│   │
│   ├── config/                # Centralized configuration - SINGLE SOURCE OF TRUTH
│   │   ├── index.ts           # Central export point (re-exports all configs)
│   │   ├── app.config.ts      # name: "Update Hub", version: "1.0.0", metadata
│   │   ├── api.config.ts      # baseUrl (NEXT_PUBLIC_API_URL), timeout, headers
│   │   ├── routes.config.tsx  # mainRoutes, footerRoutes with icons and i18n keys
│   │   ├── theme.config.ts    # colors (primary: #1677ff), siderColorPalette, themeTokens
│   │   ├── layout.config.ts   # sider: 200px, header: 64px, spacing, transitions
│   │   ├── storage.config.ts  # storageKeys (THEME, LANGUAGE, DATE_FORMAT, SIDER_COLOR)
│   │   └── i18n.config.ts     # supportedLanguages: [en, es], dateFormats
│   │
│   ├── context/               # React Context providers
│   │   ├── ThemeContext.tsx   # theme, language, dateFormat, siderColor
│   │   └── UserContext.tsx    # currentUser, loading, error, refetchUser
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── useUsers.ts        # User CRUD operations with notifications
│   │
│   ├── services/              # API communication layer
│   │   ├── userService.ts     # User API calls (fetch-based)
│   │   └── employeeService.ts # Employee API calls
│   │
│   ├── i18n/                  # Internationalization
│   │   ├── config.ts          # i18next configuration
│   │   └── locales/           # Translation files (en.json, es.json)
│   │
│   └── utils/                 # Utility functions
│       └── userUtils.ts       # Avatar colors, name initials, date formatting
│
├── package.json               # Dependencies & scripts
│                              # React 19, Next.js 16, Ant Design 5, Tailwind CSS 4
│                              # Scripts: dev, build, start, lint
│
├── pnpm-lock.yaml            # pnpm lockfile (primary package manager)
├── package-lock.json          # npm lockfile (secondary)
├── tsconfig.json              # TypeScript config (strict mode, @/* path aliases)
├── next.config.ts             # Next.js config (static export enabled)
├── eslint.config.mjs          # ESLint 9 config
├── postcss.config.mjs         # PostCSS with Tailwind CSS
├── tailwind.config.ts         # Tailwind CSS configuration
├── .env.example               # Environment variable template (NEXT_PUBLIC_API_URL)
├── .next/                     # Build output (ignored)
└── node_modules/              # Dependencies (ignored)
```

### `database/` (assumed)

**Purpose:** Database schemas, stored procedures, migration scripts
**Contains:** Likely SQL scripts for schema management
**Note:** Not fully explored but referenced in architecture

### `.planning/` - Planning Documents

**Purpose:** Project planning and codebase documentation (GSD workflow)
**Contains:** Codebase analysis documents
**Key files:**
- `codebase/STACK.md` - This file location
- `codebase/ARCHITECTURE.md`
- `codebase/STRUCTURE.md`
- `codebase/CONVENTIONS.md`
- `codebase/TESTING.md`
- `codebase/INTEGRATIONS.md`
- `codebase/CONCERNS.md`

### `.claude/` - Claude Configuration

**Purpose:** Claude Code CLI configuration and commands
**Contains:** Get-Shit-Done workflow files, commands, templates

## Key File Locations

**Entry Points:**
- `api/Program.cs` - Backend application entry point
- `client/src/app/layout.tsx` - Frontend root layout
- `client/src/app/page.tsx` - Dashboard home page

**Configuration:**
- `api/appsettings.json` - Backend configuration (connection strings, JWT)
- `api/Properties/launchSettings.json` - IIS launch profiles
- `client/.env.example` - Frontend environment variables template
- `client/tsconfig.json` - TypeScript configuration
- `client/next.config.ts` - Next.js build configuration
- `client/eslint.config.mjs` - Linting rules
- `client/src/config/` - Centralized app configuration (ALL constants here)

**Core Logic:**
- `api/Endpoints/*.cs` - HTTP endpoint handlers
- `api/Utils/DapperContext.cs` - Database access
- `client/src/services/*.ts` - API communication
- `client/src/hooks/*.ts` - Feature state management
- `client/src/context/*.tsx` - Global state providers

**Testing:**
- Not detected - No test files exist

**Documentation:**
- `CLAUDE.md` - Project guidance for Claude Code
- `README.md` - User-facing documentation
- `api/README.md` - Backend-specific documentation

## Naming Conventions

**Files:**
- Backend: PascalCase (e.g., `UserEndpoints.cs`, `DapperContext.cs`)
- Frontend pages: `page.tsx` (Next.js App Router convention)
- Frontend components: PascalCase (e.g., `AppLayout.tsx`, `UserForm.tsx`)
- Frontend utilities: kebab-case with suffix (e.g., `user-service.ts`, `user-utils.ts`)
- Frontend config: kebab-case with `.config` suffix (e.g., `theme.config.ts`)

**Directories:**
- Backend: PascalCase (e.g., `Endpoints`, `Models`, `Utils`)
- Frontend: kebab-case (e.g., `app`, `components`, `services`, `hooks`)
- Feature routes: kebab-case (e.g., `users`, `jobs`, `approvals`)

**Special Patterns:**
- Endpoint files: `{Entity}Endpoints.cs`
- Service files: `{entity}Service.ts`
- Utility files: `{entity}Utils.ts`
- Config files: `{name}.config.ts`
- Context files: `{Name}Context.tsx`
- Hook files: `use{Name}.ts`

## Where to Add New Code

**New Backend Endpoint:**
- Primary code: `api/Endpoints/{Entity}Endpoints.cs`
- Model: `api/Models/{Entity}.cs`
- Stored procedure: Database (naming: `{Entity}_{Action}`)
- No manual routing needed (auto-discovered via reflection)

**New Frontend Feature:**
- Route: `client/src/app/{feature}/page.tsx`
- Components: `client/src/app/{feature}/{ComponentName}.tsx`
- Service: `client/src/services/{feature}Service.ts`
- Hook: `client/src/hooks/use{Feature}.ts`
- Route config: Add to `client/src/config/routes.config.tsx` (mainRoutes or footerRoutes)

**New Configuration:**
- Add to `client/src/config/{name}.config.ts`
- Re-export from `client/src/config/index.ts`
- Import via `import { nameConfig } from '@/config'`

**Utilities:**
- Backend: `api/Utils/{UtilityName}.cs`
- Frontend: `client/src/utils/{entity}-utils.ts`

## Special Directories

**Auto-generated/Build Output:**
- `api/bin/`, `api/obj/` - .NET build artifacts (gitignored)
- `client/.next/` - Next.js build output (gitignored)
- `client/node_modules/` - Dependencies (gitignored)

**Package Management:**
- `client/pnpm-lock.yaml` - pnpm lockfile (primary package manager)
- `client/package-lock.json` - npm lockfile (secondary)

---

*Structure analysis: 2026-01-04*
*Update when directory structure changes*
