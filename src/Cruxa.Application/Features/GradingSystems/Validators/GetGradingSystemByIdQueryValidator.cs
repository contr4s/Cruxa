using FluentValidation;
using Cruxa.Application.Features.GradingSystems.Queries;

namespace Cruxa.Application.Features.GradingSystems.Validators;

public class GetGradingSystemByIdQueryValidator : AbstractValidator<GetGradingSystemByIdQuery>
{
    public GetGradingSystemByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Grading system ID is required");
    }
}
