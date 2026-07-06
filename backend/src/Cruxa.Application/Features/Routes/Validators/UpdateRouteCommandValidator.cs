using FluentValidation;
using Cruxa.Application.Features.Routes.Commands;

namespace Cruxa.Application.Features.Routes.Validators;

public class UpdateRouteCommandValidator : AbstractValidator<UpdateRouteCommand>
{
    public UpdateRouteCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Route ID is required");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Route type is not valid")
            .When(x => x.Type.HasValue);

        RuleFor(x => x.HoldColor)
            .IsInEnum().WithMessage("Hold color is not valid")
            .When(x => x.HoldColor.HasValue);

        RuleFor(x => x.Sector)
            .MaximumLength(100).WithMessage("Sector must not exceed 100 characters")
            .When(x => x.Sector != null);

        RuleFor(x => x.GradeRaw)
            .NotEmpty().WithMessage("GradeRaw must not be empty when provided")
            .MaximumLength(20).WithMessage("GradeRaw must not exceed 20 characters")
            .When(x => x.GradeRaw != null);
    }
}
