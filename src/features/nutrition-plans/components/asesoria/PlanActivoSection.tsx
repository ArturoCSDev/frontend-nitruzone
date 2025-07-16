// src/features/nutrition-plans/components/asesoria/PlanActivoSection.tsx
import React from 'react';
import { Target, Calendar, TrendingUp, Utensils, Eye } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Types
import { PlanActivoCompleto } from '../../types/asesoria-completa-api.types';
import { getObjetivoInfo } from '../../utils/plan.utils';

interface PlanActivoSectionProps {
  plan: PlanActivoCompleto | null;
  onViewPlan?: (planId: string) => void;
}

export const PlanActivoSection: React.FC<PlanActivoSectionProps> = ({ 
  plan, 
  onViewPlan 
}) => {
  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            Plan Nutricional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Sin Plan Activo</h3>
            <p className="text-muted-foreground">
              Este cliente no tiene un plan nutricional activo en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const objetivoInfo = getObjetivoInfo(plan.objetivo);
  const ObjectiveIcon = objetivoInfo.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${objetivoInfo.color}`}>
              <ObjectiveIcon className="w-5 h-5" />
            </div>
            Plan Nutricional Activo
          </CardTitle>
          {onViewPlan && (
            <Button variant="outline" size="sm" onClick={() => onViewPlan(plan.id)}>
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{plan.nombre}</h3>
              <p className="text-muted-foreground">{plan.descripcion}</p>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progreso del Plan</span>
                <span className="text-sm font-medium">{plan.progreso}%</span>
              </div>
              <Progress value={plan.progreso} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {plan.diasRestantes ? `${plan.diasRestantes} días restantes` : 'Plan completado'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Objetivos Nutricionales
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{plan.caloriasObjetivo || 0}</p>
                  <p className="text-xs text-muted-foreground">Calorías</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{plan.proteinaObjetivo || 0}g</p>
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{plan.carbohidratosObjetivo || 0}g</p>
                  <p className="text-xs text-muted-foreground">Carbohidratos</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{plan.grasasObjetivo || 0}g</p>
                  <p className="text-xs text-muted-foreground">Grasas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Iniciales */}
        {(plan.pesoInicial || plan.grasaInicial || plan.muscularInicial) && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Métricas Iniciales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plan.pesoInicial && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">{plan.pesoInicial}kg</p>
                  <p className="text-sm text-blue-700">Peso Inicial</p>
                </div>
              )}
              {plan.grasaInicial && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-xl font-bold text-orange-600">{plan.grasaInicial}%</p>
                  <p className="text-sm text-orange-700">Grasa Inicial</p>
                </div>
              )}
              {plan.muscularInicial && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{plan.muscularInicial}kg</p>
                  <p className="text-sm text-green-700">Músculo Inicial</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información de Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duración:</span>
              <span className="text-sm font-medium">{plan.duracion || 0} días</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Fecha fin:</span>
              <span className="text-sm font-medium">
                {plan.fechaFin ? formatDate(plan.fechaFin) : 'Sin fecha límite'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Modificable:</span>
              <Badge variant={plan.puedeSerModificado ? "default" : "secondary"}>
                {plan.puedeSerModificado ? 'Sí' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Creado:</span>
              <span className="text-sm font-medium">
                {formatDate(plan.fechaCreacion)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};