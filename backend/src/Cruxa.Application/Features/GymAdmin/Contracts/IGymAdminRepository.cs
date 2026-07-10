using Cruxa.Application.Features.GymAdmin.DTOs;

namespace Cruxa.Application.Features.GymAdmin.Contracts;

public interface IGymAdminRepository
{
    Task<GymActivityDto?> GetActivityAsync(Guid gymId);
}
