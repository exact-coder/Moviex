import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { tmdbApi } from '@/services/tmdbApi';
import { Film, Gamepad2, Heart, Play, Search, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const response = await tmdbApi.getPopularMovies();
        setFeaturedMovies(response.results.slice(0, 6));
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-start justify-center text-center px-4 pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Film className="w-16 h-16 text-primary mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MovieX
            </h1>
            <div className="relative ml-6">
              <Gamepad2 className="w-16 h-16 text-accent float animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-0 w-16 h-16 bg-accent/30 rounded-full blur-xl pulse-neon" style={{ animationDelay: '1s' }} />
            </div>
          </div>
          
          <p className="text-xl md:text-4xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlimited movies, TV shows, and more...
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" className="btn-movie">
                <Search className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
            </Link>
            
            {user ? (
              <Link to="/watchlist">
                <Button size="lg" variant="default" className="btn-simple border-primary/30">
                  <Heart className="w-5 h-5 mr-2" />
                  My Watchlist
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" variant="default" className="btn-simple border-primary/30">
                  <Star className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>


      {/* Featured Movies Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Movies Right Now
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover what's trending in the world of movie
            </p>
        
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-[2/3] loading-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {featuredMovies.map((movie) => (
                <Link 
                  key={movie.id} 
                  to={`/movie/${movie.id}`}
                  className="group block"
                >
                  <div className="movie-card overflow-hidden">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={tmdbApi.getPosterUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-bold text-left line-clamp-1">{movie.title}</p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-muted-foreground">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" className="btn-movie">
                <Play className="w-5 h-5 mr-2" />
                Explore All Movies
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="default" className="btn-simple border-primary/30">
                <Star className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
