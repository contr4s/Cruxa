using FluentValidation;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Validators;

/// <summary>
/// Validates the BulkImportGymsCommand.
/// </summary>
public class BulkImportGymsValidator : AbstractValidator<BulkImportGymsCommand>
{
    public BulkImportGymsValidator()
    {
        RuleFor(x => x.Gyms)
            .NotNull()
            .WithMessage("Gyms list is required.")
            .NotEmpty()
            .WithMessage("At least one gym is required.")
            .Must(gyms => gyms.Count <= 500)
            .WithMessage("Maximum 500 gyms per import request.");
    }
}
