# Monitor Application

A full-stack Enterprise SaaS Data Management Platform combining a .NET 8 Web API backend with a modern Next.js frontend for comprehensive data management, user authentication, and workflow operations.

## Overview

This project consists of two main components:
- **API**: A .NET 8 minimal API with MySQL database integration
- **Client**: A Next.js 16 web application with modern UI/UX

## Features

### Backend (API)
- **Minimal API Architecture**: Lightweight, high-performance endpoints using .NET 8
- **User Management**: Complete CRUD operations for user management
- **Database Access**: Dapper ORM with MySQL using stored procedures
- **Authentication**: BCrypt password hashing and JWT Bearer authentication
- **CORS Support**: Configured for cross-origin requests
- **API Documentation**: Swagger/OpenAPI integration

### Frontend (Client)
- **Dashboard**: Real-time overview of active jobs, pending approvals, and statistics
- **File Upload**: Bulk data upload with template validation
- **Job Management**: Track and monitor data update jobs
- **Approval Workflow**: Review and approve submitted changes
- **Template Library**: Pre-configured templates for different data types
- **Item Management**: Manage data items and configurations
- **Dark/Light Theme**: User preference-based theme with localStorage persistence
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **.NET 8.0**: Latest LTS version of .NET
- **Dapper**: Lightweight ORM for database operations
- **MySQL**: Database server (via MySqlConnector)
- **BCrypt.Net**: Password hashing
- **Swagger/OpenAPI**: API documentation and testing
- **JWT Bearer**: Token-based authentication support

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Component Library**: Ant Design 5
- **Styling**: Tailwind CSS 4
- **Icons**: Ant Design Icons
- **State Management**: React Context API

## Project Structure

```
app/
├── api/                    # .NET 8 Web API
│   ├── Endpoints/          # API endpoint definitions
│   ├── Models/             # Data models
│   ├── Utils/              # Utility classes
│   ├── Properties/         # Project properties
│   ├── wwwroot/           # Static files
│   ├── Program.cs         # Application entry point
│   ├── appsettings.json   # Configuration
│   └── api.csproj         # Project file
│
└── client/                # Next.js Frontend
    ├── app/                # Next.js App Router directory
    │   ├── approvals/      # Approvals page
    │   ├── components/     # Shared React components
    │   ├── context/        # React Context providers
    │   ├── help/           # Help/documentation page
    │   ├── items/          # Items management page
    │   ├── jobs/           # Jobs listing page
    │   ├── settings/       # Settings page
    │   ├── templates/      # Templates library page
    │   ├── upload/         # File upload page
    │   ├── globals.css     # Global styles
    │   ├── layout.tsx      # Root layout
    │   └── page.tsx        # Dashboard home page
    └── public/             # Static assets
```

## Prerequisites

- **.NET 8.0 SDK**
- **Node.js** >= 18.0.0 (LTS recommended)
- **MySQL Server**
- **npm** >= 9.0.0 or **yarn** >= 1.22.0 or **pnpm** >= 8.0.0
- **Git** (for version control)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd app
```

### 2. Database Setup

Ensure MySQL is running and create the required database and stored procedures:

```sql
CREATE DATABASE monitor;
```

Create the following stored procedures:
- `proc_get_user_list`
- `proc_get_user`
- `proc_add_user`
- `proc_update_user`
- `proc_delete_user`

Update the connection string in [api/appsettings.json](api/appsettings.json):

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=3306;Database=monitor;Uid=your_user;Pwd=your_password;"
  }
}
```

### 3. Backend Setup

```bash
cd api
dotnet restore
dotnet build
dotnet run
```

The API will be available at:
- Development: `https://localhost:<port>/monitor`
- Swagger UI: `https://localhost:<port>/monitor/swagger`

### 4. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (supports search parameter) |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update existing user |
| DELETE | `/api/users/{id}` | Delete user |

### Example Request

**Create User:**
```bash
curl -X POST https://localhost:<port>/monitor/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password_hash": "securepassword"
  }'
```

## Development

### Backend Commands

| Command | Description |
|---------|-------------|
| `dotnet build` | Build the API project |
| `dotnet run` | Run the API in development mode |
| `dotnet test` | Run tests |
| `dotnet publish -c Release` | Create production build |

### Frontend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `http://localhost:3000` |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint to check code quality |

### Best Practices

#### Using Ant Design Message API

When using the Ant Design message API in your components, always use `App.useApp()` instead of importing `message` directly from `antd`. This ensures proper integration with the App component context.

**Correct usage:**
```typescript
import { App } from 'antd';

export default function MyComponent() {
  const { message } = App.useApp();

  const handleAction = () => {
    message.success('Action completed successfully');
  };

  return <button onClick={handleAction}>Click me</button>;
}
```

**Incorrect usage:**
```typescript
import { message } from 'antd'; // ❌ Don't do this

export default function MyComponent() {
  const handleAction = () => {
    message.success('Action completed successfully');
  };

  return <button onClick={handleAction}>Click me</button>;
}
```

This applies to other static methods like `modal`, `notification`, etc. Always use the hook version provided by `App.useApp()`.

## CORS Configuration

The API is configured to allow requests from `http://localhost:3000` by default. Update the CORS policy in [api/Program.cs](api/Program.cs) to match your frontend URL for different environments.

## Security Considerations

- Passwords are hashed using BCrypt before storage
- JWT authentication infrastructure is configured (update secret key for production)
- Never commit sensitive credentials to version control
- Update the JWT secret key in [api/appsettings.json](api/appsettings.json) for production use
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

## Deployment

### Backend Deployment

Use the provided deployment scripts:
- **Windows**: `deploy.cmd`
- **Linux/macOS**: `deploy.sh`

Or manually:
```bash
cd api
dotnet publish -c Release
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
cd client
npm install -g vercel
vercel --prod
```

Or deploy via GitHub integration on [Vercel](https://vercel.com)

#### Docker

```dockerfile
# Frontend
FROM node:18-alpine
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

[Add your license here]

## Support

For questions or issues, please contact the development team or create an issue in the repository.
