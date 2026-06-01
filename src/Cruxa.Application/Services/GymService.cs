namespace Cruxa.Application.Services;

using AutoMapper;
using DTOs;
using Interfaces;
using Domain.Entities;

public class GymService : IGymService
{
    private readonly IGymRepository _gymRepository;
    private readonly IMapper _mapper;

    public GymService(IGymRepository gymRepository, IMapper mapper)
    {
        _gymRepository = gymRepository;
        _mapper = mapper;
    }

    public async Task<GymDto?> GetByIdAsync(Guid id)
    {
        var gym = await _gymRepository.GetByIdAsync(id);
        return gym == null ? null : _mapper.Map<GymDto>(gym);
    }

    public async Task<IEnumerable<GymDto>> GetByCityAsync(string city)
    {
        var gyms = await _gymRepository.GetByCityAsync(city);
        return _mapper.Map<IEnumerable<GymDto>>(gyms);
    }

    public async Task<IEnumerable<GymDto>> GetAllAsync()
    {
        var gyms = await _gymRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<GymDto>>(gyms);
    }

    public async Task<GymDto> CreateAsync(CreateGymRequest request)
    {
        var gym = new Gym
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            City = request.City,
            Address = request.Address,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ContactInfo = request.ContactInfo,
            Website = request.Website,
            Prices = request.Prices,
            WorkingHours = request.WorkingHours,
            PhotoUrls = request.PhotoUrls ?? [],
            GradingSystemId = request.GradingSystemId
        };

        await _gymRepository.AddAsync(gym);
        return _mapper.Map<GymDto>(gym);
    }

    public async Task<GymDto?> UpdateAsync(Guid id, CreateGymRequest request)
    {
        var gym = await _gymRepository.GetByIdAsync(id);
        if (gym == null) return null;

        gym.Name = request.Name;
        gym.Description = request.Description;
        gym.City = request.City;
        gym.Address = request.Address;
        gym.Latitude = request.Latitude;
        gym.Longitude = request.Longitude;
        gym.ContactInfo = request.ContactInfo;
        gym.Website = request.Website;
        gym.Prices = request.Prices;
        gym.WorkingHours = request.WorkingHours;
        gym.PhotoUrls = request.PhotoUrls ?? [];
        gym.GradingSystemId = request.GradingSystemId;

        await _gymRepository.UpdateAsync(gym);
        return _mapper.Map<GymDto>(gym);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var gym = await _gymRepository.GetByIdAsync(id);
        if (gym == null) return false;

        await _gymRepository.DeleteAsync(id);
        return true;
    }
}
