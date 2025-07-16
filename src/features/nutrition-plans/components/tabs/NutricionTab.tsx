import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetPlanNutricionalResponse } from '../../types/nutrition-plans-api.types';

interface NutricionTabProps {
  plan: GetPlanNutricionalResponse;
}

const MacronutrienteCircle = ({ 
  valor, 
  unidad, 
  nombre, 
  porcentaje, 
  colorClass 
}: {
  valor: number;
  unidad: string;
  nombre: string;
  porcentaje: string;
  colorClass: string;
}) => (
  <div className="text-center space-y-2">
    <div className={`w-20 h-20 mx-auto ${colorClass} rounded-full flex items-center justify-center`}>
      <span className={`text-2xl font-bold ${colorClass.includes('blue') ? 'text-blue-600' : 
                       colorClass.includes('green') ? 'text-green-600' : 'text-orange-600'}`}>
        {valor}{unidad}
      </span>
    </div>
    <div>
      <p className="font-medium">{nombre}</p>
      <p className="text-sm text-muted-foreground">{porcentaje}</p>
    </div>
  </div>
);

export const NutricionTab = ({ plan }: NutricionTabProps) => {
  const calcularPorcentaje = (valor: number, factor: number) => {
    if (!plan.caloriasObjetivo || !valor) return '0%';
    return `${Math.round((valor * factor / plan.caloriasObjetivo) * 100)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Macronutrientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MacronutrienteCircle
            valor={plan.proteinaObjetivo || 0}
            unidad="g"
            nombre="Proteínas"
            porcentaje={calcularPorcentaje(plan.proteinaObjetivo || 0, 4)}
            colorClass="bg-blue-100"
          />
          <MacronutrienteCircle
            valor={plan.carbohidratosObjetivo || 0}
            unidad="g"
            nombre="Carbohidratos"
            porcentaje={calcularPorcentaje(plan.carbohidratosObjetivo || 0, 4)}
            colorClass="bg-green-100"
          />
          <MacronutrienteCircle
            valor={plan.grasasObjetivo || 0}
            unidad="g"
            nombre="Grasas"
            porcentaje={calcularPorcentaje(plan.grasasObjetivo || 0, 9)}
            colorClass="bg-orange-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};