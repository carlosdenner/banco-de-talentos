import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Opportunity, OpportunityFormData } from './types';
import { WORK_MODEL_OPTIONS } from './types';
import { INTEREST_AREAS_OPTIONS } from '../application/types';

const defaultFormData: OpportunityFormData = {
  title: '',
  description: '',
  requirements: '',
  benefits: '',
  location: 'Brasília - DF',
  work_model: 'Híbrido',
  weekly_hours: 20,
  monthly_stipend: '',
  interest_areas: [],
  start_date: '',
  end_date: '',
  is_active: true,
  max_applications: '',
};

export function OpportunitiesManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OpportunityFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOpportunities(data);
    }
    setLoading(false);
  }

  function handleEdit(opp: Opportunity) {
    setFormData({
      title: opp.title,
      description: opp.description || '',
      requirements: opp.requirements || '',
      benefits: opp.benefits || '',
      location: opp.location,
      work_model: opp.work_model,
      weekly_hours: opp.weekly_hours,
      monthly_stipend: opp.monthly_stipend?.toString() || '',
      interest_areas: opp.interest_areas,
      start_date: opp.start_date || '',
      end_date: opp.end_date || '',
      is_active: opp.is_active,
      max_applications: opp.max_applications?.toString() || '',
    });
    setEditingId(opp.id);
    setShowForm(true);
  }

  function handleNew() {
    setFormData(defaultFormData);
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title,
      description: formData.description || null,
      requirements: formData.requirements || null,
      benefits: formData.benefits || null,
      location: formData.location,
      work_model: formData.work_model,
      weekly_hours: formData.weekly_hours,
      monthly_stipend: formData.monthly_stipend ? parseFloat(formData.monthly_stipend.toString()) : null,
      interest_areas: formData.interest_areas,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_active: formData.is_active,
      max_applications: formData.max_applications ? parseInt(formData.max_applications.toString()) : null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from('opportunities')
        .update(payload)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase
        .from('opportunities')
        .insert(payload));
    }

    setSaving(false);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
      return;
    }

    setShowForm(false);
    loadOpportunities();
  }

  async function toggleActive(id: string, currentState: boolean) {
    await supabase
      .from('opportunities')
      .update({ is_active: !currentState, updated_at: new Date().toISOString() })
      .eq('id', id);
    loadOpportunities();
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta oportunidade?')) return;
    
    await supabase.from('opportunities').delete().eq('id', id);
    loadOpportunities();
  }

  if (loading) {
    return <div className="text-center py-8">Carregando oportunidades...</div>;
  }

  if (showForm) {
    return (
      <div>
        <button
          onClick={() => setShowForm(false)}
          className="mb-4 text-primary hover:underline"
        >
          ← Voltar para lista
        </button>

        <h2 className="text-xl font-bold mb-6">
          {editingId ? 'Editar Oportunidade' : 'Nova Oportunidade'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da vaga *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Ex: Estágio em Desenvolvimento Web"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Descreva a oportunidade..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requisitos
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Liste os requisitos..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benefícios
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="Liste os benefícios..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo de trabalho
              </label>
              <select
                value={formData.work_model}
                onChange={(e) => setFormData({ ...formData, work_model: e.target.value as typeof formData.work_model })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                {WORK_MODEL_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carga horária semanal
              </label>
              <input
                type="number"
                value={formData.weekly_hours}
                onChange={(e) => setFormData({ ...formData, weekly_hours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bolsa mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_stipend}
                onChange={(e) => setFormData({ ...formData, monthly_stipend: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Ex: 1500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de início das inscrições
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de fim das inscrições
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de candidaturas
              </label>
              <input
                type="number"
                value={formData.max_applications}
                onChange={(e) => setFormData({ ...formData, max_applications: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Deixe vazio para ilimitado"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Áreas de interesse relacionadas
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_AREAS_OPTIONS.map((area: string) => (
                <label
                  key={area}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    formData.interest_areas.includes(area)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.interest_areas.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, interest_areas: [...formData.interest_areas, area] });
                      } else {
                        setFormData({ ...formData, interest_areas: formData.interest_areas.filter(a => a !== area) });
                      }
                    }}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Oportunidade ativa (visível para candidatos)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Oportunidades</h2>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          + Nova Oportunidade
        </button>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma oportunidade cadastrada.
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className={`border rounded-lg p-4 ${opp.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{opp.title}</h3>
                  <p className="text-sm text-gray-600">
                    {opp.location} • {opp.work_model} • {opp.weekly_hours}h/semana
                    {opp.monthly_stipend && ` • R$ ${opp.monthly_stipend.toLocaleString('pt-BR')}`}
                  </p>
                  {opp.interest_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {opp.interest_areas.map((area, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  opp.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {opp.is_active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(opp)}
                  className="text-sm text-primary hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(opp.id, opp.is_active)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  {opp.is_active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleDelete(opp.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
