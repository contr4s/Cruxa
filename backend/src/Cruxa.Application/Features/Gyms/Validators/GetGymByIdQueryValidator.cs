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
