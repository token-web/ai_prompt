import React, { useState, useEffect } from 'react';
import { PromptGroup, PromptVersion, Category } from '../types';
import { fileToCompressedDataUrl, verifyAdminPassword } from '../utils/storage';
import { X, Upload, Lock, KeyRound, Image as ImageIcon, Trash2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminModalProps {
  mode: 'login' | 'edit' | 'import' | 'changePw';
  categories: Category[];
  targetPrompt?: PromptGroup | null;
  targetVersion?: PromptVersion | null;
  isNewVersion?: boolean;
  activeCategory?: string | null;
  onClose: () => void;
  onLogin: (password: string) => boolean;
  onSavePrompt: (data: {
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
  }) => void;
  onImportJson: (jsonStr: string) => void;
  onChangePassword: (newPw: string) => void;
  showToast: (msg: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  mode,
  categories,
  targetPrompt,
  targetVersion,
  isNewVersion = false,
  activeCategory,
  onClose,
  onLogin,
  onSavePrompt,
  onImportJson,
  onChangePassword,
  showToast,
}) => {
  // Login State
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Change Password State
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [showCurrentPw, setShowCurrentPw] = useState<boolean>(false);
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [changePwError, setChangePwError] = useState<string>('');

  // Form State
  const isEditing = Boolean(targetPrompt && targetVersion && !isNewVersion);
  const [cat, setCat] = useState<string>(targetPrompt?.cat || activeCategory || categories[0]?.name || '인물 & 프로필');
  const [title, setTitle] = useState<string>(targetPrompt?.title || '');
  const [icon, setIcon] = useState<string>(targetPrompt?.icon || '✨');
  const [tag, setTag] = useState<string>(targetPrompt?.tag || '');
  const [name, setName] = useState<string>(isNewVersion ? '추가 버전' : targetVersion?.name || '기본');
  const [type, setType] = useState<'이미지 생성' | '텍스트'>(targetVersion?.type || '이미지 생성');
  const [photo, setPhoto] = useState<boolean>(targetVersion?.photo ?? true);
  const [guideKo, setGuideKo] = useState<string>(targetVersion?.guideKo || '');
  const [guideEn, setGuideEn] = useState<string>(targetVersion?.guideEn || '');
  const [bodyKo, setBodyKo] = useState<string>(targetVersion?.bodyKo || '');
  const [bodyEn, setBodyEn] = useState<string>(targetVersion?.bodyEn || '');
  const [beforeImg, setBeforeImg] = useState<string | undefined>(targetVersion?.beforeImg);
  const [afterImg, setAfterImg] = useState<string | undefined>(targetVersion?.afterImg);
  const [beforeLabel, setBeforeLabel] = useState<string>(targetVersion?.beforeLabel || 'BEFORE');
  const [afterLabel, setAfterLabel] = useState<string>(targetVersion?.afterLabel || 'AFTER');
  const [next, setNext] = useState<string>(targetVersion?.next || '');
  const [hidden, setHidden] = useState<boolean>(targetVersion?.hidden ?? false);

  // Active form tab: Ko vs En vs Media
  const [formTab, setFormTab] = useState<'ko' | 'en' | 'media'>('ko');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // JSON Import State
  const [jsonText, setJsonText] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError('비밀번호를 입력하세요.');
      return;
    }
    const success = onLogin(passwordInput.trim());
    if (success) {
      showToast('관리자 모드로 로그인되었습니다.');
      onClose();
    } else {
      setLoginError('비밀번호가 올바르지 않습니다.');
    }
  };

  // Handle Image Upload
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('이미지 처리 중...');
      const dataUrl = await fileToCompressedDataUrl(file);
      if (target === 'before') {
        setBeforeImg(dataUrl);
      } else {
        setAfterImg(dataUrl);
      }
      showToast('이미지가 등록되었습니다.');
    } catch {
      showToast('이미지 압축에 실패했습니다.');
    }
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cat.trim() || !title.trim() || !bodyKo.trim()) {
      showToast('카테고리, 제목, 한글 프롬프트는 필수 입력 항목입니다.');
      return;
    }

    setIsProcessing(true);
    onSavePrompt({
      promptId: isNewVersion ? targetPrompt?.id : targetPrompt?.id,
      versionId: isNewVersion ? undefined : targetVersion?.id,
      cat: cat.trim(),
      title: title.trim(),
      icon: icon.trim() || '✨',
      tag: tag.trim(),
      name: name.trim() || '기본',
      type,
      photo,
      guideKo: guideKo.trim(),
      guideEn: guideEn.trim(),
      bodyKo: bodyKo.trim(),
      bodyEn: bodyEn.trim(),
      beforeImg,
      afterImg,
      beforeLabel: beforeLabel.trim() || 'BEFORE',
      afterLabel: afterLabel.trim() || 'AFTER',
      next: next.trim(),
      hidden,
    });
    setIsProcessing(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 1. Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-3">
              <div className="rounded-lg bg-cyan-100 p-2 text-cyan-800">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">관리자 모드 로그인</h3>
                <p className="text-xs text-slate-500">프롬프트 추가, 수정 및 삭제 권한을 얻습니다.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                관리자 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="비밀번호를 입력하세요"
                  autoFocus
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showLoginPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginError && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600">{loginError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#0b1f3a] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#133058] shadow-sm"
              >
                로그인
              </button>
            </div>
          </form>
        )}

        {/* 2. Change Password Mode */}
        {mode === 'changePw' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!currentPasswordInput.trim()) {
                setChangePwError('현재 비밀번호를 입력해 주세요.');
                return;
              }
              if (!verifyAdminPassword(currentPasswordInput.trim())) {
                setChangePwError('현재 비밀번호가 일치하지 않습니다.');
                return;
              }
              if (newPasswordInput.trim().length < 4) {
                setChangePwError('새 비밀번호를 4자 이상 입력해 주세요.');
                return;
              }
              if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
                setChangePwError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
              }
              onChangePassword(newPasswordInput.trim());
              showToast('관리자 비밀번호가 안전하게 변경되었습니다.');
              onClose();
            }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">관리자 비밀번호 변경</h3>
                <p className="text-xs text-slate-500">현재 비밀번호를 확인 후 새로운 비밀번호로 변경합니다.</p>
              </div>
            </div>

            {changePwError && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">
                {changePwError}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">현재 비밀번호</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPasswordInput}
                  onChange={(e) => {
                    setCurrentPasswordInput(e.target.value);
                    setChangePwError('');
                  }}
                  placeholder="현재 비밀번호 입력"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-sm focus:border-cyan-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호 (4자 이상)</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    setChangePwError('');
                  }}
                  placeholder="새로운 비밀번호 입력"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-sm focus:border-cyan-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={(e) => {
                  setConfirmPasswordInput(e.target.value);
                  setChangePwError('');
                }}
                placeholder="새로운 비밀번호 재입력"
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-cyan-500 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#0b1f3a] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#133058] shadow-sm"
              >
                비밀번호 저장
              </button>
            </div>
          </form>
        )}

        {/* 3. JSON Import Mode */}
        {mode === 'import' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Upload className="h-5 w-5 text-cyan-600" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">프롬프트 데이터 가져오기 (JSON)</h3>
                <p className="text-xs text-slate-500">JSON 파일을 직접 업로드하거나 붙여넣어 데이터를 동기화합니다.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">JSON 파일 선택</label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const text = ev.target?.result as string;
                    setJsonText(text);
                  };
                  reader.readAsText(file);
                }}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">또는 JSON 텍스트 직접 입력</label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={8}
                placeholder='{"categories": [...], "prompts": [...]}'
                className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs focus:border-cyan-500 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (!jsonText.trim()) {
                    showToast('가져올 JSON 데이터를 입력하거나 파일을 선택하세요.');
                    return;
                  }
                  try {
                    onImportJson(jsonText);
                    showToast('성공적으로 데이터를 가져왔습니다.');
                    onClose();
                  } catch (e: any) {
                    showToast(e.message || 'JSON 형식이 올바르지 않습니다.');
                  }
                }}
                className="rounded-full bg-[#0b1f3a] px-5 py-2 text-xs font-bold text-white hover:bg-[#133058]"
              >
                데이터 적용
              </button>
            </div>
          </div>
        )}

        {/* 4. Edit / Add Prompt Mode */}
        {mode === 'edit' && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-lg font-extrabold text-slate-900">
                {isNewVersion
                  ? `"${targetPrompt?.title}" 버전 추가`
                  : isEditing
                  ? '프롬프트 수정'
                  : '새 프롬프트 추가'}
              </h3>
              <p className="text-xs text-slate-500">한글과 영문 프롬프트, 비포/애프터 이미지를 입력하세요.</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">카테고리 *</label>
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  list="cat-suggestions"
                  placeholder="예: 인물 & 프로필"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 focus:border-cyan-500 outline-hidden"
                />
                <datalist id="cat-suggestions">
                  {categories.map((c) => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">제목 (8~15자 권장) *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 스튜디오 자연광 감성 프로필"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 focus:border-cyan-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">한줄설명 (목록 타일에 표시)</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="예: 잡지 표지급 시네마틱 스튜디오 프로필"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 focus:border-cyan-500 outline-hidden"
                />
              </div>

              <div className="flex gap-2">
                <div className="w-24">
                  <label className="block font-bold text-slate-700 mb-1">아이콘</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="✨"
                    className="w-full text-center rounded-lg border border-slate-300 px-2 py-1.5 focus:border-cyan-500 outline-hidden"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-bold text-slate-700 mb-1">버전명</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 기본, 상세, 초고화질"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 focus:border-cyan-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Quick Settings */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">유형</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5"
                >
                  <option value="이미지 생성">이미지 생성</option>
                  <option value="텍스트">텍스트</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">사진 필요 여부</label>
                <select
                  value={photo ? 'true' : 'false'}
                  onChange={(e) => setPhoto(e.target.value === 'true')}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5"
                >
                  <option value="true">필요 (사진 첨부 권장)</option>
                  <option value="false">불필요</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">공개 상태</label>
                <select
                  value={hidden ? 'true' : 'false'}
                  onChange={(e) => setHidden(e.target.value === 'true')}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5"
                >
                  <option value="false">공개</option>
                  <option value="true">비공개 (관리자만 보기)</option>
                </select>
              </div>
            </div>

            {/* Sub Tabs: 한글 프롬프트 / 영문 프롬프트 / 비포애프터 사진 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-100/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFormTab('ko')}
                  className={`flex-1 py-2 px-3 text-center transition-colors ${
                    formTab === 'ko' ? 'bg-white text-slate-900 border-b-2 border-cyan-500' : 'text-slate-500'
                  }`}
                >
                  🇰🇷 한글 프롬프트
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab('en')}
                  className={`flex-1 py-2 px-3 text-center transition-colors ${
                    formTab === 'en' ? 'bg-white text-slate-900 border-b-2 border-cyan-500' : 'text-slate-500'
                  }`}
                >
                  🇺🇸 영문 프롬프트
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab('media')}
                  className={`flex-1 py-2 px-3 text-center transition-colors ${
                    formTab === 'media' ? 'bg-white text-slate-900 border-b-2 border-cyan-500' : 'text-slate-500'
                  }`}
                >
                  🖼️ 비포/애프터 사진
                </button>
              </div>

              <div className="p-3.5 space-y-3">
                {formTab === 'ko' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        한글 안내문 (바꿀 곳 [괄호] 설명)
                      </label>
                      <input
                        type="text"
                        value={guideKo}
                        onChange={(e) => setGuideKo(e.target.value)}
                        placeholder="예: 인물 사진을 업로드한 후, [인물 특징], [의상 색상]을 수정하세요."
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-cyan-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        한글 프롬프트 본문 *
                      </label>
                      <textarea
                        value={bodyKo}
                        onChange={(e) => setBodyKo(e.target.value)}
                        rows={7}
                        placeholder="한글 프롬프트를 입력하세요..."
                        required
                        className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs focus:border-cyan-500 outline-hidden"
                      />
                    </div>
                  </>
                )}

                {formTab === 'en' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        영문 안내문 (English Guide)
                      </label>
                      <input
                        type="text"
                        value={guideEn}
                        onChange={(e) => setGuideEn(e.target.value)}
                        placeholder="e.g. Upload source portrait, and adjust placeholders in brackets."
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-cyan-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        영문 프롬프트 본문 (Midjourney/DALL-E 최적화)
                      </label>
                      <textarea
                        value={bodyEn}
                        onChange={(e) => setBodyEn(e.target.value)}
                        rows={7}
                        placeholder="Enter English prompt..."
                        className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs focus:border-cyan-500 outline-hidden"
                      />
                    </div>
                  </>
                )}

                {formTab === 'media' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Before Image */}
                    <div className="space-y-1.5 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">BEFORE (원본) 사진</span>
                        {beforeImg && (
                          <button
                            type="button"
                            onClick={() => setBeforeImg(undefined)}
                            className="text-[11px] text-rose-600 font-semibold hover:underline"
                          >
                            사진 삭제
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={beforeLabel}
                        onChange={(e) => setBeforeLabel(e.target.value)}
                        placeholder="라벨 (예: BEFORE)"
                        className="w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, 'before')}
                        className="text-[11px] file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-800"
                      />
                      {beforeImg && (
                        <div className="aspect-4/3 w-full overflow-hidden rounded bg-black/10 mt-1">
                          <img
                            src={beforeImg}
                            alt="Before preview"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {/* After Image */}
                    <div className="space-y-1.5 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">AFTER (결과) 사진</span>
                        {afterImg && (
                          <button
                            type="button"
                            onClick={() => setAfterImg(undefined)}
                            className="text-[11px] text-rose-600 font-semibold hover:underline"
                          >
                            사진 삭제
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={afterLabel}
                        onChange={(e) => setAfterLabel(e.target.value)}
                        placeholder="라벨 (예: AFTER)"
                        className="w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, 'after')}
                        className="text-[11px] file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-800"
                      />
                      {afterImg && (
                        <div className="aspect-4/3 w-full overflow-hidden rounded bg-black/10 mt-1">
                          <img
                            src={afterImg}
                            alt="After preview"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Step */}
            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">다음 단계 안내 (추천 프롬프트 제목)</label>
              <input
                type="text"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="예: 빈티지 35mm 필름 레트로 감성"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-cyan-500 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="rounded-full bg-[#0b1f3a] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#133058] shadow-sm disabled:opacity-50"
              >
                {isProcessing ? '저장 중...' : '저장 완료'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
