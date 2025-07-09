// src/features/seguimiento-fisico/schemas/control-fisico.schema.ts
import { z } from 'zod';

export const createControlFisicoSchema = z.object({
  clienteId: z.string().min(1, 'El ID del cliente es requerido'),
  planId: z.string().optional(),
  fechaControl: z.string().min(1, 'La fecha del control es requerida'),
  peso: z.number().min(30, 'El peso mínimo es 30kg').max(300, 'El peso máximo es 300kg').optional(),
  grasaCorporal: z.number().min(3, 'El porcentaje mínimo es 3%').max(50, 'El porcentaje máximo es 50%').optional(),
  masaMuscular: z.number().min(20, 'La masa muscular mínima es 20kg').max(100, 'La masa muscular máxima es 100kg').optional(),
  medidasAdicionales: z.record(z.unknown()).optional(),
  nivelEnergia: z.number().min(1, 'El nivel mínimo es 1').max(5, 'El nivel máximo es 5').optional(),
  estadoAnimo: z.number().min(1, 'El nivel mínimo es 1').max(5, 'El nivel máximo es 5').optional(),
  notas: z.string().optional(),
  realizadoPor: z.string().optional(),
  proximaCita: z.string().optional(),
}).refine(
  (data) => {
    // Al menos debe tener una métrica física, evaluación subjetiva, o notas
    return !!(
      data.peso || 
      data.grasaCorporal || 
      data.masaMuscular || 
      data.nivelEnergia || 
      data.estadoAnimo || 
      data.notas || 
      (data.medidasAdicionales && Object.keys(data.medidasAdicionales).length > 0)
    );
  },
  {
    message: 'Debe proporcionar al menos una métrica física, evaluación subjetiva o notas',
    path: ['root'],
  }
);

export const updateControlFisicoSchema = z.object({
  planId: z.string().optional(),
  fechaControl: z.string().optional(),
  peso: z.number().min(30, 'El peso mínimo es 30kg').max(300, 'El peso máximo es 300kg').optional(),
  grasaCorporal: z.number().min(3, 'El porcentaje mínimo es 3%').max(50, 'El porcentaje máximo es 50%').optional(),
  masaMuscular: z.number().min(20, 'La masa muscular mínima es 20kg').max(100, 'La masa muscular máxima es 100kg').optional(),
  medidasAdicionales: z.record(z.unknown()).optional(),
  nivelEnergia: z.number().min(1, 'El nivel mínimo es 1').max(5, 'El nivel máximo es 5').optional(),
  estadoAnimo: z.number().min(1, 'El nivel mínimo es 1').max(5, 'El nivel máximo es 5').optional(),
  notas: z.string().optional(),
  realizadoPor: z.string().optional(),
  proximaCita: z.string().optional(),
});

export const listControlFisicoSchema = z.object({
  clienteId: z.string().optional(),
  planId: z.string().optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  onlyWithMetrics: z.boolean().optional(),
  onlyWithSubjectiveEvaluation: z.boolean().optional(),
  onlyRecent: z.boolean().optional(),
  realizadoPor: z.string().optional(),
});

export type CreateControlFisicoInput = z.infer<typeof createControlFisicoSchema>;
export type UpdateControlFisicoInput = z.infer<typeof updateControlFisicoSchema>;
export type ListControlFisicoInput = z.infer<typeof listControlFisicoSchema>;