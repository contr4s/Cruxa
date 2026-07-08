using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Social.Commands;

public record UnlikePostCommand(Guid PostId, Guid UserId) : IRequest<Result>, ICommand;
