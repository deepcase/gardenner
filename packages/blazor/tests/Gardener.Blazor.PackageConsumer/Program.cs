using Gardener.Blazor.Generated;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents();
builder.Services.AddGardenerBlazor();
if (GardenerCatalog.Components.Count != 506 || GardenerRuntimeCatalog.Events.Count != 75) throw new InvalidOperationException("Packaged API is incomplete.");
var app = builder.Build();
app.MapStaticAssets();
app.MapGet("/", () => "Gardener.Blazor package consumer");
app.Run();

