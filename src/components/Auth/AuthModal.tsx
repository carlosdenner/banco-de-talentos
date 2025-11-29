import { useState } from 'react';
import { useAuth } from '../../lib/authContext';
import { TextInput } from '../FormFields';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signIn, signUp, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (mode === 'register' && password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (mode !== 'forgot' && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setError('Erro ao enviar e-mail. Verifique o endereço informado.');
        } else {
          setSuccessMessage('E-mail enviado! Verifique sua caixa de entrada para redefinir sua senha.');
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError('E-mail ou senha incorretos');
        } else {
          onSuccess?.();
          onClose();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Este e-mail já está cadastrado');
          } else {
            setError('Erro ao criar conta. Tente novamente.');
          }
        } else {
          setSuccessMessage('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
        }
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar Conta' : 'Recuperar Senha'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {successMessage ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600">{successMessage}</p>
            <button
              onClick={() => {
                setMode('login');
                setSuccessMessage(null);
              }}
              className="mt-4 text-primary hover:underline"
            >
              Voltar para login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <TextInput
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />

            {mode !== 'forgot' && (
              <TextInput
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            )}

            {mode === 'register' && (
              <TextInput
                label="Confirmar Senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            )}

            {mode === 'forgot' && (
              <p className="text-sm text-gray-600 -mt-2 mb-4">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 bg-primary text-white font-medium rounded-lg
                hover:bg-primary-dark transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                mt-2
              "
            >
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar Conta' : 'Enviar Link'}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="w-full text-center text-sm text-gray-500 hover:text-primary mt-3"
              >
                Esqueci minha senha
              </button>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              {mode === 'login' ? (
                <>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-primary hover:underline"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  {mode === 'forgot' ? 'Lembrou a senha?' : 'Já tem uma conta?'}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-primary hover:underline"
                  >
                    Entrar
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
