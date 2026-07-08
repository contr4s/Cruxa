using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;

namespace Cruxa.Seeder.Generators;

public static class UserGenerator
{
    /// <summary>
    /// 10 climbers (Bogus ru) + 10 staff (5 combined GymAdmin+Routesetter, 5 pure Routesetter).
    /// Returns users, credentials, and staff-map for GymAssignments.
    /// </summary>
    public static (List<User> Users, List<PasswordCredential> Credentials, List<(Guid userId, int gymIndex, bool isAdmin, bool isSetter)> StaffMap) Generate()
    {
        var users = new List<User>();
        var creds = new List<PasswordCredential>();
        var staffMap = new List<(Guid userId, int gymIndex, bool isAdmin, bool isSetter)>();

        var faker = new Faker("ru");
        var cities = new[] { "Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск" };

        for (var i = 0; i < 10; i++)
        {
            var person = new Bogus.Person(locale: "ru");
            var gender = person.Gender == Bogus.DataSets.Name.Gender.Male ? "M" : "F";
            var first = person.FirstName;
            var last = person.LastName;
            var username = person.UserName;
            var email = Email.Create($"{username}@cruxa.seed").Value;
            var city = faker.PickRandom(cities);
            var height = faker.Random.Int(155, 195);

            var user = User.Create(email, username, first, last, gender, height, city).Value!;
            users.Add(user);
            creds.Add(new PasswordCredential(user.Id, HashPassword(username.ToLower())));
        }

        // 5 GymAdmin accounts (gyms 1-5)
        for (var i = 1; i <= 5; i++)
        {
            var username = $"gym{i}admin";
            var email = Email.Create($"{username}@cruxa.seed").Value;
            var user = User.Create(email, username, $"Staff{i}", $"Admin").Value!;
            user.ChangeRole(Role.GymAdmin);
            users.Add(user);
            creds.Add(new PasswordCredential(user.Id, HashPassword(faker.Internet.Password())));
            staffMap.Add((user.Id, i - 1, true, false));
        }

        // 5 Routesetter accounts (gyms 1-5)
        for (var i = 1; i <= 5; i++)
        {
            var username = $"gym{i}setter";
            var email = Email.Create($"{username}@cruxa.seed").Value;
            var user = User.Create(email, username, $"Staff{i}", $"Setter").Value!;
            user.ChangeRole(Role.Routesetter);
            users.Add(user);
            creds.Add(new PasswordCredential(user.Id, HashPassword(faker.Internet.Password())));
            staffMap.Add((user.Id, i - 1, false, true));
        }

        return (users, creds, staffMap);
    }

    internal static string HashPassword(string password)
    {
        var salt = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);
        var hash = System.Security.Cryptography.Rfc2898DeriveBytes.Pbkdf2(
            password, salt, 100_000, System.Security.Cryptography.HashAlgorithmName.SHA256, 32);
        var bytes = new byte[48];
        System.Buffer.BlockCopy(salt, 0, bytes, 0, 16);
        System.Buffer.BlockCopy(hash, 0, bytes, 16, 32);
        return Convert.ToBase64String(bytes);
    }
}
