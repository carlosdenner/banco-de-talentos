import type { ApplicationRecord, ApplicationStatus } from './types';
import { STATUS_LABELS, STATUS_COLORS } from './types';

interface ApplicationDetailProps {
  application: ApplicationRecord;
  onBack: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
}

export function ApplicationDetail({ application, onBack, onStatusChange }: ApplicationDetailProps) {
  const app = application;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-primary hover:underline flex items-center gap-1"
      >
        ← Voltar para lista
      </button>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{app.full_name}</h2>
              <p className="text-gray-500">{app.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[app.status]}`}>
                {STATUS_LABELS[app.status]}
              </span>
              <select
                value={app.status}
                onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pendente</option>
                <option value="reviewing">Em análise</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dados Pessoais */}
          <Section title="Dados Pessoais">
            <DataRow label="Nome completo" value={app.full_name} />
            <DataRow label="Data de nascimento" value={formatDate(app.birth_date)} />
            <DataRow label="Email" value={app.email} />
            <DataRow label="WhatsApp" value={app.whatsapp} />
            <DataRow label="Cidade" value={app.city} />
          </Section>

          {/* Formação */}
          <Section title="Formação Acadêmica">
            <DataRow label="Instituição" value={app.institution} />
            <DataRow label="Curso" value={app.course} />
            <DataRow label="Período atual" value={app.current_period} />
            <DataRow label="Turno" value={app.study_shift} />
            {app.graduation_month && app.graduation_year && (
              <DataRow 
                label="Previsão de formatura" 
                value={`${app.graduation_month}/${app.graduation_year}`} 
              />
            )}
          </Section>

          {/* Áreas de Interesse */}
          <Section title="Áreas de Interesse">
            <div className="flex flex-wrap gap-2 mb-3">
              {app.interest_areas.map((area, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
            {app.interest_areas_other && (
              <DataRow label="Outra área" value={app.interest_areas_other} />
            )}
            <DataRow label="Motivação" value={app.motivation} multiline />
            <DataRow label="Contribuições" value={app.contributions} multiline />
          </Section>

          {/* Experiências */}
          <Section title="Experiências e Habilidades">
            {app.tools && <DataRow label="Ferramentas/Tecnologias" value={app.tools} />}
            <DataRow label="Experiência prévia" value={app.has_experience ? 'Sim' : 'Não'} />
            
            {app.has_experience && (
              <>
                {app.experience_type && <DataRow label="Tipo de experiência" value={app.experience_type} />}
                {app.experience_org && <DataRow label="Organização" value={app.experience_org} />}
                {app.experience_period && <DataRow label="Período" value={app.experience_period} />}
                {app.experience_activities && (
                  <DataRow label="Atividades desenvolvidas" value={app.experience_activities} multiline />
                )}
                {app.experience_learnings && (
                  <DataRow label="Aprendizados" value={app.experience_learnings} multiline />
                )}
              </>
            )}
          </Section>

          {/* Informações Complementares */}
          <Section title="Informações Complementares">
            {app.extra_info && <DataRow label="Informações adicionais" value={app.extra_info} multiline />}
            <DataRow label="Como soube do programa" value={app.how_did_you_hear} />
            {app.how_did_you_hear_other && (
              <DataRow label="Detalhe" value={app.how_did_you_hear_other} />
            )}
            {app.cv_url && (
              <div className="mt-3">
                <a
                  href={app.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar Currículo
                </a>
              </div>
            )}
          </Section>

          {/* Metadados */}
          <Section title="Metadados">
            <DataRow label="ID" value={app.id} />
            <DataRow label="Cadastro em" value={formatDate(app.created_at)} />
            <DataRow label="Última atualização" value={formatDate(app.updated_at)} />
            {app.user_id && <DataRow label="User ID" value={app.user_id} />}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function DataRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? '' : 'flex flex-col sm:flex-row sm:gap-4'}>
      <span className="text-gray-500 font-medium sm:w-48 shrink-0">{label}:</span>
      {multiline ? (
        <p className="text-gray-900 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{value}</p>
      ) : (
        <span className="text-gray-900">{value}</span>
      )}
    </div>
  );
}
