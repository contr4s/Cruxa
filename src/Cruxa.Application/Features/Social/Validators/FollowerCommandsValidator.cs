using FluentValidation;
using Cruxa.Application.Features.Social.Commands;

namespace Cruxa.Application.Features.Social.Validators;

public class FollowUserCommandValidator : AbstractValidator<FollowUserCommand>
{
    public FollowUserCommandValidator()
    {
        RuleFor(x => x.FollowerId).NotEmpty();
        RuleFor(x => x.FolloweeId).NotEmpty();
    }
}
