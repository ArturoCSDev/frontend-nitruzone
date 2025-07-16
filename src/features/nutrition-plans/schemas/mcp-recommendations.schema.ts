// src/features/nutrition-plans/schemas/mcp-recommendations.schema.ts
import { z } from 'zod';

export const createRecommendationMCPSchema = z.object({
  clienteId: z.string().min(1, 'El ID del cliente es requerido'),
  planId: z.string().optional(),
  contexto: z.string().optional(),
  objetivoEspecifico: z.string().min(5, 'El objetivo debe tener al menos 5 caracteres').optional(),
  prioridadMinima: z.enum(['ALTA', 'MEDIA', 'BAJA']).optional(),
  soloFavoritos: z.boolean().optional(),
  momentoDelDia: z.string().optional(),
});

export const momentosDelDiaOptions = [
  { value: 'MANANA', label: 'Mañana' },
  { value: 'PRE_ENTRENAMIENTO', label: 'Pre-Entrenamiento' },
  { value: 'POST_ENTRENAMIENTO', label: 'Post-Entrenamiento' },
  { value: 'TARDE', label: 'Tarde' },
  { value: 'NOCHE', label: 'Noche' },
  { value: 'ANTES_DORMIR', label: 'Antes de Dormir' },
];

export const contextosOptions = [
  { value: 'pre_entreno', label: 'Pre-Entrenamiento' },
  { value: 'post_entreno', label: 'Post-Entrenamiento' },
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena', label: 'Cena' },
  { value: 'snack', label: 'Snack/Colación' },
  { value: 'recuperacion', label: 'Recuperación' },
  { value: 'energia', label: 'Energía' },
];

export const prioridadOptions = [
  { value: 'ALTA', label: 'Alta Prioridad' },
  { value: 'MEDIA', label: 'Media Prioridad' },
  { value: 'BAJA', label: 'Baja Prioridad' },
];

export type CreateRecommendationMCPInput = z.infer<typeof createRecommendationMCPSchema>;