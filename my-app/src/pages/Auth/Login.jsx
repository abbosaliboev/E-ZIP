import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.scss';

export default function Login() {
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // TODO: call API
    alert('Logged in (demo)');
  };

  return (
    <section className="auth container-narrow">
      <div className="auth__panel card-soft">
        <h1 className="auth__title">Log in with Email</h1>
        <hr className="auth__hr" />
        <p className="auth__hint">Please log in to continue using our service.</p>

        <form onSubmit={submit} className="auth__form">
          {/* Email */}
          <label className="auth__label">Email</label>
          <input
            className="auth__input"
            type="email"
            placeholder="Enter your email address"
            required
          />

          {/* Password */}
          <label className="auth__label">Password</label>
          <div className="auth__field">
            <input
              className="auth__input"
              type={show ? 'text' : 'password'}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="auth__eye"
              onClick={() => setShow(v => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              title={show ? 'Hide password' : 'Show password'}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>

          <button className="auth__primary" type="submit">Log in</button>

          <div className="auth__links">
            <Link to="/reset">Reset password</Link>
            <span className="sep">|</span>
            <Link to="/register">Sign up with email</Link>
          </div>
        </form>
      </div>
    </section>
  );
}