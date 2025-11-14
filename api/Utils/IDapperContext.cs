using System.Data;

namespace App.Server.Utils;
public interface IDapperContext
{
    IDbConnection CreateConnection();
}