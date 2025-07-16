import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import { PlanHeader } from '../components/PlanHeader';
import { PlanStatsCards } from '../components/PlanStatsCards';
import { PlanTabs } from '../components/PlanTabs';
import { PlanLoading } from '../components/PlanLoading';
import { PlanError } from '../components/PlanError';

// Hooks
import { useGetPlan } from '../hooks/useGetPlan';

const PlanNutricionalDetails = () => {
  const { clienteId, planId } = useParams<{ clienteId: string; planId: string }>();
  const navigate = useNavigate();

  // Hook para obtener el plan completo
  const { data: plan, isLoading, error, refetch } = useGetPlan(planId || '', {
    includeRecomendaciones: true,
    includeProductos: true,
    includeCliente: true,
  });

  const handleGoBack = () => {
    navigate(`/panel/clients/${clienteId}/seguimiento`);
  };

  // Debug effect
  useEffect(() => {
    console.log('🔍 PlanNutricionalDetails - Estado:', {
      planId,
      clienteId,
      isLoading,
      hasPlan: !!plan,
      hasError: !!error,
      clienteData: plan?.cliente ? {
        id: plan.cliente.id,
        nombre: plan.cliente.nombreCompleto,
        peso: plan.cliente.peso,
        altura: plan.cliente.altura
      } : null,
      recomendaciones: plan?.recomendaciones?.length || 0
    });
  }, [planId, clienteId, plan, isLoading, error]);

  // Estados de carga y error
  if (isLoading) {
    return <PlanLoading />;
  }

  if (error || !plan) {
    return (
      <PlanError
        error={error}
        planId={planId}
        clienteId={clienteId}
        onGoBack={handleGoBack}
        onRetry={() => refetch()}
      />
    );
  }

  // Render principal
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PlanHeader plan={plan} onGoBack={handleGoBack} />
      <PlanStatsCards plan={plan} />
      <PlanTabs plan={plan} />
      {/* <PlanActionButtons /> */}
    </div>
  );
};

export default PlanNutricionalDetails;