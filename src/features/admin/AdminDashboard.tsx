import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { ApplicationRecord, ApplicationStatus } from './types';
import { STATUS_LABELS, STATUS_COLORS } from './types';
import { ApplicationDetail } from './ApplicationDetail';

export function AdminDashboard() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Erro ao carregar candidaturas: ' + fetchError.message);
      setLoading(false);
      return;
    }

    setApplications(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: ApplicationStatus) {
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      alert('Erro ao atualizar status: ' + updateError.message);
      return;
    }

    setApplications(apps => 
      apps.map(app => app.id === id ? { ...app, status } : app)
    );

    if (selectedApp?.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status } : null);
    }
  }

  function exportToCSV() {
    const headers = [
      'Nome', 'Email', 'WhatsApp', 'Cidade', 'Instituição', 'Curso',
      'Período', 'Turno', 'Áreas de Interesse', 'Status', 'Data de Cadastro'
    ];

    const rows = filteredApplications.map(app => [
      app.full_name,
      app.email,
      app.whatsapp,
      app.city,
      app.institution,
      app.course,
      app.current_period,
      app.study_shift,
      app.interest_areas.join('; '),
      STATUS_LABELS[app.status],
      new Date(app.created_at).toLocaleDateString('pt-BR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `candidaturas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Carregando candidaturas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (selectedApp) {
    return (
      <ApplicationDetail
        application={selectedApp}
        onBack={() => setSelectedApp(null)}
        onStatusChange={(status: ApplicationStatus) => updateStatus(selectedApp.id, status)}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Painel de Candidaturas
        </h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Exportar CSV
        </button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'pending', 'reviewing', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todos' : STATUS_LABELS[status]} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, email ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Applications table */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma candidatura encontrada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Curso</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Áreas</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Data</th>
                <th className="px-4 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{app.full_name}</div>
                    <div className="text-gray-500 text-xs">{app.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {app.course}
                    <div className="text-xs text-gray-400">{app.institution}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {app.interest_areas.slice(0, 2).map((area, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {area.length > 20 ? area.substring(0, 20) + '...' : area}
                        </span>
                      ))}
                      {app.interest_areas.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{app.interest_areas.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {new Date(app.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
