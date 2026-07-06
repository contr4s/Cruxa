using FluentValidation;

namespace Cruxa.Application.Features.Posts.Validators;

public class GetPostByIdQueryValidator : AbstractValidator<Queries.GetPostByIdQuery>
{
    public GetPostByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Post id is required");
    }
}
