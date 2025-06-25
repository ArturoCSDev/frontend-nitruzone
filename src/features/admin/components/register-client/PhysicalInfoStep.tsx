import { UseFormReturn } from 'react-hook-form';
import { Scale, Ruler, Calendar, Phone, User2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegisterClientFormData } from '../../schemas/register-client.schema';

interface PhysicalInfoStepProps {
  form: UseFormReturn<RegisterClientFormData>;
}

export const PhysicalInfoStep = ({ form }: PhysicalInfoStepProps) => {
  const { register, formState: { errors }, setValue } = form;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Información Física</h3>
        <p className="text-sm text-muted-foreground">
          Datos opcionales para personalizar la experiencia nutricional
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Edad */}
        <div className="space-y-2">
          <Label htmlFor="edad">Edad (años)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="edad"
              type="number"
              placeholder="25"
              className="pl-10"
              min={16}
              max={100}
              {...register('edad', { valueAsNumber: true })}
            />
          </div>
          {errors.edad && (
            <p className="text-sm text-destructive">{errors.edad.message}</p>
          )}
        </div>

        {/* Género */}
        <div className="space-y-2">
          <Label>Género</Label>
          <Select onValueChange={(value: string) => setValue('genero', value as 'Masculino' | 'Femenino' | 'Otro')}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Seleccionar género" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          {errors.genero && (
            <p className="text-sm text-destructive">{errors.genero.message}</p>
          )}
        </div>

        {/* Peso */}
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <div className="relative">
            <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="peso"
              type="number"
              placeholder="70.5"
              className="pl-10"
              step="0.1"
              min={30}
              max={300}
              {...register('peso', { valueAsNumber: true })}
            />
          </div>
          {errors.peso && (
            <p className="text-sm text-destructive">{errors.peso.message}</p>
          )}
        </div>

        {/* Altura */}
        <div className="space-y-2">
          <Label htmlFor="altura">Altura (cm)</Label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="altura"
              type="number"
              placeholder="175"
              className="pl-10"
              min={100}
              max={250}
              {...register('altura', { valueAsNumber: true })}
            />
          </div>
          {errors.altura && (
            <p className="text-sm text-destructive">{errors.altura.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="telefono"
              type="text"
              placeholder="987654321"
              className="pl-10"
              maxLength={9}
              {...register('telefono')}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Formato: 9XXXXXXXX (celular peruano)
          </p>
          {errors.telefono && (
            <p className="text-sm text-destructive">{errors.telefono.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};