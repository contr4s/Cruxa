using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetAllTagsQuery : IRequest<Result<List<string>>>;
