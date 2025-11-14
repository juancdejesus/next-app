using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace App.Server.Utils;


public static class EndpointRouteBuilderExtensions
{
    public static void MapEndpoints(this IEndpointRouteBuilder app, Assembly assembly)
    {
        ArgumentNullException.ThrowIfNull(app);
        ArgumentNullException.ThrowIfNull(assembly);

        var endpointRouteHandlerInterfaceType = typeof(IEndpointRouteHandler);

        var endpointRouteHandlerTypes = assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && !t.IsGenericType && typeof(IEndpointRouteHandler).IsAssignableFrom(t));

        foreach (var endpointRouteHandlerType in endpointRouteHandlerTypes)
        {
            var instantiatedType = (IEndpointRouteHandler)ActivatorUtilities.CreateInstance(app.ServiceProvider, endpointRouteHandlerType);
            instantiatedType.MapEndpoints(app);
        }
    }
}