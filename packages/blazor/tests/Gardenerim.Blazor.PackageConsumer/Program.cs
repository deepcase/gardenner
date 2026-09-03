using Gardenerim.Blazor.Generated;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents();
builder.Services.AddGardenerimBlazor();
if (GardenerimCatalog.Components.Count != 506 || GardenerimRuntimeCatalog.Events.Count != 79) throw new InvalidOperationException("Packaged API is incomplete.");
var app = builder.Build();
app.MapStaticAssets();
app.MapGet("/", () => "Gardenerim.Blazor package consumer");
app.Run();
