using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Gyms.Commands;

public record ToggleGymFavoriteCommand(Guid GymId, Guid UserId) : IRequest<Result>, ICommand;
