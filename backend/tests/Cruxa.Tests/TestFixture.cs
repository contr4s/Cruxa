using Bogus;
using Soenneker.Utils.AutoBogus;
using Soenneker.Utils.AutoBogus.Abstract;
using Soenneker.Utils.AutoBogus.Config;
using Soenneker.Utils.AutoBogus.Context;
using Soenneker.Utils.AutoBogus.Override;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Domain.Enums;

namespace Cruxa.Tests;

/// <summary>
/// AutoBogus test data generator (Soenneker.Utils.AutoBogus).
/// Types without an override are auto-generated.
/// TimeOnly, WorkingHoursEntry, PriceItem are supported natively.
/// </summary>
public sealed class TestFixture
{
    private readonly IAutoFaker _faker;

    public TestFixture()
    {
        Faker = new Faker("ru");
        _faker = new AutoFaker(new AutoFakerConfig { Locale = "ru" });
        _faker.Configure(builder =>
        {
            builder.WithOverride(new CreateGymCommandOverride());
            builder.WithOverride(new RegisterCommandOverride());
            builder.WithOverride(new CreateRouteCommandOverride());
            builder.WithOverride(new AddRouteReviewCommandOverride());
            builder.WithOverride(new UpdateRouteReviewCommandOverride());
        });
    }

    public Faker Faker { get; }

    public T Create<T>() => _faker.Generate<T>();
    public List<T> CreateMany<T>(int count) => _faker.Generate<T>(count);

    // ---- AutoFakerOverrides ----
    // Наследуемся от AutoFakerOverride<T> — Preinitialize=true,
    // context.Instance уже создан, остаётся заполнить нужные поля.

    private sealed class CreateGymCommandOverride : AutoFakerOverride<CreateGymCommand>
    {
        public override void Generate(AutoFakerOverrideContext context)
        {
            context.Instance = (CreateGymCommand)context.Instance with
            {
                GradingSystemId = new Guid("00000000-0000-0000-0000-000000000001"),
            };
        }
    }

    private sealed class RegisterCommandOverride : AutoFakerOverride<RegisterCommand>
    {
        public override void Generate(AutoFakerOverrideContext context)
        {
            var person = context.Faker.Person;
            var suffix = context.Faker.Random.Int(1, 99999);
            context.Instance = new RegisterCommand(
                Username: person.UserName + suffix,
                Email: $"{suffix}{person.Email.ToLowerInvariant()}",
                Password: context.Faker.Internet.Password(),
                City: person.Address.City
            );
        }
    }

    private sealed class CreateRouteCommandOverride : AutoFakerOverride<CreateRouteCommand>
    {
        public override void Generate(AutoFakerOverrideContext context)
        {
            context.Instance = (CreateRouteCommand)context.Instance with
            {
                GradeRaw = context.Faker.PickRandom(
                    "4a", "4b", "4c", "5a", "5b", "5c",
                    "6a", "6b", "6c", "7a", "7b", "7c", "8a"),
            };
        }
    }

    private sealed class AddRouteReviewCommandOverride : AutoFakerOverride<AddRouteReviewCommand>
    {
        public override void Generate(AutoFakerOverrideContext context)
        {
            var instance = (AddRouteReviewCommand)context.Instance;
            context.Instance = instance with
            {
                Rating = context.Faker.Random.Int(1, 5)
            };
        }
    }

    private sealed class UpdateRouteReviewCommandOverride : AutoFakerOverride<UpdateRouteReviewCommand>
    {
        public override void Generate(AutoFakerOverrideContext context)
        {
            var instance = (UpdateRouteReviewCommand)context.Instance;
            context.Instance = instance with
            {
                Rating = context.Faker.Random.Int(1, 5)
            };
        }
    }
}
