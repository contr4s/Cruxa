using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Commands;

public record DeletePostCommand(Guid Id, Guid UserId) : IRequest<Result>;
