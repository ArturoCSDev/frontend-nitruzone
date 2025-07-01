import { Link, useLocation } from 'react-router-dom';
import { 
  UserPlus, 
  Shield, 
  Users, 
  Settings,
  Leaf,
  Package,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

// Navigation items
const navigationItems = [
  {
    title: "Gestión de Usuarios",
    items: [
      {
        title: "Registrar Cliente",
        url: "/panel/register-client",
        icon: UserPlus,
      },
      {
        title: "Registrar Admin",
        url: "/panel/register-admin", 
        icon: Shield,
      },
    ]
  },
  {
    title: "Listados",
    items: [
      {
        title: "Lista de Clientes",
        url: "/panel/list-users/client",
        icon: Users,
      },
      {
        title: "Lista de Admins",
        url: "/panel/list-users/admin",
        icon: Settings,
      },
    ]
  },
  {
    title: "Inventario",
    items: [
      {
        title: "Lista de Productos",
        url: "/panel/inventory",
        icon: Package,
      },
      {
        title: "Lista de Sabores",
        url: "/panel/inventory/sabores",
        icon: Package,
      },
    ]
  }
];

export const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  return (
    <Sidebar className="border-r bg-sidebar">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex items-center justify-center w-9 h-9 bg-sidebar-primary rounded-lg">
            <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">NutriZone</h2>
            <p className="text-xs text-sidebar-foreground/70">Panel Admin</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive(item.url)}
                      className="w-full"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};