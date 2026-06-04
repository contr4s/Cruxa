using FluentValidation;

namespace Cruxa.Application.Features.Posts.Validators;

public class GetFeedQueryValidator : AbstractValidator<Queries.GetFeedQuery>
{
    public GetFeedQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User id is required");

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Page must be >= 1");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100).WithMessage("Page size must be between 1 and 100");
    }
}
