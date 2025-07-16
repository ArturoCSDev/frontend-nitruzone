import { SelectIconProps } from "@radix-ui/react-select";

export interface ObjetivoInfo {
    label: string;
    icon: React.ComponentType<SelectIconProps>;
    color: string;
}
  
export interface PrioridadBadge {
    variant: 'destructive' | 'default' | 'secondary';
    label: string;
}
  
export interface RespuestaBadge {
    icon: React.ComponentType<SelectIconProps>;
    variant: 'outline' | 'default' | 'destructive' | 'secondary';
    label: string;
    color: string;
}