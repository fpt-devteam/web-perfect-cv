import { MoreVertical, Plus } from 'lucide-react';
import { parseISO, addHours, formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import type { CVResponse } from '@/modules/cv/types/cv.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { CreateCVForm } from '@/modules/cv/components/CreateCVForm';
import { useNavigate } from '@tanstack/react-router';

export function CVPreview({ cv }: { readonly cv: CVResponse }) {
  return (
    <div className="w-full max-w-[80%] bg-white border border-gray-100 shadow-sm p-4 text-xs">
      <div className="border-b pb-1 mb-1">{cv.title}</div>
      <div className="space-y-1">
        <div className="w-full h-2 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function CreateCVCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-700 font-medium">Create new CV</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl">Create a CV</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CreateCVForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CVCard({ cv }: { readonly cv: CVResponse }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate({ to: `/user-dashboard/cvs/${cv.cvId}/contact` })}
      className="cursor-pointer gap-0 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow p-0"
    >
      <CardContent className="p-0">
        <div className="h-[200px] bg-gray-50 flex items-center justify-center p-4">
          <CVPreview cv={cv} />
        </div>
      </CardContent>
      <CardFooter className="p-6 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className="font-medium text-gray-900 truncate block">{cv.title}</CardTitle>
          <CardDescription className="text-xs text-gray-500 truncate">
            Edited{' '}
            {formatDistanceToNow(addHours(parseISO(cv.lastEditedAt), 7), { addSuffix: true })}
          </CardDescription>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </CardFooter>
    </Card>
  );
}
