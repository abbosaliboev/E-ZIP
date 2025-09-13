// src/services/rooms.js
import api from '../lib/api';

/* ================= Helpers ================= */

// Won -> 만원 (10,000 KRW)
const toManwon = (won) => {
  const n = Number(won || 0);
  return Number.isFinite(n) ? Math.round(n / 10_000) : 0;
};

/* ================= Normalizer ================= */

export function normalizeRoom(r) {
  const thumb = r.images?.find(i => i.thumbnail)?.url || r.images?.[0]?.url || '';
  const pics  = (r.images || []).map(i => i.url).filter(Boolean);
  const title = `${(r.roomType || '').replaceAll('_',' ')} • ${Math.round(r.areaM2 || 0)} m² @ ${r.address || '—'}`;
  return {
    id: r.roomId ?? r.id,
    title,
    city: r.address || '',
    address: r.address,
    priceMonthly: r.monthlyRent,            // backend: 만원
    deposit: r.deposit,                     // backend: 만원
    maintenanceFee: r.maintenanceFee,       // 원
    meta: `${r.roomCount || 1} rm · ${r.bathroomCount || 1} bath · ${Math.round(r.areaM2||0)} m²`,
    img: thumb,
    images: pics,
    coords: (r.latitude != null && r.longitude != null)
      ? { lat: r.latitude, lng: r.longitude }
      : null,
    raw: r,
  };
}

/* ================= Build payloads (JSON update) ================= */

export function buildCreatePayload(ui) {
  return {
    address: ui.address?.trim(),
    latitude: ui.latitude != null ? Number(ui.latitude) : undefined,
    longitude: ui.longitude != null ? Number(ui.longitude) : undefined,

    monthlyRent: ui.monthlyRentWon != null
      ? toManwon(ui.monthlyRentWon)
      : Number(ui.monthlyRent ?? ui.priceMonthly ?? 0),

    deposit: ui.depositWon != null
      ? toManwon(ui.depositWon)
      : Number(ui.deposit ?? 0),

    maintenanceFee: ui.maintenanceFeeWon != null
      ? Number(ui.maintenanceFeeWon)
      : Number(ui.maintenanceFee ?? 0),

    roomType: ui.roomType || 'ONE_ROOM',
    areaM2: ui.areaM2 != null ? Number(ui.areaM2) : undefined,
    roomCount: ui.roomCount != null ? Number(ui.roomCount) : undefined,
    bathroomCount: ui.bathroomCount != null ? Number(ui.bathroomCount) : undefined,
    direction: ui.direction || undefined,
    heatingType: ui.heatingType || undefined,
    entranceType: ui.entranceType || undefined,
    buildingUse: ui.buildingUse || undefined,
    approvalDate: ui.approvalDate || undefined,
    floor: ui.floor != null ? Number(ui.floor) : undefined,
    parkingAvailable: ui.parkingAvailable != null ? !!ui.parkingAvailable : undefined,
    totalParkingSpots: ui.totalParkingSpots != null ? Number(ui.totalParkingSpots) : undefined,
    availableFrom: ui.availableFrom || undefined,
    description: ui.description || undefined,

    options: Array.isArray(ui.options)
      ? ui.options
      : (ui.options || '').split(',').map(s => s.trim()).filter(Boolean),

    securityFacilities: Array.isArray(ui.securityFacilities)
      ? ui.securityFacilities
      : (ui.securityFacilities || '').split(',').map(s => s.trim()).filter(Boolean),

    landlordName: ui.landlordName || undefined,
    landlordPhone: ui.landlordPhone || undefined,
    landlordBusinessRegNo: ui.landlordBusinessRegNo || undefined,
  };
}

/* ================= Endpoints ================= */

// GET /v1/rooms
export async function fetchRooms(params = {}) {
  const { data } = await api.get('/v1/rooms', { params });
  const rows = Array.isArray(data) ? data : (data?.results || []);
  return rows.map(normalizeRoom);
}

// GET /v1/rooms/{id}
export async function fetchRoom(roomId) {
  const { data } = await api.get(`/v1/rooms/${roomId}`);
  return normalizeRoom(data);
}

// GET /v1/rooms/search  (param: keyword, sort, min/maxMonthlyRent, min/maxDeposit)
export async function searchRooms(params = {}) {
  const apiParams = {};
  if (params.query) apiParams.keyword = params.query; // fallback
  if (params.keyword) apiParams.keyword = params.keyword;
  if (params.sort) apiParams.sort = params.sort;
  if (params.minMonthlyRent) apiParams.minMonthlyRent = params.minMonthlyRent;
  if (params.maxMonthlyRent) apiParams.maxMonthlyRent = params.maxMonthlyRent;
  if (params.minDeposit) apiParams.minDeposit = params.minDeposit;
  if (params.maxDeposit) apiParams.maxDeposit = params.maxDeposit;

  const { data } = await api.get('/v1/rooms/search', { params: apiParams });
  const rows = Array.isArray(data) ? data : (data?.results || []);
  return rows.map(normalizeRoom);
}

// POST /v1/rooms  (multipart/form-data)
export async function createRoomMultipart(uiData, files = []) {
  const fd = new FormData();
  if (uiData.uploaderId) fd.append('uploaderId', uiData.uploaderId);

  fd.append('address', uiData.address.trim());
  fd.append('monthlyRent', String(toManwon(uiData.monthlyRentWon))); // 만원
  fd.append('deposit', String(toManwon(uiData.depositWon)));         // 만원
  fd.append('roomType', uiData.roomType);

  if (uiData.maintenanceFeeWon) fd.append('maintenanceFee', String(uiData.maintenanceFeeWon));
  if (uiData.areaM2) fd.append('areaM2', String(uiData.areaM2));
  if (uiData.roomCount) fd.append('roomCount', String(uiData.roomCount));
  if (uiData.bathroomCount) fd.append('bathroomCount', String(uiData.bathroomCount));
  if (uiData.direction) fd.append('direction', uiData.direction);
  if (uiData.heatingType) fd.append('heatingType', uiData.heatingType);
  if (uiData.entranceType) fd.append('entranceType', uiData.entranceType);
  if (uiData.buildingUse) fd.append('buildingUse', uiData.buildingUse);
  if (uiData.approvalDate) fd.append('approvalDate', uiData.approvalDate);
  if (uiData.floor !== '' && uiData.floor !== null && uiData.floor !== undefined) fd.append('floor', String(uiData.floor));
  if (uiData.parkingAvailable !== undefined) fd.append('parkingAvailable', String(!!uiData.parkingAvailable));
  if (uiData.totalParkingSpots) fd.append('totalParkingSpots', String(uiData.totalParkingSpots));
  if (uiData.availableFrom) fd.append('availableFrom', uiData.availableFrom);
  if (uiData.description) fd.append('description', uiData.description);

  const arrFrom = (v) => Array.isArray(v) ? v : (v || '').split(',').map(s => s.trim()).filter(Boolean);
  arrFrom(uiData.options).forEach(v => fd.append('options', v));
  arrFrom(uiData.securityFacilities).forEach(v => fd.append('securityFacilities', v));

  if (uiData.landlordName) fd.append('landlordName', uiData.landlordName);
  if (uiData.landlordPhone) fd.append('landlordPhone', uiData.landlordPhone);
  if (uiData.landlordBusinessRegNo) fd.append('landlordBusinessRegNo', uiData.landlordBusinessRegNo);

  (files || []).forEach((f) => f && fd.append('images', f));

  const { data } = await api.post('/v1/rooms', fd /*, { headers: { 'Content-Type': 'multipart/form-data' } }*/);
  return data;
}

// PUT /v1/rooms/{id}  (imagesiz JSON update)
export async function updateRoomFromUI(roomId, uiPayload) {
  const payload = buildCreatePayload(uiPayload);
  const { data } = await api.put(`/v1/rooms/${roomId}`, payload);
  return data;
}

// DELETE /v1/rooms/{id}
export async function deleteRoom(roomId) {
  const { data } = await api.delete(`/v1/rooms/${roomId}`);
  return data;
}