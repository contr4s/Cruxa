using FluentValidation;

namespace Cruxa.Application.Features.Posts.Validators;

public class GetPostsByGymQueryValidator : AbstractValidator<Queries.GetPostsByGymQuery>
{
    public GetPostsByGymQueryValidator()
    {
        RuleFor(x => x.GymId)
            .NotEmpty().WithMessage("Gym id is required");
    }
}
