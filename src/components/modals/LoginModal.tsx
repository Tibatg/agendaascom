import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  intentMessage: string;
  onClose: () => void;
  onLogin: (email: string, pass: string) => boolean;
  onQuickLogin: (role: 'Administrador' | 'Editor') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  intentMessage,
  onClose,
  onLogin,
  onQuickLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError('Credenciais incorretas. Verifique seu e-mail e senha institucional.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">
              ACESSO RESTRITO
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {intentMessage && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-800 dark:text-blue-300">
            {intentMessage}
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold block mb-1">E-mail Institucional *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ascomitapecuru@gmail.com"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Senha de Acesso *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Entrar
            </button>
          </div>
        </form>

        {/* Quick Login for convenience in review & testing */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px] block">Acesso Rápido de Demonstração:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQuickLogin('Administrador')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-left cursor-pointer transition-colors"
            >
              <div className="font-bold text-blue-700 dark:text-blue-300 text-[11px]">Administrador (ASCOM)</div>
              <div className="text-[10px] text-slate-400">Acesso total</div>
            </button>
            <button
              type="button"
              onClick={() => onQuickLogin('Editor')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 text-left cursor-pointer transition-colors"
            >
              <div className="font-bold text-amber-700 dark:text-amber-300 text-[11px]">Editor Setorial</div>
              <div className="text-[10px] text-slate-400">Edição e cadastro</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
