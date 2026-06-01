namespace Cruxa.Application.Services;

using AutoMapper;
using DTOs;
using Interfaces;
using Domain.Entities;

public class AscentService : IAscentService
{
    private readonly IAscentRepository _ascentRepository;
    private readonly IPostRepository _postRepository;
    private readonly IRouteRepository _routeRepository;
    private readonly IMapper _mapper;

    public AscentService(
        IAscentRepository ascentRepository,
        IPostRepository postRepository,
        IRouteRepository routeRepository,
        IMapper mapper)
    {
        _ascentRepository = ascentRepository;
        _postRepository = postRepository;
        _routeRepository = routeRepository;
        _mapper = mapper;
    }

    public async Task<AscentDto?> GetByIdAsync(Guid id)
    {
        var ascent = await _ascentRepository.GetByIdAsync(id);
        return ascent == null ? null : _mapper.Map<AscentDto>(ascent);
    }

    public async Task<IEnumerable<AscentDto>> GetByRouteAsync(Guid routeId)
    {
        var ascents = await _ascentRepository.GetByRouteIdAsync(routeId);
        return _mapper.Map<IEnumerable<AscentDto>>(ascents);
    }

    public async Task<IEnumerable<AscentDto>> GetByUserAsync(Guid userId)
    {
        var ascents = await _ascentRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<AscentDto>>(ascents);
    }

    public async Task<IEnumerable<AscentDto>> GetByPostAsync(Guid postId)
    {
        var ascents = await _ascentRepository.GetByPostIdAsync(postId);
        return _mapper.Map<IEnumerable<AscentDto>>(ascents);
    }

    public async Task<AscentDto> CreateAsync(CreateAscentRequest request, Guid userId)
    {
        var post = await _postRepository.GetByIdAsync(request.PostId)
            ?? throw new InvalidOperationException($"Post {request.PostId} not found");
        var route = await _routeRepository.GetByIdAsync(request.RouteId)
            ?? throw new InvalidOperationException($"Route {request.RouteId} not found");

        var ascent = new Ascent
        {
            Id = Guid.NewGuid(),
            PostId = request.PostId,
            UserId = userId,
            RouteId = request.RouteId,
            Style = request.Style,
            Rating = request.Rating,
            MediaUrls = request.MediaUrls ?? [],
            PrivateNotes = request.PrivateNotes,
            PublicReview = request.PublicReview,
            CreatedAt = DateTime.UtcNow
        };

        await _ascentRepository.AddAsync(ascent);
        return _mapper.Map<AscentDto>(ascent);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var ascent = await _ascentRepository.GetByIdAsync(id);
        if (ascent == null || ascent.UserId != userId)
            return false;

        await _ascentRepository.DeleteAsync(id);
        return true;
    }
}
