using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.GradingSystems.Commands;

public record UpdateGradingSystemCommand(
    Guid Id,
    string Name,
    Dictionary<string, int> GradeMapping) : IRequest<Result<GradingSystemDto>>, ICommand;
