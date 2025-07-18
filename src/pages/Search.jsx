import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, Loader2, TrendingUp, X, Star } from 'lucide-react';
import { tmdbApi } from '@/services/tmdbApi';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Load trending movies on component mount
  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoadingTrending(true);
        const response = await tmdbApi.getTrendingMovies();
        setTrendingMovies(response.results.slice(0, 12));
      } catch (err) {
        console.error('Error loading trending movies:', err);
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrendingMovies();
  }, []);

  // Real-time search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchMovies(query);
      }, 500);
    } else {
      setMovies([]);
      setHasSearched(false);
      setError('');
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const searchMovies = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await tmdbApi.searchMovies(searchQuery);
      setMovies(response.results);
      
      if (response.results.length === 0) {
        setError('No movies found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTrendingClick = (movieTitle) => {
    setQuery(movieTitle);
    setIsSearchExpanded(true);
    searchMovies(movieTitle);
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
  };

  const handleClearSearch = () => {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
    setError('');
    setIsSearchExpanded(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Search Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6 glow-text">
          Discover Movies
        </h1>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          Search through millions of movies and build your personal watchlist.
        </p>
        <Separator className='my-4 bg-primary'/>
      </div>

      {/* Enhanced Search Interface */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="relative">
          {!isSearchExpanded ? (
            // Collapsed search icon
            <div className="flex justify-center">
              <button
                onClick={handleSearchIconClick}
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full hover:scale-110 transition-all duration-1000 hover:shadow-2xl pulse-neon"
              >
                <SearchIcon className="w-7 h-7 text-primary-foreground group-hover:scale-150 transition-transform duration-300" />
              </button>
            </div>
          ) : (
            // Expanded search box
            <div className="relative flex items-center slide-in">
              <div className="absolute left-4 z-10">
                <SearchIcon className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <Input
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input pl-14 pr-14 h-11 text-xl"
                autoFocus
              />
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 z-10 p-2 hover:bg-primary/20 rounded-full transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </button>
              )}
              {isLoading && (
                <div className="absolute right-16 z-10">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trending Movies Section (shown when no search has been made) */}
      {!hasSearched && !isSearchExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {trendingMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="cursor-pointer transition-all duration-500 hover:scale-105 hover:z-10 relative group"
              onClick={() => handleTrendingClick(movie.title)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[2/3] overflow-hidden rounded-xl relative">
                <img
                  src={tmdbApi.getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />

                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-20">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-bold text-center">{movie.title}</p>
                </div>
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto mb-8 border-red-500/50 bg-red-500/10 slide-in">
          <AlertDescription className="text-center">{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  Searching...
                </span>
              ) : (
                `Search Results for "${query}"`
              )}
            </h2>
            {movies.length > 0 && (
              <span className="text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                {movies.length} movies found
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-[2/3] loading-shimmer rounded-xl" />
                  <div className="h-4 loading-shimmer rounded" />
                  <div className="h-3 loading-shimmer w-3/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie, index) => (
                <div
                  key={movie.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="fade-in"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;