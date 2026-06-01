using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Cruxa.Infrastructure.Persistence;

namespace Cruxa.Infrastructure;

public class CruxaDbContextFactory : IDesignTimeDbContextFactory<CruxaDbContext>
{
    public CruxaDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CruxaDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=cruxa;Username=postgres;Password=postgres");

        return new CruxaDbContext(optionsBuilder.Options);
    }
}
