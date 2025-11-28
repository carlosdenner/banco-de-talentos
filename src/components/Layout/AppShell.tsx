import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            GigaCandanga
          </h1>
        </header>
        <main className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {children}
        </main>
        <footer className="text-center mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} GigaCandanga. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
