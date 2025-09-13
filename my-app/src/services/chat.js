import api from '../lib/api';

// Chat yuborish (payload shaklini backend bilan kelishib oling)
export async function sendChat(payload) {
  const { data } = await api.post('/api/v1/chat', payload);
  return data;
}

// Tarjima
export async function translateChat(payload) {
  const { data } = await api.post('/api/v1/chat/translate', payload);
  return data;
}