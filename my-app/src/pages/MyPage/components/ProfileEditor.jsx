import { useMemo, useRef, useState } from 'react';

export default function ProfileEditor({
  user = {
    email: 'user@example.com',
    phone: '010-1234-5678',
    avatarUrl: '',
  },
  onSave,   // async (payload: {email, phone, password?, avatarFile?}) => void
}) {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const fileRef = useRef(null);

  const emailOk = useMemo(()=> /\S+@\S+\.\S+/.test(email), [email]);
  const phoneOk = useMemo(()=> phone.trim().length >= 7, [phone]);
  const pwOk = useMemo(()=>{
    if (!pw && !pw2) return true; // parol o'zgartirmasa ham bo'ladi
    return pw.length >= 8 && pw === pw2;
  }, [pw, pw2]);

  const canSave = editing && emailOk && phoneOk && pwOk;

  const pickFile = () => fileRef.current?.click();
  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarUrl(URL.createObjectURL(f));
  };

  const resetEdits = () => {
    setEmail(user.email);
    setPhone(user.phone);
    setPw('');
    setPw2('');
    setAvatarFile(null);
    setAvatarUrl(user.avatarUrl || '');
  };

  const save = async () => {
    if (!canSave) return;
    const payload = { email, phone };
    if (pw) payload.password = pw;
    if (avatarFile) payload.avatarFile = avatarFile;

    try {
      await onSave?.(payload);
      setEditing(false);
    } catch (e) {
      alert('Failed to save changes.');
    }
  };

  return (
    <div className="profile-edit">
      <div className="profile-edit__header">
        <h2 className="h6 m-0">My info</h2>
        {!editing ? (
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>setEditing(true)}>Edit</button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={()=>{ resetEdits(); setEditing(false); }}>Cancel</button>
            <button className="btn btn-primary btn-sm" disabled={!canSave} onClick={save}>Save</button>
          </div>
        )}
      </div>

      <div className="profile-edit__body">
        {/* Avatar */}
        <div className="profile-edit__avatar">
          <div className="avatar-box" onClick={editing ? pickFile : undefined} role={editing ? 'button' : undefined} title={editing ? 'Change photo' : 'Profile photo'}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              <span>👤</span>
            )}
            {editing && <div className="avatar-edit">Change</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
        </div>

        {/* Fields */}
        <div className="profile-edit__fields">
          {/* Email */}
          <div className="pe-row">
            <div className="pe-label">Email</div>
            <div className="pe-value">
              {!editing ? (
                <div className="fw-semibold">{email}</div>
              ) : (
                <>
                  <input
                    className={`form-control form-control-sm ${email && !emailOk ? 'is-invalid':''}`}
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                  {!emailOk && email && <div className="invalid-msg small">Enter a valid email.</div>}
                </>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="pe-row">
            <div className="pe-label">Phone number</div>
            <div className="pe-value">
              {!editing ? (
                <div className="fw-semibold">{phone}</div>
              ) : (
                <>
                  <input
                    className={`form-control form-control-sm ${phone && !phoneOk ? 'is-invalid':''}`}
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                  />
                  {!phoneOk && phone && <div className="invalid-msg small">Enter a valid phone.</div>}
                </>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="pe-row">
            <div className="pe-label">Password</div>
            <div className="pe-value">
              {!editing ? (
                <div className="text-secondary">••••••••</div>
              ) : (
                <div className="row g-2">
                  <div className="col-12 col-md-6 position-relative">
                    <input
                      className={`form-control form-control-sm ${pw && pw.length < 8 ? 'is-invalid':''}`}
                      type={show1 ? 'text' : 'password'}
                      value={pw}
                      onChange={(e)=>setPw(e.target.value)}
                      placeholder="New password (optional)"
                    />
                    <button type="button" className="pe-eye" onClick={()=>setShow1(v=>!v)}>{show1?'🙈':'👁️'}</button>
                    {pw && pw.length<8 && <div className="invalid-msg small">Use 8+ characters.</div>}
                  </div>
                  <div className="col-12 col-md-6 position-relative">
                    <input
                      className={`form-control form-control-sm ${pw2 && pw2!==pw ? 'is-invalid':''}`}
                      type={show2 ? 'text' : 'password'}
                      value={pw2}
                      onChange={(e)=>setPw2(e.target.value)}
                      placeholder="Confirm password"
                    />
                    <button type="button" className="pe-eye" onClick={()=>setShow2(v=>!v)}>{show2?'🙈':'👁️'}</button>
                    {pw2 && pw2!==pw && <div className="invalid-msg small">Passwords don’t match.</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="muted small mt-2">Tip: Leave password empty if you don’t want to change it.</p>
    </div>
  );
}