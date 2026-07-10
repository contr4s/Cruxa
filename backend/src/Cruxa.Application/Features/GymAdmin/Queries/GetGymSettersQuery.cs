using MediatR;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Queries;

public record GetGymSettersQuery(Guid GymId) : IRequest<Result<List<SetterManagementItemDto>>>;
