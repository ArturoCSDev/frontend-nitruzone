// src/features/admin/schemas/register-admin.schema.ts
import { z } from 'zod';

// Step 1: Información de la cuenta
export const adminAccountInfoSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  
  dni: z
    .string()
    .min(1, 'El DNI es requerido')
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  
  apellidoPaterno: z
    .string()
    .min(1, 'El apellido paterno es requerido')
    .min(2, 'El apellido paterno debe tener al menos 2 caracteres'),
  
  apellidoMaterno: z
    .string()
    .min(1, 'El apellido materno es requerido')
    .min(2, 'El apellido materno debe tener al menos 2 caracteres'),
});

// Step 2: Información administrativa
export const adminRoleInfoSchema = z.object({
  departamento: z
    .enum(['Nutrición', 'Administración', 'Sistemas', 'Recursos Humanos', 'Finanzas'], {
      errorMap: () => ({ message: 'Selecciona un departamento válido' })
    })
    .optional(),
  
  nivelAcceso: z
    .number()
    .min(1, 'El nivel de acceso mínimo es 1')
    .max(5, 'El nivel de acceso máximo es 5')
    .optional(),
});

// Step 3: Confirmación (por ahora vacío, para futuro)
export const adminConfirmationSchema = z.object({
  notes: z.string().optional(),
});

// Schema completo
export const registerAdminSchema = z.object({
  ...adminAccountInfoSchema.shape,
  ...adminRoleInfoSchema.shape,
  ...adminConfirmationSchema.shape,
});

// Tipos derivados
export type AdminAccountInfoFormData = z.infer<typeof adminAccountInfoSchema>;
export type AdminRoleInfoFormData = z.infer<typeof adminRoleInfoSchema>;
export type AdminConfirmationFormData = z.infer<typeof adminConfirmationSchema>;
export type RegisterAdminFormData = z.infer<typeof registerAdminSchema>;