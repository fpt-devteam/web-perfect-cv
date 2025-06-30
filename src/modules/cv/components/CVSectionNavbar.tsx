import { Link, useRouterState } from '@tanstack/react-router';

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function CVSectionNavbar({ cvId }: { readonly cvId: string }) {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  const sections = [
    { name: 'CONTACT', path: `/user-dashboard/cvs/${cvId}/contact` },
    { name: 'EXPERIENCE', path: `/user-dashboard/cvs/${cvId}/experience` },
    { name: 'PROJECT', path: `/user-dashboard/cvs/${cvId}/project` },
    { name: 'EDUCATION', path: `/user-dashboard/cvs/${cvId}/education` },
    { name: 'CERTIFICATIONS', path: `/user-dashboard/cvs/${cvId}/certifications` },
    { name: 'SKILLS', path: `/user-dashboard/cvs/${cvId}/skills` },
    { name: 'SUMMARY', path: `/user-dashboard/cvs/${cvId}/summary` },
    { name: 'FINISH UP & PREVIEW', path: `/user-dashboard/cvs/${cvId}/preview` },
    { name: 'AI COVER LETTER', path: `/user-dashboard/cvs/${cvId}/ai-cover-letter` },
  ];

  return (
    <div className="w-full overflow-x-auto bg-gray-100 border-b shadow-sm">
      <div className="flex whitespace-nowrap">
        {sections.map(section => (
          <Link
            key={section.path}
            to={section.path}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors',
              currentPath === section.path
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-200 text-gray-700'
            )}
          >
            {section.name}
          </Link>
        ))}
        <button className="px-4 py-3 text-gray-700 hover:bg-gray-200">
          <span className="sr-only">More</span>
          <span className="inline-flex items-center justify-center">...</span>
        </button>
      </div>
    </div>
  );
}
