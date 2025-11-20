using App.Server.Models;
using App.Server.Utils;
using Dapper;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace App.Server.Endpoints
{
    public class UserEndpoints : IEndpointRouteHandler
    {
        private const string BaseRoute = "/users";
        private readonly IConfiguration _configuration;

        public UserEndpoints(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void MapEndpoints(IEndpointRouteBuilder app)
        {
            // Get current Windows authenticated user from browser
            app.MapGet($"{BaseRoute}/me", (HttpContext httpContext) =>
            {
                var user = httpContext.User;
                var identity = user?.Identity;

                // Check if user is authenticated via Windows Authentication
                if (identity?.IsAuthenticated == true && !string.IsNullOrEmpty(identity.Name))
                {
                    var username = identity.Name;

                    // Parse domain\username format
                    var parts = username.Split('\\');
                    var domain = parts.Length > 1 ? parts[0] : string.Empty;
                    var userName = parts.Length > 1 ? parts[1] : parts[0];

                    return Results.Ok(new
                    {
                        Username = userName,
                        Domain = domain,
                        FullName = username,
                        IsAuthenticated = true,
                        identity.AuthenticationType
                    });
                }

                // Fallback: Return server process user if no Windows Authentication
                var windowsUsername = Environment.UserName;
                var domainUsername = Environment.UserDomainName;

                return Results.Ok(new
                {
                    Username = windowsUsername,
                    Domain = domainUsername,
                    FullName = $"{domainUsername}\\{windowsUsername}",
                    IsAuthenticated = false,
                    AuthenticationType = "ServerProcess",
                    Note = "Windows Authentication not detected. Run with IIS Express and ensure windowsAuthentication=true in launchSettings.json"
                });
            });

            // Get user list
            app.MapGet(BaseRoute, async (DapperContext context, string? search) =>
            {
                using var connection = context.CreateConnection();

                object? parameters = null;

                if (!string.IsNullOrEmpty(search))
                {
                    parameters = new { SearchTerm = search };
                }

                var users = await connection.QueryAsync<dynamic>(
                    "User_GetList",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return Results.Ok(users);
            });

            // Get user by Id
            app.MapGet($"{BaseRoute}/{{id:int}}", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();
                var parameters = new { Id = id };

                var user = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "User_Get",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (user == null)
                {
                    return Results.NotFound(new { Message = $"User with ID {id} not found." });
                }

                return Results.Ok(user);
            });

            app.MapPost(BaseRoute, async (User user, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new
                {
                    Name = user.name,
                    Username = user.username,
                    Email = user.email,
                    RoleId = user.role_id
                };

                var newUser = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "User_Add",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (newUser == null)
                {
                    return Results.NotFound(new { Message = $"Couldn't get the new created user." });
                }

                return Results.Created($"{BaseRoute}/{newUser.id}", newUser);
            });

            app.MapPut($"{BaseRoute}/{{id:int}}", async (int id, User user, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new
                {
                    Id = id,
                    Name = user.name,
                    Username = user.username,
                    Email = user.email,
                    UserStatus = user.user_status,
                    RoleId = user.role_id
                };

                var rowsAffected = await connection.ExecuteAsync(
                    "User_Update",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (rowsAffected == 0)
                {
                    return Results.NotFound(new { Message = $"User with ID {id} not found." });
                }

                // Fetch the updated user to return it
                var updatedUser = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "User_Get",
                    new { Id = id },
                    commandType: CommandType.StoredProcedure
                );

                return Results.Ok(updatedUser);
            });

   
            app.MapDelete($"{BaseRoute}/{{id:int}}", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new { Id = id };

                var rowsAffected = await connection.ExecuteAsync(
                    "User_Delete",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return rowsAffected == 0
                    ? Results.NotFound(new { Message = $"User with ID {id} not found." })
                    : Results.Ok(new { Message = $"User with ID {id} deleted successfully." });
            });

            app.MapPost($"{BaseRoute}/{{id:int}}/inactivate", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new { Id = id };

                var rowsAffected = await connection.ExecuteAsync(
                    "User_Inactivate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return rowsAffected == 0
                    ? Results.NotFound(new { Message = $"User with ID {id} not found." })
                    : Results.Ok(new { Message = $"User with ID {id} has been inactivated." });
            });

            app.MapPost($"{BaseRoute}/{{id:int}}/activate", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new { Id = id };

                var rowsAffected = await connection.ExecuteAsync(
                    "User_Activate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return rowsAffected == 0
                    ? Results.NotFound(new { Message = $"User with ID {id} not found." })
                    : Results.Ok(new { Message = $"User with ID {id} has been activated." });
            });
        }
    }
}