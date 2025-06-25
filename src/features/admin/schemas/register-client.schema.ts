// src/features/admin/schemas/register-client.schema.ts
import { z } from 'zod';

// Step 1: Información de la cuenta
export const accountInfoSchema = z.object({
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

// Step 2: Información física/lipídica
export const physicalInfoSchema = z.object({
  edad: z
    .number()
    .min(16, 'La edad mínima es 16 años')
    .max(100, 'La edad máxima es 100 años')
    .optional(),
  
  peso: z
    .number()
    .min(30, 'El peso mínimo es 30 kg')
    .max(300, 'El peso máximo es 300 kg')
    .optional(),
  
  altura: z
    .number()
    .min(100, 'La altura mínima es 100 cm')
    .max(250, 'La altura máxima es 250 cm')
    .optional(),
  
  genero: z
    .enum(['Masculino', 'Femenino', 'Otro'], {
      errorMap: () => ({ message: 'Selecciona un género válido' })
    })
    .optional(),
  
  telefono: z
    .string()
    .regex(/^9\d{8}$/, 'El teléfono debe tener formato peruano (9XXXXXXXX)')
    .optional()
    .or(z.literal('')),
});

// Step 3: Preferencias (por ahora vacío, para futuro)
export const preferencesSchema = z.object({
  // Por ahora no hay preferencias en el backend
  notes: z.string().optional(),
});

// Schema completo
export const registerClientSchema = z.object({
  ...accountInfoSchema.shape,
  ...physicalInfoSchema.shape,
  ...preferencesSchema.shape,
});

// Tipos derivados
export type AccountInfoFormData = z.infer<typeof accountInfoSchema>;
export type PhysicalInfoFormData = z.infer<typeof physicalInfoSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;
export type RegisterClientFormData = z.infer<typeof registerClientSchema>;