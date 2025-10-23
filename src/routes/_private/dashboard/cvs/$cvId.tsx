import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CVSectionNavbar } from '@/modules/cv/components/CVSectionNavbar';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId')({
  component: CVLayout,
});

export function CVLayout() {
  const { cvId } = Route.useParams();
  return (
    <div className="flex flex-col min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -mt-3">
      <CVSectionNavbar cvId={cvId} />
      <div className="px-4 sm:px-6 lg:px-8 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
