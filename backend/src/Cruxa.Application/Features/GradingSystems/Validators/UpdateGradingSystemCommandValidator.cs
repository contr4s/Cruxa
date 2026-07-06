using FluentValidation;

namespace Cruxa.Application.Features.GradingSystems.Validators;

public class UpdateGradingSystemCommandValidator : AbstractValidator<Commands.UpdateGradingSystemCommand>
{
    public UpdateGradingSystemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.GradeMapping)
            .NotNull().WithMessage("GradeMapping is required")
            .Must(m => m.Count > 0).WithMessage("GradeMapping must contain at least one entry");
    }
}
