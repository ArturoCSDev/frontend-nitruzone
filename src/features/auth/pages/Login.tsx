// src/features/auth/pages/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Users, TrendingUp, Heart, Zap } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../stores/auth.store';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isClient } = useAuthStore();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate('/panel/register-client', { replace: true });
      } else if (isClient()) {
        navigate('/club', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isClient, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marketing Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Bienvenido a
                <span className="text-white/90 flex items-center justify-center lg:justify-start gap-3">
                  <Sparkles className="w-12 h-12" />
                  NutriZone
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Tu plataforma integral de nutrición personalizada. 
                Accede a tu espacio personal o gestiona la plataforma 
                desde el panel administrativo.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nutrición Personalizada</h3>
                  <p className="text-sm text-white/70">
                    Planes diseñados específicamente para ti
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Gestión Profesional</h3>
                  <p className="text-sm text-white/70">
                    Herramientas avanzadas para profesionales
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Seguimiento Avanzado</h3>
                  <p className="text-sm text-white/70">
                    Monitorea tu progreso en tiempo real
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Comunidad Activa</h3>
                  <p className="text-sm text-white/70">
                    Únete a nuestra comunidad saludable
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">1,200+</div>
                <div className="text-sm text-white/70">Usuarios Activos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-white/70">Objetivos Alcanzados</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/70">Soporte Disponible</div>
              </div>
            </div> */}

            {/* Call to Action */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">¿Nuevo en NutriZone?</span>
              </div>
              <p className="text-sm text-white/80">
                Contacta con nuestro equipo para crear tu cuenta personalizada 
                y comenzar tu transformación nutricional.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}