using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetAllGymsQuery(int Page = 1, int PageSize = 20) : IRequest<Result<OffsetPaginatedList<GymDto>>>;
