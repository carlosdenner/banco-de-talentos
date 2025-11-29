import { useState, type ReactNode } from 'react';
import { useAuth } from '../../lib/authContext';
import { useTheme } from '../../lib/themeContext';

interface AppShellProps {
  children: ReactNode;
  onOpenAuth: () => void;
  onOpenPrivacyPolicy?: () => void;
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
        <h1 className="text-xl font-bold text-primary dark:text-blue-400 leading-tight">
          GigaCandanga
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Banco de Talentos</p>
      </div>
    </a>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

export function AppShell({ children, onOpenAuth, onOpenPrivacyPolicy }: AppShellProps) {
  const { user, signOut, loading, isEmailConfirmed, resendConfirmationEmail } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleResendConfirmation = async () => {
    if (!user?.email) return;
    setResendLoading(true);
    setResendMessage(null);
    const { error } = await resendConfirmationEmail(user.email);
    if (error) {
      setResendMessage('Erro ao reenviar. Tente novamente.');
    } else {
      setResendMessage('E-mail enviado! Verifique sua caixa de entrada.');
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Header Bar */}
      <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo />
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {!loading && (
                <div className="flex items-center gap-3">
                  {user ? (
                    <>
                      <span className="text-sm text-slate-600 dark:text-slate-300 hidden md:inline truncate max-w-[200px]">
                        {user.email}
                      </span>
                      <button
                        onClick={() => signOut()}
                        className="text-sm px-3 py-1.5 text-blue-700 dark:text-blue-400 border border-blue-700 dark:border-blue-400 rounded-lg hover:bg-blue-700 hover:text-white dark:hover:bg-blue-500 transition-colors"
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onOpenAuth}
                      className="px-4 py-2 text-sm bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
                    >
                      Entrar / Cadastrar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {user && !isEmailConfirmed && (
          <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  E-mail não confirmado
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Para enviar sua inscrição, confirme seu e-mail clicando no link que enviamos para <strong>{user.email}</strong>.
                </p>
                {resendMessage && (
                  <p className={`text-sm mt-2 ${resendMessage.includes('Erro') ? 'text-red-600' : 'text-green-600 dark:text-green-400'}`}>
                    {resendMessage}
                  </p>
                )}
                <button
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="mt-2 text-sm text-amber-800 dark:text-amber-200 underline hover:no-underline disabled:opacity-50"
                >
                  {resendLoading ? 'Enviando...' : 'Reenviar e-mail de confirmação'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {user && isEmailConfirmed && (
          <div className="mb-4 px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Você está logado. Seu perfil será salvo e poderá ser editado.
            </p>
          </div>
        )}
        
        <main className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 dark:bg-slate-900 text-white py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">GigaCandanga</p>
              <p className="text-sm text-blue-200 dark:text-slate-400">
                Instituição de Ciência e Tecnologia
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <a 
                href="https://gigacandanga.net.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                Sobre a GigaCandanga
              </a>
              <button
                onClick={onOpenPrivacyPolicy}
                className="hover:text-orange-400 transition-colors"
              >
                Política de Privacidade
              </button>
              <a 
                href="mailto:suporte@gigacandanga.net.br"
                className="hover:text-orange-400 transition-colors"
              >
                suporte@gigacandanga.net.br
              </a>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-blue-700 dark:border-slate-700 text-sm text-blue-200 dark:text-slate-400">
            &copy; {new Date().getFullYear()} GigaCandanga. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
