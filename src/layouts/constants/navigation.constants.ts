import { 
    UserPlus, 
    Shield, 
    Users, 
    Settings 
  } from 'lucide-react';
  import { NavigationGroup } from '../types/navigation.types';
  
  export const ADMIN_NAVIGATION: NavigationGroup[] = [
    {
      title: "Gestión de Usuarios",
      items: [
        {
          title: "Registrar Cliente",
          url: "/panel/register-client",
          icon: UserPlus,
          description: "Crear nuevos clientes en el sistema"
        },
        {
          title: "Registrar Admin",
          url: "/panel/register-admin", 
          icon: Shield,
          description: "Crear nuevos administradores"
        },
      ]
    },
    {
      title: "Listados y Reportes",
      items: [
        {
          title: "Lista de Clientes",
          url: "/panel/list-users/client",
          icon: Users,
          description: "Ver y gestionar clientes"
        },
        {
          title: "Lista de Admins",
          url: "/panel/list-users/admin",
          icon: Settings,
          description: "Ver y gestionar administradores"
        },
      ]
    }
  ];