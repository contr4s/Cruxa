using FluentValidation;
using Cruxa.Application.Features.Posts.Commands;

namespace Cruxa.Application.Features.Posts.Validators;

public class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.GymId).NotEmpty();
        RuleFor(x => x.Description)
            .MaximumLength(2000).When(x => x.Description != null);
    }
}
