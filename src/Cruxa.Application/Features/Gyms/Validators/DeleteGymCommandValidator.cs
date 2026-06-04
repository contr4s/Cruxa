using FluentValidation;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Validators;

public class DeleteGymCommandValidator : AbstractValidator<DeleteGymCommand>
{
    public DeleteGymCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Gym ID is required");
    }
}
