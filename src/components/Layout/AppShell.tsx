import { useState, type ReactNode } from 'react';
import { useAuth } from '../../lib/authContext';
import { AuthModal } from '../Auth';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              GigaCandanga
            </h1>
            
            {!loading && (
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 hidden sm:inline">
                      {user.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Entrar / Cadastrar
                  </button>
                )}
              </div>
            )}
          </div>
          
          {user && (
            <p className="text-center text-sm text-green-600 mt-2">
              Você está logado. Seu perfil será salvo e poderá ser editado.
            </p>
          )}
        </header>
        
        <main className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {children}
        </main>
        
        <footer className="text-center mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} GigaCandanga. Todos os direitos reservados.
        </footer>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
