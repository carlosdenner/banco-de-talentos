interface StepSucessoProps {
  onReset: () => void;
}

export function StepSucesso({ onReset }: StepSucessoProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Inscrição enviada com sucesso!
      </h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        Obrigado por se candidatar ao Banco de Talentos da GigaCandanga. 
        Entraremos em contato por e-mail ou WhatsApp quando surgir uma oportunidade 
        alinhada ao seu perfil.
      </p>

      <button
        onClick={onReset}
        className="
          px-6 py-3 bg-primary text-white font-medium rounded-lg
          hover:bg-primary-dark transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        "
      >
        Voltar ao início
      </button>
    </div>
  );
}
