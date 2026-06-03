using MediatR;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Ascents.Queries;

public record GetAscentsByPostQuery(Guid PostId) : IRequest<Result<IEnumerable<AscentDto>>>;

public record GetAscentsByUserQuery(Guid UserId) : IRequest<Result<IEnumerable<AscentDto>>>;
