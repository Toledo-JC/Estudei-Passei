import React, { useState } from 'react';
import { SchoolConfig, PeriodType, RecoveryType, RecoveryCalc } from '../types';
import { TooltipHelp } from './TooltipHelp';
import { useToast } from '../contexts/ToastContext';
import { Settings, CheckCircle2, Sliders, ShieldAlert, Plus, Trash2 } from 'lucide-react';

interface SchoolConfigSectionProps {
  config: SchoolConfig;
  onSaveConfig: (newConfig: SchoolConfig) => void;
}

export const SchoolConfigSection: React.FC<SchoolConfigSectionProps> = ({ config, onSaveConfig }) => {
  const [formData, setFormData] = useState<SchoolConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { showSuccessToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    showSuccessToast('Regras Salvas!', 'Configurações e composição de pesos do DNA Escolar gravados com sucesso.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCategoryChange = (index: number, field: string, value: any) => {
    const updated = [...formData.evalCategories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, evalCategories: updated });
  };

  const addCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'Nova Categoria (A3)',
      weightPercent: 10,
      maxScore: formData.maxScorePerPeriod,
      description: 'Descrição da avaliação'
    };
    setFormData({
      ...formData,
      evalCategories: [...formData.evalCategories, newCat]
    });
  };

  const removeCategory = (id: string) => {
    if (formData.evalCategories.length <= 1) return;
    setFormData({
      ...formData,
      evalCategories: formData.evalCategories.filter(c => c.id !== id)
    });
  };

  const totalWeight = formData.evalCategories.reduce((acc, curr) => acc + (Number(curr.weightPercent) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
            <Sliders className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">Configurador de Regras & DNA Escolar</h2>
            <p className="text-xs text-slate-300">
              Personalize os parâmetros burocráticos exatos da sua instituição com auxílio contextual.
            </p>
          </div>
        </div>
        {savedSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Regras salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6 text-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Estrutura do Período */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <span>Estrutura de Período</span>
              <TooltipHelp
                title="Bimestres x Trimestres"
                text="Determine como o ano letivo da sua escola é dividido. O sistema irá criar automaticamente 4 períodos para bimestres ou 3 para trimestres."
                example="A maioria das escolas privadas adota 4 Bimestres."
              />
            </label>
            <select
              value={formData.periodType}
              onChange={(e) => setFormData({ ...formData, periodType: e.target.value as PeriodType })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="bimestre">4 Bimestres (Ano dividido em 4 etapas)</option>
              <option value="trimestre">3 Trimestres (Ano dividido em 3 etapas)</option>
            </select>
          </div>

          {/* 2. Nota de Corte (Média para Passar) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <span>Média de Corte (Passar Direto)</span>
              <TooltipHelp
                title="Média de Corte"
                text="É a nota mínima exigida no boletim para aprovação direta em cada período ou no fim do ano sem precisar de prova de recuperação."
                example="Geralmente 6,0 ou 7,0 pontos."
              />
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="100"
              value={formData.passingScore}
              onChange={(e) => setFormData({ ...formData, passingScore: parseFloat(e.target.value) || 6.0 })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 3. Valor Máximo do Período */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <span>Valor Máximo do Bimestre/Trimestre</span>
              <TooltipHelp
                title="Valor Máximo do Bimestre"
                text="É a nota máxima que vale o seu boletim neste período, geralmente 10 pontos. Confira no manual do aluno se há divisões diferentes."
                example="Muitas escolas usam escala de 0 a 10,0 ou de 0 a 100."
              />
            </label>
            <input
              type="number"
              step="1"
              min="10"
              max="1000"
              value={formData.maxScorePerPeriod}
              onChange={(e) => setFormData({ ...formData, maxScorePerPeriod: parseFloat(e.target.value) || 10.0 })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 4. Regra de Recuperação */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <span>Frequência da Recuperação</span>
              <TooltipHelp
                title="Período da Recuperação"
                text="Indica em quais momentos da rotina a escola aplica provas de recuperação de nota."
                example="Bimestral se houver prova no fim de cada bimestre; Semestral se for a cada dois bimestres."
              />
            </label>
            <select
              value={formData.recoveryType}
              onChange={(e) => setFormData({ ...formData, recoveryType: e.target.value as RecoveryType })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="bimestral">Recuperação Bimestral (A cada período)</option>
              <option value="semestral">Recuperação Semestral</option>
              <option value="ambas">Bimestral e Paralela de Fim de Ano</option>
              <option value="nenhuma">Sem recuperação intermediária</option>
            </select>
          </div>

          {/* 5. Forma de Cálculo da Recuperação */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 md:col-span-2 lg:col-span-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <span>Cálculo da Nota de Recuperação</span>
              <TooltipHelp
                title="Substitutiva vs Média"
                text="Se você tirar nota maior na recuperação: 'Substitutiva' troca a nota antiga inteira pela nova. 'Média' faz a média aritmética entre a nota antiga e a prova de recuperação."
                example="Se você tinha 4.0 e tirou 8.0 na recuperação: Substitutiva vira 8.0; Média vira (4+8)/2 = 6.0."
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <label className={`p-3 rounded-lg border cursor-pointer transition flex items-start space-x-3 ${
                formData.recoveryCalculation === 'substitutiva'
                  ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <input
                  type="radio"
                  name="recoveryCalc"
                  checked={formData.recoveryCalculation === 'substitutiva'}
                  onChange={() => setFormData({ ...formData, recoveryCalculation: 'substitutiva' })}
                  className="mt-0.5 text-indigo-600"
                />
                <div className="text-xs">
                  <span className="block font-bold">Nota Substitutiva (Substitui a menor)</span>
                  <span className="text-[11px] text-slate-500">A maior nota prevalece no boletim.</span>
                </div>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer transition flex items-start space-x-3 ${
                formData.recoveryCalculation === 'media'
                  ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <input
                  type="radio"
                  name="recoveryCalc"
                  checked={formData.recoveryCalculation === 'media'}
                  onChange={() => setFormData({ ...formData, recoveryCalculation: 'media' })}
                  className="mt-0.5 text-indigo-600"
                />
                <div className="text-xs">
                  <span className="block font-bold">Média Simples (Soma e divide)</span>
                  <span className="text-[11px] text-slate-500">Faz a média entre a nota original e a prova.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Divisão de Pesos de Avaliações */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <span>Composição e Pesos das Avaliações por Período</span>
                <TooltipHelp
                  title="Pesos de Avaliações"
                  text="Como a nota do bimestre é composta na sua escola. Exemplo: Prova A1 vale 70% e Trabalhos A2 valem 30%. O total deve somar 100%."
                  example="A1 (Prova) = 70%, A2 (Trabalho) = 30%."
                />
              </h3>
              <p className="text-xs text-slate-500">
                Soma atual dos pesos: <strong className={totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'}>{totalWeight}%</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Categoria</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.evalCategories.map((cat, idx) => (
              <div key={cat.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex-1 w-full">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Nome da Categoria</span>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleCategoryChange(idx, 'name', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Prova Escrita A1"
                  />
                </div>

                <div className="w-full sm:w-32">
                  <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center">
                    <span>Peso (%)</span>
                    <TooltipHelp text="Percentual que esta prova representa no total do período." />
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={cat.weightPercent}
                    onChange={(e) => handleCategoryChange(idx, 'weightPercent', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="w-full sm:w-32">
                  <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center">
                    <span>Valor Máx.</span>
                    <TooltipHelp text="Nota máxima que esta avaliação vale individualmente." />
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    value={cat.maxScore}
                    onChange={(e) => handleCategoryChange(idx, 'maxScore', parseFloat(e.target.value) || 10.0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {formData.evalCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(cat.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition shrink-0 self-end sm:self-center"
                    title="Remover categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {totalWeight !== 100 && (
            <div className="mt-3 flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Atenção: A soma dos pesos é de {totalWeight}%. Recomenda-se ajustar para fechar exatamente em 100%.
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow border border-indigo-500/30 transition flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Configuração do DNA Escolar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
