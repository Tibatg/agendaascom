import React, { useState, useMemo } from 'react';
import { User, Search, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { MunicipalAction, Secretariat } from '../types';

interface ResponsaveisTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  onSelectAction: (action: MunicipalAction) => void;
}

export const ResponsaveisTab: React.FC<ResponsaveisTabProps> = ({
  acoes,
  secretarias,
  onSelectAction
}) => {
  const [search, setSearch] = useState('');

  const responsaveisMap = useMemo(() => {
    const map = new Map<string, { actions: MunicipalAction[]; secretariasIds: Set<string> }>();

    acoes.forEach(action => {
      const resp = action.responsavel?.trim() || 'Não informado';
      if (!map.has(resp)) {
        map.set(resp, { actions: [], secretariasIds: new Set() });
      }
      const item = map.get(resp)!;
      item.actions.push(action);
      item.secretariasIds.add(action.secretaria_id);
    });

    return Array.from(map.entries()).map(([nome, data]) => ({
      nome,
      actions: data.actions,
      secretarias: Array.from(data.secretariasIds).map(id => secretarias.find(s => s.id === id)).filter(Boolean) as Secretariat[]
    }));
  }, [acoes, secretarias]);

  const filtered = useMemo(() => {
    if (!search.trim()) return responsaveisMap;
    const q = search.toLowerCase();
    return responsaveisMap.filter(r => 
      r.nome.toLowerCase().includes(q) ||
      r.secretarias.some(s => s.nome.toLowerCase().includes(q) || s.sigla.toLowerCase().includes(q))
    );
  }, [responsaveisMap, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Gestores & Equipes Técnicas
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Responsáveis Cadastrados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lotações e quadro de coordenadores e técnicos encarregados pela execução das ações municipais
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nome do responsável ou secretaria associada..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((resp, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                  {resp.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{resp.nome}</h4>
                  <span className="text-[11px] text-slate-400">Lotação Municipal</span>
                </div>
              </div>

              {/* Secretariat Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resp.secretarias.map(sec => (
                  <span 
                    key={sec.id} 
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${sec.cor}18`, color: sec.cor }}
                  >
                    {sec.sigla}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Ações atribuídas:</span>
                <strong className="text-blue-600">{resp.actions.length}</strong>
              </div>

              {/* Mini list of actions */}
              <div className="space-y-1">
                {resp.actions.slice(0, 2).map(act => (
                  <div 
                    key={act.id} 
                    onClick={() => onSelectAction(act)}
                    className="text-[11px] p-1.5 rounded bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 truncate cursor-pointer transition-colors"
                    title={act.titulo}
                  >
                    • {act.titulo}
                  </div>
                ))}
                {resp.actions.length > 2 && (
                  <span className="text-[10px] text-slate-400 block pl-1">
                    + {resp.actions.length - 2} outras ações
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
