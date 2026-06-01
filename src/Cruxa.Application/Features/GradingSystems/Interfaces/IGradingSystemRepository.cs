namespace Cruxa.Application.Features.GradingSystems.Interfaces;

using Domain.Entities;

public interface IGradingSystemRepository
{
    Task<GradingSystem?> GetByIdAsync(Guid id);
    Task<IEnumerable<GradingSystem>> GetAllAsync();
    Task<GradingSystem?> GetByGymIdAsync(Guid gymId);
}
