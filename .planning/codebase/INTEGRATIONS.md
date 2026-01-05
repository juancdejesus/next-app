# External Integrations

**Analysis Date:** 2026-01-04

## APIs & External Services

**Not currently integrated:**
No external third-party API integrations detected (payment processors, email services, SMS, analytics, cloud storage, etc.)

## Data Storage

**Databases:**
- SQL Server - `api/appsettings.json`, `api/Utils/DapperContext.cs`
  - Connection: Server=192.168.68.130;Database=DataHub;User Id=jdejesus
  - Client: Dapper ORM v2.1.35 with stored procedure pattern
  - Migrations: Not detected (likely manual schema management)
  - Stored procedure naming: `{Entity}_{Action}` (e.g., User_GetList, User_Add, User_Update)

- MySQL (Optional/Alternative) - `api/Utils/DapperContext.cs` (line 18, commented out)
  - Connection: MySqlConnector package installed but not active
  - Can be enabled by switching line 18/19 in DapperContext.cs

**File Storage:**
- Not detected - No cloud storage integrations (S3, Azure Blob, etc.)

**Caching:**
- Not detected - No Redis or similar caching layer

## Authentication & Identity

**Auth Provider:**
- Windows Authentication - `api/Program.cs`, `api/Properties/launchSettings.json`
  - Implementation: Microsoft.AspNetCore.Authentication.Negotiate
  - Token storage: Server-side Windows authentication
  - Session management: Windows domain credentials
  - IIS/IIS Express integration enabled

**JWT Infrastructure** - `api/Program.cs`, `api/appsettings.json`
  - Status: Configured but not fully implemented
  - Package: Microsoft.AspNetCore.Authentication.JwtBearer 8.0.14
  - Secret key: Stored in appsettings.json (should be moved to environment variables)
  - Ready for future implementation

**Password Security:**
- BCrypt hashing - `api/api.csproj` (BCrypt.Net-Next 4.0.3)
  - Passwords hashed before database storage
  - Used for user account management

**OAuth Integrations:**
- Not detected - No social login providers (Google, Microsoft, GitHub, etc.)

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service (Sentry, Application Insights, etc.)

**Analytics:**
- Not detected - No analytics integration (Google Analytics, Mixpanel, etc.)

**Logs:**
- Console/stdout logging only
  - Backend: ASP.NET Core default logging
  - Frontend: Console.log statements (some active in production code)
  - No centralized logging service detected

## CI/CD & Deployment

**Hosting:**
- Backend: IIS/IIS Express - `api/Properties/launchSettings.json`
  - Deployment: Windows Server with IIS expected
  - Base path: `/monitor`
  - Environment vars: Configured via appsettings.json (not environment-based currently)

- Frontend: Static export capable - `client/next.config.ts`
  - Deployment: Any static hosting (Vercel, Netlify, IIS, etc.)
  - Build command: `pnpm build`
  - Output: Static HTML/CSS/JS files

**CI Pipeline:**
- Not detected - No GitHub Actions, Azure DevOps, or similar CI/CD workflows found

## Environment Configuration

**Development:**
- Required env vars (Frontend): NEXT_PUBLIC_API_URL - `client/.env.example`
- Backend configuration: `api/appsettings.json` (connection strings, JWT keys)
- **Security Note**: Database credentials currently hardcoded in appsettings.json (should use environment variables)
- API URL fallback: http://localhost:5000/monitor/api - `client/src/config/api.config.ts`

**Staging:**
- Not configured - No staging-specific configuration detected

**Production:**
- Secrets management: Currently in appsettings.json (recommend moving to Azure Key Vault, environment variables, or secure config)
- CORS: Configured for http://localhost:3000 in development - `api/Program.cs` (needs production update)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Internationalization (i18n)

**i18next Framework** - `client/package.json`, `client/src/config/i18n.config.ts`
- Languages: English (en), Spanish (es)
- Detection: localStorage → navigator → htmlTag
- Translation files: `client/src/i18n/locales/en.json`, `client/src/i18n/locales/es.json`
- Browser language auto-detection via i18next-browser-languagedetector 8.2.0

**Date/Time Handling** - `client/package.json`, `client/src/config/i18n.config.ts`
- Library: dayjs 1.11.19
- Supported formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD.MM.YYYY
- Locale: Configurable per user via settings

## API Documentation

**Swagger/OpenAPI** - `api/Program.cs`
- Endpoint: `/monitor/swagger` (development only)
- Packages: Swashbuckle.AspNetCore 6.6.2, Microsoft.AspNetCore.OpenAPI 8.0.12
- Auto-generated from endpoint definitions

## CORS Configuration

**Allowed Origins** - `api/Program.cs` (line 28)
- Development: http://localhost:3000
- Policy: AllowAnyHeader, AllowAnyMethod, AllowCredentials
- **Note**: Must be updated for production deployment

---

*Integration audit: 2026-01-04*
*Update when adding/removing external services*
