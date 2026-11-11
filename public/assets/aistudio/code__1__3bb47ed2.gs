// AI 프롬프트 모음 — 서버 코드 (관리자 모드 포함)
const CACHE_SEC = 60;
const HIDDEN = ['비공개', 'false', 'n', 'no', '숨김'];
const EXTRA = ['ID', '한줄설명', '아이콘', '비포', '애프터'];
const FIELDS = ['카테고리', '제목', '버전명', '유형', '사진필요', '안내문', '본문', '공개', '다음단계', '한줄설명', '아이콘', '비포', '애프터'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('AI 프롬프트 모음')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('프롬프트 앱')
    .addItem('캐시 지금 갱신', 'clearCache')
    .addItem('관리자 초기 설정(열 추가)', 'setup')
    .addItem('관리자 비밀번호 설정', 'setPassword')
    .addToUi();
}

function clearCache() { CacheService.getScriptCache().remove('pub'); }

function sheet_() { return SpreadsheetApp.getActive().getSheetByName('프롬프트'); }

// 1회 실행: ID·한줄설명·아이콘·비포·애프터 열을 추가하고 ID를 채운다
function setup() {
  const sh = sheet_();
  let h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(x => String(x).trim());
  EXTRA.forEach(n => { if (h.indexOf(n) < 0) { sh.getRange(1, h.length + 1).setValue(n); h.push(n); } });
  const idc = h.indexOf('ID') + 1, last = sh.getLastRow();
  if (last > 1) {
    const rng = sh.getRange(2, idc, last - 1, 1), v = rng.getValues();
    rng.setValues(v.map((r, i) => [r[0] || ('p' + Utilities.getUuid().slice(0, 7))]));
  }
  clearCache();
  SpreadsheetApp.getActive().toast('관리자 모드 준비 완료');
}

function setPassword() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('관리자 비밀번호', '앱 관리자 모드에서 쓸 비밀번호를 입력하세요 (6자 이상).', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK || r.getResponseText().length < 6) return;
  PropertiesService.getScriptProperties().setProperty('ADMIN_PW', r.getResponseText());
  ui.alert('설정했습니다.');
}

// ---- 인증 ----
function adminLogin(pw) {
  const c = CacheService.getScriptCache();
  if (Number(c.get('fail') || 0) >= 5) throw new Error('시도 횟수 초과. 10분 뒤에 다시 시도하세요.');
  const real = PropertiesService.getScriptProperties().getProperty('ADMIN_PW');
  if (!real) throw new Error('비밀번호가 아직 설정되지 않았습니다. 시트 메뉴에서 설정하세요.');
  if (String(pw) !== real) { c.put('fail', String(Number(c.get('fail') || 0) + 1), 600); throw new Error('비밀번호가 맞지 않습니다.'); }
  const t = Utilities.getUuid();
  c.put('tok_' + t, '1', 21600);
  return t;
}
function guard_(t) {
  if (!t || !CacheService.getScriptCache().get('tok_' + t)) throw new Error('관리자 로그인이 필요합니다.');
}

// ---- 읽기 ----
function getData() {
  const c = CacheService.getScriptCache(), hit = c.get('pub');
  if (hit) return JSON.parse(hit);
  const d = build_(false);
  try { c.put('pub', JSON.stringify(d), CACHE_SEC); } catch (e) {}
  return d;
}
function getAdminData(t) { guard_(t); return build_(true); }

function build_(admin) {
  const ss = SpreadsheetApp.getActive();
  const rows = sheet_().getDataRange().getValues();
  const h = rows.shift().map(x => String(x).trim());
  const g = (r, n) => { const i = h.indexOf(n); return i < 0 ? '' : r[i]; };
  const map = {}, list = [];
  rows.forEach(r => {
    const title = String(g(r, '제목')).trim(), body = String(g(r, '본문')).trim();
    if (!title || !body) return;
    const hid = HIDDEN.indexOf(String(g(r, '공개')).trim().toLowerCase()) >= 0;
    if (hid && !admin) return;
    const cat = String(g(r, '카테고리')).trim() || '기타', key = cat + '|' + title;
    if (!map[key]) { map[key] = { id: 'g' + list.length, cat: cat, title: title, icon: '', tag: '', versions: [] }; list.push(map[key]); }
    const p = map[key];
    if (!p.icon) p.icon = String(g(r, '아이콘')).trim();
    if (!p.tag) p.tag = String(g(r, '한줄설명')).trim();
    p.versions.push({
      id: String(g(r, 'ID')), name: String(g(r, '버전명')).trim() || '기본', type: String(g(r, '유형')).trim(),
      photo: String(g(r, '사진필요')).trim() === '필요', guide: String(g(r, '안내문')).trim(),
      next: String(g(r, '다음단계')).trim(), body: body, hidden: hid,
      before: String(g(r, '비포')).trim(), after: String(g(r, '애프터')).trim()
    });
  });
  const cs = ss.getSheetByName('카테고리');
  const defs = cs ? cs.getDataRange().getValues().slice(1) : [];
  const cats = [], seen = {};
  defs.forEach(d => { const n = String(d[0]).trim(); if (n && !seen[n]) { seen[n] = 1; cats.push({ name: n, desc: String(d[1] || '') }); } });
  list.forEach(p => { if (!seen[p.cat]) { seen[p.cat] = 1; cats.push({ name: p.cat, desc: '' }); } });
  return { cats: cats.filter(c => list.some(p => p.cat === c.name)), prompts: list };
}

// ---- 쓰기 (관리자) ----
function adminSave(t, rec) {
  guard_(t);
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const sh = sheet_(), h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(x => String(x).trim());
    const idc = h.indexOf('ID');
    if (idc < 0) throw new Error('시트 메뉴에서 "관리자 초기 설정"을 먼저 실행하세요.');
    let row = 0;
    if (rec.id) {
      const ids = sh.getRange(2, idc + 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
      for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === rec.id) { row = i + 2; break; }
      if (!row) throw new Error('수정할 항목을 찾지 못했습니다.');
    } else {
      row = sh.getLastRow() + 1;
      sh.getRange(row, idc + 1).setValue('p' + Utilities.getUuid().slice(0, 7));
      const oc = h.indexOf('순서');
      if (oc >= 0) sh.getRange(row, oc + 1).setValue(row - 1);
    }
    FIELDS.forEach(f => { const i = h.indexOf(f); if (i >= 0 && f in rec) sh.getRange(row, i + 1).setValue(rec[f]); });
    clearCache();
    return sh.getRange(row, idc + 1).getValue();
  } finally { lock.releaseLock(); }
}

function adminDelete(t, id) {
  guard_(t);
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const sh = sheet_(), h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(x => String(x).trim());
    const ids = sh.getRange(2, h.indexOf('ID') + 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
    for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === id) { sh.deleteRow(i + 2); clearCache(); return true; }
    throw new Error('삭제할 항목을 찾지 못했습니다.');
  } finally { lock.releaseLock(); }
}

// 샘플 사진 업로드 → 드라이브 폴더에 저장하고 파일 ID를 돌려준다 (링크 공유: 보기 전용)
function adminUpload(t, dataUrl) {
  guard_(t);
  const m = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(dataUrl || '');
  if (!m) throw new Error('이미지 형식이 올바르지 않습니다.');
  const props = PropertiesService.getScriptProperties();
  let fid = props.getProperty('FOLDER_ID'), folder;
  try { folder = fid ? DriveApp.getFolderById(fid) : null; } catch (e) { folder = null; }
  if (!folder) { folder = DriveApp.createFolder('프롬프트앱_샘플사진'); props.setProperty('FOLDER_ID', folder.getId()); }
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], 'sample_' + Date.now() + '.jpg'));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getId();
}
