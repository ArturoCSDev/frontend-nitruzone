// src/features/auth/schemas/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  dni: z
    .string()
    .min(1, 'El DNI es requerido')
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
    .transform((val) => val.trim()),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
