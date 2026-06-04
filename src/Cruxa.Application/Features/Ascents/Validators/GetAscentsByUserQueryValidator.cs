using FluentValidation;
using Cruxa.Application.Features.Ascents.Queries;

namespace Cruxa.Application.Features.Ascents.Validators;

public class GetAscentsByUserQueryValidator : AbstractValidator<GetAscentsByUserQuery>
{
    public GetAscentsByUserQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}
