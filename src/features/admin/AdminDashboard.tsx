import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { ApplicationRecord, ApplicationStatus } from './types';
import { STATUS_LABELS, STATUS_COLORS } from './types';
import { ApplicationDetail } from './ApplicationDetail';

interface Invite {
  id: string;
  email: string;
  invited_by_email: string;
  status: 'pending' | 'accepted' | 'expired';
  accepted_at: string | null;
  created_at: string;
  expires_at: string;
}

const INVITE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  expired: 'Expirado',
};

const INVITE_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  expired: 'bg-gray-100 text-gray-800',
};

export function AdminDashboard() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Invite history state
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showInviteHistory, setShowInviteHistory] = useState(false);

  useEffect(() => {
    loadApplications();
    loadInvites();
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

  async function loadInvites() {
    const { data } = await supabase
      .from('invites')
      .select('*')
      .order('created_at', { ascending: false });

    setInvites((data as Invite[]) || []);
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

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviteLoading(true);
    setInviteMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ email: inviteEmail }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setInviteMessage({ type: 'error', text: result.error || 'Erro ao enviar convite' });
      } else {
        setInviteMessage({ type: 'success', text: `Convite enviado para ${inviteEmail}!` });
        setInviteEmail('');
        loadInvites(); // Reload invites list
      }
    } catch {
      setInviteMessage({ type: 'error', text: 'Erro ao enviar convite. Tente novamente.' });
    } finally {
      setInviteLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Painel de Candidaturas
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            Convidar Talento
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Convidar para o Banco de Talentos
              </h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteMessage(null);
                  setInviteEmail('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Envie um convite por e-mail para um talento se cadastrar no Banco de Talentos da GigaCandanga.
            </p>

            <form onSubmit={sendInvite}>
              {inviteMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  inviteMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {inviteMessage.text}
                </div>
              )}

              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white mb-4"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteMessage(null);
                    setInviteEmail('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteEmail}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviteLoading ? 'Enviando...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite History Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowInviteHistory(!showInviteHistory)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showInviteHistory ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Histórico de Convites ({invites.length})
        </button>

        {showInviteHistory && invites.length > 0 && (
          <div className="mt-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 dark:text-gray-400">
                    <th className="pb-2 font-medium">E-mail</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Enviado por</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td className="py-2 text-gray-900 dark:text-gray-100">{invite.email}</td>
                      <td className="py-2 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{invite.invited_by_email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${INVITE_STATUS_COLORS[invite.status]}`}>
                          {INVITE_STATUS_LABELS[invite.status]}
                        </span>
                      </td>
                      <td className="py-2 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {new Date(invite.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showInviteHistory && invites.length === 0 && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Nenhum convite enviado ainda.
          </p>
        )}
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
