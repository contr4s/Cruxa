namespace Cruxa.Application.Services;

using AutoMapper;
using DTOs;
using Interfaces;
using Domain.Entities;

public class RouteService : IRouteService
{
    private readonly IRouteRepository _routeRepository;
    private readonly IGymRepository _gymRepository;
    private readonly IGradingSystemRepository _gradingSystemRepository;
    private readonly IGradeMappingService _gradeMappingService;
    private readonly IMapper _mapper;

    public RouteService(
        IRouteRepository routeRepository,
        IGymRepository gymRepository,
        IGradingSystemRepository gradingSystemRepository,
        IGradeMappingService gradeMappingService,
        IMapper mapper)
    {
        _routeRepository = routeRepository;
        _gymRepository = gymRepository;
        _gradingSystemRepository = gradingSystemRepository;
        _gradeMappingService = gradeMappingService;
        _mapper = mapper;
    }

    public async Task<RouteDto?> GetByIdAsync(Guid id)
    {
        var route = await _routeRepository.GetByIdAsync(id);
        return route == null ? null : _mapper.Map<RouteDto>(route);
    }

    public async Task<IEnumerable<RouteDto>> GetByGymAsync(Guid gymId)
    {
        var routes = await _routeRepository.GetByGymIdAsync(gymId);
        return _mapper.Map<IEnumerable<RouteDto>>(routes);
    }

    public async Task<IEnumerable<RouteDto>> GetAllAsync()
    {
        var routes = await _routeRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<RouteDto>>(routes);
    }

    public async Task<RouteDto> CreateAsync(CreateRouteRequest request, Guid? authorId = null)
    {
        var gradeIndex = await CalculateGradeIndexAsync(request.GradeRaw, request.GymId);

        var route = new Route
        {
            Id = Guid.NewGuid(),
            GymId = request.GymId,
            AuthorId = authorId,
            GradeRaw = request.GradeRaw,
            GradeIndex = gradeIndex,
            Type = request.Type,
            HoldColor = request.HoldColor,
            PhotoUrls = request.PhotoUrls ?? [],
            Tags = request.Tags ?? [],
            Sector = request.Sector,
            IsActive = true
        };

        await _routeRepository.AddAsync(route);
        return _mapper.Map<RouteDto>(route);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateRouteRequest request)
    {
        var route = await _routeRepository.GetByIdAsync(id);
        if (route == null) return false;

        if (request.Type.HasValue)
            route.Type = request.Type.Value;
        if (request.HoldColor.HasValue)
            route.HoldColor = request.HoldColor.Value;
        if (request.PhotoUrls != null)
            route.PhotoUrls = request.PhotoUrls;
        if (request.Tags != null)
            route.Tags = request.Tags;
        if (request.Sector != null)
            route.Sector = request.Sector;
        if (request.IsActive.HasValue)
            route.IsActive = request.IsActive.Value;

        await _routeRepository.UpdateAsync(route);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var route = await _routeRepository.GetByIdAsync(id);
        if (route == null) return false;

        await _routeRepository.DeleteAsync(id);
        return true;
    }

    public async Task<int> CalculateGradeIndexAsync(string gradeRaw, Guid gymId)
    {
        var gradingSystem = await _gradingSystemRepository.GetByGymIdAsync(gymId);
        if (gradingSystem == null)
            throw new InvalidOperationException($"Grading system not found for gym {gymId}");

        return _gradeMappingService.CalculateGradeIndex(gradeRaw, gradingSystem.GradeMapping);
    }
}
