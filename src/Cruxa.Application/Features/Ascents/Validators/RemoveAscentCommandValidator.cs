using FluentValidation;

namespace Cruxa.Application.Features.Ascents.Validators;

public class RemoveAscentCommandValidator : AbstractValidator<Commands.RemoveAscentCommand>
{
    public RemoveAscentCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ascent id is required");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User id is required");
    }
}
