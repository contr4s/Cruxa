using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetGymByIdQuery(Guid Id) : IRequest<Result<GymDto>>;
public record GetGymsByCityQuery(string City) : IRequest<Result<IEnumerable<GymDto>>>;
public record GetAllGymsQuery : IRequest<Result<IEnumerable<GymDto>>>;
