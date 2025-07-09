// src/features/admin/schemas/register-client.schema.ts
import { z } from 'zod';

// Enums que coinciden con el backend
const NivelActividadEnum = z.enum(['SEDENTARIO', 'LIGERO', 'MODERADO', 'ACTIVO', 'MUY_ACTIVO']);
const ObjetivoNutricionalEnum = z.enum([
  'PERDIDA_PESO', 
  'GANANCIA_MASA_MUSCULAR', 
  'MANTENIMIENTO', 
  'DEFINICION', 
  'FUERZA', 
  'RESISTENCIA'
]);
const DiaSemanaEnum = z.enum([
  'LUNES', 
  'MARTES', 
  'MIERCOLES', 
  'JUEVES', 
  'VIERNES', 
  'SABADO', 
  'DOMINGO'
]);

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
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
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

// Step 2: Información física
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

// Step 3: Preferencias y objetivos
export const preferencesSchema = z.object({
  // Nivel de actividad
  nivelActividad: NivelActividadEnum.optional(),
  
  // Preferencias dietéticas (array de strings)
  preferenciasDieteticas: z
    .array(z.string())
    .optional(),
  
  // Alergenos (array de strings)
  alergenos: z
    .array(z.string())
    .optional(),
  
  // Objetivos fitness (array de enums)
  objetivosFitness: z
    .array(ObjetivoNutricionalEnum)
    .optional(),
  
  // Días de entrenamiento (array de enums)
  diasEntrenamiento: z
    .array(DiaSemanaEnum)
    .optional(),
  
  // Horarios de entrenamiento (array de strings)
  horariosEntrenamiento: z
    .array(z.string())
    .optional(),
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

// Tipos de enums para TypeScript
export type NivelActividad = z.infer<typeof NivelActividadEnum>;
export type ObjetivoNutricional = z.infer<typeof ObjetivoNutricionalEnum>;
export type DiaSemana = z.infer<typeof DiaSemanaEnum>;