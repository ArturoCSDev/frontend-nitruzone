import {
    TrendingUp, Activity, Target, Star, Zap, Heart,
    Clock, CheckCircle, XCircle, Edit
  } from 'lucide-react';
  
  export const getObjetivoInfo = (objetivo: string) => {
    const objetivos = {
      'PERDIDA_PESO': { label: 'Pérdida de Peso', icon: TrendingUp, color: 'text-red-600 bg-red-50 border-red-200' },
      'GANANCIA_MUSCULAR': { label: 'Ganancia Muscular', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-200' },
      'MANTENIMIENTO': { label: 'Mantenimiento', icon: Target, color: 'text-green-600 bg-green-50 border-green-200' },
      'DEFINICION': { label: 'Definición', icon: Star, color: 'text-purple-600 bg-purple-50 border-purple-200' },
      'VOLUMEN': { label: 'Volumen', icon: Zap, color: 'text-orange-600 bg-orange-50 border-orange-200' },
      'RECUPERACION': { label: 'Recuperación', icon: Heart, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    };
    return objetivos[objetivo as keyof typeof objetivos] || objetivos['MANTENIMIENTO'];
  };
  
  export const getPrioridadBadge = (prioridad: string) => {
    const prioridades = {
      'ALTA': { variant: 'destructive' as const, label: 'Alta' },
      'MEDIA': { variant: 'default' as const, label: 'Media' },
      'BAJA': { variant: 'secondary' as const, label: 'Baja' },
    };
    return prioridades[prioridad as keyof typeof prioridades] || prioridades['MEDIA'];
  };
  
  export const getRespuestaBadge = (respuesta: string) => {
    const respuestas = {
      'PENDIENTE': { icon: Clock, variant: 'outline' as const, label: 'Pendiente', color: 'text-yellow-600' },
      'ACEPTADA': { icon: CheckCircle, variant: 'default' as const, label: 'Aceptada', color: 'text-green-600' },
      'RECHAZADA': { icon: XCircle, variant: 'destructive' as const, label: 'Rechazada', color: 'text-red-600' },
      'MODIFICADA': { icon: Edit, variant: 'secondary' as const, label: 'Modificada', color: 'text-blue-600' },
    };
    return respuestas[respuesta as keyof typeof respuestas] || respuestas['PENDIENTE'];
  };
  
  export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };