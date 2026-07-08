using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Queries;

public record GetGradePyramidQuery(Guid UserId) : IRequest<Result<List<GradePyramidItemDto>>>;