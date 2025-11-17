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
                var parameters = new { p_user_id = userId };

                var settings = await connection.QueryFirstOrDefaultAsync<UserSettings>(
                    "proc_get_user_settings",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (settings == null)
                {
                    // Return default settings if none exist
                    return Results.Ok(new UserSettings
                    {
                        user_id = userId,
                        language = "en",
                        date_format = "yyyy-mm-dd",
                        sider_color = "#001529",
                        theme = "light"
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
                    p_user_id = userId,
                    p_language = request.language ?? "en",
                    p_date_format = request.date_format ?? "yyyy-mm-dd",
                    p_sider_color = request.sider_color ?? "#001529",
                    p_theme = request.theme ?? "light"
                };

                var updatedSettings = await connection.QueryFirstOrDefaultAsync<UserSettings>(
                    "proc_upsert_user_settings",
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
                var parameters = new { p_user_id = userId.Value };

                var settings = await connection.QueryFirstOrDefaultAsync<UserSettings>(
                    "proc_get_user_settings",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (settings == null)
                {
                    // Return default settings if none exist
                    return Results.Ok(new UserSettings
                    {
                        user_id = userId.Value,
                        language = "en",
                        date_format = "yyyy-mm-dd",
                        sider_color = "#001529",
                        theme = "light"
                    });
                }

                return Results.Ok(settings);
            });
        }
    }
}
