using FluentValidation;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Application.Features.Users.Validators;

public sealed class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required")
            .MinimumLength(6).WithMessage("New password must be at least 6 characters")
            .MaximumLength(200).WithMessage("New password must not exceed 200 characters")
            .NotEqual(x => x.CurrentPassword).WithMessage("New password must differ from current password");
    }
}
