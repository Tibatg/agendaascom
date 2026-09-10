import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, Eye, Calendar as CalendarIcon, MapPin, User } from 'lucide-react';
import { Secretariat, MunicipalAction, ActionStatus, ActionType, OrigemRecurso } from '../types';
import { ACTION_TYPES, ACTION_STATUSES } from '../data/initialData';

interface PesquisaTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  onSelectAction: (action: MunicipalAction) => void;
  getStatusBadge: (status: ActionStatus) => string;
}

export const PesquisaTab: React.FC<PesquisaTabProps> = ({
  acoes,
  secretarias,
  onSelectAction,
  getStatusBadge
}) => {
  const [keyword, setKeyword] = useState('');
  const [secretariaId, setSecretariaId] = useState('todas');
  const [tipo, setTipo] = useState('todos');
  const [status, setStatus] = useState('todos');
  const [origem, setOrigem] = useState('todos');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const handleReset = () => {
    setKeyword('');
    setSecretariaId('todas');
    setTipo('todos');
    setStatus('todos');
    setOrigem('todos');
    setDateStart('');
    setDateEnd('');
  };

  const results = useMemo(() => {
    return acoes.filter(action => {
      if (secretariaId !== 'todas' && action.secretaria_id !== secretariaId) return false;
      if (tipo !== 'todos' && action.tipo !== tipo) return false;
      if (status !== 'todos' && action.status !== status) return false;
      if (origem !== 'todos' && action.origem_recurso !== origem) return false;
      if (dateStart && action.data_inicio < dateStart) return false;
      if (dateEnd && action.data_inicio > dateEnd) return false;

      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const inTitle = action.titulo.toLowerCase().includes(q);
        const inDesc = action.descricao?.toLowerCase().includes(q);
        const inLocal = action.local.toLowerCase().includes(q);
        const inResp = action.responsavel.toLowerCase().includes(q);
        const inPub = action.publico_alvo?.toLowerCase().includes(q);
        const inObs = action.observacoes?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inLocal && !inResp && !inPub && !inObs) return false;
      }

      return true;
    }).sort((a, b) => a.data_inicio.localeCompare(b.data_inicio));
  }, [acoes, keyword, secretariaId, tipo, status, origem, dateStart, dateEnd]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Consulta Avançada
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
          Pesquisa de Ações e Demandas
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Filtros cruzados por palavra-chave, secretaria, período, status e origem orçamentária
        </p>
      </div>

      {/* Filter Box */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Critérios de Filtragem</span>
          </div>
          <button
            onClick={handleReset}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Limpar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="font-bold block mb-1">Palavra-chave</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: vacinação, audiência, escola, sarau..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Secretaria Municipal</label>
            <select
              value={secretariaId}
              onChange={(e) => setSecretariaId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todas">Todas as Secretarias</option>
              {secretarias.map(s => (
                <option key={s.id} value={s.id}>{s.sigla} - {s.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Tipo de Ação</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todos">Todos os Tipos</option>
              {ACTION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Status Operacional</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todos">Todos os Status</option>
              {ACTION_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Origem do Recurso</label>
            <select
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todos">Todas as Origens</option>
              <option value="Recursos Próprios">Recursos Próprios</option>
              <option value="Emenda">Emenda Parlamentar</option>
              <option value="Parceria">Parceria</option>
              <option value="Geral">Geral</option>
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Data De</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Data Até</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Encontradas <strong>{results.length}</strong> ações correspondentes
        </span>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Data & Horário</th>
                <th className="p-3.5">Ação Municipal</th>
                <th className="p-3.5">Secretaria</th>
                <th className="p-3.5">Local</th>
                <th className="p-3.5">Responsável</th>
                <th className="p-3.5">Origem</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhuma ação municipal encontrada com os parâmetros pesquisados.
                  </td>
                </tr>
              ) : (
                results.map(action => {
                  const sec = secretarias.find(s => s.id === action.secretaria_id);
                  return (
                    <tr 
                      key={action.id} 
                      onClick={() => onSelectAction(action)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <td className="p-3.5 whitespace-nowrap font-semibold">
                        <div>{action.data_inicio.split('-').reverse().join('/')}</div>
                        <div className="text-[11px] text-slate-400">{action.hora_inicio}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{action.titulo}</td>
                      <td className="p-3.5 whitespace-nowrap">{sec?.sigla}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{action.local}</td>
                      <td className="p-3.5">{action.responsavel}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {action.origem_recurso}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(action.status)}`}>
                          {action.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAction(action);
                          }}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
