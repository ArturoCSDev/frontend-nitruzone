import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetPlanNutricionalResponse } from '../types/nutrition-plans-api.types';
import { OverviewTab } from './tabs/OverviewTab';
import { NutricionTab } from './tabs/NutricionTab';
import { ProgresoTab } from './tabs/ProgresoTab';

interface PlanTabsProps {
  plan: GetPlanNutricionalResponse;
}

export const PlanTabs = ({ plan }: PlanTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        {/* <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger> */}
        <TabsTrigger value="nutrition">Nutrición</TabsTrigger>
        <TabsTrigger value="progress">Progreso</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewTab plan={plan} />
      </TabsContent>

      {/* <TabsContent value="recommendations" className="space-y-6">
        <RecomendacionesTab plan={plan} />
      </TabsContent> */}

      <TabsContent value="nutrition" className="space-y-6">
        <NutricionTab plan={plan} />
      </TabsContent>

      <TabsContent value="progress" className="space-y-6">
        <ProgresoTab plan={plan} />
      </TabsContent>
    </Tabs>
  );
};