using FluentValidation;
using Cruxa.Application.Features.Social.Queries;

namespace Cruxa.Application.Features.Social.Validators;

public class GetFollowersQueryValidator : AbstractValidator<GetFollowersQuery>
{
    public GetFollowersQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}
