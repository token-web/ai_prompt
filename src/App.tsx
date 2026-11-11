import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AdminBar } from './components/AdminBar';
import { CategoryFilter } from './components/CategoryFilter';
import { PromptCard } from './components/PromptCard';
import { DetailModal } from './components/DetailModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AppData, PromptGroup, PromptVersion } from './types';
import {
  loadAppData,
  saveAppData,
  checkAdminSession,
  loginAdmin,
  logoutAdmin,
  exportDataAsJson,
  importDataFromJson,
  resetToDefaults,
  setStoredAdminPassword,
} from './utils/storage';
import { Search, X, Sparkles, FolderPlus } from 'lucide-react';

const ACCENT_COLORS = [
  '#0e7490',
  '#c2410c',
  '#6d28d9',
  '#15803d',
  '#b91c1c',
  '#1d4ed8',
  '#a16207',
  '#be185d',
];

export default function App() {
  const [data, setData] = useState<AppData>(loadAppData);
  const [isAdmin, setIsAdmin] = useState<boolean>(checkAdminSession);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Detail Modal State
  const [detailPrompt, setDetailPrompt] = useState<PromptGroup | null>(null);
  const [detailVersionIndex, setDetailVersionIndex] = useState<number>(0);

  // Admin Modal State
  const [adminModalMode, setAdminModalMode] = useState<
    'login' | 'edit' | 'import' | 'changePw' | null
  >(null);
  const [editTargetPrompt, setEditTargetPrompt] = useState<PromptGroup | null>(null);
  const [editTargetVersion, setEditTargetVersion] = useState<PromptVersion | null>(null);
  const [isNewVersion, setIsNewVersion] = useState<boolean>(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Sync state with storage on update
  const updateData = (newData: AppData) => {
    setData(newData);
    saveAppData(newData);
  };

  // Filtered prompts calculation
  const filteredPrompts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = data.prompts;

    // Filter hidden versions for regular users
    if (!isAdmin) {
      list = list
        .map((p) => ({
          ...p,
          versions: p.versions.filter((v) => !v.hidden),
        }))
        .filter((p) => p.versions.length > 0);
    }

    if (q) {
      return list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const catMatch = p.cat.toLowerCase().includes(q);
        const tagMatch = p.tag.toLowerCase().includes(q);
        const bodyMatch = p.versions.some(
          (v) =>
            v.bodyKo.toLowerCase().includes(q) ||
            v.bodyEn.toLowerCase().includes(q) ||
            v.name.toLowerCase().includes(q)
        );
        return titleMatch || catMatch || tagMatch || bodyMatch;
      });
    }

    if (selectedCategory) {
      return list.filter((p) => p.cat === selectedCategory);
    }

    return list;
  }, [data.prompts, searchQuery, selectedCategory, isAdmin]);

  // Color lookup helper
  const getCatColor = (catName: string) => {
    const idx = data.categories.findIndex((c) => c.name === catName);
    return idx >= 0 ? ACCENT_COLORS[idx % ACCENT_COLORS.length] : ACCENT_COLORS[0];
  };

  // Select prompt by title (for "next step" links)
  const handleSelectPromptByTitle = (title: string) => {
    const found = data.prompts.find((p) => p.title === title);
    if (found) {
      setDetailPrompt(found);
      setDetailVersionIndex(0);
    } else {
      showToast(`'${title}' 프롬프트를 찾지 못했습니다.`);
    }
  };

  // Admin login handler
  const handleAdminLogin = (pw: string) => {
    const success = loginAdmin(pw);
    if (success) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    showToast('관리자 모드에서 로그아웃했습니다.');
  };

  // Delete version / prompt handler
  const handleDeleteVersion = (promptId: string, versionId: string) => {
    const prompt = data.prompts.find((p) => p.id === promptId);
    if (!prompt) return;

    let updatedPrompts: PromptGroup[];
    if (prompt.versions.length <= 1) {
      // Remove entire prompt group
      updatedPrompts = data.prompts.filter((p) => p.id !== promptId);
      setDetailPrompt(null);
    } else {
      // Remove just that version
      const updatedVersions = prompt.versions.filter((v) => v.id !== versionId);
      const updatedGroup = { ...prompt, versions: updatedVersions };
      updatedPrompts = data.prompts.map((p) => (p.id === promptId ? updatedGroup : p));
      setDetailPrompt(updatedGroup);
      setDetailVersionIndex(0);
    }

    updateData({ ...data, prompts: updatedPrompts });
    showToast('프롬프트가 삭제되었습니다.');
  };

  // Save prompt handler (Add / Edit / Add version)
  const handleSavePrompt = (item: {
    promptId?: string;
    versionId?: string;
    cat: string;
    title: string;
    icon: string;
    tag: string;
    name: string;
    type: '이미지 생성' | '텍스트';
    photo: boolean;
    guideKo: string;
    guideEn: string;
    bodyKo: string;
    bodyEn: string;
    beforeImg?: string;
    afterImg?: string;
    beforeLabel?: string;
    afterLabel?: string;
    next?: string;
    hidden: boolean;
  }) => {
    let updatedPrompts = [...data.prompts];
    let updatedCategories = [...data.categories];

    // Ensure category exists
    if (!updatedCategories.some((c) => c.name === item.cat)) {
      updatedCategories.push({
        name: item.cat,
        desc: '새로 추가된 카테고리',
        icon: '📁',
      });
    }

    const versionObj: PromptVersion = {
      id: item.versionId || `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: item.name || '기본',
      type: item.type,
      photo: item.photo,
      guideKo: item.guideKo,
      guideEn: item.guideEn,
      bodyKo: item.bodyKo,
      bodyEn: item.bodyEn,
      beforeImg: item.beforeImg,
      afterImg: item.afterImg,
      beforeLabel: item.beforeLabel || 'BEFORE',
      afterLabel: item.afterLabel || 'AFTER',
      next: item.next,
      hidden: item.hidden,
    };

    if (item.promptId) {
      // Existing prompt
      const pIdx = updatedPrompts.findIndex((p) => p.id === item.promptId);
      if (pIdx >= 0) {
        const existing = updatedPrompts[pIdx];
        if (item.versionId) {
          // Edit existing version
          const vIdx = existing.versions.findIndex((v) => v.id === item.versionId);
          const newVersions = [...existing.versions];
          if (vIdx >= 0) {
            newVersions[vIdx] = versionObj;
          } else {
            newVersions.push(versionObj);
          }
          updatedPrompts[pIdx] = {
            ...existing,
            cat: item.cat,
            title: item.title,
            icon: item.icon,
            tag: item.tag,
            versions: newVersions,
          };
        } else {
          // Add new version to existing prompt
          updatedPrompts[pIdx] = {
            ...existing,
            cat: item.cat,
            title: item.title,
            icon: item.icon,
            tag: item.tag,
            versions: [...existing.versions, versionObj],
          };
        }
        if (detailPrompt && detailPrompt.id === item.promptId) {
          setDetailPrompt(updatedPrompts[pIdx]);
        }
      }
    } else {
      // Completely new prompt
      const newPrompt: PromptGroup = {
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        cat: item.cat,
        title: item.title,
        icon: item.icon || '✨',
        tag: item.tag,
        versions: [versionObj],
      };
      updatedPrompts.unshift(newPrompt);
    }

    updateData({
      ...data,
      categories: updatedCategories,
      prompts: updatedPrompts,
    });
    showToast('프롬프트가 성공적으로 저장되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-[#14233a] flex flex-col font-sans selection:bg-cyan-200 selection:text-cyan-950">
      {/* Top Header */}
      <Header
        isAdmin={isAdmin}
        onOpenLogin={() => setAdminModalMode('login')}
        onLogout={handleAdminLogout}
      />

      {/* Admin Toolbar (When Admin Mode Active) */}
      {isAdmin && (
        <AdminBar
          onAddPrompt={() => {
            setEditTargetPrompt(null);
            setEditTargetVersion(null);
            setIsNewVersion(false);
            setAdminModalMode('edit');
          }}
          onExportData={() => {
            exportDataAsJson(data);
            showToast('JSON 파일이 다운로드되었습니다. GitHub에 커밋할 수 있습니다.');
          }}
          onImportData={() => setAdminModalMode('import')}
          onResetData={() => {
            if (window.confirm('모든 데이터를 기본 샘플 상태로 초기화하시겠습니까?')) {
              const res = resetToDefaults();
              setData(res);
              showToast('기본 데이터로 복원되었습니다.');
            }
          }}
          onChangePassword={() => setAdminModalMode('changePw')}
        />
      )}

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        {/* Title & Search Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                AI 프롬프트 모음
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {searchQuery
                  ? `'${searchQuery}' 검색 결과 (${filteredPrompts.length}개)`
                  : selectedCategory
                  ? `${selectedCategory} 카테고리의 추천 프롬프트입니다.`
                  : '카테고리를 고르거나 검색하여 최적의 AI 프롬프트를 찾아보세요.'}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditTargetPrompt(null);
                  setEditTargetVersion(null);
                  setIsNewVersion(false);
                  setAdminModalMode('edit');
                }}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>＋ 새 프롬프트</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프롬프트 제목, 본문, 키워드 검색..."
              aria-label="프롬프트 검색"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-xs focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="검색어 지우기"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid (Only when not actively searching & no category selected) */}
        {!searchQuery && (
          <CategoryFilter
            categories={data.categories}
            prompts={data.prompts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            accentColors={ACCENT_COLORS}
          />
        )}

        {/* Prompts Grid */}
        {(selectedCategory || searchQuery) && (
          <>
            {filteredPrompts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-12 text-center text-slate-500">
                <Sparkles className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold">조건에 맞는 프롬프트가 없습니다.</p>
                <p className="text-xs text-slate-400 mt-1">다른 키워드로 검색해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    accentColor={getCatColor(prompt.cat)}
                    onClick={() => {
                      setDetailPrompt(prompt);
                      setDetailVersionIndex(0);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        isAdmin={isAdmin}
        onOpenLogin={() => setAdminModalMode('login')}
        onLogout={handleAdminLogout}
      />

      {/* Prompt Detail Modal (with Before/After Slider & Korean/English Toggle) */}
      {detailPrompt && (
        <DetailModal
          prompt={detailPrompt}
          initialVersionIndex={detailVersionIndex}
          isAdmin={isAdmin}
          onClose={() => setDetailPrompt(null)}
          onSelectPromptByTitle={handleSelectPromptByTitle}
          onEdit={(prompt, version) => {
            setEditTargetPrompt(prompt);
            setEditTargetVersion(version);
            setIsNewVersion(false);
            setAdminModalMode('edit');
          }}
          onAddVersion={(prompt) => {
            setEditTargetPrompt(prompt);
            setEditTargetVersion(null);
            setIsNewVersion(true);
            setAdminModalMode('edit');
          }}
          onDeleteVersion={handleDeleteVersion}
          showToast={showToast}
        />
      )}

      {/* Admin Action Modal (Login, Edit/Add, Import, Change Password) */}
      {adminModalMode && (
        <AdminModal
          mode={adminModalMode}
          categories={data.categories}
          targetPrompt={editTargetPrompt}
          targetVersion={editTargetVersion}
          isNewVersion={isNewVersion}
          activeCategory={selectedCategory}
          onClose={() => {
            setAdminModalMode(null);
            setEditTargetPrompt(null);
            setEditTargetVersion(null);
            setIsNewVersion(false);
          }}
          onLogin={handleAdminLogin}
          onSavePrompt={handleSavePrompt}
          onImportJson={(jsonStr) => {
            const imported = importDataFromJson(jsonStr);
            setData(imported);
          }}
          onChangePassword={(newPw) => setStoredAdminPassword(newPw)}
          showToast={showToast}
        />
      )}

      {/* Notification Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
