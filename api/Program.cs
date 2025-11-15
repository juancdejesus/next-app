using App.Server.Utils;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Note: Ensure you have a 'using' statement for your endpoint mapping logic if it's in a different namespace.
// For example: using App.Server.Endpoints; 

namespace App.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Define a policy name for your specific CORS configuration
            const string AllowFrontendOrigin = "_allowFrontendOrigin";

            // Add and configure CORS services
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: AllowFrontendOrigin,
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:3000") // Your frontend development URL
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials(); 
                                  });
            });

            // Add other services to the container
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configure JSON serialization options
            builder.Services.ConfigureHttpJsonOptions(options =>
            {
                options.SerializerOptions.PropertyNameCaseInsensitive = true;
            });

            // Add DapperContext
            builder.Services.AddSingleton<DapperContext>();

            // Configure Windows Authentication for IIS/IIS Express
            builder.Services.AddAuthentication(Microsoft.AspNetCore.Server.IISIntegration.IISDefaults.AuthenticationScheme);

            // Configure IIS integration to forward Windows credentials
            builder.Services.Configure<Microsoft.AspNetCore.Builder.IISOptions>(options =>
            {
                options.AutomaticAuthentication = true;
                options.ForwardClientCertificate = true;
            });

            var app = builder.Build();
            
            // Configure the application's base path
            app.UsePathBase("/monitor");

            // Configure the HTTP request pipeline.
            app.UseExceptionHandler("/error");

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Serve static files like index.html
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // UseRouting should be called before UseCors
            app.UseRouting();

            // Apply the CORS policy
            app.UseCors(AllowFrontendOrigin);

            // Enable Windows Authentication
            app.UseAuthentication();

            // Map API endpoints and client-side fallback
            app.MapGroup("/api").MapEndpoints(Assembly.GetExecutingAssembly());
            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}
