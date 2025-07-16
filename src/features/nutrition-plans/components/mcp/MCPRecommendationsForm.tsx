// src/features/nutrition-plans/components/mcp/MCPRecommendationsForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Target, Clock, Star } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schema y tipos
import { 
  createRecommendationMCPSchema, 
  CreateRecommendationMCPInput,
  momentosDelDiaOptions,
  contextosOptions,
  prioridadOptions
} from '../../schemas/mcp-recommendations.schema';

interface MCPRecommendationsFormProps {
  clienteId: string;
  planId?: string;
  onSubmit: (data: CreateRecommendationMCPInput) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const MCPRecommendationsForm: React.FC<MCPRecommendationsFormProps> = ({
  clienteId,
  planId,
  onSubmit,
  isLoading,
  disabled = false
}) => {
  const form = useForm<CreateRecommendationMCPInput>({
    resolver: zodResolver(createRecommendationMCPSchema),
    defaultValues: {
      clienteId,
      planId: planId || undefined,
      contexto: undefined,
      objetivoEspecifico: '',
      prioridadMinima: 'MEDIA',
      soloFavoritos: false,
      momentoDelDia: undefined,
    },
  });

  const handleSubmit = (data: CreateRecommendationMCPInput) => {
    // Limpiar campos vacíos
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        console.log(_, value);
        return value !== undefined && value !== '' && value !== null;
      })
    ) as CreateRecommendationMCPInput;
    
    onSubmit(cleanData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Generar Recomendaciones con IA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Utiliza inteligencia artificial para generar recomendaciones personalizadas
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contexto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Contexto
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar contexto..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contextosOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      ¿En qué momento o situación se usarán los productos?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="momentoDelDia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Momento del Día
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar momento..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {momentosDelDiaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Horario específico para las recomendaciones
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Objetivo específico */}
            <FormField
              control={form.control}
              name="objetivoEspecifico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objetivo Específico
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Necesito energía para entrenar piernas, quiero proteína para recuperación, busco algo para mejorar la concentración..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe específicamente qué quieres lograr con las recomendaciones
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Configuraciones avanzadas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Configuraciones Avanzadas</h3>
                <Badge variant="outline">Opcional</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prioridadMinima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Prioridad Mínima
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {prioridadOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Nivel mínimo de prioridad para las recomendaciones
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center">
                  <FormField
                    control={form.control}
                    name="soloFavoritos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Solo productos favoritos
                          </FormLabel>
                          <FormDescription>
                            Recomendar únicamente productos marcados como favoritos
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Información del plan */}
            {planId && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Plan Nutricional Vinculado</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Las recomendaciones se generarán considerando el plan nutricional activo del cliente.
                </p>
              </div>
            )}

            {/* Botón de envío */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isLoading || disabled}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando recomendaciones...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Recomendaciones
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};