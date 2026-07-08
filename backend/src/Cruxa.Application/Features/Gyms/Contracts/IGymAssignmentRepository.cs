using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Contracts;

public interface IGymAssignmentRepository
{
    Task<List<GymAssignment>> GetByUserIdAsync(Guid userId);
    Task<List<GymAssignment>> GetByGymIdAsync(Guid gymId);
    Task AddAsync(GymAssignment assignment);
    Task AddRangeAsync(List<GymAssignment> assignments);
    Task DeleteRangeAsync(IEnumerable<GymAssignment> assignments);
    Task<List<GymAssignment>> GetAllAsync();
}
