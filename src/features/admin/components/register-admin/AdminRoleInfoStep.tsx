// src/features/admin/components/register-admin/AdminRoleInfoStep.tsx
import { UseFormReturn } from 'react-hook-form';
import { Building2, Shield, Star } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegisterAdminFormData } from '../../schemas/register-admin.schema';

interface AdminRoleInfoStepProps {
  form: UseFormReturn<RegisterAdminFormData>;
}

export const AdminRoleInfoStep = ({ form }: AdminRoleInfoStepProps) => {
  const { register, formState: { errors }, setValue } = form;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Información Administrativa</h3>
        <p className="text-sm text-muted-foreground">
          Configuración de rol y permisos del administrador
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departamento */}
        <div className="space-y-2">
          <Label>Departamento</Label>
          <Select onValueChange={(value: string) => setValue('departamento', value as 'Nutrición' | 'Administración' | 'Sistemas' | 'Recursos Humanos' | 'Finanzas')}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Seleccionar departamento" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nutrición">Nutrición</SelectItem>
              <SelectItem value="Administración">Administración</SelectItem>
              <SelectItem value="Sistemas">Sistemas</SelectItem>
              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
              <SelectItem value="Finanzas">Finanzas</SelectItem>
            </SelectContent>
          </Select>
          {errors.departamento && (
            <p className="text-sm text-destructive">{errors.departamento.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            El departamento ayuda a organizar los permisos y responsabilidades
          </p>
        </div>

        {/* Nivel de Acceso */}
        <div className="space-y-2">
          <Label htmlFor="nivelAcceso">Nivel de Acceso</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="nivelAcceso"
              type="number"
              placeholder="3"
              className="pl-10"
              min={1}
              max={5}
              {...register('nivelAcceso', { valueAsNumber: true })}
            />
          </div>
          {errors.nivelAcceso && (
            <p className="text-sm text-destructive">{errors.nivelAcceso.message}</p>
          )}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Niveles de acceso:</p>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>1-2: Acceso básico</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>3: Acceso estándar</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>4-5: Acceso avanzado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Configuración de Permisos
              </p>
              <p className="text-xs text-blue-700">
                Los valores son opcionales. Si no se especifican, se asignarán valores por defecto: 
                Departamento "Administración" y Nivel de Acceso 3.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};