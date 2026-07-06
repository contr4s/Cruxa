using FluentValidation;
using Cruxa.Application.Features.Gyms.Queries;

namespace Cruxa.Application.Features.Gyms.Validators;

public class GetGymsByCityQueryValidator : AbstractValidator<GetGymsByCityQuery>
{
    public GetGymsByCityQueryValidator()
    {
        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City must not exceed 100 characters");
    }
}
