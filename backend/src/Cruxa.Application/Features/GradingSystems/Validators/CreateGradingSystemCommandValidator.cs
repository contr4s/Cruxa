using FluentValidation;

namespace Cruxa.Application.Features.GradingSystems.Validators;

public class CreateGradingSystemCommandValidator : AbstractValidator<Commands.CreateGradingSystemCommand>
{
    public CreateGradingSystemCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.GradeMapping)
            .NotNull().WithMessage("GradeMapping is required")
            .Must(m => m.Count > 0).WithMessage("GradeMapping must contain at least one entry");
    }
}
