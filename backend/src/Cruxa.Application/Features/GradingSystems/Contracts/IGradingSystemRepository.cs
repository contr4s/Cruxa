namespace Cruxa.Application.Features.GradingSystems.Contracts;

using Domain.Entities;

public interface IGradingSystemRepository
{
    Task<GradingSystem?> GetByIdAsync(Guid id);
    Task<IEnumerable<GradingSystem>> GetAllAsync();
    Task<GradingSystem?> GetByGymIdAsync(Guid gymId);
    Task AddAsync(GradingSystem gradingSystem, CancellationToken ct = default);
    void Remove(GradingSystem gradingSystem);
}
