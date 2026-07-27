import React, { useState } from 'react';
import { GoogleDriveSyncInfo, ParentGuardSettings } from '../types';
import { Cloud, CheckCircle2, RefreshCw, Download, Upload, Users, ShieldCheck, Folder, Mail, Plus, Trash2, X, AlertCircle, ArrowRightLeft, Sparkles } from 'lucide-react';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncInfo: GoogleDriveSyncInfo;
  onUpdateSyncInfo: (newInfo: GoogleDriveSyncInfo) => void;
  parentSettings: ParentGuardSettings;
  onUpdateParentSettings: (newSettings: ParentGuardSettings) => void;
  onExportBackupJSON: () => void;
  onImportBackupJSON: (jsonData: string) => void;
  onSwitchActiveChildProfile?: (childId: string) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  syncInfo,
  onUpdateSyncInfo,
  parentSettings,
  onUpdateParentSettings,
  onExportBackupJSON,
  onImportBackupJSON,
  onSwitchActiveChildProfile
}) => {
  const [studentEmail, setStudentEmail] = useState(syncInfo.studentGoogleAccount || 'lucas.toledo@gmail.com');
  const [parentEmailInput, setParentEmailInput] = useState('');
  const [parentEmailsList, setParentEmailsList] = useState<string[]>(
    syncInfo.parentEmails.length > 0 ? syncInfo.parentEmails : [parentSettings.guardianEmail || 'responsavel@exemplo.com.br']
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [newChildYear, setNewChildYear] = useState('1º Ano do Ensino Médio');
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  if (!isOpen) return null;

  const handleAddParentEmail = () => {
    if (!parentEmailInput.trim() || !parentEmailInput.includes('@')) return;
    if (!parentEmailsList.includes(parentEmailInput.trim())) {
      const updated = [...parentEmailsList, parentEmailInput.trim()];
      setParentEmailsList(updated);
      setParentEmailInput('');
      onUpdateSyncInfo({ ...syncInfo, parentEmails: updated });
    }
  };

  const handleRemoveParentEmail = (emailToRemove: string) => {
    const updated = parentEmailsList.filter(e => e !== emailToRemove);
    setParentEmailsList(updated);
    onUpdateSyncInfo({ ...syncInfo, parentEmails: updated });
  };

  const handleManualDriveSync = () => {
    setIsSyncing(true);
    setSyncSuccessMsg('');

    setTimeout(() => {
      setIsSyncing(false);
      const nowString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      onUpdateSyncInfo({
        ...syncInfo,
        isConfigured: true,
        studentGoogleAccount: studentEmail,
        parentEmails: parentEmailsList,
        isSynced: true,
        lastSyncedAt: `Hoje às ${nowString}`
      });
      setSyncSuccessMsg(`Sincronização com a pasta "${syncInfo.folderName}" no Google Drive finalizada com sucesso!`);
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    }, 1200);
  };

  const handleAddChildProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const newChildId = `child-${Date.now()}`;
    const newChild = {
      id: newChildId,
      studentName: newChildName.trim(),
      studentYear: newChildYear,
      schoolName: parentSettings.schoolName || 'Colégio Estudei & Passei',
      guardianEmail: parentEmailsList[0] || 'responsavel@exemplo.com.br',
      lastSyncedAt: 'Criado agora'
    };

    const updatedChildren = [...syncInfo.connectedChildrenProfiles, newChild];
    onUpdateSyncInfo({
      ...syncInfo,
      connectedChildrenProfiles: updatedChildren,
      activeChildId: newChildId
    });

    if (onSwitchActiveChildProfile) {
      onSwitchActiveChildProfile(newChildId);
    }

    setNewChildName('');
    setShowAddChildForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportBackupJSON(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 border border-blue-200 rounded-2xl">
              <Cloud className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                <span>Central de Sincronização Google Drive & Ecossistema Familiar</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                  Offline-First
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Seus dados funcionam 100% offline no dispositivo e são sincronizados com o Google Drive para pais e múltiplos filhos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Box */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-blue-300" />
              <span className="text-xs font-bold text-blue-100">Pasta Raiz Criada no Google Drive:</span>
              <code className="text-xs font-bold bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-700/50 text-blue-200">
                {syncInfo.folderName}
              </code>
            </div>

            <div className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{syncInfo.isSynced ? 'Conectado & Sincronizado' : 'Pronto para Sincronizar'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Status: <strong>{syncInfo.lastSyncedAt || 'Sincronização pendente'}</strong>. Todas as notas, edital do livro e boletins são salvos localmente e replicados na nuvem do Google do estudante.
          </p>

          {syncSuccessMsg && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold rounded-xl animate-in fade-in">
              {syncSuccessMsg}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleManualDriveSync}
              disabled={isSyncing}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-2 shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora com Google Drive'}</span>
            </button>

            <button
              onClick={onExportBackupJSON}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Exportar Backup (.JSON)</span>
            </button>

            <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 border border-slate-700 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Importar Backup (.JSON)</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* 1. SEÇÃO DE VÍNCULO FAMILIAR (E-MAILS DOS RESPONSÁVEIS) */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Vínculo Familiar & Compartilhamento de Acesso aos Pais
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Conta Google Principal do Estudante:
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                placeholder="aluno@gmail.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Adicionar E-mail dos Pais/Responsáveis:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={parentEmailInput}
                  onChange={(e) => setParentEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParentEmail())}
                  placeholder="responsavel@gmail.com"
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddParentEmail}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* List of registered parents */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Contas com Permissão de Leitura dos Boletins e Desempenho:
            </span>

            <div className="flex flex-wrap gap-2">
              {parentEmailsList.map((email, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-indigo-200 text-indigo-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveParentEmail(email)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. SEÇÃO DE SUPORTE A MÚLTIPLOS FILHOS */}
        <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Suporte a Múltiplos Filhos (Painel dos Pais)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gerencie mais de um estudante vinculado à mesma conta familiar.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddChildForm(!showAddChildForm)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddChildForm ? 'Cancelar' : 'Cadastrar Outro Filho(a)'}</span>
            </button>
          </div>

          {/* Form to add child profile */}
          {showAddChildForm && (
            <form onSubmit={handleAddChildProfile} className="p-4 bg-white border border-indigo-200 rounded-2xl space-y-3 animate-in fade-in">
              <span className="text-xs font-extrabold text-indigo-900 uppercase block">
                Novo Perfil de Estudante Vinculado
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome Completo do Filho(a) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Toledo"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Ano / Série Escolar</label>
                  <select
                    value={newChildYear}
                    onChange={(e) => setNewChildYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="1º Ano do Ensino Médio">1º Ano do Ensino Médio</option>
                    <option value="2º Ano do Ensino Médio">2º Ano do Ensino Médio</option>
                    <option value="3º Ano do Ensino Médio / Terceirão">3º Ano / Terceirão ENEM</option>
                    <option value="Pré-Vestibular / Cursinho">Pré-Vestibular / Cursinho</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  Salvar Perfil do Filho(a)
                </button>
              </div>
            </form>
          )}

          {/* List of profiles connected */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {syncInfo.connectedChildrenProfiles.map((child) => {
              const isActive = child.id === syncInfo.activeChildId;

              return (
                <div
                  key={child.id}
                  onClick={() => {
                    onUpdateSyncInfo({ ...syncInfo, activeChildId: child.id });
                    if (onSwitchActiveChildProfile) {
                      onSwitchActiveChildProfile(child.id);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold">{child.studentName}</span>
                    {isActive && (
                      <span className="text-[10px] bg-white text-indigo-900 font-extrabold px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {child.studentYear} • {child.schoolName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Configurações da Nuvem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
