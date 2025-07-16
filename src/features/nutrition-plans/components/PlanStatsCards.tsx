import { User, TrendingUp, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { GetPlanNutricionalResponse } from '../types/nutrition-plans-api.types';
import { getInitials } from '../utils/plan.utils';

interface PlanStatsCardsProps {
  plan: GetPlanNutricionalResponse;
}

export const PlanStatsCards = ({ plan }: PlanStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cliente</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(plan.cliente?.nombreCompleto || 'Cliente')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{plan.cliente?.nombreCompleto}</p>
              <p className="text-xs text-muted-foreground">
                {plan.cliente?.edad ? `${plan.cliente.edad} años` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progreso */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progreso</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{plan.progreso}%</div>
            <Progress value={plan.progreso} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {plan.diasRestantes ? `${plan.diasRestantes} días restantes` : 'Completado'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Duración */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Duración</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{plan.duracion || 0}</div>
          <p className="text-xs text-muted-foreground">días totales</p>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recomendaciones</CardTitle>
          <ChefHat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{plan.resumenRecomendaciones?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            {plan.resumenRecomendaciones?.pendientes || 0} pendientes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};