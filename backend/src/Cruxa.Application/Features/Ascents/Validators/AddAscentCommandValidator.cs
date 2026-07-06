using FluentValidation;
using Cruxa.Application.Features.Ascents.Commands;

namespace Cruxa.Application.Features.Ascents.Validators;

public class AddAscentCommandValidator : AbstractValidator<AddAscentCommand>
{
    public AddAscentCommandValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.RouteId).NotEmpty();
        RuleFor(x => x.Style).IsInEnum();
    }
}
