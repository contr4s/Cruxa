FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/Cruxa.Api/Cruxa.Api.csproj", "Cruxa.Api/"]
COPY ["src/Cruxa.Application/Cruxa.Application.csproj", "Cruxa.Application/"]
COPY ["src/Cruxa.Infrastructure/Cruxa.Infrastructure.csproj", "Cruxa.Infrastructure/"]
COPY ["src/Cruxa.Domain/Cruxa.Domain.csproj", "Cruxa.Domain/"]
COPY ["src/Cruxa.Seeder/Cruxa.Seeder.csproj", "Cruxa.Seeder/"]
RUN dotnet restore "Cruxa.Api/Cruxa.Api.csproj"

COPY src/ .
WORKDIR "/src/Cruxa.Api"
RUN dotnet publish "Cruxa.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
COPY data/ /app/data/
ENTRYPOINT ["dotnet", "Cruxa.Api.dll"]
