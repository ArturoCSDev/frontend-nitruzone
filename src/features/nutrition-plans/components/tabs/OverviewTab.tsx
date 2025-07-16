import { Target, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GetPlanNutricionalResponse } from '../../types/nutrition-plans-api.types';
import { formatDate } from '../../utils/plan.utils';

interface OverviewTabProps {
  plan: GetPlanNutricionalResponse;
}

export const OverviewTab = ({ plan }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Objetivos Nutricionales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Objetivos Nutricionales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{plan.caloriasObjetivo || 0}</p>
              <p className="text-sm text-muted-foreground">Calorías</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{plan.proteinaObjetivo || 0}g</p>
              <p className="text-sm text-muted-foreground">Proteínas</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{plan.carbohidratosObjetivo || 0}g</p>
              <p className="text-sm text-muted-foreground">Carbohidratos</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{plan.grasasObjetivo || 0}g</p>
              <p className="text-sm text-muted-foreground">Grasas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Estado del Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado actual:</span>
              <Badge variant={plan.estaActivo ? "default" : "secondary"}>
                {plan.estado}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fecha inicio:</span>
              <span className="text-sm font-medium">{formatDate(plan.fechaInicio)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fecha fin:</span>
              <span className="text-sm font-medium">
                {plan.fechaFin ? formatDate(plan.fechaFin) : 'Sin fecha límite'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Puede modificarse:</span>
              <Badge variant={plan.puedeSerModificado ? "default" : "secondary"}>
                {plan.puedeSerModificado ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};