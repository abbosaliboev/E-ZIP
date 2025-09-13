import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X, PlusCircle, Globe, LogOut } from 'lucide-react';
import { isAuthed, getSession, logout } from '../utils/auth'; // ⬅️ qo'shing
import logo from '../assets/logo_ezip-2.png';
import './navbar.scss';

const LANGS = [ /* ... oldingi ro'yxat ... */ ];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [authed, setAuthed] = useState(isAuthed());   // ⬅️ holat
  const [me, setMe] = useState(getSession());         // ⬅️ foydalanuvchi
  const nav = useNavigate();

  useEffect(() => {
    const onAuth = () => { setAuthed(isAuthed()); setMe(getSession()); setOpen(false); };
    window.addEventListener('auth', onAuth);
    window.addEventListener('storage', onAuth); // boshqa tablarda ham
    return () => { window.removeEventListener('auth', onAuth); window.removeEventListener('storage', onAuth); };
  }, []);

  const handleLogout = () => {
    logout();
    nav('/');  // yoki qayerga xohlasangiz
  };

  return (
    <header className="nav">
      <div className="nav__inner container-narrow">
        {/* Left: Logo */}
        <Link to="/" className="nav__brand" onClick={()=>setOpen(false)}>
          <img src={logo} alt="logo" className="nav__logo" />
        </Link>

        {/* Mobile toggle */}
        <button className="nav__toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>

        {/* Right */}
        <div className={`nav__right ${open ? 'is-open' : ''}`}>
          <nav className="nav__links">
            <NavLink to="/" end className="nav__link" onClick={()=>setOpen(false)}>Find Homes</NavLink>
            <NavLink to="/mypage" className="nav__link" onClick={()=>setOpen(false)}>My Page</NavLink>
          </nav>

          <div className="nav__actions d-flex align-items-center gap-2">
            {/* Post */}
            <button className="btn btn-sm btn--primary" onClick={()=>{ setOpen(false); nav('/post'); }} title="Post a Home">
              <PlusCircle size={16}/> Post
            </button>

            {/* Auth area */}
            {authed ? (
              <>
                <span className="nav__me muted small">Hi, {me?.name || 'User'}</span>
                <button className="btn btn-sm btn--ghost" onClick={handleLogout}>
                  <LogOut size={16}/> Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-sm btn--ghost" onClick={()=>{ setOpen(false); nav('/login'); }}>
                  <LogIn size={16}/> Log in
                </button>
                <button className="btn btn-sm btn--ghost" onClick={()=>{ setOpen(false); nav('/register'); }}>
                  <UserPlus size={16}/> Sign up
                </button>
              </>
            )}

            {/* Language dropdown (xuddi avvalgidek) */}
            <div className="dropdown">
              <button className="btn btn-sm btn--ghost d-flex align-items-center" onClick={() => setLangOpen(!langOpen)}>
                <Globe size={16}/> {LANGS.find(l => l.code===lang)?.label}
              </button>
              {langOpen && (
                <div className="dropdown-menu show">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={`dropdown-item ${lang===l.code?'active':''}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}