using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHealthChecks();

// Configure Kestrel for production
builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false; // Remove Server header for security
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // 10MB max request size
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for production - restrict to specific origins
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost", "https://localhost" };

// Allow comma-separated env override (ALLOWED_ORIGINS)
var allowedOriginsEnv = builder.Configuration["ALLOWED_ORIGINS"];
if (!string.IsNullOrWhiteSpace(allowedOriginsEnv))
{
    allowedOrigins = allowedOriginsEnv
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}

// Rate limiting settings (env: RATE_LIMIT_REQUESTS_PER_MINUTE)
var rateLimitPerMinute = builder.Configuration.GetValue("RateLimiting:RequestsPerMinute", 100);
var rateLimitEnv = builder.Configuration["RATE_LIMIT_REQUESTS_PER_MINUTE"];
if (int.TryParse(rateLimitEnv, out var envRateLimit) && envRateLimit > 0)
{
    rateLimitPerMinute = envRateLimit;
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        if (builder.Environment.IsProduction())
        {
            // In production, use specific allowed origins
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .SetIsOriginAllowedToAllowWildcardSubdomains();
        }
        else
        {
            // In development, allow any origin
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = rateLimitPerMinute,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.", token);
    };
});

// Security headers
builder.Services.AddAntiforgery(options =>
{
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
});

builder.Services.AddHsts(options =>
{
    options.Preload = true;
    options.IncludeSubDomains = true;
    options.MaxAge = TimeSpan.FromDays(365);
});

// Configure forwarded headers for reverse proxy
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
    app.UseExceptionHandler("/Error");
}

// Security middleware - order matters!
app.UseForwardedHeaders();

// Add custom security headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Remove("X-Powered-By");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Add("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    
    await next();
});

// Rate limiting
app.UseRateLimiter();

// CORS
app.UseCors("ProductionPolicy");

// Static files with security options
var staticFileOptions = new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Cache static assets for 1 year
        if (ctx.File.Name.EndsWith(".js") || ctx.File.Name.EndsWith(".css") || 
            ctx.File.Name.EndsWith(".woff") || ctx.File.Name.EndsWith(".woff2"))
        {
            ctx.Context.Response.Headers.Add("Cache-Control", "public,max-age=31536000,immutable");
        }
    }
};

app.UseDefaultFiles();
app.UseStaticFiles(staticFileOptions);

// Serve content files from mounted volumes with read-only access
var contentPath = Path.Combine(app.Environment.WebRootPath, "content");
if (Directory.Exists(contentPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(contentPath),
        RequestPath = "/content",
        ServeUnknownFileTypes = false, // Only serve known MIME types
        OnPrepareResponse = ctx =>
        {
            // No caching for content files
            ctx.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
            ctx.Context.Response.Headers.Add("Pragma", "no-cache");
            ctx.Context.Response.Headers.Add("Expires", "0");
        }
    });
}

app.UseRouting();
app.UseAuthorization();

// Health check endpoint
app.MapHealthChecks("/health");

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
