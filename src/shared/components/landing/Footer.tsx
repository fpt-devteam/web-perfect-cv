import { Link } from '@tanstack/react-router';

export function Footer() {
  return (
    <footer className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-700">© 2025 PerfectCV. All rights reserved.</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
