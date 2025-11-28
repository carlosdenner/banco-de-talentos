import { useAuth } from '../../../lib/authContext';

interface StepWelcomeProps {
  onStart: () => void;
  onOpenAuth: () => void;
}

export function StepWelcome({ onStart, onOpenAuth }: StepWelcomeProps) {
  const { user, loading } = useAuth();

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Banco de Talentos – Estágio GigaCandanga
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        Em busca de uma oportunidade para aprender, se desafiar e contribuir com projetos reais? 
        Preencha seu perfil e faça parte do nosso banco de talentos.
      </p>
      
      {loading ? (
        <div className="h-12" /> // Placeholder while loading
      ) : user ? (
        <button
          onClick={onStart}
          className="
            px-8 py-3 bg-primary text-white font-medium rounded-lg
            hover:bg-primary-dark transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          "
        >
          Começar
        </button>
      ) : (
        <>
          <button
            onClick={onOpenAuth}
            className="
              px-8 py-3 bg-primary text-white font-medium rounded-lg
              hover:bg-primary-dark transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            "
          >
            Entrar / Cadastrar
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Faça login ou crie uma conta para preencher seu perfil
          </p>
        </>
      )}
    </div>
  );
}
