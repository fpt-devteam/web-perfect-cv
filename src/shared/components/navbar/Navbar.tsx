import { Link, useMatches } from '@tanstack/react-router';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Logo } from '@/shared/components/logo/Logo';

export function Navbar() {
  const { getCurrentUser } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const matches = useMatches();

  const isAuthPage = matches.some(
    match =>
      match.routeId === '/_auth/login' ||
      match.routeId === '/_auth/register' ||
      match.routeId === '/_auth/forgot-password'
  );

  useEffect(() => {
    getCurrentUser().then(user => setIsAuthenticated(!!user));
  }, [getCurrentUser]);

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md py-6 px-8">
      <div className="grid grid-cols-3 items-center">
        <Link to="/" className="flex items-center gap-2 font-display">
          <Logo />
        </Link>

        <nav className="flex justify-center">
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-800 hover:text-gray-900 font-medium">
              Features
            </Link>
            <Link to="/" className="text-gray-800 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <Link to="/" className="text-gray-800 hover:text-gray-900 font-medium">
              Contact
            </Link>
          </div>
        </nav>

        <div className="flex justify-end">
          {isAuthenticated ? (
            <Link
              to="/user-dashboard/cvs"
              className="bg-primary text-white py-2 px-5 rounded-md transition-colors font-medium inline-block"
            >
              Dashboard
            </Link>
          ) : (
            !isAuthPage && (
              <div className="flex space-x-4">
                <Link
                  to="/register"
                  className="border border-primary text-primary py-2 px-5 rounded-md transition-colors font-medium inline-block hover:bg-gray-50"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="bg-primary text-white py-2 px-5 rounded-md transition-colors font-medium inline-block"
                >
                  Login
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
