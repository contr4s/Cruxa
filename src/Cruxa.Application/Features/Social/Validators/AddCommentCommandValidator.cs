using FluentValidation;
using Cruxa.Application.Features.Social.Commands;

namespace Cruxa.Application.Features.Social.Validators;

public class AddCommentCommandValidator : AbstractValidator<AddCommentCommand>
{
    public AddCommentCommandValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Content).NotEmpty().MaximumLength(2000);
    }
}
