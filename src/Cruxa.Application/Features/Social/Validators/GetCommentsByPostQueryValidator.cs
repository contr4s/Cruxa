using FluentValidation;

namespace Cruxa.Application.Features.Social.Validators;

public class GetCommentsByPostQueryValidator : AbstractValidator<Queries.GetCommentsByPostQuery>
{
    public GetCommentsByPostQueryValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty().WithMessage("Post id is required");
    }
}
