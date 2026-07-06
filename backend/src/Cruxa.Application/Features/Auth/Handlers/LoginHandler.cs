using Mapster;
using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Queries;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Auth.Handlers;

public class LoginHandler(IUserRepository users, IJwtTokenGenerator jwt, IPasswordHasher passwordHasher)
    : IRequestHandler<LoginQuery, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(LoginQuery query, CancellationToken ct)
    {
        var user = await users.GetByEmailAsync(query.Email);
        if (user == null || !passwordHasher.Verify(query.Password, user.PasswordHash))
            return Error.Unauthorized("Invalid email or password");

        var token = await jwt.GenerateTokenAsync(user);
        var userDto = user.Adapt<UserDto>();

        return new AuthResponse { Token = token, User = userDto };
    }

}
