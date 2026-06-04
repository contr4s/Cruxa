using FluentValidation;

namespace Cruxa.Application.Features.Posts.Validators;

public class GetPostsByUserQueryValidator : AbstractValidator<Queries.GetPostsByUserQuery>
{
    public GetPostsByUserQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User id is required");
    }
}
