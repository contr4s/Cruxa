using FluentValidation;
using Cruxa.Application.Features.Routes.Queries;

namespace Cruxa.Application.Features.Routes.Validators;

public class GetRoutesByGymQueryValidator : AbstractValidator<GetRoutesByGymQuery>
{
    public GetRoutesByGymQueryValidator()
    {
        RuleFor(x => x.Filter.GymId)
            .NotEmpty().WithMessage("Gym ID is required");
    }
}
