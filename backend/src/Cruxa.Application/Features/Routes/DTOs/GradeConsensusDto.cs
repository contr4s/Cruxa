namespace Cruxa.Application.Features.Routes.DTOs;

public class GradeConsensusDto
{
    public Guid RouteId { get; set; }
    public List<GradeVoteCountDto> GradeDistribution { get; set; } = [];
    public string? ConsensusGrade { get; set; }
    public int TotalVotes { get; set; }
    public string? UserVote { get; set; }
}
