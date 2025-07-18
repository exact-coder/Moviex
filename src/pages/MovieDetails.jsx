import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { tmdbApi } from '@/services/tmdbApi';
import { ArrowLeft, Calendar, Clock, Heart, Play, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError('');

      try {
        const movieData = await tmdbApi.getMovieDetails(parseInt(id));
        setMovie(movieData);
      } catch (err) {
        setError('Failed to load movie details. Please try again.');
        console.error('Movie details error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Loading Skeleton */}
        <div className="relative h-96 loading-shimmer" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="aspect-[2/3] loading-shimmer" />
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 loading-shimmer" />
              <div className="h-4 loading-shimmer w-3/4" />
              <div className="h-4 loading-shimmer w-1/2" />
              <div className="space-y-2">
                <div className="h-4 loading-shimmer" />
                <div className="h-4 loading-shimmer" />
                <div className="h-4 loading-shimmer w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error || 'Movie not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isInList = isInWatchlist(movie.id);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-96 md:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${tmdbApi.getBackdropUrl(movie.backdrop_path)})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4 z-10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Trailer
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="flex justify-center md:justify-start">
            <div className="movie-card p-0 overflow-hidden w-full max-w-sm">
              <img
                src={tmdbApi.getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
          </div>

          {/* Movie Information */}
          <div className="md:col-span-2 space-y-6 fade-in">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{releaseYear}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{runtime}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{rating}/10</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Watchlist Button */}
              {user && (
                <Button
                  onClick={() => toggleWatchlist(movie)}
                  className={`mb-6 ${
                    isInList 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'btn-movie'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInList ? 'fill-current' : ''}`} />
                  {isInList ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
              )}
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Production</h2>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.slice(0, 4).map((company) => (
                    <div key={company.id} className="flex items-center gap-2">
                      {company.logo_path && (
                        <img
                          src={tmdbApi.getImageUrl(company.logo_path, 'w200')}
                          alt={company.name}
                          className="h-8 object-contain filter invert opacity-70"
                        />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;