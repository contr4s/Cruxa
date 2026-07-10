using MediatR;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Admin.Queries;

public record GetTopGymsQuery : IRequest<Result<List<TopGymItemDto>>>;
