import { createFileRoute } from '@tanstack/react-router';
import { CVList } from '@/modules/cv/components/CVList';

export const Route = createFileRoute('/_private/dashboard/cvs/')({
  component: CVList,
});
