// src/pages/Chat/components/ContractModal.jsx
import { useEffect, useMemo, useState } from 'react';
import './contractModal.scss';

export default function ContractModal({
  open,
  onClose,
  initialUser,   // {name, email, phone}
  room,          // {id, address, priceMonthly, deposit, landlordName}
  onConfirm,     // async (payload) => void
}) {
  const [name, setName]   = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [phone, setPhone] = useState(initialUser?.phone || '');
  const [date, setDate]   = useState('');

  useEffect(() => {
    if (open) {
      setName(initialUser?.name || '');
      setEmail(initialUser?.email || '');
      setPhone(initialUser?.phone || '');
      setDate('');
    }
  }, [open, initialUser]);

  const validEmail = /\S+@\S+\.\S+/.test(email);
  const validName  = name.trim().length > 1;
  const validPhone = phone.trim().length >= 7;
  const validDate  = !!date;
  const canSubmit  = validName && validEmail && validPhone && validDate;

  const warning = useMemo(() => {
    const missing = [];
    if (!validName)  missing.push('name');
    if (!validEmail) missing.push('email');
    if (!validPhone) missing.push('phone');
    if (!validDate)  missing.push('move-in date');
    if (!missing.length) return '';
    return `Please fill: ${missing.join(', ')}.`;
  }, [validName, validEmail, validPhone, validDate]);

  if (!open) return null;

  return (
    <div className="cmodal">
      <div className="cmodal__backdrop" onClick={onClose} />
      <div className="cmodal__panel">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="h5 m-0">Request Contract</div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Close</button>
        </div>

        <div className="text-secondary small mb-2">
          Please confirm your details. A demo PDF will be generated for preview & download.
        </div>

        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label small">Full name</label>
            <input className="form-control" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small">Phone</label>
            <input className="form-control" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small">Intended move-in date</label>
            <input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
        </div>

        <div className="mt-3 small">
          <div><b>Room:</b> #{room?.id} {room?.address ? `• ${room.address}` : ''}</div>
          <div><b>Monthly:</b> ₩{Number(room?.priceMonthly||0).toLocaleString()} 만 · <b>Deposit:</b> {Number(room?.deposit||0)===0?'No deposit':`₩${Number(room?.deposit||0).toLocaleString()} 만`}</div>
        </div>

        {warning && <div className="alert alert-warning py-2 px-3 mt-3">{warning}</div>}

        <div className="d-flex gap-2 justify-content-end mt-3">
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-brand" disabled={!canSubmit}
            onClick={() => onConfirm({
              tenantName: name.trim(),
              tenantEmail: email.trim(),
              tenantPhone: phone.trim(),
              moveInDate: date,
            })}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}