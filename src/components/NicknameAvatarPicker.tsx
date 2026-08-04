import React, { useState } from 'react';
import { User, Sparkles, RefreshCw, AlertCircle, Check } from 'lucide-react';

const AVATAR_LIST = [
  { id: 'coruja', emoji: '🦉', label: 'Coruja Sábia' },
  { id: 'foguete', emoji: '🚀', label: 'Foguete Lunar' },
  { id: 'mago', emoji: '🧙‍♂️', label: 'Mago das Exatas' },
  { id: 'tigre', emoji: '🐯', label: 'Tigre Estudioso' },
  { id: 'ninja', emoji: '🥷', label: 'Ninja Focado' },
  { id: 'astronauta', emoji: '🧑‍🚀', label: 'Astronauta' },
  { id: 'leao', emoji: '🦁', label: 'Leão Determinado' },
  { id: 'cerebro', emoji: '🧠', label: 'Mente Brilhante' },
  { id: 'raio', emoji: '⚡', label: 'Raio de Energia' },
  { id: 'trofeu', emoji: '🏆', label: 'Troféu Ouro' },
  { id: 'dragao', emoji: '🐲', label: 'Dragão lendário' },
  { id: 'robo', emoji: '🤖', label: 'Robô IA' },
  { id: 'aguia', emoji: '🦅', label: 'Águia de Elite' },
  { id: 'fogo', emoji: '🔥', label: 'Chama Viva' },
  { id: 'estrela', emoji: '⭐', label: 'Estrela Guia' },
  { id: 'livro', emoji: '📚', label: 'Devorador de Livros' }
];

const NICKNAME_ADJECTIVES = ['Sábia', 'Estudioso', 'Brilhante', 'Focado', 'Rápido', 'Imparável', 'Lendário', 'Gênio', 'Curioso', 'Persistente'];
const NICKNAME_NOUNS = ['Coruja', 'Tigre', 'Mago', 'Ninja', 'Foguete', 'Fera', 'Astronauta', 'Leão', 'Águia', 'Mestre'];

interface NicknameAvatarPickerProps {
  currentNickname: string;
  currentAvatar: string;
  userRealName?: string;
  onSave: (nickname: string, avatar: string) => void;
}

export const NicknameAvatarPicker: React.FC<NicknameAvatarPickerProps> = ({
  currentNickname,
  currentAvatar,
  userRealName = '',
  onSave
}) => {
  const [nickname, setNickname] = useState(currentNickname || 'TigreEstudioso');
  const [avatar, setAvatar] = useState(currentAvatar || '🐯');
  const [errorMsg, setErrorMsg] = useState('');

  const generateRandomNickname = () => {
    const adj = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
    const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
    const num = Math.floor(Math.random() * 90 + 10);
    setNickname(`${noun}${adj}${num}`);
    setErrorMsg('');
  };

  const handleValidateAndSave = () => {
    setErrorMsg('');
    const trimmed = nickname.trim();

    if (!trimmed) {
      setErrorMsg('Por favor, informe um codinome/apelido.');
      return;
    }

    if (trimmed.length < 3) {
      setErrorMsg('O codinome deve ter pelo menos 3 caracteres.');
      return;
    }

    // Check if nickname contains user's real name (Privacy rule)
    if (userRealName && userRealName.length >= 3) {
      const realLower = userRealName.toLowerCase().split(' ')[0];
      if (realLower && trimmed.toLowerCase().includes(realLower)) {
        setErrorMsg('Por privacidade, seu codinome NÃO pode conter seu nome real.');
        return;
      }
    }

    // Basic profanity check
    const BANNED_WORDS = ['idiota', 'palavrao', 'merda', 'caralho', 'otario', 'lixo'];
    const hasProfanity = BANNED_WORDS.some(w => trimmed.toLowerCase().includes(w));
    if (hasProfanity) {
      setErrorMsg('Por favor, escolha um apelido respeitoso.');
      return;
    }

    onSave(trimmed, avatar);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-700">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 font-display">
            Seu Perfil Anônimo do Ranqueamento
          </h3>
          <p className="text-xs text-slate-500">
            Defina seu avatar e codinome. Seus colegas verão apenas estas informações!
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Nickname Generator */}
      <div className="space-y-2">
        <label className="block text-xs font-extrabold text-slate-700">Codinome Secreto *</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ex: CorujaSabia99"
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono"
          />
          <button
            type="button"
            onClick={generateRandomNickname}
            className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl text-xs font-extrabold transition flex items-center space-x-1.5 shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Gerar Aleatório</span>
          </button>
        </div>
      </div>

      {/* Avatar Emoji Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-extrabold text-slate-700">Escolha seu Avatar Emoji</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {AVATAR_LIST.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAvatar(item.emoji)}
              className={`p-3 rounded-2xl text-2xl transition border flex items-center justify-center ${
                avatar === item.emoji
                  ? 'bg-indigo-100 border-indigo-600 ring-2 ring-indigo-300 scale-105'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleValidateAndSave}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-sm transition flex items-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Salvar Perfil Anônimo</span>
        </button>
      </div>
    </div>
  );
};
