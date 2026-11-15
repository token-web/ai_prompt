import React from 'react';
import { PromptGroup } from '../types';
import { Camera, SplitSquareVertical } from 'lucide-react';

interface PromptCardProps {
  prompt: PromptGroup;
  accentColor?: string;
  onClick: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, accentColor = '#0e7490', onClick }) => {
  const versions = prompt.versions || [];
  const primaryVersion = versions[0];
  const allHidden = versions.length > 0 && versions.every((v) => v.hidden);
  const hasSlider = versions.some((v) => v.beforeImg && v.afterImg);
  const needsPhoto = versions.some((v) => v.photo);

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col justify-between text-left rounded-2xl bg-white p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all focus-visible:outline-2 focus-visible:outline-cyan-400 ${
        allHidden ? 'opacity-55 border-dashed border-rose-300' : ''
      }`}
      style={{
        borderTopWidth: '4px',
        borderTopColor: accentColor,
      }}
    >
      <div>
        {/* Top bar on card */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl transition-transform group-hover:scale-110 duration-200">
            {prompt.icon || '✨'}
          </span>
          <div className="flex items-center gap-1.5">
            {hasSlider && (
              <span
                className="inline-flex items-center gap-0.5 rounded-full bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 text-[10px] font-bold text-cyan-800"
                title="비포 & 애프터 비교 지원"
              >
                <SplitSquareVertical className="h-3 w-3" />
                <span>B/A</span>
              </span>
            )}
            {needsPhoto && (
              <span
                className="rounded-full bg-amber-50 p-1 text-amber-700"
                title="사진 첨부 권장"
              >
                <Camera className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors line-clamp-2 leading-snug">
          {prompt.title}
        </h3>

        {/* Tag / Description */}
        {prompt.tag && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {prompt.tag}
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[120px] font-medium text-slate-500">
          {prompt.cat}
        </span>
        {versions.length > 1 ? (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs"
            style={{ backgroundColor: accentColor }}
          >
            v{versions.length}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            {primaryVersion?.type || '이미지'}
          </span>
        )}
      </div>
    </button>
  );
};
