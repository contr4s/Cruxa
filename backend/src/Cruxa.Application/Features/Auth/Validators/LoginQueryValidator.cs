using Cruxa.Application.Features.Auth.Commands;
using FluentValidation;

namespace Cruxa.Application.Features.Auth.Validators;

public class LoginQueryValidator : AbstractValidator<LoginCommand>
{
    public LoginQueryValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is not valid");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}
