using App.Server.Models;
using App.Server.Utils;
using Dapper;
using System.Data;

namespace App.Server.Endpoints
{
    public class EmployeeEndpoints : IEndpointRouteHandler
    {
        private const string BaseRoute = "/employees";

        public void MapEndpoints(IEndpointRouteBuilder app)
        {
            // Get all employees
            app.MapGet(BaseRoute, async (DapperContext context, bool includeTerminated = false) =>
            {
                using var connection = context.CreateConnection();
                var parameters = new { IncludeTerminated = includeTerminated };

                var employees = await connection.QueryAsync<dynamic>(
                    "Employees_GetList",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Results.Ok(employees);
            });

            // Get employees without user access (for dropdown)
            app.MapGet($"{BaseRoute}/without-access", async (DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var employees = await connection.QueryAsync<dynamic>(
                    "Employees_GetWithoutUserAccess",
                    commandType: CommandType.StoredProcedure
                );

                return Results.Ok(employees);
            });

            // Get employee by ID
            app.MapGet($"{BaseRoute}/{{id:int}}", async (int id, DapperContext context) =>
            {
                using var connection = context.CreateConnection();
                var parameters = new { Id = id };

                var employee = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "Employees_Get",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (employee == null)
                {
                    return Results.NotFound(new { Message = $"Employee with ID {id} not found." });
                }

                return Results.Ok(employee);
            });

            // Create employee
            app.MapPost(BaseRoute, async (Employee employee, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new
                {
                    EmployeeNumber = employee.EmployeeNumber,
                    FirstName = employee.FirstName,
                    LastName = employee.LastName,
                    Email = employee.Email,
                    DomainUsername = employee.DomainUsername,
                    Department = employee.Department,
                    JobTitle = employee.JobTitle,
                    PhoneNumber = employee.PhoneNumber,
                    PhotoURL = employee.PhotoURL,
                    ManagerId = employee.ManagerId,
                    HireDate = employee.HireDate
                };

                var newEmployee = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "Employees_Add",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Results.Created($"{BaseRoute}/{newEmployee.Id}", newEmployee);
            });

            // Update employee
            app.MapPut($"{BaseRoute}/{{id:int}}", async (int id, Employee employee, DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                var parameters = new
                {
                    Id = id,
                    EmployeeNumber = employee.EmployeeNumber,
                    FirstName = employee.FirstName,
                    LastName = employee.LastName,
                    Email = employee.Email,
                    DomainUsername = employee.DomainUsername,
                    Department = employee.Department,
                    JobTitle = employee.JobTitle,
                    PhoneNumber = employee.PhoneNumber,
                    PhotoURL = employee.PhotoURL,
                    ManagerId = employee.ManagerId,
                    HireDate = employee.HireDate,
                    TerminationDate = employee.TerminationDate,
                    EmployeeStatus = employee.EmployeeStatus
                };

                var rowsAffected = await connection.ExecuteAsync(
                    "Employees_Update",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (rowsAffected == 0)
                {
                    return Results.NotFound(new { Message = $"Employee with ID {id} not found." });
                }

                var updatedEmployee = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "Employees_Get",
                    new { Id = id },
                    commandType: CommandType.StoredProcedure
                );

                return Results.Ok(updatedEmployee);
            });
        }
    }
}
