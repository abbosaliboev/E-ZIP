// src/services/chat.js
import api from '../lib/api';

// AI (임대인) bilan chat — POST /api/v1/chat
export async function chatAI(message) {
  const { data } = await api.post('/v1/chat', { message });
  // backend javobining field nomi farq qilsa, safety bilan o‘qiymiz
  const reply =
    data?.message ??
    data?.reply ??
    data?.answer ??
    (typeof data === 'string' ? data : JSON.stringify(data));
  return String(reply);
}

// Matn tarjimasi — POST /api/v1/chat/translate
export async function translateMessage(message, translateLanguage) {
  const { data } = await api.post('/v1/chat/translate', {
    translateLanguage,
    message,
  });
  const translated =
    data?.message ??
    data?.translated ??
    (typeof data === 'string' ? data : JSON.stringify(data));
  return String(translated);
}