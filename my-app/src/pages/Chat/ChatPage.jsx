// src/pages/Chat/ChatPage.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatAI, translateMessage } from '../../services/chat';
import ContractModal from './components/ContractModal';
import { buildContractPdf, openPdfInNewTab } from '../../utils/contractPdf';
import './chat.scss';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "Oʻzbekcha" },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'vi', label: 'Tiếng Việt' },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ChatPage() {
  const nav = useNavigate();
  const q = useQuery();

  const roomId = q.get('roomId') || '';
  const to = q.get('to') || 'Landlord';
  const startMode = q.get('mode'); // "request" bo‘lsa kontrakt flow

  const [messages, setMessages] = useState([]); // {id, role:'user'|'ai', text}
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [tgtLang, setTgtLang] = useState('en');

  const [contractOpen, setContractOpen] = useState(false);
  const listRef = useRef(null);

  // Login bo‘lgan userni .localStorage('user') dan olamiz
  const userProfile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  }, []);

  // Boshlang'ich holat: hech qanday "hello" xabari yo‘q.
  useEffect(() => {
    if (startMode === 'request') {
      const draft =
        `Hello ${to}, I’d like to request a contract for room #${roomId}.\n` +
        `My details:\n• Full name: ______\n• Email: ______\n• Phone: ______\n• Intended move-in date: ______\n\n` +
        `If everything looks good, please confirm and share the contract PDF.`;
      setMessages([{ id: 'draft-1', role: 'user', text: draft }]);
      setContractOpen(true);
    } else {
      setMessages([]); // bo'sh chat
    }
  }, [startMode, roomId, to]);

  // Auto-scroll pastga
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      const replyText = await chatAI(text);
      const aiMsg = { id: `a-${Date.now()}`, role: 'ai', text: replyText };
      setMessages((m) => [...m, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { id: `err-${Date.now()}`, role: 'ai', text: 'Failed to send. Please try again.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const translateLastAI = async () => {
    const lastAi = [...messages].reverse().find((m) => m.role === 'ai');
    if (!lastAi) return;
    try {
      const t = await translateMessage(lastAi.text, tgtLang);
      setMessages((m) => [...m, { id: `t-${Date.now()}`, role: 'ai', text: t }]);
    } catch (e) {
      console.error(e);
      alert('Translate failed');
    }
  };

  // Kontrakt tasdiqlash → PDF yaratish, preview, download, chatga summary
  const handleContractConfirm = async ({ tenantName, tenantEmail, tenantPhone, moveInDate }) => {
    const { blob, filename } = buildContractPdf({
      roomId,
      landlord: to,
      tenantName,
      tenantEmail,
      tenantPhone,
      moveInDate,
      address: q.get('address') || '',
      monthlyRent: q.get('monthly') || '',
      deposit: q.get('deposit') || '',
    });

    // Preview
    openPdfInNewTab(blob);

    // Yuklab olish
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);

    // Uy egasiga xulosa matni
    const summary =
      `Contract request for room #${roomId}\n\n` +
      `Tenant: ${tenantName}\nEmail: ${tenantEmail}\nPhone: ${tenantPhone}\nMove-in: ${moveInDate}\n\n` +
      `A demo PDF was generated and downloaded by the tenant. Please review and confirm.`;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text: summary }]);

    setContractOpen(false);
  };

  return (
    <section className="chat container-narrow">
      {/* Header */}
      <div className="chat__head">
        <button className="btn btn-link p-0 me-2" onClick={() => nav(-1)}>‹ Back</button>
        <div className="fw-bold">{to}</div>
        <div className="ms-auto d-flex gap-2 align-items-center">
          <select
            value={tgtLang}
            onChange={(e) => setTgtLang(e.target.value)}
            className="form-select form-select-sm w-auto"
            title="Translate to"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <button className="btn btn-outline-secondary btn-sm" onClick={translateLastAI}>
            Translate last reply
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setContractOpen(true)}>
            Request contract
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat__list" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat__row ${m.role === 'user' ? 'is-user' : 'is-ai'}`}>
            <div className="chat__bubble">{m.text}</div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="chat__composer">
        <textarea
          className="form-control"
          rows={1}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="btn btn-brand" onClick={send} disabled={sending}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>

      {/* Contract Modal */}
      <ContractModal
        open={contractOpen}
        onClose={() => setContractOpen(false)}
        initialUser={{
          name: userProfile?.name || '',
          email: userProfile?.email || '',
          phone: userProfile?.phone || '',
        }}
        room={{
          id: roomId || '—',
          address: q.get('address') || '',
          priceMonthly: q.get('monthly') || '',
          deposit: q.get('deposit') || '',
          landlordName: to,
        }}
        onConfirm={handleContractConfirm}
      />
    </section>
  );
}