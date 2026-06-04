using FluentValidation;
using Cruxa.Application.Features.Routes.Queries;

namespace Cruxa.Application.Features.Routes.Validators;

public class GetRouteByIdQueryValidator : AbstractValidator<GetRouteByIdQuery>
{
    public GetRouteByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Route ID is required");
    }
}
