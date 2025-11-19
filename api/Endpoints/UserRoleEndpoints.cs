using api.Models;
using App.Server.Utils;
using Dapper;
using System.Data;

namespace App.Server.Endpoints
{
    public class UserRoleEndpoints : IEndpointRouteHandler
    {
        private const string BaseRoute = "/roles";

        public void MapEndpoints(IEndpointRouteBuilder app)
        {
            // Get all roles
            app.MapGet(BaseRoute, async (DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var roles = await connection.QueryAsync<UserRole>(
                    "UserRoles_GetList",
                    commandType: CommandType.StoredProcedure);

                return Results.Ok(roles);
            });
        }
    }
}
