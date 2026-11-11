import React from 'react';
import { Camera, Shield, LogOut } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-linear-to-r from-[#0b1f3a] via-[#102d52] to-[#12335c] text-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://token-web.github.io/aiinsightlab/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            title="AI Insight Lab 바로가기"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 font-black text-slate-950 shadow-xs">
              <span className="text-sm tracking-tighter">HY</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold tracking-wider text-white">AIINSIGHT</span>
              <span className="rounded-full bg-amber-300/90 px-2 py-0.5 text-[11px] font-bold text-amber-950">
                무료 앱
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2 & 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://token-web.github.io/album/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xs hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0"
          >
            <Camera className="h-4 w-4" />
            <span>앨범 만들기</span>
          </a>

          {isAdmin ? (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 rounded-full bg-rose-950/80 border border-rose-500/50 px-3 py-1.5 text-xs font-bold text-rose-200 hover:bg-rose-900 transition-colors"
              title="관리자 로그아웃"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
              title="관리자 로그인"
            >
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>관리자</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
