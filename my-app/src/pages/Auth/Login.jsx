import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../utils/auth';
import './auth.scss';

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    const res = login(email.trim(), pw);
    if (!res.ok) {
      if (res.reason === 'NO_ACCOUNT') setErr('No account found. Please sign up.');
      else if (res.reason === 'EMAIL') setErr('Email does not match our records.');
      else if (res.reason === 'PASSWORD') setErr('Incorrect password.');
      else setErr('Login failed.');
      return;
    }
    nav('/'); // yoki /mypage
  };

  return (
    <section className="auth container-narrow">
      <div className="auth__panel card-soft">
        <h1 className="auth__title">Log in</h1>
        <hr className="auth__hr" />
        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__label">Email</label>
          <input className="auth__input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />

          <label className="auth__label">Password</label>
          <input className="auth__input" type="password" value={pw} onChange={e=>setPw(e.target.value)} required />

          {err && <div className="invalid-msg">{err}</div>}

          <button className="auth__primary" type="submit">Log in</button>

          <div className="auth__links">
            <span className="muted">No account?</span> <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </section>
  );
}