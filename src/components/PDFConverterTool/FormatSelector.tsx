import React from 'react';
import { FileText, Table, Presentation, FileJson, Image as ImageIcon } from 'lucide-react';

const FORMATS = [
  { id: 'docx', name: 'Word', ext: '.docx', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'xlsx', name: 'Excel', ext: '.xlsx', icon: Table, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'pptx', name: 'PowerPoint', ext: '.pptx', icon: Presentation, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 'txt', name: 'Plain Text', ext: '.txt', icon: FileJson, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'png', name: 'Images', ext: '.png', icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-400/10' },
];

interface Props {
  onSelect: (id: string) => void;
  disabled: boolean;
}

export default function FormatSelector({ onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {FORMATS.map((f) => {
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            disabled={disabled}
            onClick={() => onSelect(f.id)}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border border-border-glass bg-surface transition-all hover:border-accent hover:-translate-y-1 disabled:opacity-50 disabled:pointer-events-none group`}
          >
            <div className={`p-3 rounded-2xl ${f.bg} group-hover:scale-110 transition-transform`}>
              <Icon className={`${f.color} w-6 h-6`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">{f.name}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase">{f.ext}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
