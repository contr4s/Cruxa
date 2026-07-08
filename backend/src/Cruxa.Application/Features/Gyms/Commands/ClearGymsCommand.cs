using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Gyms.Commands;

public record ClearGymsCommand() : IRequest<Result>, ICommand;
