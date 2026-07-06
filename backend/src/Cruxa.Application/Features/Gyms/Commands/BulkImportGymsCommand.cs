using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using MediatR;

namespace Cruxa.Application.Features.Gyms.Commands;

/// <summary>
/// Command to bulk import gyms from an external source (parser).
/// Admin-only. Validates each gym individually and returns import statistics.
/// </summary>
public record BulkImportGymsCommand(List<ImportGymDto> Gyms) : IRequest<Result<BulkImportResult>>;
