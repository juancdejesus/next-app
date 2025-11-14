# API Project

A .NET 8 Web API built with minimal API architecture, using Dapper for database access and MySQL as the data store.

## Features

- **Minimal API Architecture**: Leverages .NET 8's minimal API pattern for lightweight, high-performance endpoints
- **User Management**: Complete CRUD operations for user management
- **Database Access**: Dapper ORM with MySQL using stored procedures
- **Authentication**: BCrypt password hashing for secure credential storage
- **JWT Ready**: JWT Bearer authentication infrastructure configured
- **CORS Support**: Configured for cross-origin requests from frontend applications
- **API Documentation**: Swagger/OpenAPI integration for interactive API documentation

## Tech Stack

- **.NET 8.0**: Latest LTS version of .NET
- **Dapper**: Lightweight ORM for database operations
- **MySQL**: Database server (via MySqlConnector)
- **BCrypt.Net**: Password hashing
- **Swagger/OpenAPI**: API documentation and testing
- **JWT Bearer**: Token-based authentication support

## Project Structure

```
api/
├── Endpoints/          # API endpoint definitions
│   └── UserEndpoints.cs
├── Models/             # Data models
│   └── User.cs
├── Utils/              # Utility classes
│   ├── DapperContext.cs
│   ├── EndpointRouteBuilderExtensions.cs
│   ├── IDapperContext.cs
│   └── IEndpointRouteHandler.cs
├── Properties/         # Project properties
├── wwwroot/           # Static files
├── Program.cs         # Application entry point
├── appsettings.json   # Configuration
└── api.csproj         # Project file
```

## Prerequisites

- .NET 8.0 SDK
- MySQL Server
- A database named `monitor` with the required stored procedures

## Configuration

Update the connection string in [appsettings.json](appsettings.json):

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=3306;Database=monitor;Uid=your_user;Pwd=your_password;"
  }
}
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd api
```

### 2. Restore dependencies

```bash
dotnet restore
```

### 3. Set up the database

Ensure MySQL is running and create the required database and stored procedures:
- `proc_get_user_list`
- `proc_get_user`
- `proc_add_user`
- `proc_update_user`
- `proc_delete_user`

### 4. Run the application

```bash
dotnet run
```

The API will be available at:
- Development: `https://localhost:<port>/monitor`
- Swagger UI: `https://localhost:<port>/monitor/swagger`

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

### Building the project

```bash
dotnet build
```

### Running tests

```bash
dotnet test
```

### Publishing

```bash
dotnet publish -c Release
```

## Deployment

Use the provided deployment scripts:
- **Windows**: `deploy.cmd`
- **Linux/macOS**: `deploy.sh`

## CORS Configuration

The API is configured to allow requests from `http://localhost:3000` by default. Update the CORS policy in [Program.cs](Program.cs:27) to match your frontend URL.

## Security Considerations

- Passwords are hashed using BCrypt before storage
- JWT authentication infrastructure is in place (configure as needed)
- Update the JWT secret key in [appsettings.json](appsettings.json:14) for production use
- Never commit sensitive credentials to version control

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
