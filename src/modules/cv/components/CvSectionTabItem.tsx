import { HiDotsHorizontal } from "react-icons/hi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { EyeIcon, TrashIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface CvSectionTabsItemProps {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly handleSelectTab: (id: string) => void;
  readonly handledDeleteTab: (id: string) => void;
  readonly handleUnShowTab: (id: string) => void;
  readonly isActive: boolean;
}

export function CvSectionTabsItem({ id, title, detail, handleSelectTab, handledDeleteTab, handleUnShowTab, isActive }: CvSectionTabsItemProps) {
  return (
    <Card
      key={id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-gray-200'}`}
      onClick={() => handleSelectTab(id)}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-1">
          {title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-900 flex items-center space-x-1"
            >
              <HiDotsHorizontal className="w-5 h-5" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="py-1">
            <DropdownMenuItem
              className="flex items-center space-x-2"
              onClick={e => { e.stopPropagation(); handleUnShowTab(id); }}
            >
              <EyeIcon className="w-5 h-5" />
              <span>Show on resume</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center space-x-2 text-red-500"
              onClick={e => { e.stopPropagation(); handledDeleteTab(id); }}
            >
              <TrashIcon className="w-5 h-5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {detail}
        </p>
      </CardContent>
    </Card>
  )
}
