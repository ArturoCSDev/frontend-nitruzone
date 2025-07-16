import { Share2, Download, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PlanActionButtons = () => {
  return (
    <div className="flex justify-end gap-2 pt-6 border-t">
      <Button variant="outline">
        <Share2 className="w-4 h-4 mr-2" />
        Compartir Plan
      </Button>
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Descargar PDF
      </Button>
      <Button>
        <Edit className="w-4 h-4 mr-2" />
        Editar Plan
      </Button>
    </div>
  );
};