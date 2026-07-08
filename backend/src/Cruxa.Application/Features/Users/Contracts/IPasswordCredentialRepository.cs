namespace Cruxa.Application.Features.Users.Contracts;

using Domain.Entities;

public interface IPasswordCredentialRepository
{
    Task<PasswordCredential?> GetByUserIdAsync(Guid userId);
    Task AddAsync(PasswordCredential credential);
    Task UpdateAsync(PasswordCredential credential);
}
