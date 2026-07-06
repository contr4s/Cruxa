using FluentValidation;
using Cruxa.Application.Features.Users.Queries;

namespace Cruxa.Application.Features.Users.Validators;

public class GetUserByIdQueryValidator : AbstractValidator<GetUserByIdQuery>
{
    public GetUserByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("User ID is required");
    }
}
