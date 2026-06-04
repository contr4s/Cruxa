using FluentValidation;
using Cruxa.Application.Features.Users.Queries;

namespace Cruxa.Application.Features.Users.Validators;

public class GetUserByUsernameQueryValidator : AbstractValidator<GetUserByUsernameQuery>
{
    public GetUserByUsernameQueryValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .Length(3, 50).WithMessage("Username must be between 3 and 50 characters");
    }
}
