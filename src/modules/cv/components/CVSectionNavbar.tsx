import { Link, useRouterState } from '@tanstack/react-router';
import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function CVSectionNavbar({ cvId }: { readonly cvId: string }) {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  const [visibleItems, setVisibleItems] = useState<number>(9);
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () => [
      { name: 'CONTACT', path: `/dashboard/cvs/${cvId}/contact` },
      { name: 'EXPERIENCE', path: `/dashboard/cvs/${cvId}/experience` },
      { name: 'PROJECT', path: `/dashboard/cvs/${cvId}/project` },
      { name: 'EDUCATION', path: `/dashboard/cvs/${cvId}/education` },
      { name: 'CERTIFICATIONS', path: `/dashboard/cvs/${cvId}/certifications` },
      { name: 'SKILLS', path: `/dashboard/cvs/${cvId}/skills` },
      { name: 'SUMMARY', path: `/dashboard/cvs/${cvId}/summary` },
      { name: 'FINISH UP & PREVIEW', path: `/dashboard/cvs/${cvId}/preview` },
      // { name: 'AI COVER LETTER', path: `/dashboard/cvs/${cvId}/ai-cover-letter` },
    ],
    [cvId]
  );

  useEffect(() => {
    const updateVisibleItems = () => {
      if (navRef.current && itemsRef.current) {
        const containerWidth = navRef.current.offsetWidth;
        const dropdownWidth = 50; // Actual dropdown button width
        const availableWidth = containerWidth - dropdownWidth - 12; // 24px for padding

        // Create a temporary element to measure actual text widths
        const tempElement = document.createElement('div');
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        tempElement.style.fontSize = '14px';
        tempElement.style.fontWeight = '500';
        tempElement.style.padding = '16px'; // px-4 py-4
        document.body.appendChild(tempElement);

        let totalWidth = 0;
        let maxVisibleItems = 0;

        for (let i = 0; i < sections.length; i++) {
          tempElement.textContent = sections[i].name;
          const itemWidth = tempElement.offsetWidth;

          if (totalWidth + itemWidth <= availableWidth) {
            totalWidth += itemWidth;
            maxVisibleItems = i + 1;
          } else {
            break;
          }
        }

        document.body.removeChild(tempElement);

        // Only show dropdown if there are actually hidden items
        // and we have at least 3 visible items
        const newVisibleItems = Math.max(maxVisibleItems, 3);
        setVisibleItems(Math.min(newVisibleItems, sections.length));
      }
    };

    // Initial calculation
    updateVisibleItems();

    // Add resize listener
    window.addEventListener('resize', updateVisibleItems);

    // Cleanup
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, [sections]);

  const visibleSections = sections.slice(0, visibleItems);
  const hiddenSections = sections.slice(visibleItems);

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50/30 pt-4 pb-2 sticky top-0 z-10">
      <div ref={navRef} className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
          {/* Visible navigation items */}
          <div ref={itemsRef} className="flex items-center justify-around">
            {visibleSections.map((section, index) => {
              const isFirst = index === 0;
              const isLast = index === visibleSections.length - 1 && hiddenSections.length === 0;
              const isActive = currentPath === section.path;

              const cornerClasses = [
                isFirst && isActive && 'rounded-tl-xl pl-6',
                isLast && isActive && 'rounded-tr-xl pr-6',
                isFirst && !isActive && 'pl-6',
                isLast && !isActive && 'pr-6',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <Link
                  key={section.path}
                  to={section.path}
                  className={cn(
                    'flex-1 text-center px-4 py-4 text-sm font-medium transition-all duration-300 border-b-3 relative whitespace-nowrap',
                    isActive
                      ? 'text-primary bg-primary/5 border-primary font-semibold'
                      : 'hover:bg-gray-50/80 text-gray-600 hover:text-gray-900 border-transparent',
                    cornerClasses
                  )}
                >
                  {section.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-t-sm"></div>
                  )}
                </Link>
              );
            })}

            {/* Dropdown for hidden items - only show if there are actually hidden items */}
            {hiddenSections.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-4 text-gray-500 hover:bg-gray-50/80 hover:text-gray-700 transition-colors duration-300 h-auto rounded-none border-b-3 border-transparent"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">More sections</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {hiddenSections.map(section => (
                    <DropdownMenuItem key={section.path} asChild>
                      <Link
                        to={section.path}
                        className={cn(
                          'w-full cursor-pointer',
                          currentPath === section.path
                            ? 'bg-primary/5 text-primary font-semibold'
                            : 'text-gray-700 hover:text-gray-900'
                        )}
                      >
                        {section.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      {/* Add subtle separator with breathing room */}
      <div className="h-6"></div>
    </div>
  );
}
