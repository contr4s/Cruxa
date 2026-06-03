using Microsoft.EntityFrameworkCore;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Cruxa.Application.Features.Routes.Reviews.Interfaces;

namespace Cruxa.Infrastructure.Features.Routes.Repositories;

internal class RouteReviewRepository : IRouteReviewRepository
{
    private readonly CruxaDbContext _db;

    public RouteReviewRepository(CruxaDbContext db) => _db = db;

    public async Task<RouteReview?> GetByIdAsync(Guid id)
        => await _db.RouteReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<RouteReview?> GetByRouteAndUserAsync(Guid routeId, Guid userId)
        => await _db.RouteReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.RouteId == routeId && r.UserId == userId);

    public async Task<IEnumerable<RouteReview>> GetByRouteIdAsync(Guid routeId)
        => await _db.RouteReviews
            .Include(r => r.User)
            .Where(r => r.RouteId == routeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<RouteReview>> GetByUserIdAsync(Guid userId)
        => await _db.RouteReviews
            .Include(r => r.Route)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task AddAsync(RouteReview review)
    {
        await _db.RouteReviews.AddAsync(review);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(RouteReview review)
    {
        _db.RouteReviews.Update(review);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var review = await _db.RouteReviews.FindAsync(id);
        if (review is not null)
        {
            _db.RouteReviews.Remove(review);
            await _db.SaveChangesAsync();
        }
    }
}
