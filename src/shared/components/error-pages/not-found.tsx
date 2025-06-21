import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Home, Frown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Frown className="mx-auto h-16 w-16 text-gray-400" />
          <CardTitle className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Oops! The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            It seems like you've taken a wrong turn. Let's get you back on track.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
