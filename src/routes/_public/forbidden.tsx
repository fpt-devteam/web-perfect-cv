import { createFileRoute } from '@tanstack/react-router';
import { Forbidden } from '@/shared/components/error-pages/Forbidden';

export const Route = createFileRoute('/_public/forbidden')({
  component: Forbidden,
});
