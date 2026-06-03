using FluentValidation;
using Cruxa.Application.Features.Social.Commands;

namespace Cruxa.Application.Features.Social.Validators;

public class AddCommentCommandValidator : AbstractValidator<AddCommentCommand>
{
    public AddCommentCommandValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Comment content is required")
            .MaximumLength(500).WithMessage("Comment must not exceed 500 characters");
    }
}
