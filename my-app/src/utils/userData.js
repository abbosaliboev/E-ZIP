// src/utils/userData.js
import { getSession, getRegisteredUser } from './auth';

// Per-user localStorage kalitlari:
function key(prefix) {
  const me = getSession();
  const id = me?.email || 'guest';
  return `${prefix}_${id}`;
}

// ---- PROFILE (My info) ----
export function loadMyProfile() {
  // Avval ro'yxatdan o'tgan foydalanuvchi (register payti saqlangan)
  const reg = getRegisteredUser();
  const sess = getSession();
  const base = {
    name: reg?.name || sess?.name || '',
    email: reg?.email || sess?.email || '',
    phone: '',
    avatarUrl: '',
  };
  try {
    const saved = JSON.parse(localStorage.getItem(key('profile')) || 'null');
    return saved ? { ...base, ...saved } : base;
  } catch {
    return base;
  }
}

export function saveMyProfile(patch) {
  const current = loadMyProfile();
  const next = { ...current, ...patch };
  localStorage.setItem(key('profile'), JSON.stringify(next));

  // Agar ism/email o‘zgarsa, sessiya ham yangilab qo‘yiladi (Navbar uchun)
  try {
    const sess = getSession();
    if (sess) {
      const updated = { ...sess, name: next.name || sess.name, email: next.email || sess.email };
      localStorage.setItem('session_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('auth'));
    }
  } catch {}
  return next;
}

// ---- SAVED (favorites) ----
export function loadSavedIds() {
  try { return new Set(JSON.parse(localStorage.getItem(key('saved')) || '[]')); }
  catch { return new Set(); }
}
export function saveSavedIds(setOrArray) {
  const arr = Array.isArray(setOrArray) ? setOrArray : Array.from(setOrArray);
  localStorage.setItem(key('saved'), JSON.stringify(arr));
  window.dispatchEvent(new Event('storage'));
}

// ---- RECENT ----
export function loadRecent() {
  try { return JSON.parse(localStorage.getItem(key('recent')) || '[]'); }
  catch { return []; }
}
export function pushRecent(listing) {
  const curr = loadRecent();
  const existsIdx = curr.findIndex(x => x.id === listing.id);
  if (existsIdx >= 0) curr.splice(existsIdx, 1);
  curr.unshift({ id: listing.id, at: Date.now() });
  if (curr.length > 50) curr.length = 50;
  localStorage.setItem(key('recent'), JSON.stringify(curr));
  window.dispatchEvent(new Event('storage'));
  return curr;
}

// ---- CONTRACTS (demo) ----
export function loadContracts() {
  try { return JSON.parse(localStorage.getItem(key('contracts')) || '[]'); }
  catch { return []; }
}
export function saveContracts(rows) {
  localStorage.setItem(key('contracts'), JSON.stringify(rows));
  window.dispatchEvent(new Event('storage'));
}