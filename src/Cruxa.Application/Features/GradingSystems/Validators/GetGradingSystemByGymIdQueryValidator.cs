using FluentValidation;
using Cruxa.Application.Features.GradingSystems.Queries;

namespace Cruxa.Application.Features.GradingSystems.Validators;

public class GetGradingSystemByGymIdQueryValidator : AbstractValidator<GetGradingSystemByGymIdQuery>
{
    public GetGradingSystemByGymIdQueryValidator()
    {
        RuleFor(x => x.GymId)
            .NotEmpty().WithMessage("Gym ID is required");
    }
}
