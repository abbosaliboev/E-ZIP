import { useEffect, useMemo, useState } from 'react';
import { buildContractPDF } from '../../utils/generateContract';

/**
 * Props:
 * - open: boolean
 * - onClose: fn()
 * - listing: object
 * - onSent: fn()  // after sending (to navigate to chat)
 */
export default function ContractModal({ open, onClose, listing, onSent }) {
  const LS_KEY = 'me_profile';
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') || {}; } catch { return {}; }
  });

  const [form, setForm] = useState({
    name: '', email: '', phone: '', id: '', startDate: new Date().toISOString().slice(0,10)
  });
  const [pdfUrl, setPdfUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [step, setStep] = useState('form'); // form | preview

  useEffect(() => {
    if (open) {
      setPdfUrl('');
      setStep('form');
      // if profile data exists, fill the form
      setForm(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        id: profile.id || '',
        startDate: new Date().toISOString().slice(0,10),
      }));
    }
  }, [open]); // eslint-disable-line

  const valid = useMemo(() => {
    const { name, email, phone, id } = form;
    return name.trim() && /\S+@\S+\.\S+/.test(email || '') && (phone || '').trim() && (id || '').trim();
  }, [form]);

  const generate = () => {
    // save to localStorage (for auto-fill next time)
    const p = { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), id: form.id.trim() };
    localStorage.setItem(LS_KEY, JSON.stringify(p));
    setProfile(p);

    // PDF build
    const { blobUrl, filename: fn } = buildContractPDF({
      listing,
      tenant: p,
      owner: { name: 'Owner', email: 'owner@example.com' },
      startDate: form.startDate
    });
    setPdfUrl(blobUrl);
    setFilename(fn);
    setStep('preview');
  };

  const sendToOwner = () => {
    // add to chat (localStorage)
    const chats = JSON.parse(localStorage.getItem('chats') || '{}');
    const key = `chat_${listing.ownerId}`;
    if (!chats[key]) chats[key] = [];
    chats[key].push({
      from: 'me',
      type: 'contract_pdf',
      listingId: listing.id,
      title: listing.title,
      priceMonthly: listing.priceMonthly,
      deposit: listing.deposit,
      pdfUrl,
      filename,
      when: Date.now(),
    });
    localStorage.setItem('chats', JSON.stringify(chats));
    onClose?.();
    onSent?.(); // for navigation to chat page
  };

  if (!open) return null;

  return (
    <div className="contract-modal">
      <div className="contract-modal__backdrop" onClick={onClose} />
      <div className="contract-modal__panel">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="fw-bold">{step === 'form' ? 'Contract details' : 'Review & send'}</div>
          <button className="btn-close" onClick={onClose} />
        </div>

        {step === 'form' && (
          <>
            <div className="small text-secondary mb-2">
              Please confirm your personal info. We’ll use it to generate the contract PDF.
            </div>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label small">Full name</label>
                <input className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Email</label>
                <input className="form-control" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Phone</label>
                <input className="form-control" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">ID/Passport</label>
                <input className="form-control" value={form.id} onChange={e=>setForm({...form, id:e.target.value})}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Start date</label>
                <input type="date" className="form-control" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})}/>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={!valid} onClick={generate}>Generate PDF</button>
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            <div className="small text-secondary mb-2">
              Preview your contract. You can download it or send to the owner.
            </div>
            <div className="ratio ratio-4x3 mb-2">
              {/* PDF preview */}
              <iframe src={pdfUrl} title="contract preview" style={{borderRadius:'10px', border:'1px solid #eef2f7'}} />
            </div>
            <div className="d-flex justify-content-between">
              <a href={pdfUrl} download={filename} className="btn btn-outline-secondary">Download PDF</a>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={()=>setStep('form')}>Back</button>
                <button className="btn btn-brand" onClick={sendToOwner}>Send to owner</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}