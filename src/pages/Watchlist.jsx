import { MovieCard } from '@/components/MovieCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Film, Heart, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';

const Watchlist = () => {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleRemoveMovie = (movieId) => {
    removeFromWatchlist(movieId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-primary fill-current" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Watchlist
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Your personal collection of movies to watch
        </p>
      </div>

      {/* Watchlist Content */}
      {watchlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start building your watchlist by searching for movies and adding your favorites!
            </p>
            <Button 
              onClick={() => window.location.href = '/search'}
              className="btn-movie"
            >
              Browse Movies
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Watchlist Stats */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} in your watchlist
              </h2>
            </div>
            
            {watchlist.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire watchlist?')) {
                    watchlist.forEach(movie => removeFromWatchlist(movie.id));
                  }
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 fade-in">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard 
                  movie={movie} 
                  showWatchlistButton={false}
                />
                
                {/* Remove Button Overlay */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveMovie(movie.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Guideline */}
          <Alert className="mt-12 max-w-2xl mx-auto">
            <Heart className="h-4 w-4" />
            <AlertDescription>
              <strong>Guideline:</strong> Click on any movie poster to view detailed information, 
              ratings, and synopsis. You can also remove movies from your watchlist by hovering 
              over them and clicking the remove button.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Watchlist;