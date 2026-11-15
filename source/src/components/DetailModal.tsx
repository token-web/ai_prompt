import React, { useState, useEffect } from 'react';
import { PromptGroup, PromptVersion } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import {
  Copy,
  Download,
  Edit3,
  Trash2,
  Plus,
  Camera,
  Check,
  Languages,
  ArrowRight,
  X,
} from 'lucide-react';

interface DetailModalProps {
  prompt: PromptGroup;
  initialVersionIndex?: number;
  isAdmin: boolean;
  onClose: () => void;
  onSelectPromptByTitle: (title: string) => void;
  onEdit: (prompt: PromptGroup, version: PromptVersion) => void;
  onAddVersion: (prompt: PromptGroup) => void;
  onDeleteVersion: (promptId: string, versionId: string) => void;
  showToast: (msg: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  prompt,
  initialVersionIndex = 0,
  isAdmin,
  onClose,
  onSelectPromptByTitle,
  onEdit,
  onAddVersion,
  onDeleteVersion,
  showToast,
}) => {
  const [versionIdx, setVersionIdx] = useState<number>(initialVersionIndex);
  const [activeLang, setActiveLang] = useState<'ko' | 'en'>('ko');
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const versions = prompt.versions || [];
  const currentVersion: PromptVersion | undefined = versions[versionIdx] || versions[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!currentVersion) return null;

  const currentBody = activeLang === 'ko' ? currentVersion.bodyKo : (currentVersion.bodyEn || currentVersion.bodyKo);
  const currentGuide = activeLang === 'ko' ? currentVersion.guideKo : (currentVersion.guideEn || currentVersion.guideKo);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentBody);
      } else {
        const ta = document.createElement('textarea');
        ta.value = currentBody;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      showToast(`${activeLang === 'ko' ? '한글' : '영문'} 프롬프트가 복사되었습니다!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('클립보드 복사에 실패했습니다. 텍스트 저장을 이용하세요.');
    }
  };

  const handleDownload = () => {
    const langLabel = activeLang === 'ko' ? 'KR' : 'EN';
    const filename = `${prompt.title}_${currentVersion.name}_${langLabel}.txt`.replace(/[\\/:*?"<>|]/g, '');
    const blob = new Blob(['\uFEFF' + currentBody], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${filename} 파일이 다운로드되었습니다.`);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3500);
      return;
    }
    onDeleteVersion(prompt.id, currentVersion.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-prompt-title"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-7 shadow-2xl transition-all border border-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {prompt.cat}
            </span>
            <h2
              id="modal-prompt-title"
              className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2"
            >
              <span>{prompt.icon}</span>
              <span>{prompt.title}</span>
              {currentVersion.hidden && (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  비공개
                </span>
              )}
            </h2>
            {prompt.tag && (
              <p className="text-xs text-slate-500 mt-0.5">{prompt.tag}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Versions Tabs (if more than 1) */}
        {versions.length > 1 && (
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            {versions.map((ver, idx) => (
              <button
                key={ver.id || idx}
                onClick={() => setVersionIdx(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  idx === versionIdx
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ver.name}
                {ver.hidden && ' (비공개)'}
              </button>
            ))}
          </div>
        )}

        {/* Before / After Comparison Slider */}
        {(currentVersion.beforeImg || currentVersion.afterImg) && (
          <div className="mt-1">
            <BeforeAfterSlider
              beforeImg={currentVersion.beforeImg}
              afterImg={currentVersion.afterImg}
              beforeLabel={currentVersion.beforeLabel || 'BEFORE'}
              afterLabel={currentVersion.afterLabel || 'AFTER'}
            />
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md bg-blue-50 border border-blue-200/60 px-2.5 py-1 font-bold text-blue-700">
            {currentVersion.type || '이미지 생성'}
          </span>
          {currentVersion.photo && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-2.5 py-1 font-bold text-amber-800">
              <Camera className="h-3.5 w-3.5" />
              <span>사진 첨부 권장</span>
            </span>
          )}
        </div>

        {/* Korean / English Prompt Language Toggle */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Languages className="h-4 w-4 text-cyan-600" />
              <span>언어 선택</span>
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg">
              <button
                onClick={() => setActiveLang('ko')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  activeLang === 'ko'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇰🇷 한글 프롬프트
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  activeLang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇺🇸 English Prompt
              </button>
            </div>
          </div>

          {/* Guide note if present */}
          {currentGuide && (
            <div className="mb-2.5 rounded-lg bg-cyan-50/80 border-l-3 border-cyan-500 px-3 py-2 text-xs text-cyan-900 leading-relaxed">
              <span className="font-bold mr-1">💡 안내:</span>
              <span>{currentGuide}</span>
            </div>
          )}

          {/* Prompt Body */}
          <div className="relative group">
            <pre className="max-h-[36vh] overflow-y-auto rounded-xl bg-[#0b1f3a] p-3.5 sm:p-4 text-xs sm:text-sm text-cyan-50 font-mono leading-relaxed whitespace-pre-wrap break-words border border-slate-800">
              {currentBody}
            </pre>
          </div>
        </div>

        {/* User Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#0b1f3a] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#133058] active:scale-98 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? '복사 완료!' : activeLang === 'ko' ? '한글 복사하기' : 'Copy English'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>텍스트 저장</span>
          </button>
        </div>

        {/* Next step link */}
        {currentVersion.next && (
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-600">다음 단계 추천:</span>
            <button
              onClick={() => onSelectPromptByTitle(currentVersion.next!)}
              className="inline-flex items-center gap-1 font-bold text-cyan-700 hover:text-cyan-900 underline underline-offset-2"
            >
              <span>{currentVersion.next}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mt-2 pt-3 border-t border-dashed border-amber-300/80 bg-amber-50/60 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 rounded-b-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-amber-900">관리자 전용 기능:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(prompt, currentVersion)}
                className="inline-flex items-center gap-1 rounded-md bg-white border border-amber-300 px-3 py-1.5 font-bold text-slate-800 hover:bg-amber-100 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-700" />
                <span>수정</span>
              </button>

              <button
                onClick={() => onAddVersion(prompt)}
                className="inline-flex items-center gap-1 rounded-md bg-white border border-amber-300 px-3 py-1.5 font-bold text-slate-800 hover:bg-amber-100 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-amber-700" />
                <span>버전 추가</span>
              </button>

              <button
                onClick={handleDelete}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 font-bold transition-all ${
                  confirmDelete
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmDelete ? '한 번 더 누르면 삭제' : '삭제'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
