using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class PasswordCredentialRepository : IPasswordCredentialRepository
{
    private readonly CruxaDbContext _context;

    public PasswordCredentialRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<PasswordCredential?> GetByUserIdAsync(Guid userId)
    {
        return await _context.PasswordCredentials
            .FirstOrDefaultAsync(pc => pc.UserId == userId);
    }

    public async Task AddAsync(PasswordCredential credential)
    {
        await _context.PasswordCredentials.AddAsync(credential);
    }

    public async Task UpdateAsync(PasswordCredential credential)
    {
        _context.PasswordCredentials.Update(credential);
    }
}
