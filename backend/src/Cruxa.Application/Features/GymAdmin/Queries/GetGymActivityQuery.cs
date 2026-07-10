using MediatR;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Queries;

public record GetGymActivityQuery(Guid GymId) : IRequest<Result<GymActivityDto>>;
