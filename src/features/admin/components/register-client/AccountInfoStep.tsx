// src/features/admin/components/register-client/AccountInfoStep.tsx
import { UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegisterClientFormData } from '../../schemas/register-client.schema';

interface AccountInfoStepProps {
  form: UseFormReturn<RegisterClientFormData>;
}

export const AccountInfoStep = ({ form }: AccountInfoStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Información de la Cuenta</h3>
        <p className="text-sm text-muted-foreground">
          Datos básicos para crear la cuenta del cliente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="cliente@ejemplo.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* DNI */}
        <div className="space-y-2">
          <Label htmlFor="dni">DNI *</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="dni"
              type="text"
              placeholder="12345678"
              className="pl-10"
              maxLength={8}
              {...register('dni')}
            />
          </div>
          {errors.dni && (
            <p className="text-sm text-destructive">{errors.dni.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="nombre"
              type="text"
              placeholder="Juan"
              className="pl-10"
              {...register('nombre')}
            />
          </div>
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          )}
        </div>

        {/* Apellido Paterno */}
        <div className="space-y-2">
          <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
          <Input
            id="apellidoPaterno"
            type="text"
            placeholder="Pérez"
            {...register('apellidoPaterno')}
          />
          {errors.apellidoPaterno && (
            <p className="text-sm text-destructive">{errors.apellidoPaterno.message}</p>
          )}
        </div>

        {/* Apellido Materno */}
        <div className="space-y-2">
          <Label htmlFor="apellidoMaterno">Apellido Materno *</Label>
          <Input
            id="apellidoMaterno"
            type="text"
            placeholder="García"
            {...register('apellidoMaterno')}
          />
          {errors.apellidoMaterno && (
            <p className="text-sm text-destructive">{errors.apellidoMaterno.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
