import { UseFormReturn } from 'react-hook-form';
import { Heart, Target, Calendar, Clock, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DiaSemana, NivelActividad, ObjetivoNutricional, RegisterClientFormData } from '../../schemas/register-client.schema';

interface PreferencesStepProps {
  form: UseFormReturn<RegisterClientFormData>;
}

const PREFERENCIAS_DIETETICAS = [
  'Vegetariano',
  'Vegano',
  'Sin Gluten',
  'Sin Lactosa',
  'Keto',
  'Paleo',
  'Mediterránea',
  'Baja en Sodio',
  'Baja en Azúcar',
  'Rica en Proteínas'
];

const ALERGENOS_COMUNES = [
  'Gluten',
  'Lactosa',
  'Frutos Secos',
  'Mariscos',
  'Huevos',
  'Soja',
  'Pescado',
  'Apio',
  'Mostaza',
  'Sésamo'
];

const OBJETIVOS_FITNESS = [
  { value: 'PERDIDA_PESO', label: 'Pérdida de Peso' },
  { value: 'GANANCIA_MASA_MUSCULAR', label: 'Ganancia de Masa Muscular' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'DEFINICION', label: 'Definición' },
  { value: 'FUERZA', label: 'Aumento de Fuerza' },
  { value: 'RESISTENCIA', label: 'Mejorar Resistencia' }
];

const DIAS_SEMANA = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SABADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' }
];

const HORARIOS_ENTRENAMIENTO = [
  'Mañana (6:00 - 9:00)',
  'Medio día (11:00 - 14:00)',
  'Tarde (15:00 - 18:00)',
  'Noche (19:00 - 22:00)'
];

export const PreferencesStep = ({ form }: PreferencesStepProps) => {
  const { setValue, watch, formState: { errors } } = form;
  const [customPreferencia, setCustomPreferencia] = useState('');
  const [customAlergeno, setCustomAlergeno] = useState('');
  const [customHorario, setCustomHorario] = useState('');

  // Valores actuales
  const preferenciasDieteticas = watch('preferenciasDieteticas') || [];
  const alergenos = watch('alergenos') || [];
  const objetivosFitness = watch('objetivosFitness') || [];
  const diasEntrenamiento = watch('diasEntrenamiento') || [];
  const horariosEntrenamiento = watch('horariosEntrenamiento') || [];
  // const nivelActividad = watch('nivelActividad');

  const handlePreferenciaToggle = (preferencia: string) => {
    const current = preferenciasDieteticas;
    const updated = current.includes(preferencia)
      ? current.filter(p => p !== preferencia)
      : [...current, preferencia];
    setValue('preferenciasDieteticas', updated);
  };

  const handleAlergenoToggle = (alergeno: string) => {
    const current = alergenos;
    const updated = current.includes(alergeno)
      ? current.filter(a => a !== alergeno)
      : [...current, alergeno];
    setValue('alergenos', updated);
  };

  const handleObjetivoToggle = (objetivo: ObjetivoNutricional) => {
    const current = objetivosFitness;
    const updated = current.includes(objetivo)
      ? current.filter(o => o !== objetivo)
      : [...current, objetivo];
    setValue('objetivosFitness', updated);
  };

  const handleDiaToggle = (dia: DiaSemana) => {
    const current = diasEntrenamiento;
    const updated = current.includes(dia)
      ? current.filter(d => d !== dia)
      : [...current, dia];
    setValue('diasEntrenamiento', updated);
  };

  const handleHorarioToggle = (horario: string) => {
    const current = horariosEntrenamiento;
    const updated = current.includes(horario)
      ? current.filter(h => h !== horario)
      : [...current, horario];
    setValue('horariosEntrenamiento', updated);
  };

  const addCustomPreferencia = () => {
    if (customPreferencia.trim() && !preferenciasDieteticas.includes(customPreferencia.trim())) {
      setValue('preferenciasDieteticas', [...preferenciasDieteticas, customPreferencia.trim()]);
      setCustomPreferencia('');
    }
  };

  const addCustomAlergeno = () => {
    if (customAlergeno.trim() && !alergenos.includes(customAlergeno.trim())) {
      setValue('alergenos', [...alergenos, customAlergeno.trim()]);
      setCustomAlergeno('');
    }
  };

  const addCustomHorario = () => {
    if (customHorario.trim() && !horariosEntrenamiento.includes(customHorario.trim())) {
      setValue('horariosEntrenamiento', [...horariosEntrenamiento, customHorario.trim()]);
      setCustomHorario('');
    }
  };

  const removePreferencia = (preferencia: string) => {
    setValue('preferenciasDieteticas', preferenciasDieteticas.filter(p => p !== preferencia));
  };

  const removeAlergeno = (alergeno: string) => {
    setValue('alergenos', alergenos.filter(a => a !== alergeno));
  };

  const removeHorario = (horario: string) => {
    setValue('horariosEntrenamiento', horariosEntrenamiento.filter(h => h !== horario));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Preferencias y Objetivos</h3>
        <p className="text-sm text-muted-foreground">
          Configuración opcional para personalizar la experiencia nutricional
        </p>
      </div>

      {/* Nivel de Actividad */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Target className="w-4 h-4" />
          Nivel de Actividad Física
        </Label>
        <Select onValueChange={(value) => setValue('nivelActividad', value as NivelActividad)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu nivel de actividad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SEDENTARIO">Sedentario - Poco o ningún ejercicio</SelectItem>
            <SelectItem value="LIGERO">Ligero - Ejercicio ligero 1-3 días/semana</SelectItem>
            <SelectItem value="MODERADO">Moderado - Ejercicio moderado 3-5 días/semana</SelectItem>
            <SelectItem value="ACTIVO">Activo - Ejercicio intenso 6-7 días/semana</SelectItem>
            <SelectItem value="MUY_ACTIVO">Muy Activo - Ejercicio muy intenso/trabajo físico</SelectItem>
          </SelectContent>
        </Select>
        {errors.nivelActividad && (
          <p className="text-sm text-destructive">{errors.nivelActividad.message}</p>
        )}
      </div>

      {/* Preferencias Dietéticas */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Preferencias Dietéticas
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PREFERENCIAS_DIETETICAS.map((preferencia) => (
            <div key={preferencia} className="flex items-center space-x-2">
              <Checkbox
                id={`pref-${preferencia}`}
                checked={preferenciasDieteticas.includes(preferencia)}
                onCheckedChange={() => handlePreferenciaToggle(preferencia)}
              />
              <Label 
                htmlFor={`pref-${preferencia}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {preferencia}
              </Label>
            </div>
          ))}
        </div>

        {/* Preferencias seleccionadas */}
        {preferenciasDieteticas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferenciasDieteticas.map((preferencia) => (
              <Badge key={preferencia} variant="secondary" className="flex items-center gap-1">
                {preferencia}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removePreferencia(preferencia)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Agregar preferencia personalizada */}
        <div className="flex gap-2">
          <Input
            placeholder="Agregar preferencia personalizada..."
            value={customPreferencia}
            onChange={(e) => setCustomPreferencia(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomPreferencia()}
          />
          <Button type="button" size="sm" onClick={addCustomPreferencia}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Alergenos */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Alergenos e Intolerancias</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ALERGENOS_COMUNES.map((alergeno) => (
            <div key={alergeno} className="flex items-center space-x-2">
              <Checkbox
                id={`alerg-${alergeno}`}
                checked={alergenos.includes(alergeno)}
                onCheckedChange={() => handleAlergenoToggle(alergeno)}
              />
              <Label 
                htmlFor={`alerg-${alergeno}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {alergeno}
              </Label>
            </div>
          ))}
        </div>

        {/* Alergenos seleccionados */}
        {alergenos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {alergenos.map((alergeno) => (
              <Badge key={alergeno} variant="destructive" className="flex items-center gap-1">
                {alergeno}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => removeAlergeno(alergeno)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Agregar alergeno personalizado */}
        <div className="flex gap-2">
          <Input
            placeholder="Agregar alérgeno personalizado..."
            value={customAlergeno}
            onChange={(e) => setCustomAlergeno(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomAlergeno()}
          />
          <Button type="button" size="sm" onClick={addCustomAlergeno}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Objetivos Fitness */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Target className="w-4 h-4" />
          Objetivos de Fitness
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {OBJETIVOS_FITNESS.map((objetivo) => (
            <div key={objetivo.value} className="flex items-center space-x-2">
              <Checkbox
                id={`obj-${objetivo.value}`}
                checked={objetivosFitness.includes(objetivo.value as ObjetivoNutricional)}
                onCheckedChange={() => handleObjetivoToggle(objetivo.value as ObjetivoNutricional)}
              />
              <Label 
                htmlFor={`obj-${objetivo.value}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {objetivo.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Objetivos seleccionados */}
        {objetivosFitness.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {objetivosFitness.map((objetivo) => {
              const objetivoLabel = OBJETIVOS_FITNESS.find(o => o.value === objetivo)?.label || objetivo;
              return (
                <Badge key={objetivo} variant="default" className="flex items-center gap-1">
                  {objetivoLabel}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-muted" 
                    onClick={() => handleObjetivoToggle(objetivo)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Días de Entrenamiento */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Días de Entrenamiento Preferidos
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia.value} className="flex items-center space-x-2">
              <Checkbox
                id={`dia-${dia.value}`}
                checked={diasEntrenamiento.includes(dia.value as DiaSemana)}
                onCheckedChange={() => handleDiaToggle(dia.value as DiaSemana)}
              />
              <Label 
                htmlFor={`dia-${dia.value}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {dia.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Días seleccionados */}
        {diasEntrenamiento.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {diasEntrenamiento.map((dia) => {
              const diaLabel = DIAS_SEMANA.find(d => d.value === dia)?.label || dia;
              return (
                <Badge key={dia} variant="outline" className="flex items-center gap-1">
                  {diaLabel}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleDiaToggle(dia)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Horarios de Entrenamiento */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Horarios de Entrenamiento Preferidos
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {HORARIOS_ENTRENAMIENTO.map((horario) => (
            <div key={horario} className="flex items-center space-x-2">
              <Checkbox
                id={`hor-${horario}`}
                checked={horariosEntrenamiento.includes(horario)}
                onCheckedChange={() => handleHorarioToggle(horario)}
              />
              <Label 
                htmlFor={`hor-${horario}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {horario}
              </Label>
            </div>
          ))}
        </div>

        {/* Horarios seleccionados */}
        {horariosEntrenamiento.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {horariosEntrenamiento.map((horario) => (
              <Badge key={horario} variant="outline" className="flex items-center gap-1">
                {horario}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeHorario(horario)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Agregar horario personalizado */}
        <div className="flex gap-2">
          <Input
            placeholder="Agregar horario personalizado (ej: Madrugada 5:00-7:00)..."
            value={customHorario}
            onChange={(e) => setCustomHorario(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomHorario()}
          />
          <Button type="button" size="sm" onClick={addCustomHorario}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Información de configuración */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">
              Configuración Personalizada
            </p>
            <p className="text-xs text-muted-foreground">
              Estas preferencias nos ayudarán a crear planes nutricionales más adecuados 
              para ti. Puedes modificarlas en cualquier momento desde tu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};