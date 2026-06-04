using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.GradingSystems.Commands;

public record DeleteGradingSystemCommand(Guid Id) : IRequest<Result>, ICommand;
