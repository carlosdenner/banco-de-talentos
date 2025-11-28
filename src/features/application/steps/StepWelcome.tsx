import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/authContext';
import { supabase } from '../../../lib/supabaseClient';
import type { Opportunity } from '../../opportunities/types';

interface StepWelcomeProps {
  onStart: (opportunityId?: string) => void;
  onOpenAuth: () => void;
}

export function StepWelcome({ onStart, onOpenAuth }: StepWelcomeProps) {
  const { user, loading: authLoading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    const { data } = await supabase
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    setOpportunities(data || []);
    setLoadingOpps(false);
  }

  const handleStart = () => {
    onStart(selectedOpp || undefined);
  };

  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Banco de Talentos – Estágio GigaCandanga
        </h2>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Em busca de uma oportunidade para aprender, se desafiar e contribuir com projetos reais? 
          Preencha seu perfil e faça parte do nosso banco de talentos.
        </p>
      </div>

      {/* Opportunities list */}
      {!loadingOpps && opportunities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Oportunidades Disponíveis
          </h3>
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <label
                key={opp.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOpp === opp.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="opportunity"
                    value={opp.id}
                    checked={selectedOpp === opp.id}
                    onChange={() => setSelectedOpp(opp.id)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{opp.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {opp.location} • {opp.work_model} • {opp.weekly_hours}h/semana
                      {opp.monthly_stipend && (
                        <span className="ml-1">
                          • R$ {opp.monthly_stipend.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    {opp.description && (
                      <p className="text-sm text-gray-600 mt-2">{opp.description}</p>
                    )}
                    {opp.interest_areas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {opp.interest_areas.map((area, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {loadingOpps && (
        <div className="text-center py-4 text-gray-500">
          Carregando oportunidades...
        </div>
      )}

      {!loadingOpps && opportunities.length === 0 && (
        <div className="text-center py-4 text-gray-500 mb-4">
          Nenhuma oportunidade aberta no momento. Você pode se cadastrar no banco de talentos geral.
        </div>
      )}
      
      {/* Action buttons */}
      <div className="text-center">
        {authLoading ? (
          <div className="h-12" />
        ) : user ? (
          <button
            onClick={handleStart}
            className="
              px-8 py-3 bg-primary text-white font-medium rounded-lg
              hover:bg-primary-dark transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            "
          >
            {selectedOpp ? 'Candidatar-se' : 'Começar Cadastro'}
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
    </div>
  );
}
