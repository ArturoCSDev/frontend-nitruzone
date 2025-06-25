// src/layouts/PublicLayout.tsx
import { Outlet } from 'react-router-dom';
import { Leaf, Shield, Heart, Users, TrendingUp, Sparkles } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NutriZone</h1>
                <p className="text-sm text-white/80">Tu espacio nutricional</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">Plataforma Activa</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons - Más relacionados a nutrición */}
        <div className="absolute top-20 left-10 opacity-10">
          <Heart className="w-24 h-24 text-white animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-10">
          <Users className="w-20 h-20 text-white animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-32 left-20 opacity-10">
          <Sparkles className="w-28 h-28 text-white animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute top-60 right-40 opacity-10">
          <TrendingUp className="w-16 h-16 text-white animate-bounce" style={{ animationDelay: '3s' }} />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-white/70">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Personalizado</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Innovador</span>
              </div>
            </div>
            <p className="text-sm text-white/60">
              © 2025 NutriZone. Transformando vidas a través de la nutrición personalizada.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};