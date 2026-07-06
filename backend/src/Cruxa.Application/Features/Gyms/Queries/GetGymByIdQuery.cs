using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetGymByIdQuery(Guid Id) : IRequest<Result<GymDto>>;
