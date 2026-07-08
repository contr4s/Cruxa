using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Posts.Commands;

public record PublishPostCommand(Guid Id, Guid UserId) : IRequest<Result>, ICommand;
