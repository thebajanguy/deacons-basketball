using Azure.Core.Serialization;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.ComponentModel.Design;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using IntakeAPI.Services;
using IntakeAPI.Settings;
using FluentValidation;
using MediatR;


var builder = FunctionsApplication.CreateBuilder(args);

// ---------------- Configuration ----------------
builder.Configuration
   // .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
   // .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true); // ignored in Azure

// ---------------- Logging ----------------
builder.Services.AddLogging(lb => lb.AddConsole());


// ---------------- Worker JSON ------------------
builder.Services.Configure<WorkerOptions>(opts =>
{
    opts.Serializer = new JsonObjectSerializer(new JsonSerializerOptions
    {
        // override the default value
        PropertyNameCaseInsensitive = false,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        ReferenceHandler = ReferenceHandler.Preserve,
        WriteIndented = true,
    });

});
builder.Services.AddSingleton(new JsonSerializerOptions
{
    // override the default value
    PropertyNameCaseInsensitive = false,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    ReferenceHandler = ReferenceHandler.Preserve,
    WriteIndented = true,
});

// ---------------- HttpClient & cache ----------------
builder.Services.AddHttpClient();
builder.Services.AddHttpClient("aad", c =>
{
    c.Timeout = TimeSpan.FromSeconds(30);
    c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
});

// ---------------- Options binding --------------
//builder.Services.AddOptions<GmailOptions>().Bind(builder.Configuration.GetSection("Gmail")).ValidateDataAnnotations().ValidateOnStart();
//builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<GmailOptions>>().Value);

// ---------------- Middleware (ordered) ----------------
// NOTE: Middlewares execute in the order they are registered here.
// To do: Add middleware components here


// ---------------- Services ----------------------
builder.Services.AddScoped<IEmailService, EmailService>();

//// ---------------- EF Core (Cosmos) ----------------
//builder.Services.AddDbContextFactory<ApplicationDatabaseContext>((sp, opt) =>
//{
//    var cfg = sp.GetRequiredService<IOptions<CosmosOptions>>().Value;
//    opt.UseCosmos(
//        accountEndpoint: cfg.Endpoint,
//        accountKey: cfg.Key,
//        databaseName: cfg.Database
//    );
//});

//// ---------------- Repositories ----------------
//builder.Services.AddScoped<IRepository<Athlete>, AthleteRepository>();


//// ---------------- MediatR + pipeline ----------------
//builder.Services.AddMediatR(cfg =>
//{
//    cfg.RegisterServicesFromAssemblies(
//        typeof(Program).Assembly,
//        typeof(ProfileManager.Application.AssemblyReference).Assembly
//    );
//});
//builder.Services.AddValidatorsFromAssemblyContaining(typeof(Program.AssemblyReference));
//builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(FluentValidationBehavior<,>));
//builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

//// ---------------- Seeders ----------------
//builder.Services.AddScoped<IDbSeederHostedService, DbSeederHostedService>();
//builder.Services.AddHostedService<OneTimeSeederHostedService>();

// ---------------- Run ----------------


builder.Build().Run();
