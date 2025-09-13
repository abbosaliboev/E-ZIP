// src/utils/listingsStore.js
import { LISTINGS as BASE } from '../mock/listings';

const LS_KEY = 'user_listings_v1';

export function getUserListings() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}

export function saveUserListings(rows) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

export function getAllListings() {
  return [...BASE, ...getUserListings()];
}

export function getListingById(id) {
  return getAllListings().find(x => String(x.id) === String(id)) || null;
}

export function addListing(payload) {
  const row = {
    ...payload,
    id: payload.id || `c_${Date.now()}`,
    // muhim: cardlarda img ishlatiladi; yo‘q bo‘lsa images[0] dan olamiz
    img: payload.img || (payload.images && payload.images[0]) || 'https://picsum.photos/seed/new/1000/600'
  };
  const mine = getUserListings();
  mine.unshift(row);
  saveUserListings(mine);

  // boshqalarga signal berish (home/search tinglaydi)
  window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY, newValue: JSON.stringify(mine) }));
  return row;
}