// src/utils/listingsStore.js
const KEY = 'user_listings_v1';

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

export function getAllListings() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveAllListings(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export async function addUserListingFromForm(id, form, files = []) {
  const imgs = [];
  for (const f of files) {
    if (f) imgs.push(await fileToDataURL(f));
  }
  const title = `${(form.roomType || 'ONE_ROOM').replaceAll('_',' ')} • ${Math.round(form.areaM2 || 0)} m² @ ${form.address || '—'}`;

  const item = {
    id: String(id || `tmp-${Date.now()}`),
    title,
    city: form.address || '',
    address: form.address || '',
    priceMonthly: Math.round((form.monthlyRentWon || 0) / 10_000), // won -> 만원
    deposit: Math.round((form.depositWon || 0) / 10_000),
    maintenanceFee: Number(form.maintenanceFeeWon || 0),
    meta: `${form.roomCount || 1} rm · ${form.bathroomCount || 1} bath · ${Math.round(form.areaM2||0)} m²`,
    img: imgs[0] || '',
    images: imgs,
    coords: null,
    raw: null,
    createdAtLocal: Date.now(),
  };

  const all = getAllListings();
  const withoutDup = all.filter(x => x.id !== item.id);
  withoutDup.unshift(item);
  saveAllListings(withoutDup);
  return item.id;
}