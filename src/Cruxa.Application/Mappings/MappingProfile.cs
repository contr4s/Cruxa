using AutoMapper;
using Cruxa.Application.DTOs;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<Gym, GymDto>();

        CreateMap<Route, RouteDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.HoldColor, opt => opt.MapFrom(src => src.HoldColor.ToString()));

        CreateMap<Post, PostDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.GymName, opt => opt.MapFrom(src => src.Gym.Name))
            .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => src.Likes.Count))
            .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Count))
            .ForMember(dest => dest.Ascents, opt => opt.MapFrom(src => src.Ascents));

        CreateMap<Ascent, AscentDto>()
            .ForMember(dest => dest.GradeRaw, opt => opt.MapFrom(src => src.Route.GradeRaw))
            .ForMember(dest => dest.Style, opt => opt.MapFrom(src => src.Style.ToString()));

        CreateMap<GradingSystem, GradingSystemDto>();
    }
}
