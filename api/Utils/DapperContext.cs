using Microsoft.Data.SqlClient;
using MySqlConnector;
using System.Data;

namespace App.Server.Utils
{
    public class DapperContext : IDapperContext
    {
        private readonly IConfiguration _configuration;
        private readonly string? _connectionString;

        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("Default");
        }

        //public IDbConnection CreateConnection() => new MySqlConnection(_connectionString);
        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}
