using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetCitiesQuery : IRequest<Result<List<string>>>;
