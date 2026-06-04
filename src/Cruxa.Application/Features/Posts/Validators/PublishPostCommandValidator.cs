using FluentValidation;
using Cruxa.Application.Features.Posts.Commands;

namespace Cruxa.Application.Features.Posts.Validators;

public class PublishPostCommandValidator : AbstractValidator<PublishPostCommand>
{
    public PublishPostCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
