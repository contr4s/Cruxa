using FluentValidation;
using Cruxa.Application.Features.Routes.Reviews.Commands;

namespace Cruxa.Application.Features.Routes.Reviews.Validators;

public class AddRouteReviewCommandValidator : AbstractValidator<AddRouteReviewCommand>
{
    public AddRouteReviewCommandValidator()
    {
        RuleFor(x => x.RouteId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Rating).InclusiveBetween(1, 5).When(x => x.Rating.HasValue);
        RuleFor(x => x.PrivateNotes).MaximumLength(1000);
        RuleFor(x => x.PublicReview).MaximumLength(1000);
    }
}

public class UpdateRouteReviewCommandValidator : AbstractValidator<UpdateRouteReviewCommand>
{
    public UpdateRouteReviewCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Rating).InclusiveBetween(1, 5).When(x => x.Rating.HasValue);
        RuleFor(x => x.PrivateNotes).MaximumLength(1000);
        RuleFor(x => x.PublicReview).MaximumLength(1000);
    }
}
