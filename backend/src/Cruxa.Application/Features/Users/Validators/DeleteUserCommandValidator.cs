using FluentValidation;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Application.Features.Users.Validators;

public class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("User ID is required");
    }
}
