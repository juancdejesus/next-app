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
            app.MapGet($"{BaseRoute}/me", async (HttpContext httpContext, DapperContext context) =>
            {
                var user = httpContext.User;
                var identity = user?.Identity;

                string domainUsername;

                // Check if user is authenticated via Windows Authentication
                if (identity?.IsAuthenticated == true && !string.IsNullOrEmpty(identity.Name))
                {
                    domainUsername = identity.Name;
                }
                else
                {
                    // Fallback: Return server process user if no Windows Authentication
                    var windowsUsername = Environment.UserName;
                    var domainName = Environment.UserDomainName;
                    domainUsername = domainName + "\\" + windowsUsername;
                }

                // Query the database for the user by domain username
                using var connection = context.CreateConnection();
                var parameters = new { DomainUsername = domainUsername };

                var dbUser = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "User_GetByDomainUsername",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (dbUser == null)
                {
                    return Results.NotFound(new
                    {
                        Message = $"User with domain username '{domainUsername}' not found in database.",
                        DomainUsername = domainUsername
                    });
                }

                return Results.Ok(dbUser);
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
                    EmployeeId = user.EmployeeId,
                    RoleId = user.RoleId,
                    CreatedBy = (long?)null  // TODO: Get from authenticated user context
                };

                try
                {
                    var newUser = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        "User_Add",
                        parameters,
                        commandType: CommandType.StoredProcedure
                    );

                    if (newUser == null)
                    {
                        return Results.BadRequest(new { Message = "Couldn't create user account." });
                    }

                    return Results.Created($"{BaseRoute}/{newUser.Id}", newUser);
                }
                catch (Exception ex)
                {
                    // Handle SQL errors (e.g., duplicate user, employee not found)
                    return Results.BadRequest(new { Message = ex.Message });
                }
            });

            app.MapPut($"{BaseRoute}/{{id:int}}", async (int id, User user, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new
                {
                    Id = id,
                    RoleId = user.RoleId,
                    UserStatus = user.UserStatus,
                    ModifiedBy = (long?)null  // TODO: Get from authenticated user context
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