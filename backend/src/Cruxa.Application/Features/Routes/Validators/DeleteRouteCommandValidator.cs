using FluentValidation;
using Cruxa.Application.Features.Routes.Commands;

namespace Cruxa.Application.Features.Routes.Validators;

public class DeleteRouteCommandValidator : AbstractValidator<DeleteRouteCommand>
{
    public DeleteRouteCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Route ID is required");
    }
}
