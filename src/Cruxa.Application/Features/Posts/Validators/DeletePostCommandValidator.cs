using FluentValidation;
using Cruxa.Application.Features.Posts.Commands;

namespace Cruxa.Application.Features.Posts.Validators;

public class DeletePostCommandValidator : AbstractValidator<DeletePostCommand>
{
    public DeletePostCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
