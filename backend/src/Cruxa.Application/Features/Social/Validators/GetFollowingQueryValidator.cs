using FluentValidation;
using Cruxa.Application.Features.Social.Queries;

namespace Cruxa.Application.Features.Social.Validators;

public class GetFollowingQueryValidator : AbstractValidator<GetFollowingQuery>
{
    public GetFollowingQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}
