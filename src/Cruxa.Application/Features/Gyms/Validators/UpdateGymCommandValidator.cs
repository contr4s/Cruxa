using FluentValidation;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Validators;

public class UpdateGymCommandValidator : AbstractValidator<UpdateGymCommand>
{
    public UpdateGymCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Gym ID is required");

        RuleFor(x => x.Name)
            .MaximumLength(200).WithMessage("Gym name must not exceed 200 characters")
            .When(x => x.Name != null);

        RuleFor(x => x.City)
            .MaximumLength(100).WithMessage("City must not exceed 100 characters")
            .When(x => x.City != null);

        RuleFor(x => x.Address)
            .MaximumLength(300).WithMessage("Address must not exceed 300 characters")
            .When(x => x.Address != null);

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90")
            .When(x => x.Latitude.HasValue);

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180")
            .When(x => x.Longitude.HasValue);
    }
}
