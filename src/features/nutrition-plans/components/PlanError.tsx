import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanErrorProps {
  error?: Error | null;
  planId?: string;
  clienteId?: string;
  onGoBack: () => void;
  onRetry: () => void;
}

export const PlanError = ({ error, planId, clienteId, onGoBack, onRetry }: PlanErrorProps) => {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-medium">Plan no encontrado</h3>
        <p className="text-muted-foreground mb-4">
          {error ? 
            `Error: ${error instanceof Error ? error.message : 'Error desconocido'}` :
            'El plan nutricional solicitado no existe o no tienes permisos para verlo.'
          }
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-red-800">
              Plan ID: {planId}<br/>
              Cliente ID: {clienteId}
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button variant="outline" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};