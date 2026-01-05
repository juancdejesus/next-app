# Coding Conventions

**Analysis Date:** 2026-01-04

## Naming Patterns

**Files:**
- Frontend pages: `page.tsx` (Next.js App Router convention)
- Frontend components: `PascalCase` (e.g., `UserForm.tsx`, `AppLayout.tsx`, `ThemeToggle.tsx`)
- Frontend services: `kebab-case` with `-service` suffix (e.g., `user-service.ts`)
- Frontend utilities: `kebab-case` with `-utils` suffix (e.g., `user-utils.ts`)
- Frontend config: `kebab-case` with `.config` suffix (e.g., `theme.config.ts`, `api.config.ts`)
- Frontend hooks: `use{Name}` pattern (e.g., `useUsers.ts`)
- Frontend contexts: `{Name}Context.tsx` (e.g., `ThemeContext.tsx`, `UserContext.tsx`)
- Backend files: `PascalCase` (e.g., `UserEndpoints.cs`, `DapperContext.cs`)
- Backend endpoints: `{Entity}Endpoints.cs` (e.g., `UserEndpoints.cs`, `EmployeeEndpoints.cs`)

**Functions:**
- Frontend: `camelCase` (e.g., `getAvatarColor`, `formatLastActive`)
- Backend: `PascalCase` (C# convention)
- Event handlers: `handle{EventName}` pattern (e.g., `handleSubmit`, `handleDelete`)

**Variables:**
- Frontend: `camelCase`
- Frontend constants: `camelCase` (e.g., `defaultDateFormat`, `appConfig`)
- Backend: `camelCase` for local variables, `PascalCase` for properties
- Backend fields: `PascalCase` for public properties

**Types:**
- Interfaces: `PascalCase` (e.g., `User`, `UserFormValues`, `ThemeContextType`)
- Type aliases: `PascalCase` (e.g., `Theme`, `DateFormat`, `Language`)
- Backend interfaces: `I{Name}` prefix (e.g., `IEndpointRouteHandler`, `IDapperContext`)

## Code Style

**Frontend Formatting:**
- Indentation: 2 spaces
- Quotes: Single quotes (`'`)
- Semicolons: Required
- Line endings: LF (Unix)
- Line length: No explicit limit (generally ~100-120 characters)

**Backend Formatting:**
- Indentation: 4 spaces
- Accessibility: Explicit modifiers (`public`, `private`)
- Using statements: Top of file
- Namespaces: Deep nesting pattern (e.g., `App.Server.Models`, `App.Server.Endpoints`)

**Linting:**
- Frontend: ESLint 9 installed - `client/eslint.config.mjs`
- Rules: Next.js core-web-vitals preset
- No `.eslintrc` config file (using flat config)
- Backend: No explicit linting configuration

**Formatting Tools:**
- No Prettier configuration detected
- No .editorconfig file
- Formatting appears consistent but not enforced

## Import Organization

**Frontend Order:**
1. React and Next.js imports
2. External packages (Ant Design, i18next, dayjs, lucide-react)
3. Internal modules via `@/` path alias
4. Type imports (interfaces, types)
5. Styles (globals.css)

**Grouping:**
- No enforced blank lines between groups
- Generally alphabetical within each group

**Path Aliases:**
- `@/*` maps to `src/*` - `client/tsconfig.json`
- Example: `import { appConfig } from '@/config'`

**Backend Using Statements:**
- Grouped by namespace origin (System, Microsoft, third-party, local)
- Alphabetical within each group

## Error Handling

**Frontend Patterns:**
- Try/catch at hook level (e.g., `client/src/hooks/useUsers.ts`)
- Service layer throws errors to hooks
- Hooks catch and display Ant Design message notifications
- Pattern: `message.error(t('users.messages.createError'))` via `App.useApp()`

**Frontend Error Types:**
- API errors: Caught in service layer, re-thrown with context
- Component errors: No error boundaries detected (gap)
- Validation errors: Ant Design Form validation

**Backend Patterns:**
- Try/catch in endpoint handlers
- Return `Results.BadRequest()` or `Results.Problem()` on error
- Generic error messages returned to client (security)
- No centralized error logging detected

**Backend Error Example** (`api/Endpoints/UserEndpoints.cs`):
```csharp
try {
    var result = await connection.QueryFirstOrDefaultAsync(...);
    return Results.Created($"/api/users/{newUser.Id}", newUser);
} catch (Exception ex) {
    return Results.BadRequest(new { message = "Couldn't create user account" });
}
```

**Frontend Error Example** (`client/src/hooks/useUsers.ts`):
```typescript
try {
    await userService.createUser(payload);
    message.success(t('users.messages.createSuccess'));
    await fetchUsers();
} catch (error) {
    message.error(t('users.messages.createError'));
    console.error('Error creating user:', error);
}
```

## Logging

**Frontend:**
- Framework: Console.log statements
- Levels: log, warn, error
- **Issue**: Active console.log in production code (e.g., `client/src/services/userService.ts:108`, `client/src/app/users/page.tsx:58-59`)
- Pattern: `console.error()` for error logging
- No centralized logging library

**Backend:**
- Framework: ASP.NET Core default logging (console/debug)
- Levels: Information, Warning, Error, Critical
- No explicit logging calls in endpoint handlers
- Exception handler configured in `api/Program.cs` (line 65)

**Patterns:**
- Log at service boundaries
- Log errors before throwing
- No structured logging detected

## Comments

**When to Comment:**
- Frontend: JSDoc for public functions
- Frontend: Inline comments for complex logic
- Backend: Minimal comments (code is self-documenting)
- Backend: Comments explain "why" not "what"

**Frontend JSDoc/TSDoc:**
- Required for exported functions
- Format: `/** Description */` with `@param`, `@returns` tags
- Example from `client/src/utils/userUtils.ts`:
  ```typescript
  /**
   * Generates a consistent avatar color based on the user's name
   * @param name - The user's name
   * @returns A hex color string
   */
  export const getAvatarColor = (name: string): string => {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  ```

**TODO Comments:**
- Backend: Two TODO comments in `api/Endpoints/UserEndpoints.cs` (lines 115, 149)
  - `TODO: Get the CreatedBy from the authenticated user context`
  - `TODO: Get the ModifiedBy from the authenticated user context`
- Frontend: No TODO comments detected
- No issue tracking links in comments

## Function Design

**Size:**
- Frontend: Generally under 50-100 lines
- Backend: Endpoint handlers can be longer (100-200 lines) due to query setup
- No strict enforcement

**Parameters:**
- Frontend: Destructured object parameters for 3+ arguments
- Backend: Individual parameters, typed with C# types
- Frontend example: `function create(options: CreateOptions)`

**Return Values:**
- Frontend: Explicit return types in TypeScript
- Backend: Explicit return types in C# method signatures
- Async functions: Always return Promise<T> (frontend) or Task<T> (backend)

## Module Design

**Frontend Exports:**
- Config files: Named exports only (e.g., `export const appConfig = {...}`)
- Components: Default exports for React components/pages
- Services/utilities: Named exports
- Context: Named exports for provider and custom hooks

**Backend Exports:**
- Classes: Public visibility
- Interfaces: Public visibility
- Internal utilities: Internal or private visibility

**Barrel Files:**
- Frontend: `client/src/config/index.ts` re-exports all configs
- Pattern: Single import point for centralized configuration
- Example: `import { appConfig, themeConfig, apiConfig } from '@/config'`

## Configuration Management

**Centralized Config Pattern:**
- All configuration in `client/src/config/` directory
- Central export point: `client/src/config/index.ts`
- **Always use config constants** instead of hardcoding values
- Example configs:
  - `app.config.ts` - App name, version, metadata
  - `api.config.ts` - API base URL, timeout, headers
  - `theme.config.ts` - Colors, sidebar palette, Ant Design tokens
  - `routes.config.tsx` - Menu routes with icons and i18n keys
  - `layout.config.ts` - Dimensions, spacing, transitions
  - `storage.config.ts` - localStorage key constants
  - `i18n.config.ts` - Languages, date formats, defaults

**Usage Pattern:**
```typescript
// ✅ Correct
import { appConfig, themeConfig } from '@/config';
const appName = appConfig.name;

// ❌ Incorrect
const appName = "Update Hub"; // Hardcoded
```

## Cross-Layer Naming Conventions

**Case Sensitivity Differences:**
- Backend C# properties: `PascalCase` (e.g., `UserStatus`, `RoleId`, `LastActiveTime`)
- Frontend TypeScript interfaces: `PascalCase` (matching backend)
- Database fields: `snake_case` (in stored procedures)

**Example Mapping:**
```
Database:     user_status, role_id, last_active_time
Backend (C#): UserStatus, RoleId, LastActiveTime
Frontend (TS): UserStatus, RoleId, LastActiveTime
```

## Ant Design Best Practices

**Always use `App.useApp()` hook** instead of importing `message`, `modal`, or `notification` directly:

```typescript
// ✅ Correct
import { App } from 'antd';
const { message } = App.useApp();
message.success('Success!');

// ❌ Incorrect
import { message } from 'antd';
message.success('Success!'); // Won't work properly with context
```

**Why:** Ant Design v5 requires the `<App>` component wrapper for proper context integration. Direct imports bypass the context system.

## Known Convention Violations

**Issues to Address:**
1. Active console.log statements in production code
   - `client/src/services/userService.ts:108`
   - `client/src/app/users/page.tsx:58-59`
2. Commented-out code left in files
   - `client/src/services/userService.ts:81-83` (debug logs)
   - `client/src/app/users/UserForm.tsx:44` (filter logic)
3. No .prettierrc or .editorconfig for consistent formatting
4. No pre-commit hooks for enforcing conventions

**Recommendations:**
1. Remove all active console.log statements from production code
2. Remove commented-out code or document why it's kept
3. Add Prettier configuration for consistent formatting
4. Configure Husky for pre-commit hooks (lint, type-check)

---

*Convention analysis: 2026-01-04*
*Update when patterns change*
