# Architecture

**Analysis Date:** 2026-01-04

## Pattern Overview

**Overall:** Full-Stack Enterprise SaaS Monorepo with Decoupled Frontend & Backend

**Key Characteristics:**
- Monorepo structure with separate frontend and backend projects
- Backend: .NET 8 Minimal APIs with vertical slice architecture
- Frontend: Next.js 16 App Router with server/client component boundaries
- Communication: REST API over HTTP/HTTPS with CORS
- Database: SQL Server via stored procedures (Dapper ORM)

## Layers

### Backend Layers (`api/`)

**Route Handler Layer** - `api/Endpoints/*.cs`
- Purpose: HTTP endpoint definitions and routing
- Contains: Endpoint classes implementing `IEndpointRouteHandler`
- Depends on: Data access layer (DapperContext), Models
- Used by: HTTP requests from frontend
- Entry: `api/Program.cs` - Auto-discovers endpoints via reflection
- Pattern: MapGet, MapPost, MapPut, MapDelete for CRUD operations
- Examples: `api/Endpoints/UserEndpoints.cs`, `api/Endpoints/EmployeeEndpoints.cs`

**Data Access Layer** - `api/Utils/DapperContext.cs`
- Purpose: Database connection abstraction
- Contains: Dapper ORM integration, connection factory
- Depends on: SQL Server/MySQL connection providers
- Used by: Endpoint handlers
- Pattern: Stored procedure execution via Dapper
- Registered as: Singleton service in DI container

**Model Layer** - `api/Models/*.cs`
- Purpose: Domain objects representing database entities
- Contains: C# classes with PascalCase properties
- Depends on: Nothing (plain POCOs)
- Used by: Endpoints for data transfer
- Examples: `api/Models/User.cs`, `api/Models/Employee.cs`

### Frontend Layers (`client/src/`)

**Pages/Routes Layer** - `client/src/app/*/page.tsx`
- Purpose: Next.js App Router entry points
- Contains: Page components for each route
- Depends on: Components, hooks, contexts
- Used by: Next.js router
- Routes: `/` (dashboard), `/users`, `/jobs`, `/approvals`, `/templates`, `/items`, `/upload`, `/settings`, `/help`

**Service Layer** - `client/src/services/*.ts`
- Purpose: API communication functions
- Contains: Type-safe fetch wrappers for backend endpoints
- Depends on: API config (`apiConfig.baseUrl`)
- Used by: Custom hooks
- Pattern: `fetch()` with JSON serialization/deserialization
- Examples: `client/src/services/userService.ts`, `client/src/services/employeeService.ts`

**Hook/State Layer** - `client/src/hooks/*.ts`
- Purpose: Feature-level state management
- Contains: Custom React hooks wrapping service calls
- Depends on: Service layer, Ant Design App context
- Used by: Page components
- Pattern: Manages loading states, error handling, notifications
- Example: `client/src/hooks/useUsers.ts`

**Context/Global State** - `client/src/context/*.tsx`
- Purpose: Application-wide state management
- Contains: React Context providers
- Depends on: localStorage, services
- Used by: All components via hooks
- Contexts:
  - `ThemeContext.tsx` - Theme, language, date format, sidebar color
  - `UserContext.tsx` - Current authenticated user

**UI Component Layer** - `client/src/components/*.tsx`
- Purpose: Reusable UI components
- Contains: Shared components (AppLayout, ThemeToggle)
- Depends on: Ant Design, contexts, config
- Used by: Page components
- Example: `client/src/components/AppLayout.tsx` (sidebar, header, breadcrumbs)

**Configuration Layer** - `client/src/config/*.ts`
- Purpose: Centralized configuration constants
- Contains: All app-wide configuration
- Depends on: Nothing (pure config)
- Used by: All layers
- Files: app.config, api.config, theme.config, routes.config, layout.config, storage.config, i18n.config
- Central export: `client/src/config/index.ts`

**Utility Layer** - `client/src/utils/*.ts`
- Purpose: Pure utility functions
- Contains: Helper functions (avatar colors, date formatting, initials)
- Depends on: dayjs
- Used by: Components
- Example: `client/src/utils/userUtils.ts`

## Data Flow

**HTTP Request (Frontend → Backend → Database):**

1. User interacts with UI (button click, form submit)
2. Component handler calls custom hook method (e.g., `useUsers.createUser()`)
3. Hook calls service layer function (e.g., `userService.createUser()`)
4. Service function executes `fetch()` to API endpoint using `apiConfig.baseUrl`
5. HTTP request crosses CORS boundary to backend API
6. Backend Minimal API endpoint handler receives request (`UserEndpoints.MapEndpoints`)
7. Endpoint handler extracts request body and calls DapperContext
8. DapperContext creates SQL connection
9. Dapper executes stored procedure (e.g., `User_Add`)
10. SQL Server processes stored procedure and returns result
11. Endpoint handler wraps result in `Results.Ok()` or `Results.Created()`
12. JSON response sent back to frontend
13. Service function parses JSON response
14. Hook updates React state (setUsers, setLoading)
15. Component re-renders with new data
16. Ant Design notification message displays success/error

**State Management:**
- Frontend: React Context API for global state (no Redux/Zustand)
- Backend: Stateless (no persistent in-memory state)
- Persistence: localStorage for UI preferences, SQL Server for data

## Key Abstractions

**Backend:**

**Endpoint Handler Pattern** - `api/Utils/IEndpointRouteHandler.cs`
- Purpose: Encapsulate HTTP endpoint registration
- Pattern: Interface with `MapEndpoints(IEndpointRouteBuilder app)` method
- Registration: Auto-discovered via reflection in `EndpointRouteBuilderExtensions.cs`
- Benefit: No manual routing configuration needed

**Dependency Injection**
- Services registered in `api/Program.cs`
- DapperContext as Singleton
- Constructor injection in endpoint handlers

**Stored Procedure Pattern**
- Naming: `{Entity}_{Action}` (e.g., User_GetList, Employee_Add)
- Execution: Dapper with `CommandType.StoredProcedure`
- Example: `api/Endpoints/UserEndpoints.cs` calls `User_GetList`, `User_Add`, `User_Update`, `User_Delete`

**Frontend:**

**Centralized Configuration** - `client/src/config/`
- Pattern: Single export point (`config/index.ts`) for all configuration
- Usage: `import { appConfig, apiConfig, themeConfig } from '@/config'`
- Benefit: Global changes without code scatter

**React Context API** - `client/src/context/`
- ThemeContext: theme, language, dateFormat, siderColor (persisted to localStorage)
- UserContext: currentUser, loading, error, refetchUser
- Pattern: Provider wraps root layout, consumed via `useContext`

**Custom Hooks for Features** - `client/src/hooks/`
- Pattern: Wraps service calls with state management and notifications
- Example: `useUsers` provides fetchUsers, createUser, updateUser, deleteUser, inactivateUser
- Integration: Ant Design `App.useApp()` for toast messages

**Service Layer Abstraction** - `client/src/services/`
- Pattern: Pure fetch functions using `apiConfig.baseUrl`
- Type safety: TypeScript interfaces for request/response
- Error handling: Try/catch with JSON parsing

## Entry Points

**Backend Entry:**
- `api/Program.cs` - WebApplication setup
  - CORS configuration (localhost:3000)
  - Service registration (DapperContext, Authentication)
  - Middleware pipeline (Exception handler, HTTPS redirect, CORS, Authentication, Authorization)
  - Endpoint mapping via `app.MapGroup("/api").MapEndpoints(Assembly.GetExecutingAssembly())`
  - Base path: `/monitor`
  - Swagger UI: `/monitor/swagger` (development only)

**Frontend Entry:**
- `client/src/app/layout.tsx` - Root layout
  - Providers: AntdRegistry → ThemeProvider → UserProvider
  - Global styles import
  - Metadata from appConfig
- `client/src/app/page.tsx` - Dashboard (/)
  - Landing page with statistics cards and recent jobs table

## Error Handling

**Strategy:** Exception bubbling with boundary handlers

**Patterns:**
- Backend: Try/catch in endpoints, return `Results.BadRequest()` or `Results.Problem()`
- Frontend: Try/catch in hooks, Ant Design message notifications via `App.useApp()`
- Global: No error boundaries detected in React app (gap)

**Backend Example** (`api/Endpoints/UserEndpoints.cs`):
```csharp
try {
    var result = await connection.QueryFirstOrDefaultAsync(...);
    return Results.Created($"/api/users/{newUser.Id}", newUser);
} catch (Exception ex) {
    return Results.BadRequest(new { message = "Couldn't create user account" });
}
```

**Frontend Example** (`client/src/hooks/useUsers.ts`):
```typescript
try {
    await userService.createUser(payload);
    message.success(t('users.messages.createSuccess'));
} catch (error) {
    message.error(t('users.messages.createError'));
}
```

## Cross-Cutting Concerns

**Logging:**
- Backend: ASP.NET Core default logging (console/debug)
- Frontend: Console.log statements (some active in production code - needs cleanup)
- No centralized logging solution

**Validation:**
- Backend: Minimal validation in endpoints (relies on database constraints)
- Frontend: Ant Design Form validation (required fields only)
- No comprehensive validation framework

**Authentication:**
- Backend: Windows Authentication via Microsoft.AspNetCore.Authentication.Negotiate
- Endpoint: `GET /api/users/me` returns authenticated user
- Frontend: UserContext fetches current user on mount

**Authorization:**
- Backend: Not explicitly implemented (no role-based middleware)
- Frontend: User roles present in data model but not enforced in UI

---

*Architecture analysis: 2026-01-04*
*Update when major patterns change*
