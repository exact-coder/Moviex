import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`);
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const saveWatchlist = (newWatchlist) => {
    if (user) {
      localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(newWatchlist));
      setWatchlist(newWatchlist);
    }
  };

  const addToWatchlist = (movie) => {
    if (!user) return;
    
    const newWatchlist = [...watchlist, movie];
    saveWatchlist(newWatchlist);
  };

  const removeFromWatchlist = (movieId) => {
    if (!user) return;
    
    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    saveWatchlist(newWatchlist);
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist
  };
};