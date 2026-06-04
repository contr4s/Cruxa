using FluentValidation;
using Cruxa.Application.Features.Posts.Commands;

namespace Cruxa.Application.Features.Posts.Validators;

public class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
{
    public UpdatePostCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Description)
            .MaximumLength(2000).When(x => x.Description != null);
    }
}
