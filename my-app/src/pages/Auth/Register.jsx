import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.scss';
import { registerUser } from '../../utils/auth';

export default function Register(){
  const nav = useNavigate();
  const [step, setStep] = useState(1);

  // STEP 1: terms
  const [all, setAll] = useState(false);
  const [over14, setOver14] = useState(false);
  const [tos, setTos] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const requiredOk = over14 && tos && privacy;

  const onToggleAll = () => {
    const next = !all;
    setAll(next);
    setOver14(next);
    setTos(next);
    setPrivacy(next);
    setMarketing(next);
  };

  // 각 체크박스 변경 시 '모두 동의' 갱신
  const onAnyChange = (setter) => (v) => {
    setter(v);
    setAll(() => {
      const nextOver14 = setter === setOver14 ? v : over14;
      const nextTos = setter === setTos ? v : tos;
      const nextPrivacy = setter === setPrivacy ? v : privacy;
      const nextMarketing = setter === setMarketing ? v : marketing;
      return nextOver14 && nextTos && nextPrivacy && nextMarketing;
    });
  };

  // STEP 2: account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const pwValid = useMemo(()=>{
    const long = pw.length >= 8;
    const mix = /[A-Za-z]/.test(pw) && /[\d\W]/.test(pw);
    return long && mix;
  }, [pw]);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const nameValid = name.trim().length > 0;

  const canSubmit = nameValid && emailValid && pwValid && pw === pw2;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
  
    const userPayload = {
      name: name.trim(),
      email: email.trim(),
      password: pw, // demo – prod'da hash!
      consents: { over14, tos, privacy, marketing },
      createdAt: new Date().toISOString()
    };
  
    try {
      registerUser(userPayload); // ⬅️ endi shu orqali ro'yxatdan o'tkazib, sessiya ochamiz
  
      // ko'chirma alert / mask xabarlar ixtiyoriy
      alert('Sign up complete ✅\nYou are now logged in.');
      nav('/'); // yoki /mypage
    } catch (err) {
      console.error(err);
      alert('Error while saving. Please try again.');
    }
  };

  return (
    <section className="auth container-narrow">
      <div className="auth__panel card-soft">
        {step === 1 ? (
          <>
            <h1 className="auth__title">Terms & Consents</h1>
            <hr className="auth__hr" />
            <p className="auth__hint">Welcome! Please agree to the terms to proceed.</p>

            <div className="terms">
              <label className="chk">
                <input type="checkbox" checked={all} onChange={onToggleAll} />
                <span><b>Agree to all</b></span>
              </label>

              <label className="chk">
                <input
                  type="checkbox"
                  checked={over14}
                  onChange={e=>onAnyChange(setOver14)(e.target.checked)}
                />
                <span>[Required] I am at least 14 years old.</span>
              </label>

              <label className="chk">
                <input
                  type="checkbox"
                  checked={tos}
                  onChange={e=>onAnyChange(setTos)(e.target.checked)}
                />
                <span>[Required] Agree to Service Terms.</span>
                <Link to="/terms" className="arrow">›</Link>
              </label>

              <label className="chk">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={e=>onAnyChange(setPrivacy)(e.target.checked)}
                />
                <span>[Required] Agree to Privacy Policy.</span>
                <Link to="/privacy" className="arrow">›</Link>
              </label>

              <label className="chk">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={e=>onAnyChange(setMarketing)(e.target.checked)}
                />
                <span>[Optional] Receive event & benefit alerts.</span>
                <Link to="/marketing" className="arrow">›</Link>
              </label>

              <p className="muted">
                Only users aged 14+ can sign up. You can review details in the Terms & Policy pages.
              </p>
            </div>

            <button
              className="auth__primary"
              disabled={!requiredOk}
              onClick={()=> setStep(2)}
            >
              Agree and continue
            </button>
          </>
        ) : (
          <>
            <h1 className="auth__title">Create your account</h1>
            <hr className="auth__hr" />
            <p className="auth__hint">Enter the details below to sign up with email.</p>

            <form className="auth__form" onSubmit={submit}>
              {/* 이름 */}
              <label className="auth__label">Name</label>
              <input
                className={`auth__input ${name && !nameValid ? 'is-invalid' : ''}`}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e=>setName(e.target.value)}
                required
              />
              {name && !nameValid && (
                <div className="invalid-msg">Please enter your name.</div>
              )}

              {/* 이메일 */}
              <label className="auth__label">Email</label>
              <input
                className={`auth__input ${email && !emailValid ? 'is-invalid' : ''}`}
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
              />
              {email && !emailValid && (
                <div className="invalid-msg">Please enter a valid email.</div>
              )}

              {/* 비밀번호 */}
              <label className="auth__label">Password</label>
              <div className="auth__field">
                <input
                  className={`auth__input ${pw && !pwValid ? 'is-invalid' : ''}`}
                  type={show1 ? 'text' : 'password'}
                  placeholder="At least 8 characters, include letters and numbers/symbols"
                  value={pw}
                  onChange={e=>setPw(e.target.value)}
                  required
                />
                <button type="button" className="auth__eye" onClick={()=>setShow1(v=>!v)}>
                  {show1 ? '🙈' : '👁️'}
                </button>
              </div>
              {!pwValid && pw && (
                <div className="invalid-msg">Use 8+ characters with letters and numbers/symbols.</div>
              )}

              {/* 비밀번호 확인 */}
              <label className="auth__label">Confirm password</label>
              <div className="auth__field">
                <input
                  className={`auth__input ${pw2 && pw2!==pw ? 'is-invalid' : ''}`}
                  type={show2 ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={pw2}
                  onChange={e=>setPw2(e.target.value)}
                  required
                />
                <button type="button" className="auth__eye" onClick={()=>setShow2(v=>!v)}>
                  {show2 ? '🙈' : '👁️'}
                </button>
              </div>
              {pw2 && pw2!==pw && <div className="invalid-msg">Passwords don’t match.</div>}

              <button className="auth__primary" type="submit" disabled={!canSubmit}>
                Complete sign up
              </button>

              <div className="auth__links">
                <span className="muted">Already have an account?</span>
                <Link to="/login">Log in</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}