import { Calendar, Clock, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GetPlanNutricionalResponse } from '../../types/nutrition-plans-api.types';
import { getPrioridadBadge, getRespuestaBadge } from '../../utils/plan.utils';

interface RecomendacionesTabProps {
  plan: GetPlanNutricionalResponse;
}

interface ResumenRecomendaciones {
  total: number;
  pendientes: number;
  aceptadas: number;
  rechazadas: number;
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

const RecomendacionesStats = ({ resumen }: { resumen: ResumenRecomendaciones }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold">{resumen.total}</div>
        <div className="text-sm text-muted-foreground">Total</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-yellow-600">{resumen.pendientes}</div>
        <div className="text-sm text-muted-foreground">Pendientes</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-green-600">{resumen.aceptadas}</div>
        <div className="text-sm text-muted-foreground">Aceptadas</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-red-600">{resumen.rechazadas}</div>
        <div className="text-sm text-muted-foreground">Rechazadas</div>
      </CardContent>
    </Card>
  </div>
);

const RecomendacionCard = ({ recomendacion }: { recomendacion: Recomendacion }) => {
  const prioridadBadge = getPrioridadBadge(recomendacion.prioridad);
  const respuestaBadge = getRespuestaBadge(recomendacion.respuestaUsuario);
  const RespuestaIcon = respuestaBadge.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">{recomendacion.iconoProducto}</div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{recomendacion.tituloRecomendacion}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={prioridadBadge.variant}>
                    Prioridad {prioridadBadge.label}
                  </Badge>
                  <Badge variant={respuestaBadge.variant} className="flex items-center gap-1">
                    <RespuestaIcon className="w-3 h-3" />
                    {respuestaBadge.label}
                  </Badge>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {recomendacion.timingRecomendado}
                </div>
                {recomendacion.horarioEspecifico && (
                  <div className="mt-1">{recomendacion.horarioEspecifico}</div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{recomendacion.razonamiento}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                <span className="font-medium">Dosis:</span> {recomendacion.dosis}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">Frecuencia:</span> {recomendacion.frecuencia}
              </div>
            </div>

            {recomendacion.timingAdicional && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Timing adicional:</strong> {recomendacion.timingAdicional}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RecomendacionesTab = ({ plan }: RecomendacionesTabProps) => {
  return (
    <div className="space-y-6">
      {plan.resumenRecomendaciones && (
        <RecomendacionesStats resumen={plan.resumenRecomendaciones} />
      )}

      <div className="space-y-4">
      {plan.recomendaciones?.map((recomendacion) => (
        <RecomendacionCard
            key={recomendacion.id}
            recomendacion={{
            ...recomendacion,
            horarioEspecifico: recomendacion.horarioEspecifico ?? "",
            timingAdicional: recomendacion.timingAdicional ?? "",
            }}
        />
        ))}
      </div>
    </div>
  );
};
