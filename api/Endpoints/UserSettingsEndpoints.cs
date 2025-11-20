using App.Server.Models;
using App.Server.Utils;
using Dapper;
using System.Data;

namespace App.Server.Endpoints
{
    public class UserSettingsEndpoints : IEndpointRouteHandler
    {
        private const string BaseRoute = "/users";

        public void MapEndpoints(IEndpointRouteBuilder app)
        {
            // Get user settings by user ID
            app.MapGet($"{BaseRoute}/{{userId:int}}/settings", async (int userId, DapperContext context) =>
            {
                using var connection = context.CreateConnection();
                var parameters = new { UserId = userId };

                var settings = await connection.QueryFirstOrDefaultAsync<UserSettings>(
                    "UserSettings_Get",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (settings == null)
                {
                    // Return default settings if none exist
                    return Results.Ok(new UserSettings
                    {
                        UserId = userId,
                        Language = "en",
                        DateFormat = "yyyy-mm-dd",
                        SiderColor = "#001529",
                        Theme = "light"
                    });
                }

                return Results.Ok(settings);
            });

            // Upsert user settings
            app.MapPost($"{BaseRoute}/{{userId:int}}/settings", async (int userId, UserSettingsRequest request, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new
                {
                    UserId = userId,
                    Language = request.Language ?? "en",
                    DateFormat = request.DateFormat ?? "yyyy-mm-dd",
                    SiderColor = request.SiderColor ?? "#001529",
                    Theme = request.Theme ?? "light"
                };

                var updatedSettings = await connection.QueryFirstOrDefaultAsync<UserSettings>(
                    "UserSettings_Upsert",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (updatedSettings == null)
                {
                    return Results.Problem("Failed to save user settings.");
                }

                return Results.Ok(updatedSettings);
            });

            // Alternative endpoint for /api/users/settings (without userId in path)
            // This could be used with authentication to get current user's settings
            app.MapGet($"{BaseRoute}/settings", async (DapperContext context, int? userId) =>
            {
                if (!userId.HasValue)
                {
                    return Results.BadRequest(new { Message = "userId query parameter is required." });
                }

                using var connection = context.CreateConnection();
                var parameters = new { UserId = userId.Value };

                var settings = await connection.QueryFirstOrDefaultAsync<UserSettings>(
                    "UserSettings_Get",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (settings == null)
                {
                    // Return default settings if none exist
                    return Results.Ok(new UserSettings
                    {
                        UserId = userId.Value,
                        Language = "en",
                        DateFormat = "yyyy-mm-dd",
                        SiderColor = "#001529",
                        Theme = "light"
                    });
                }

                return Results.Ok(settings);
            });
        }
    }
}
