namespace App.Server.Utils;

public interface IEndpointRouteHandler
{
    public void MapEndpoints(IEndpointRouteBuilder app);
}
