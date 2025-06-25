// src/features/admin/components/register-admin/RegisterAdminForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Loader2, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { registerAdminSchema, RegisterAdminFormData } from '../../schemas/register-admin.schema';
import { useRegisterAdmin } from '@/features/auth/hooks/useRegisterAdmin';
import { AdminAccountInfoStep } from './AdminAccountInfoStep';
import { AdminRoleInfoStep } from './AdminRoleInfoStep';
import { AdminConfirmationStep } from './AdminConfirmationStep';

const STEPS = [
  { id: 1, title: 'Cuenta', description: 'Información básica' },
  { id: 2, title: 'Rol', description: 'Configuración administrativa' },
  { id: 3, title: 'Confirmación', description: 'Revisar y crear' },
];

export const RegisterAdminForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const registerMutation = useRegisterAdmin();

  const form = useForm<RegisterAdminFormData>({
    resolver: zodResolver(registerAdminSchema),
    defaultValues: {
      email: '',
      dni: '',
      password: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      departamento: undefined,
      nivelAcceso: undefined,
      notes: '',
    },
    mode: 'onBlur',
  });

  const { handleSubmit, trigger, formState: { isSubmitting } } = form;

  // Validar step actual antes de avanzar
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof RegisterAdminFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['email', 'dni', 'password', 'nombre', 'apellidoPaterno', 'apellidoMaterno'];
        break;
      case 2:
        fieldsToValidate = ['departamento', 'nivelAcceso'];
        break;
      case 3:
        fieldsToValidate = ['notes'];
        break;
    }

    return await trigger(fieldsToValidate);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: RegisterAdminFormData) => {
    // Filtrar campos undefined para el backend
    const cleanData = {
      email: data.email,
      dni: data.dni,
      password: data.password,
      nombre: data.nombre,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,
      ...(data.departamento && { departamento: data.departamento }),
      ...(data.nivelAcceso && { nivelAcceso: data.nivelAcceso }),
    };

    registerMutation.mutate(cleanData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AdminAccountInfoStep form={form} />;
      case 2:
        return <AdminRoleInfoStep form={form} />;
      case 3:
        return <AdminConfirmationStep form={form} />;
      default:
        return null;
    }
  };

  const currentStepInfo = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Registrar Administrador</h2>
            </div>
            <p className="text-muted-foreground">
              Paso {currentStep} de {STEPS.length}: {currentStepInfo.description}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {STEPS.map((step) => (
                <span
                  key={step.id}
                  className={currentStep >= step.id ? 'text-primary font-medium' : ''}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step Content */}
          <div className="min-h-96 mb-6">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || registerMutation.isPending}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting || registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando administrador...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Crear Administrador
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};