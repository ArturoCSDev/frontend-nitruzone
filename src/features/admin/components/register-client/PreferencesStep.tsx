
import { UseFormReturn } from 'react-hook-form';
import { Heart, CheckCircle } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RegisterClientFormData } from '../../schemas/register-client.schema';

interface PreferencesStepProps {
  form: UseFormReturn<RegisterClientFormData>;
}

export const PreferencesStep = ({ form }: PreferencesStepProps) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Resumen y Confirmación</h3>
        <p className="text-sm text-muted-foreground">
          Revisa la información antes de crear la cuenta
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Información completada</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium">{form.watch('email') || 'No especificado'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">DNI:</span>
            <p className="font-medium">{form.watch('dni') || 'No especificado'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Nombre completo:</span>
            <p className="font-medium">
              {[form.watch('nombre'), form.watch('apellidoPaterno'), form.watch('apellidoMaterno')]
                .filter(Boolean)
                .join(' ') || 'No especificado'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Teléfono:</span>
            <p className="font-medium">{form.watch('telefono') || 'No especificado'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Comentarios o información adicional sobre el cliente..."
          className="min-h-20"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">
              ¡Perfecto! La cuenta será creada
            </p>
            <p className="text-xs text-muted-foreground">
              El cliente podrá acceder con su DNI y la contraseña establecida.
              La información física puede ser actualizada posteriormente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};