import React from 'react';
import { Plus, Download, Upload, RotateCcw, Wrench, KeyRound } from 'lucide-react';

interface AdminBarProps {
  onAddPrompt: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
  onChangePassword: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onAddPrompt,
  onExportData,
  onImportData,
  onResetData,
  onChangePassword,
}) => {
  return (
    <div className="w-full bg-[#7c2d12] text-amber-50 px-4 py-2.5 shadow-sm border-b border-amber-900/60">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <Wrench className="h-4 w-4 text-amber-300" />
          <span>관리자 모드</span>
          <span className="hidden md:inline-block text-[11px] text-amber-200/80 font-normal">
            · 추가/수정/삭제 및 깃허브용 JSON 내보내기가 가능합니다
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onAddPrompt}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-extrabold text-[#7c2d12] shadow-xs hover:bg-amber-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>프롬프트 추가</span>
          </button>

          <button
            onClick={onChangePassword}
            className="inline-flex items-center gap-1 rounded-full bg-amber-900/80 hover:bg-amber-800 border border-amber-700/80 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
            title="관리자 비밀번호 변경"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-300" />
            <span>비밀번호 변경</span>
          </button>

          <button
            onClick={onExportData}
            className="inline-flex items-center gap-1 rounded-full bg-amber-900/80 hover:bg-amber-800 border border-amber-700/80 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
            title="깃허브 저장소에 올릴 JSON 파일 다운로드"
          >
            <Download className="h-3.5 w-3.5 text-amber-300" />
            <span>JSON 내보내기</span>
          </button>

          <button
            onClick={onImportData}
            className="inline-flex items-center gap-1 rounded-full bg-amber-900/80 hover:bg-amber-800 border border-amber-700/80 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
            title="JSON 파일 업로드하여 데이터 복원"
          >
            <Upload className="h-3.5 w-3.5 text-amber-300" />
            <span>가져오기</span>
          </button>

          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 hover:bg-amber-900 border border-amber-800 px-2 py-1 text-xs text-amber-200 transition-colors"
            title="기본 샘플 데이터로 복원"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
};
