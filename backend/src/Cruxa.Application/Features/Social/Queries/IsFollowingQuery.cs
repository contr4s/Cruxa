using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record IsFollowingQuery(Guid FollowerId, Guid FolloweeId) : IRequest<Result<bool>>;
