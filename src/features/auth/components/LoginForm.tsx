// src/features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LogIn, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { loginSchema, LoginFormData } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      dni: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Accede a tu cuenta de NutriZone para continuar con tu experiencia personalizada
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* DNI Field */}
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-sm font-medium text-gray-700">
                Documento de Identidad
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  className="pl-10 h-11"
                  {...register('dni')}
                  disabled={isSubmitting}
                />
              </div>
              {errors.dni && (
                <p className="text-sm text-destructive">{errors.dni.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10 h-11"
                  {...register('password')}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Error Alert */}
            {loginMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getErrorMessage(loginMutation.error)}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando credenciales...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Acceder a mi cuenta
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Clientes
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Administradores
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};