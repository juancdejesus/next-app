# GEMINI.md

## Project Profile

**Type:** Full-stack Enterprise SaaS Data Management Platform

**Context:** High-performance data tool built by a seasoned BI/SQL Developer.

**Key Characteristic:** Strong separation of concerns, Stored Procedure-driven backend, and modern React/Next.js frontend.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | .NET 8 Minimal API, C#, Dapper, SQL Server |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **UI/Styling** | Ant Design 5, Tailwind CSS 4 |
| **Package Manager** | pnpm (Strict enforcement) |

---

## 🏗️ Architecture & Patterns (Strict Enforcement)

### 1. Backend: .NET 8 + Dapper

#### Endpoint Pattern:
- Every endpoint class must implement `IEndpointRouteHandler`.
- Define routes inside `MapEndpoints(IEndpointRouteBuilder app)`.
- Do not manually register endpoints in `Program.cs`; they are auto-discovered via reflection.

#### Data Access (BI/SQL Style):
- **ORM:** Dapper exclusively.
- **Method:** Stored Procedures only. Do not use inline SQL or Entity Framework.
- **Naming Convention:** `{Entity}_{Action}` (e.g., `User_GetList`, `Job_Add`).

#### Code Pattern:
```csharp
using var connection = context.CreateConnection();
// Always use CommandType.StoredProcedure
var result = await connection.QueryAsync<ModelType>("Procedure_Name", params, commandType: CommandType.StoredProcedure);
```

#### Model Casing (CRITICAL):
Backend C# models use **snake_case** properties (e.g., `user_id`, `created_at`) to match SQL Server column names exactly.

---

### 2. Frontend: Next.js 16 + Ant Design

#### Ant Design Hook Rule:
- **NEVER** import static feedback methods (`message`, `notification`, `modal`) directly from `antd`.
- **ALWAYS** use the `App.useApp()` hook:
```typescript
const { message, modal } = App.useApp();
```

#### State Management:
- Use React Context for global app state (Theme, Auth).
- Persist UI preferences (Dark mode, Sidebar state) to `localStorage`.

#### Routing:
- Use Next.js App Router (`app/` directory).
- Sidebar navigation is managed in `AppLayout.tsx` via `routeToKeyMap`.

---

## ⚠️ Data Mapping & Casing Rules

One of the most critical aspects of this project is handling the casing difference between layers:

- **Database/SQL:** `snake_case`
- **Backend (.NET Models):** `snake_case` (to match DB)
- **Frontend (TypeScript):** `PascalCase`

**Developer Instruction:** When writing API services or mapping data in the frontend, be explicitly aware that the JSON response from the API will have `snake_case` keys. Ensure your frontend interfaces or fetch logic handles this translation if strict `PascalCase` is required in the UI.

---

## 📂 Directory Structure Reference

- `api/Endpoints/`: Store all `IEndpointRouteHandler` implementations here.
- `api/Models/`: Dapper models (snake_case).
- `client/src/app/`: Next.js pages (Feature-based folders).
- `client/src/services/`: API fetch logic (Centralized).
- `client/src/hooks/`: Custom React hooks (Business logic wrappers).

---

## 💻 Development Context

- **API Base URL:** `/monitor`
- **Swagger:** `/monitor/swagger`
- **Client:** `http://localhost:3000`
- **Auth:** Windows Authentication (IIS/IIS Express) is the primary dev method.
