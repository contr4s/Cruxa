using FluentValidation;
using Cruxa.Application.Features.Ascents.Queries;

namespace Cruxa.Application.Features.Ascents.Validators;

public class GetAscentsByPostQueryValidator : AbstractValidator<GetAscentsByPostQuery>
{
    public GetAscentsByPostQueryValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty().WithMessage("Post ID is required");
    }
}
