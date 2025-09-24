using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using jSmartAssist.AI.API.Data;
using jSmartAssist.AI.API.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AIAssistantContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IFileProcessingService, FileProcessingService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "jSmartAssist.AI API", Version = "v1" });
});


builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        // Replace this line:
        // IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
        //     Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))

        // With the following code to ensure the value is not null:
        var jwtKey = builder.Configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("JWT Key is not configured.");
        }
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
