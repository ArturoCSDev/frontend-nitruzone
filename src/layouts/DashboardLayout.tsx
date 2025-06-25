import { FC, PropsWithChildren } from 'react';

export const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-4 py-3">
        {/* Aquí va tu navegación */}
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};