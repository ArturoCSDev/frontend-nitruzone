import { ArrowLeft, Calendar, Target, Download, Share2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { GetPlanNutricionalResponse } from '../types/nutrition-plans-api.types';
import { getObjetivoInfo, formatDate } from '../utils/plan.utils';

interface PlanHeaderProps {
  plan: GetPlanNutricionalResponse;
  onGoBack: () => void;
}

export const PlanHeader = ({ plan, onGoBack }: PlanHeaderProps) => {
  const objetivoInfo = getObjetivoInfo(plan.objetivo);
  const ObjectiveIcon = objetivoInfo.icon;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onGoBack}
          className="mt-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${objetivoInfo.color}`}>
              <ObjectiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{plan.nombre}</h1>
              <p className="text-muted-foreground">{plan.descripcion}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {objetivoInfo.label}
            </Badge>
            <Badge variant={plan.estaActivo ? "default" : "secondary"}>
              {plan.estado}
            </Badge>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(plan.fechaInicio)}
            </span>
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="w-4 h-4 mr-2" />
            Editar Plan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};