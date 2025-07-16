import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GetPlanNutricionalResponse } from '../../types/nutrition-plans-api.types';
import { getPrioridadBadge } from '../../utils/plan.utils';

interface ProgresoTabProps {
  plan: GetPlanNutricionalResponse;
}

interface Recomendacion {
  id: string;
  tituloRecomendacion: string;
  prioridad: string;
  respuestaUsuario: string;
  iconoProducto: string;
  timingRecomendado: string;
  horarioEspecifico: string;
  dosis: string;
  frecuencia: string;
  timingAdicional: string;
  razonamiento: string;
}

const MetricaInicial = ({ valor, unidad, label }: { valor: number; unidad: string; label: string }) => (
  <div className="text-center p-4 bg-muted/50 rounded-lg">
    <p className="text-lg font-bold">{valor}{unidad}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const ProximaRecomendacion = ({ rec }: { rec: Recomendacion }) => (
  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
    <div className="text-lg">{rec.iconoProducto}</div>
    <div className="flex-1">
      <p className="font-medium text-sm">{rec.tituloRecomendacion}</p>
      <p className="text-xs text-muted-foreground">{rec.timingRecomendado}</p>
    </div>
    <Badge variant="destructive">
      {getPrioridadBadge(rec.prioridad).label}
    </Badge>
  </div>
);

export const ProgresoTab = ({ plan }: ProgresoTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento del Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Progreso General</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.progreso}% completado
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{plan.progreso}%</p>
                <p className="text-sm text-muted-foreground">
                  {plan.diasRestantes ? `${plan.diasRestantes} días restantes` : 'Completado'}
                </p>
              </div>
            </div>
            <Progress value={plan.progreso} className="h-3" />
            
            {plan.pesoInicial && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <MetricaInicial valor={plan.pesoInicial} unidad="kg" label="Peso Inicial" />
                {plan.grasaInicial && (
                  <MetricaInicial valor={plan.grasaInicial} unidad="%" label="Grasa Inicial" />
                )}
                {plan.muscularInicial && (
                  <MetricaInicial valor={plan.muscularInicial} unidad="kg" label="Masa Muscular Inicial" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {plan.resumenRecomendaciones?.proximasRecomendaciones && 
       plan.resumenRecomendaciones.proximasRecomendaciones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Próximas Recomendaciones Prioritarias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
            {plan.resumenRecomendaciones.proximasRecomendaciones.map((rec) => (
                <ProximaRecomendacion
                    key={rec.id}
                    rec={{
                    ...rec,
                    horarioEspecifico: rec.horarioEspecifico ?? "",
                    timingAdicional: rec.timingAdicional ?? "",
                    }}
                />
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};