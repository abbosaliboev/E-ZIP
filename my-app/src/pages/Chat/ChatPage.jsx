import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './chat.scss';

export default function ChatPage(){
  const { ownerId } = useParams();
  const [sp] = useSearchParams();
  const asOwner = sp.get('as') === 'owner';
  const key = `chat_${ownerId}`;

  const [messages, setMessages] = useState(() => {
    const all = JSON.parse(localStorage.getItem('chats') || '{}');
    return all[key] || [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('chats') || '{}');
    all[key] = messages;
    localStorage.setItem('chats', JSON.stringify(all));
  }, [messages, key]);

  const sendText = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { from: asOwner ? 'owner' : 'me', type:'text', body: input.trim(), when: Date.now() }
    ]);
    setInput('');
  };

  return (
    <section className="container-narrow py-4 chat">
      <h1 className="h5 mb-2">Chat with Owner ({ownerId})</h1>

      <div className="card-soft p-3 chat__box">
        {messages.length === 0 && (
          <div className="text-secondary small">No messages yet.</div>
        )}
        {messages.map((m,i)=>(
          <div key={i} className={`chat__msg ${m.from==='me'?'me':'owner'}`}>
            {m.type === 'contract_pdf' ? (
              <div className="contract-req">
                <div className="fw-bold">📄 Contract request</div>
                <div className="small text-secondary">
                  {m.title} — ₩{m.priceMonthly?.toLocaleString()}/mo • {m.deposit === 0 ? 'No deposit' : `Deposit ₩${m.deposit?.toLocaleString()}`}
                </div>
                <div className="mt-1 d-flex gap-2">
                  <a className="btn btn-sm btn-outline-secondary" href={m.pdfUrl} target="_blank" rel="noreferrer">Open PDF</a>
                  <a className="btn btn-sm btn-primary" href={m.pdfUrl} download={m.filename || 'contract.pdf'}>Download</a>
                </div>
              </div>
            ) : (
              <span>{m.body}</span>
            )}
          </div>
        ))}
      </div>

      <div className="d-flex gap-2 mt-2">
        <input
          className="form-control"
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e)=> e.key==='Enter' && sendText()}
        />
        <button className="btn btn-brand" onClick={sendText}>Send</button>
      </div>
    </section>
  );
}