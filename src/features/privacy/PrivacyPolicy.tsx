interface PrivacyPolicyProps {
  onBack?: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="max-w-none prose prose-slate dark:prose-invert">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">
          Política de Privacidade
        </h1>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm px-4 py-2 text-primary dark:text-blue-400 border border-primary dark:border-blue-400 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-blue-500 transition-colors"
          >
            Voltar
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Última atualização: {new Date().toLocaleDateString('pt-BR')}
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          1. Introdução
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          A GigaCandanga ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. 
          Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos seus 
          dados pessoais quando você utiliza nosso Banco de Talentos, em conformidade com a Lei Geral 
          de Proteção de Dados (LGPD – Lei nº 13.709/2018).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          2. Dados Coletados
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          Coletamos os seguintes dados pessoais através do formulário de inscrição:
        </p>
        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1">
          <li><strong>Dados de identificação:</strong> nome completo, data de nascimento</li>
          <li><strong>Dados de contato:</strong> e-mail, telefone/WhatsApp, cidade</li>
          <li><strong>Dados acadêmicos:</strong> instituição de ensino, curso, período, turno, previsão de formatura</li>
          <li><strong>Dados profissionais:</strong> áreas de interesse, experiências anteriores, habilidades</li>
          <li><strong>Documentos:</strong> currículo (CV), quando fornecido</li>
          <li><strong>Dados de autenticação:</strong> credenciais de login (se optar por criar conta)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          3. Finalidade do Tratamento
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          Seus dados pessoais são tratados para as seguintes finalidades:
        </p>
        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1">
          <li>Avaliar seu perfil para oportunidades de estágio na GigaCandanga</li>
          <li>Entrar em contato sobre vagas compatíveis com seu perfil</li>
          <li>Gerenciar o processo seletivo de estágios</li>
          <li>Comunicar informações relevantes sobre o programa de estágio</li>
          <li>Cumprir obrigações legais e regulatórias</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          4. Base Legal
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          O tratamento dos seus dados pessoais é realizado com base no seu <strong>consentimento</strong> (Art. 7º, I, LGPD), 
          manifestado ao aceitar esta Política de Privacidade durante o cadastro. Para algumas operações, 
          também nos baseamos na <strong>execução de contrato</strong> ou <strong>procedimentos preliminares</strong> (Art. 7º, V, LGPD).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          5. Compartilhamento de Dados
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          Seus dados pessoais poderão ser compartilhados com:
        </p>
        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1">
          <li>Equipe interna de Recursos Humanos da GigaCandanga</li>
          <li>Gestores responsáveis pelas áreas com vagas de estágio</li>
          <li>Prestadores de serviços essenciais (ex: armazenamento em nuvem)</li>
          <li>Autoridades públicas, quando exigido por lei</li>
        </ul>
        <p className="text-slate-600 dark:text-slate-300 mt-3">
          Não vendemos ou comercializamos seus dados pessoais a terceiros.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          6. Armazenamento e Segurança
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          Seus dados são armazenados em servidores seguros com criptografia e controles de acesso. 
          Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra 
          acesso não autorizado, perda, alteração ou divulgação.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          Os dados serão mantidos pelo período necessário para cumprir as finalidades descritas, 
          ou enquanto houver base legal para seu tratamento, respeitando os prazos legais de retenção.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          7. Seus Direitos
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          Conforme a LGPD, você tem direito a:
        </p>
        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-1">
          <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los</li>
          <li><strong>Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados</li>
          <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou excessivos</li>
          <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
          <li><strong>Eliminação:</strong> solicitar a exclusão de dados tratados com base no consentimento</li>
          <li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento</li>
          <li><strong>Informação:</strong> saber com quem seus dados foram compartilhados</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          8. Como Exercer Seus Direitos
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-3">
          Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre o tratamento dos seus 
          dados pessoais, entre em contato conosco:
        </p>
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
          <p className="text-slate-600 dark:text-slate-300 m-0">
            <strong>E-mail:</strong>{' '}
            <a href="mailto:privacidade@gigacandanga.net.br" className="text-primary dark:text-blue-400">
              privacidade@gigacandanga.net.br
            </a>
          </p>
          <p className="text-slate-600 dark:text-slate-300 m-0 mt-2">
            <strong>Ou:</strong>{' '}
            <a href="mailto:suporte@gigacandanga.net.br" className="text-primary dark:text-blue-400">
              suporte@gigacandanga.net.br
            </a>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          9. Alterações nesta Política
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você 
          a consulte regularmente. Alterações significativas serão comunicadas por e-mail ou 
          através de aviso em nosso site.
        </p>
      </section>

      <section className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          10. Controlador dos Dados
        </h2>
        <p className="text-slate-600 dark:text-slate-300 m-0">
          <strong>GigaCandanga - Instituição de Ciência e Tecnologia</strong><br />
          Responsável pelo tratamento dos dados pessoais coletados através deste Banco de Talentos.
        </p>
      </section>

      {onBack && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Voltar ao formulário
          </button>
        </div>
      )}
    </div>
  );
}
