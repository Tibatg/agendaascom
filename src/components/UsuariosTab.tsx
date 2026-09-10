import React, { useState } from 'react';
import { Users, Plus, Shield, UserCheck, UserX, Mail, KeyRound, Edit3 } from 'lucide-react';
import { UserProfile, UserRole, Secretariat } from '../types';

interface UsuariosTabProps {
  usuarios: UserProfile[];
  secretarias: Secretariat[];
  onAddUser: (user: UserProfile) => void;
  onUpdateUser: (user: UserProfile) => void;
  onToggleUserStatus: (userId: string) => void;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const UsuariosTab: React.FC<UsuariosTabProps> = ({
  usuarios,
  secretarias,
  onAddUser,
  onUpdateUser,
  onToggleUserStatus,
  onToast
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPerfil, setNewPerfil] = useState<UserRole>('Editor');
  const [newSecretariaId, setNewSecretariaId] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim() || !newEmail.trim()) {
      onToast('Preencha nome e e-mail do usuário.', 'error');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      nome: newNome.trim(),
      email: newEmail.trim().toLowerCase(),
      perfil: newPerfil,
      secretaria_id: newPerfil === 'Editor' && newSecretariaId ? newSecretariaId : undefined,
      ativo: true,
      ultimo_acesso: 'Nunca acessou'
    };

    onAddUser(newUser);
    setShowAddModal(false);
    setNewNome('');
    setNewEmail('');
    setNewPerfil('Editor');
    setNewSecretariaId('');
    onToast(`Usuário ${newUser.nome} adicionado com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Controle de Acesso & Permissões (RBAC)
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Gestão de Usuários do Sistema
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perfis de Administrador Geral (ASCOM), Editores Setoriais e modo de consulta pública
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Usuário</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Perfil</th>
              <th className="p-4">Secretaria Vinculada</th>
              <th className="p-4">Último Acesso</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {usuarios.map(u => {
              const sec = secretarias.find(s => s.id === u.secretaria_id);
              return (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{u.nome}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{u.email}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.perfil === 'Administrador' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      u.perfil === 'Editor' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {u.perfil}
                    </span>
                  </td>
                  <td className="p-4">{sec ? `${sec.sigla} - ${sec.nome}` : 'Acesso Geral'}</td>
                  <td className="p-4 text-slate-400">{u.ultimo_acesso || '—'}</td>
                  <td className="p-4 whitespace-nowrap">
                    {u.ativo ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <UserCheck className="w-3.5 h-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
                        <UserX className="w-3.5 h-3.5" /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onToggleUserStatus(u.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {u.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">
              Adicionar Usuário
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="Ex: João da Silva (Coordenação)"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">E-mail Institucional *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="usuario@prefeitura.gov.br"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Nível de Permissão (Perfil) *</label>
                <select
                  value={newPerfil}
                  onChange={(e) => setNewPerfil(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                >
                  <option value="Administrador">Administrador Geral</option>
                  <option value="Editor">Editor de Conteúdo</option>
                  <option value="Visualizador">Visualizador (Consulta)</option>
                </select>
              </div>

              {newPerfil === 'Editor' && (
                <div>
                  <label className="font-bold block mb-1">Secretaria Municipal Vinculada</label>
                  <select
                    value={newSecretariaId}
                    onChange={(e) => setNewSecretariaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="">Acesso Editorial Geral (Todas)</option>
                    {secretarias.map(s => (
                      <option key={s.id} value={s.id}>{s.sigla} - {s.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
