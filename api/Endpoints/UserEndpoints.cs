using App.Server.Models;
using App.Server.Utils;
using Dapper;
using System.Data;
using BCrypt.Net;
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
                    "proc_get_user_list",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return Results.Ok(users);
            });

            // Get user by Id
            app.MapGet($"{BaseRoute}/{{id:int}}", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();
                var parameters = new { p_id = id };

                var user = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "proc_get_user",
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

                // Hash the password before storing
                user.password_hash = BCrypt.Net.BCrypt.HashPassword(user.password_hash);

                var parameters = new
                {
                    p_name = user.name,
                    p_username = user.username,
                    p_email = user.email,
                    p_password_hash = user.password_hash
                };

                var newUser = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "proc_add_user",
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
                    p_id = id,
                    p_name = user.name,
                    p_username = user.username,
                    p_email = user.email,
                    p_user_status = user.user_status
                };

                var rowsAffected = await connection.ExecuteAsync(
                    "proc_update_user",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (rowsAffected == 0)
                {
                    return Results.NotFound(new { Message = $"User with ID {id} not found." });
                }

                // Fetch the updated user to return it
                var updatedUser = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "proc_get_user",
                    new { p_id = id },
                    commandType: CommandType.StoredProcedure
                );

                return Results.Ok(updatedUser);
            });

   
            app.MapDelete($"{BaseRoute}/{{id:int}}", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new { p_id = id };

                var rowsAffected = await connection.ExecuteAsync(
                    "proc_delete_user",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return rowsAffected == 0
                    ? Results.NotFound(new { Message = $"User with ID {id} not found." })
                    : Results.Ok(new { Message = $"User with ID {id} deleted successfully." });
            });
        }
    }

    public record ChangePasswordRequest(string OldPassword, string NewPassword);
}