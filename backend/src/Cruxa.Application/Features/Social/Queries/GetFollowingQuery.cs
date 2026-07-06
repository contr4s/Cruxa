using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record GetFollowingQuery(Guid UserId) : IRequest<Result<IEnumerable<Guid>>>;
