import type { ReactNode } from 'react';
import { useAuth } from '../../lib/authContext';

interface AppShellProps {
  children: ReactNode;
  onOpenAuth: () => void;
}

function Logo() {
  return (
    <a 
      href="https://gigacandanga.net.br" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      {/* GigaCandanga Logo Icon */}
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="url(#logoGrad)"/>
        <text x="20" y="28" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="white" textAnchor="middle">G</text>
        <circle cx="30" cy="10" r="5" fill="#FF9900"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#004A86"/>
            <stop offset="1" stopColor="#0066B3"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-primary leading-tight">
          GigaCandanga
        </h1>
        <p className="text-xs text-gray-500 -mt-0.5">Banco de Talentos</p>
      </div>
    </a>
  );
}

export function AppShell({ children, onOpenAuth }: AppShellProps) {
  const { user, signOut, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo />
            
            {!loading && (
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 hidden md:inline truncate max-w-[200px]">
                      {user.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="text-sm px-3 py-1.5 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 text-sm bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors shadow-sm"
                  >
                    Entrar / Cadastrar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {user && (
          <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700">
              ✓ Você está logado. Seu perfil será salvo e poderá ser editado.
            </p>
          </div>
        )}
        
        <main className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">GigaCandanga</p>
              <p className="text-sm text-blue-200">
                Instituição de Ciência e Tecnologia
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <a 
                href="https://gigacandanga.net.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Sobre a GigaCandanga
              </a>
              <a 
                href="mailto:contatos@gigacandanga.net.br"
                className="hover:text-accent transition-colors"
              >
                contatos@gigacandanga.net.br
              </a>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-blue-700 text-sm text-blue-200">
            &copy; {new Date().getFullYear()} GigaCandanga. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
