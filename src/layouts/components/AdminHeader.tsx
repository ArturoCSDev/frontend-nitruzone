import { User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/auth.store';
import { useLogout } from '../../features/auth/hooks/useLogout';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const AdminHeader = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Obtener iniciales del nombre
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left side - Sidebar trigger */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">Panel Administrativo</h1>
        </div>
      </div>
      {/* Right side - User menu */}
      <div className="flex items-center gap-4">
        {/* Welcome text */}
        <div className="hidden sm:block text-sm text-muted-foreground">
          Bienvenido, <span className="font-medium text-foreground">{user?.nombreCompleto}</span>
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {user?.nombreCompleto ? getInitials(user.nombreCompleto) : 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.nombreCompleto}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <div className="flex items-center gap-1 pt-1">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-xs text-primary font-medium">
                    {user?.rol}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};