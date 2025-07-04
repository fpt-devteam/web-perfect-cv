import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CVSectionNavbar } from '@/modules/cv/components/CVSectionNavbar';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId')({
  component: CVLayout,
});

export function CVLayout() {
  const { cvId } = Route.useParams();
  return (
    <div className="flex flex-col min-h-screen">
      <CVSectionNavbar cvId={cvId} />
      <div className="w-full px-4 py-6 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
