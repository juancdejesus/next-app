# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Enterprise SaaS Data Management Platform with:
- **Backend**: .NET 8 minimal API (in `api/`) using Dapper + SQL Server with stored procedures
- **Frontend**: Next.js 16 App Router (in `client/src/`) with TypeScript, React 19, Ant Design 5, and Tailwind CSS 4

## Development Commands

### Backend (API)
```bash
cd api
dotnet restore          # Restore dependencies
dotnet build            # Build the project
dotnet run              # Run development server (https://localhost:<port>/monitor)
dotnet test             # Run tests
dotnet publish -c Release  # Create production build
```

The API runs at `/monitor` base path with Swagger UI at `/monitor/swagger`.

### Frontend (Client)
```bash
cd client
pnpm install            # Install dependencies (uses pnpm)
pnpm dev                # Start dev server (http://localhost:3000)
pnpm build              # Create production build
pnpm start              # Run production server
pnpm lint               # Run ESLint
```

Note: This project uses **pnpm** as the package manager (see `pnpm-lock.yaml`).

## Architecture & Key Patterns

### Backend Architecture

**Endpoint Registration Pattern**:
- All endpoint classes implement `IEndpointRouteHandler` interface with a `MapEndpoints()` method
- Endpoints are auto-discovered via reflection in `Program.cs` using `app.MapGroup("/api").MapEndpoints(Assembly.GetExecutingAssembly())`
- To add new endpoints: create a class implementing `IEndpointRouteHandler` in `api/Endpoints/`

**Database Access Pattern**:
- Uses **Dapper ORM** with **SQL Server stored procedures** (MySQL support commented out in `DapperContext.cs`)
- `DapperContext` is injected as a singleton, provides `CreateConnection()` method
- All database operations use stored procedures with naming convention: `{Entity}_{Action}` (e.g., `User_GetList`, `User_Add`, `User_Update`)
- Standard pattern:
  ```csharp
  using var connection = context.CreateConnection();
  var result = await connection.QueryAsync<dynamic>(
      "StoredProcedureName",
      parameters,
      commandType: CommandType.StoredProcedure
  );
  ```

**Database Configuration**:
- Current configuration uses **SQL Server** (`SqlConnection` in `DapperContext.cs:19`)
- To switch to MySQL: uncomment line 18 and comment line 19 in `api/Utils/DapperContext.cs`
- Connection string in `api/appsettings.json` under `ConnectionStrings:Default`

**Authentication**:
- Configured for **Windows Authentication** when running under IIS/IIS Express
- JWT Bearer infrastructure configured but not fully implemented
- Passwords hashed with **BCrypt** before storage
- `/api/users/me` endpoint returns current Windows authenticated user

**Models & Naming**:
- Backend models use **snake_case** properties (e.g., `user_status`, `password_hash`, `role_id`) to match database columns
- Frontend types use **PascalCase** (e.g., `UserStatus`, `PasswordHash`, `RoleId`)
- Be mindful of this casing difference when mapping between layers

### Frontend Architecture

**Project Structure**:
```
client/src/
├── app/                    # Next.js App Router pages
│   ├── users/             # User management feature
│   ├── jobs/              # Job tracking feature
│   ├── approvals/         # Approval workflow feature
│   ├── items/             # Item management feature
│   ├── templates/         # Template library feature
│   ├── upload/            # File upload feature
│   ├── settings/          # User settings feature
│   ├── help/              # Help documentation
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Dashboard home
├── components/            # Shared React components
│   ├── AppLayout.tsx      # Main layout with sidebar, header, breadcrumbs
│   ├── ThemeToggle.tsx    # Dark/light mode switcher
│   └── user/              # User-specific components
│       ├── UserTable.tsx
│       ├── UserForm.tsx
│       ├── UserToolbar.tsx
│       └── UserAvatar.tsx
├── context/               # React Context providers
│   └── ThemeContext.tsx   # Theme, language, date format state
├── hooks/                 # Custom React hooks
│   └── useUsers.ts        # User CRUD operations with error handling
├── services/              # API communication layer
│   └── userService.ts     # User API calls
├── utils/                 # Utility functions
│   └── userUtils.ts       # Avatar colors, name initials, date formatting
└── i18n/                  # Internationalization (English/Spanish)
```

**State Management**:
- Uses **React Context API** (no Redux/Zustand)
- `ThemeContext` manages: theme (dark/light), language (en/es), date format, sidebar color
- All theme settings persisted to **localStorage** to prevent flash on page load
- Component-level state uses `useState` for forms, modals, search

**API Communication**:
- Service layer in `client/src/services/` handles all API calls using `fetch`
- API base URL configured via `NEXT_PUBLIC_API_URL` environment variable
- Custom hooks (e.g., `useUsers`) wrap service calls with error handling and Ant Design message notifications
- Type-safe interfaces defined for all API contracts

**Ant Design Best Practices**:
- **Always use `App.useApp()` hook** instead of importing `message`, `modal`, or `notification` directly from `antd`
  ```typescript
  // ✅ Correct
  const { message } = App.useApp();
  message.success('Success!');

  // ❌ Incorrect
  import { message } from 'antd';
  ```
- Root layout wraps app with `<App>` component from Ant Design for proper context integration
- Dynamic theming via `ConfigProvider` with theme token customization

**Routing & Navigation**:
- Uses Next.js 16 App Router (file-based routing)
- Sidebar navigation in `AppLayout.tsx` with route mapping (`routeToKeyMap`, `keyToRouteMap`)
- Client-side navigation via `useRouter()` and `usePathname()` from `next/navigation`

**Internationalization**:
- `i18next` with browser language detection
- Supports English (`en`) and Spanish (`es`)
- Configuration in `client/src/i18n/`

### CORS Configuration

API configured to allow requests from `http://localhost:3000` with credentials. Update CORS policy in `api/Program.cs` for different environments:
```csharp
policy.WithOrigins("http://localhost:3000")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
```

## Common Workflows

### Adding a New Backend Endpoint

1. Create new class in `api/Endpoints/` implementing `IEndpointRouteHandler`
2. Implement `MapEndpoints(IEndpointRouteBuilder app)` method
3. Create corresponding stored procedures in SQL Server
4. No manual registration needed - auto-discovered via reflection

### Adding a New Frontend Feature

1. Create new page directory under `client/src/app/feature-name/`
2. Add `page.tsx` for the route
3. Create service functions in `client/src/services/featureService.ts`
4. Create custom hooks in `client/src/hooks/useFeature.ts` for state management
5. Add types/interfaces for API contracts
6. Update sidebar navigation in `components/AppLayout.tsx`

### Database Schema Changes

1. Create/modify stored procedures in SQL Server (not MySQL currently)
2. Update model classes in `api/Models/` with snake_case properties
3. Update frontend TypeScript interfaces with PascalCase properties
4. Update service layer to handle new fields

## Important Conventions

- **Package Manager**: Use `pnpm` (not npm or yarn)
- **Database**: Currently configured for SQL Server (not MySQL)
- **Case Sensitivity**: Backend uses snake_case, frontend uses PascalCase
- **Static Methods**: Use `App.useApp()` hook for Ant Design messages/modals
- **Theme Persistence**: All UI preferences saved to localStorage
- **Authentication**: Windows Authentication expected when running under IIS
- **Base Path**: API served at `/monitor` prefix
- **CORS**: Frontend expected at `http://localhost:3000` in development
