using FluentValidation;
using Cruxa.Application.Features.Social.Queries;

namespace Cruxa.Application.Features.Social.Validators;

public class IsFollowingQueryValidator : AbstractValidator<IsFollowingQuery>
{
    public IsFollowingQueryValidator()
    {
        RuleFor(x => x.FollowerId)
            .NotEmpty().WithMessage("Follower ID is required");

        RuleFor(x => x.FolloweeId)
            .NotEmpty().WithMessage("Followee ID is required");
    }
}
