using FluentValidation;
using Cruxa.Application.Features.Social.Commands;

namespace Cruxa.Application.Features.Social.Validators;

public class LikePostCommandValidator : AbstractValidator<LikePostCommand>
{
    public LikePostCommandValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
