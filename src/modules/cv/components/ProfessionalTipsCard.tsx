import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

export function ProfessionalTipsCard() {
  return (
    <Card className="shadow-md border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <h3 className="text-base font-semibold text-green-900 mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Pro Tips
        </h3>
        <div className="space-y-2">
          <div className="text-xs text-green-800 bg-green-100 p-2 rounded border border-green-200">
            <p className="font-medium mb-1">💡 Quick Tip</p>
            <p>Use action verbs and quantify your achievements for better ATS scoring.</p>
          </div>
          <div className="text-xs text-blue-800 bg-blue-100 p-2 rounded border border-blue-200">
            <p className="font-medium mb-1">🎯 Optimization</p>
            <p>Include relevant keywords from the job description you're targeting.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}