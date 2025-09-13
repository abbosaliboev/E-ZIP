// src/utils/auth.js
const LS_USER = 'user';          // ro'yxatdan o'tgan foydalanuvchi (bitta demo)
const LS_SESSION = 'session_user'; // hozir login bo'lgan user

function emitAuthChange() {
  window.dispatchEvent(new Event('auth'));     // ichki tab
  window.dispatchEvent(new StorageEvent('storage', { key: LS_SESSION })); // boshqa tablar
}

export function getRegisteredUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER) || 'null'); }
  catch { return null; }
}

export function registerUser(payload) {
  localStorage.setItem(LS_USER, JSON.stringify(payload));
  // darhol login holatiga o'tkazamiz
  localStorage.setItem(LS_SESSION, JSON.stringify({ email: payload.email, name: payload.name }));
  emitAuthChange();
}

export function login(email, password) {
  const reg = getRegisteredUser();
  if (!reg) return { ok: false, reason: 'NO_ACCOUNT' };
  if (reg.email !== email) return { ok: false, reason: 'EMAIL' };
  if (reg.password !== password) return { ok: false, reason: 'PASSWORD' };

  localStorage.setItem(LS_SESSION, JSON.stringify({ email: reg.email, name: reg.name }));
  emitAuthChange();
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(LS_SESSION);
  emitAuthChange();
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); }
  catch { return null; }
}

export function isAuthed() {
  return !!getSession();
}