using FluentValidation;
using Cruxa.Application.Features.Gyms.Queries;

namespace Cruxa.Application.Features.Gyms.Validators;

public class GetGymByIdQueryValidator : AbstractValidator<GetGymByIdQuery>
{
    public GetGymByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Gym ID is required");
    }
}

public class GetGymsByCityQueryValidator : AbstractValidator<GetGymsByCityQuery>
{
    public GetGymsByCityQueryValidator()
    {
        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City must not exceed 100 characters");
    }
}
