using FluentValidation;
using Cruxa.Application.Features.Ascents.Commands;

namespace Cruxa.Application.Features.Ascents.Validators;

public class UpdateAscentCommandValidator : AbstractValidator<UpdateAscentCommand>
{
    public UpdateAscentCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
