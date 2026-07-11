using Cruxa.Application.Features.Routes.Handlers;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Routes;

public class TagHandlerTests
{
    private readonly Mock<ITagRepository> _tagRepo = new();

    [Fact]
    public async Task GetAllTags_ReturnsDistinctSortedTags()
    {
        var tags = new List<Tag>
        {
            Tag.CreateUnsafe("bouldering"),
            Tag.CreateUnsafe("technical"),
            Tag.CreateUnsafe("slab")
        };
        _tagRepo.Setup(r => r.GetAllTagsAsync()).ReturnsAsync(tags);

        var handler = new GetAllTagsHandler(_tagRepo.Object);
        var result = await handler.Handle(new GetAllTagsQuery(), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(
            new List<TagDto>
            {
                new() { Name = "bouldering", Category = "default" },
                new() { Name = "technical", Category = "default" },
                new() { Name = "slab", Category = "default" },
            },
            opts => opts.WithStrictOrdering());
    }
}
