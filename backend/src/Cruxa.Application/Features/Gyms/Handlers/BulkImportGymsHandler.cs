using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Handlers;

/// <summary>
/// Handles bulk import of gyms from an external parser.
/// Validates each gym, deduplicates by Name+City, and inserts new ones.
/// Runs inside a single database transaction.
/// </summary>
public class BulkImportGymsHandler : IRequestHandler<BulkImportGymsCommand, Result<BulkImportResult>>
{
    private readonly IGymRepository _gymRepository;
    private readonly ITransactionManager _transactionManager;

    // Default grading system ID (Фонтенбло Боулдеринг, seeded in CruxaDbContext)
    private static readonly Guid DefaultGradingSystemId = new("00000000-0000-0000-0000-000000000001");

    public BulkImportGymsHandler(IGymRepository gymRepository, ITransactionManager transactionManager)
    {
        _gymRepository = gymRepository;
        _transactionManager = transactionManager;
    }

    public async Task<Result<BulkImportResult>> Handle(BulkImportGymsCommand command, CancellationToken ct)
    {
        var result = new BulkImportResult();

        if (command.Gyms.Count == 0)
        {
            return Result.Success(result);
        }

        if (command.Gyms.Count > 500)
        {
            return Result.Failure<BulkImportResult>(
                Error.Validation("Maximum 500 gyms per import request."));
        }

        await using var transaction = await _transactionManager.BeginTransactionAsync(ct);

        try
        {
            var newGyms = new List<Gym>();

            foreach (var dto in command.Gyms)
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    result.Errors.Add("Gym missing required field: Name");
                    result.Skipped++;
                    continue;
                }

                if (string.IsNullOrWhiteSpace(dto.City))
                {
                    result.Errors.Add($"Gym '{dto.Name}' missing required field: City");
                    result.Skipped++;
                    continue;
                }

                if (string.IsNullOrWhiteSpace(dto.Address))
                {
                    result.Errors.Add($"Gym '{dto.Name}' missing required field: Address");
                    result.Skipped++;
                    continue;
                }

                // Deduplicate: check if gym with same name + city already exists
                var exists = await _gymRepository.ExistsByNameAndCityAsync(dto.Name.Trim(), dto.City.Trim());
                if (exists)
                {
                    result.Skipped++;
                    continue;
                }

                // Create gym entity
                var createResult = Gym.Create(
                    dto.Name.Trim(),
                    dto.City.Trim(),
                    dto.Address.Trim(),
                    dto.Latitude,
                    dto.Longitude);

                if (createResult.IsFailure)
                {
                    result.Errors.Add($"Gym '{dto.Name}': {createResult.Error.Message}");
                    result.Skipped++;
                    continue;
                }

                var gym = createResult.Value;

                // Set optional fields and mark as parsed
                gym.Update(
                    description: dto.Description?.Trim(),
                    contactInfo: dto.ContactInfo?.Trim(),
                    contactEmail: dto.ContactEmail?.Trim(),
                    socialLinks: dto.SocialLinks,
                    website: dto.Website?.Trim(),
                    prices: dto.Prices,
                    workingHours: dto.WorkingHours,
                    photoUrls: dto.PhotoUrls?.Count > 0 ? dto.PhotoUrls : null,
                    gradingSystemId: DefaultGradingSystemId,
                    wallArea: dto.WallArea,
                    maxHeight: dto.MaxHeight,
                    yearFounded: dto.YearFounded,
                    metroStations: dto.MetroStations,
                    tags: dto.Tags);

                // Mark as externally parsed
                gym.MarkAsParsed();

                newGyms.Add(gym);
            }

            if (newGyms.Count > 0)
            {
                await _gymRepository.AddRangeAsync(newGyms);
            }

            await transaction.CommitAsync(ct);

            result.Imported = newGyms.Count;
            return Result.Success(result);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(ct);
            return Result.Failure<BulkImportResult>(
                Error.Validation($"Import failed: {ex.Message}"));
        }
    }
}
