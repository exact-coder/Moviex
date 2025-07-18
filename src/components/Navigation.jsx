import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, LogOut, Film } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <Film className="w-8 h-8" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MovieX
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className={`nav-link flex items-center space-x-2 ${
                isActive('/search') ? 'active' : ''
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>

            {user && (
              <Link
                to="/watchlist"
                className={`nav-link flex items-center space-x-2 ${
                  isActive('/watchlist') ? 'active' : ''
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Watchlist</span>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:block text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2  btn-movie"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:block">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 btn-movie">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden border-t border-border">
            <div className="flex justify-around py-3">
              <Link
                to="/search"
                className={`nav-link flex flex-col items-center space-y-1 text-xs ${
                  isActive('/search') ? 'active' : ''
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
              <Link
                to="/watchlist"
                className={`nav-link flex flex-col items-center space-y-1 text-xs ${
                  isActive('/watchlist') ? 'active' : ''
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Watchlist</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};