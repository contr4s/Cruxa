using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record GetFollowersQuery(Guid UserId) : IRequest<Result<IEnumerable<Guid>>>;
