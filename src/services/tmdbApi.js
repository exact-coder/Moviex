// TMDB API integration
const API_KEY = '03fe0f081423cdda3af8f1dbb37db015';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchFromAPI(endpoint) {
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}`;
    console.log(url);

    try {
      const response = await fetch(url);
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  async searchMovies(query, page = 1) {
    return this.fetchFromAPI(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async getMovieDetails(movieId) {
    return this.fetchFromAPI(`/movie/${movieId}`);
  }

  async getPopularMovies(page = 1) {
    return this.fetchFromAPI(`/movie/popular?page=${page}`);
  }

  async getTrendingMovies() {
    return this.fetchFromAPI('/trending/movie/week');
  }

  getImageUrl(path, size = 'w500') {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getPosterUrl(path) {
    return this.getImageUrl(path, 'w500');
  }

  getBackdropUrl(path) {
    return this.getImageUrl(path, 'w1280');
  }
}

const tmdbApi = new TMDBApi(API_KEY);

export { tmdbApi };