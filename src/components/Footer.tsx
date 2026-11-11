import React from 'react';
import { Camera, ExternalLink, Globe, Youtube, Linkedin, Shield } from 'lucide-react';

interface FooterProps {
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAdmin,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <footer className="mt-12 w-full border-t border-slate-200 bg-linear-to-b from-slate-50 to-slate-100/80 py-10 text-xs text-slate-600">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Main Card */}
        <div className="rounded-2xl bg-linear-to-br from-[#0b1f3a] to-[#14396a] p-5 sm:p-7 text-[#cfe2fa] shadow-xl">
          <p className="text-sm sm:text-base leading-relaxed">
            <strong className="text-white font-extrabold">정한열 교수 (AI Insight Lab)</strong>가{' '}
            <a
              href="https://token-web.github.io/aiinsightlab/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
            >
              AI Insight Lab
            </a>
            의 자료를 바탕으로 직접 만든 앱이며, 누구나 <strong className="text-amber-300">무료</strong>로 사용할 수 있습니다. 대림대학교 교육혁신센터.
          </p>

          {/* Promotion Banner for Album */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3.5 backdrop-blur-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300">
                <Camera className="h-4 w-4" />
              </span>
              <div>
                <b className="text-white text-xs sm:text-sm">나의 추억 앨범 만들기</b>
                <span className="block text-[11px] text-cyan-200/80">사진으로 앨범을 쉽게 만드는 무료 웹 앱</span>
              </div>
            </div>
            <a
              href="https://token-web.github.io/album/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-black text-slate-950 hover:bg-cyan-300 transition-colors shrink-0"
            >
              <span>가기</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* External Social Links */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <a
              href="https://token-web.github.io/aiinsightlab/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-300" />
              <span>프로필</span>
            </a>

            <a
              href="https://blog.naver.com/patriot_daelim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 font-semibold text-emerald-200 hover:bg-emerald-900/50 transition-colors"
            >
              <span className="font-black text-emerald-400">N</span>
              <span>블로그</span>
            </a>

            <a
              href="https://youtube.com/@aiinsightlabkr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/40 px-3 py-1 font-semibold text-rose-200 hover:bg-rose-900/50 transition-colors"
            >
              <Youtube className="h-3.5 w-3.5 text-rose-400" />
              <span>YouTube</span>
            </a>

            <a
              href="https://www.linkedin.com/in/hanyeol-jeong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0a66c2] border border-[#0a66c2] px-3 py-1 font-semibold text-white hover:bg-[#004182] transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5 text-white" />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* Copyright & Admin Trigger */}
          <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8fb0d6]">
            <span>FREE · © 2026 Hanyeol Jeong. All rights reserved.</span>
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="text-amber-300 hover:underline font-semibold"
              >
                관리자 로그아웃
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1 text-[#8fb0d6] hover:text-white underline underline-offset-2 transition-colors"
              >
                <Shield className="h-3 w-3" />
                <span>관리자 로그인</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
