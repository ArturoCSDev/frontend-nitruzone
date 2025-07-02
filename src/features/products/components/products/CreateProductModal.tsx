// src/features/products/components/productos/CreateProductoModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, Package, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { useCreateProducto } from '../../hooks/useCreateProducto';
import { useListCategorias } from '../../hooks/useListCategorias';
import { useListSabores } from '../../hooks/useListSabores';
import { useListTamanos } from '../../hooks/useListTamanos';
import { CreateProductoRequest } from '../../types/product-api.types';

const createProductoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  precio: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0.01, 'El precio debe ser mayor a 0'),
  proteina: z
    .number({ invalid_type_error: 'La proteína debe ser un número' })
    .min(0, 'La proteína debe ser mayor o igual a 0')
    .optional()
    .nullable(),
  calorias: z
    .number({ invalid_type_error: 'Las calorías deben ser un número' })
    .min(0, 'Las calorías deben ser mayor o igual a 0')
    .optional()
    .nullable(),
  volumen: z
    .number({ invalid_type_error: 'El volumen debe ser un número' })
    .min(0, 'El volumen debe ser mayor o igual a 0')
    .optional()
    .nullable(),
  carbohidratos: z
    .number({ invalid_type_error: 'Los carbohidratos deben ser un número' })
    .min(0, 'Los carbohidratos deben ser mayor o igual a 0')
    .optional()
    .nullable(),
  grasas: z
    .number({ invalid_type_error: 'Las grasas deben ser un número' })
    .min(0, 'Las grasas deben ser mayor o igual a 0')
    .optional()
    .nullable(),
  fibra: z
    .number({ invalid_type_error: 'La fibra debe ser un número' })
    .min(0, 'La fibra debe ser mayor o igual a 0')
    .optional()
    .nullable(),
  azucar: z
    .number({ invalid_type_error: 'El azúcar debe ser un número' })
    .min(0, 'El azúcar debe ser mayor o igual a 0')
    .optional()
    .nullable(),
  categoriaId: z
    .string()
    .min(1, 'Debe seleccionar una categoría')
    .optional()
    .nullable(),
  saborId: z
    .string()
    .optional()
    .nullable(),
  tamanoId: z
    .string()
    .optional()
    .nullable(),
  urlImagen: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
});

type CreateProductoFormData = z.infer<typeof createProductoSchema>;

interface CreateProductoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProductoModal = ({ open, onOpenChange }: CreateProductoModalProps) => {
  const [selectedIngredientes, setSelectedIngredientes] = useState<string[]>([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<string[]>([]);
  const [selectedMomentos, setSelectedMomentos] = useState<string[]>([]);
  const [newIngrediente, setNewIngrediente] = useState('');
  const [newEtiqueta, setNewEtiqueta] = useState('');

  const createMutation = useCreateProducto();
  const { data: categorias } = useListCategorias();
  const { data: sabores } = useListSabores();
  const { data: tamanos } = useListTamanos();

  // Convertir a arrays seguros
  const categoriasArray = Array.isArray(categorias) ? categorias : [];
  const saboresArray = Array.isArray(sabores) ? sabores : [];
  const tamanosArray = Array.isArray(tamanos) ? tamanos : [];

  const momentosOptions = [
    { value: 'MANANA', label: 'Mañana' },
    { value: 'PRE_ENTRENAMIENTO', label: 'Pre-entrenamiento' },
    { value: 'POST_ENTRENAMIENTO', label: 'Post-entrenamiento' },
    { value: 'TARDE', label: 'Tarde' },
    { value: 'NOCHE', label: 'Noche' },
    { value: 'ANTES_DORMIR', label: 'Antes de dormir' },
  ] as const;

  const form = useForm<CreateProductoFormData>({
    resolver: zodResolver(createProductoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: 0,
      proteina: null,
      calorias: null,
      volumen: null,
      carbohidratos: null,
      grasas: null,
      fibra: null,
      azucar: null,
      categoriaId: null,
      saborId: null,
      tamanoId: null,
      urlImagen: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = form;

  const onSubmit = async (data: CreateProductoFormData) => {
    const requestData: CreateProductoRequest = {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      precio: data.precio,
      proteina: data.proteina || null,
      calorias: data.calorias || null,
      volumen: data.volumen || null,
      carbohidratos: data.carbohidratos || null,
      grasas: data.grasas || null,
      fibra: data.fibra || null,
      azucar: data.azucar || null,
      categoriaId: data.categoriaId || null,
      saborId: data.saborId || null,
      tamanoId: data.tamanoId || null,
      urlImagen: data.urlImagen || null,
      ingredientes: selectedIngredientes,
      etiquetas: selectedEtiquetas,
      momentosRecomendados: selectedMomentos as ('MANANA' | 'PRE_ENTRENAMIENTO' | 'POST_ENTRENAMIENTO' | 'TARDE' | 'NOCHE' | 'ANTES_DORMIR')[],
    };

    createMutation.mutate(requestData, {
      onSuccess: () => {
        reset();
        setSelectedIngredientes([]);
        setSelectedEtiquetas([]);
        setSelectedMomentos([]);
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    setSelectedIngredientes([]);
    setSelectedEtiquetas([]);
    setSelectedMomentos([]);
    onOpenChange(false);
  };

  const addIngrediente = () => {
    if (newIngrediente.trim() && !selectedIngredientes.includes(newIngrediente.trim())) {
      setSelectedIngredientes([...selectedIngredientes, newIngrediente.trim()]);
      setNewIngrediente('');
    }
  };

  const removeIngrediente = (ingrediente: string) => {
    setSelectedIngredientes(selectedIngredientes.filter(i => i !== ingrediente));
  };

  const addEtiqueta = () => {
    if (newEtiqueta.trim() && !selectedEtiquetas.includes(newEtiqueta.trim())) {
      setSelectedEtiquetas([...selectedEtiquetas, newEtiqueta.trim()]);
      setNewEtiqueta('');
    }
  };

  const removeEtiqueta = (etiqueta: string) => {
    setSelectedEtiquetas(selectedEtiquetas.filter(e => e !== etiqueta));
  };

  const toggleMomento = (momento: string) => {
    setSelectedMomentos(prev => 
      prev.includes(momento) 
        ? prev.filter(m => m !== momento)
        : [...prev, momento]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Crear Nuevo Producto
          </DialogTitle>
          <DialogDescription>
            Añade un nuevo producto al catálogo con toda su información.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Proteína Whey Premium 5lb"
                {...register('nombre')}
                className={errors.nombre ? 'border-destructive' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (S/) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                placeholder="99.99"
                {...register('precio', { valueAsNumber: true })}
                className={errors.precio ? 'border-destructive' : ''}
              />
              {errors.precio && (
                <p className="text-sm text-destructive">{errors.precio.message}</p>
              )}
            </div>

            {/* URL Imagen */}
            <div className="space-y-2">
              <Label htmlFor="urlImagen">URL de Imagen (opcional)</Label>
              <Input
                id="urlImagen"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                {...register('urlImagen')}
                className={errors.urlImagen ? 'border-destructive' : ''}
              />
              {errors.urlImagen && (
                <p className="text-sm text-destructive">{errors.urlImagen.message}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe las características y beneficios del producto..."
              rows={3}
              {...register('descripcion')}
              className={errors.descripcion ? 'border-destructive' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Relaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categoría */}
            <div className="space-y-2">
              <Label>Categoría (opcional)</Label>
              <Select onValueChange={(value) => setValue('categoriaId', value === 'none' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría</SelectItem>
                  {categoriasArray?.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre} - {categoria.tipoProducto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sabor */}
            <div className="space-y-2">
              <Label>Sabor (opcional)</Label>
              <Select onValueChange={(value) => setValue('saborId', value === 'none' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sabor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin sabor</SelectItem>
                  {saboresArray?.map((sabor) => (
                    <SelectItem key={sabor.id} value={sabor.id}>
                      {sabor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tamaño */}
            <div className="space-y-2">
              <Label>Tamaño (opcional)</Label>
              <Select onValueChange={(value) => setValue('tamanoId', value === 'none' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin tamaño</SelectItem>
                  {tamanosArray?.map((tamano) => (
                    <SelectItem key={tamano.id} value={tamano.id}>
                      {tamano.nombre} ({tamano.volumen}ml)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información nutricional */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Información Nutricional (opcional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Proteína */}
              <div className="space-y-2">
                <Label htmlFor="proteina">Proteína (g)</Label>
                <Input
                  id="proteina"
                  type="number"
                  step="0.1"
                  placeholder="25.5"
                  {...register('proteina', { valueAsNumber: true })}
                  className={errors.proteina ? 'border-destructive' : ''}
                />
                {errors.proteina && (
                  <p className="text-sm text-destructive">{errors.proteina.message}</p>
                )}
              </div>

              {/* Calorías */}
              <div className="space-y-2">
                <Label htmlFor="calorias">Calorías</Label>
                <Input
                  id="calorias"
                  type="number"
                  placeholder="120"
                  {...register('calorias', { valueAsNumber: true })}
                  className={errors.calorias ? 'border-destructive' : ''}
                />
                {errors.calorias && (
                  <p className="text-sm text-destructive">{errors.calorias.message}</p>
                )}
              </div>

              {/* Volumen */}
              <div className="space-y-2">
                <Label htmlFor="volumen">Volumen (ml)</Label>
                <Input
                  id="volumen"
                  type="number"
                  placeholder="350"
                  {...register('volumen', { valueAsNumber: true })}
                  className={errors.volumen ? 'border-destructive' : ''}
                />
                {errors.volumen && (
                  <p className="text-sm text-destructive">{errors.volumen.message}</p>
                )}
              </div>

              {/* Carbohidratos */}
              <div className="space-y-2">
                <Label htmlFor="carbohidratos">Carbohidratos (g)</Label>
                <Input
                  id="carbohidratos"
                  type="number"
                  step="0.1"
                  placeholder="5.2"
                  {...register('carbohidratos', { valueAsNumber: true })}
                  className={errors.carbohidratos ? 'border-destructive' : ''}
                />
                {errors.carbohidratos && (
                  <p className="text-sm text-destructive">{errors.carbohidratos.message}</p>
                )}
              </div>

              {/* Grasas */}
              <div className="space-y-2">
                <Label htmlFor="grasas">Grasas (g)</Label>
                <Input
                  id="grasas"
                  type="number"
                  step="0.1"
                  placeholder="1.5"
                  {...register('grasas', { valueAsNumber: true })}
                  className={errors.grasas ? 'border-destructive' : ''}
                />
                {errors.grasas && (
                  <p className="text-sm text-destructive">{errors.grasas.message}</p>
                )}
              </div>

              {/* Fibra */}
              <div className="space-y-2">
                <Label htmlFor="fibra">Fibra (g)</Label>
                <Input
                  id="fibra"
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  {...register('fibra', { valueAsNumber: true })}
                  className={errors.fibra ? 'border-destructive' : ''}
                />
                {errors.fibra && (
                  <p className="text-sm text-destructive">{errors.fibra.message}</p>
                )}
              </div>

              {/* Azúcar */}
              <div className="space-y-2">
                <Label htmlFor="azucar">Azúcar (g)</Label>
                <Input
                  id="azucar"
                  type="number"
                  step="0.1"
                  placeholder="3.0"
                  {...register('azucar', { valueAsNumber: true })}
                  className={errors.azucar ? 'border-destructive' : ''}
                />
                {errors.azucar && (
                  <p className="text-sm text-destructive">{errors.azucar.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="space-y-3">
            <Label>Ingredientes (opcional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Agregar ingrediente..."
                value={newIngrediente}
                onChange={(e) => setNewIngrediente(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngrediente())}
              />
              <Button type="button" variant="outline" onClick={addIngrediente}>
                Agregar
              </Button>
            </div>
            {selectedIngredientes.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedIngredientes.map((ingrediente, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {ingrediente}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeIngrediente(ingrediente)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Etiquetas */}
          <div className="space-y-3">
            <Label>Etiquetas (opcional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Agregar etiqueta..."
                value={newEtiqueta}
                onChange={(e) => setNewEtiqueta(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEtiqueta())}
              />
              <Button type="button" variant="outline" onClick={addEtiqueta}>
                Agregar
              </Button>
            </div>
            {selectedEtiquetas.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedEtiquetas.map((etiqueta, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {etiqueta}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeEtiqueta(etiqueta)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Momentos recomendados */}
          <div className="space-y-3">
            <Label>Momentos Recomendados (opcional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {momentosOptions.map((momento) => (
                <div key={momento.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`momento-${momento.value}`}
                    checked={selectedMomentos.includes(momento.value)}
                    onCheckedChange={() => toggleMomento(momento.value)}
                  />
                  <Label 
                    htmlFor={`momento-${momento.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {momento.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedMomentos.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedMomentos.map((momento) => {
                  const momentoLabel = momentosOptions.find(m => m.value === momento)?.label;
                  return (
                    <Badge key={momento} variant="outline">
                      {momentoLabel}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Crear Producto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};