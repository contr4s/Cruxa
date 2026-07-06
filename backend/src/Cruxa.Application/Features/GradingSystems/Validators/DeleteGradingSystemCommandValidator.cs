using FluentValidation;

namespace Cruxa.Application.Features.GradingSystems.Validators;

public class DeleteGradingSystemCommandValidator : AbstractValidator<Commands.DeleteGradingSystemCommand>
{
    public DeleteGradingSystemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");
    }
}
