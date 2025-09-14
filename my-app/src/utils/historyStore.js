// Recently viewed rooms (localStorage asosida saqlanadi)
const RECENT_KEY = 'recent_rooms_v1';
const FAV_KEY = 'fav_rooms_v1';

export function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}
export function addRecent(room) {
  const current = getRecent().filter(r => r.id !== room.id);
  const next = [room, ...current].slice(0, 50); // 50 ta oxirgi
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}
export function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

export function getFavs() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
  catch { return new Set(); }
}
export function toggleFav(id) {
  const favs = getFavs();
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  return favs;
}