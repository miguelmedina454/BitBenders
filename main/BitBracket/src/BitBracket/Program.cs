using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using BitBracket.Data;
using BitBracket.Models;
using BitBracket.DAL.Abstract;
using BitBracket.DAL.Concrete;
using MyApplication.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString1 = builder.Configuration.GetConnectionString("AuthenticationConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<BitBracket.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString1));

var connectionString = builder.Configuration.GetConnectionString("BitBracketConnection");
builder.Services.AddDbContext<BitBracket.Models.BitBracketDbContext>(options => options
                    .UseLazyLoadingProxies()
                    .UseSqlServer(connectionString));

builder.Services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
builder.Services.AddScoped<IBitUserRepository, BitUserRepository>();
// Register EmailService
var sendGridKey = builder.Configuration["SendGridKey"]; // Ensure you have this key in your appsettings.json
builder.Services.AddScoped<IEmailService, EmailService>(_ => new EmailService(sendGridKey));

builder.Services.AddControllers();

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<BitBracket.Data.ApplicationDbContext>();
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseAuthentication();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
