import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface TooltipHelpProps {
  title?: string;
  text: string;
  example?: string;
  inline?: boolean;
}

export const TooltipHelp: React.FC<TooltipHelpProps> = ({ title, text, example, inline = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${inline ? 'inline-flex items-center ml-1.5' : 'block'} group`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none p-0.5 rounded-full hover:bg-indigo-50 cursor-help"
        aria-label="Ajuda contextual"
      >
        <HelpCircle className="w-4 h-4 text-indigo-500" />
      </button>

      {/* Floating Tooltip Popover */}
      {isOpen && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start gap-2 mb-1">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="font-semibold text-amber-300 text-xs">{title || 'Dica do Estudei'}</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-sans">{text}</p>
          {example && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 italic">
              <strong>Exemplo:</strong> {example}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
