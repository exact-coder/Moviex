import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import { tmdbApi } from '@/services/tmdbApi';
import { Calendar, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';



export const MovieCard= ({ 
  movie, 
  showWatchlistButton = true 
}) => {
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isInList = isInWatchlist(movie.id);

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Card className="movie-card group relative overflow-hidden pt-0">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative">
          {/* Movie Poster */}
          <div className="aspect-[5/6] overflow-hidden">
            <img
              src={tmdbApi.getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-full object-cover movie-poster group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-white">{rating}</span>
          </div>

          {/* Watchlist Button */}
          {showWatchlistButton && user && (
            <Button
              size="sm"
              variant={isInList ? "default" : "secondary"}
              className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 ${
                isInList 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white/90 hover:bg-white text-black'
              }`}
              onClick={handleWatchlistClick}
            >
              <Heart className={`w-4 h-4 ${isInList ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseYear}</span>
            </div>
          </div>

          {movie.overview && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {movie.overview}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};