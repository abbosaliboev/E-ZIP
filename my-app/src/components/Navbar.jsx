import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X, PlusCircle, Globe } from 'lucide-react';
import logo from '../assets/logo_ezip-2.png';
import './navbar.scss';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "O'zbekcha" },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'vi', label: 'Tiếng Việt' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="nav__inner container-narrow">
        {/* Left: Logo */}
        <Link to="/" className="nav__brand" onClick={()=>setOpen(false)}>
          <img src={logo} alt="logo" className="nav__logo" />
        </Link>

        {/* Mobile toggle */}
        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>

        {/* Right: Links + Actions */}
        <div className={`nav__right ${open ? 'is-open' : ''}`}>
          <nav className="nav__links">
            <NavLink to="/" end className="nav__link" onClick={()=>setOpen(false)}>Find Homes</NavLink>
            <NavLink to="/mypage" className="nav__link" onClick={()=>setOpen(false)}>My Page</NavLink>
          </nav>

          <div className="nav__actions d-flex align-items-center gap-2">
            {/* Post button */}
            <button
              className="btn btn-sm btn--primary"
              onClick={()=>{ setOpen(false); nav('/post'); }}
              title="Post a Home"
            >
              <PlusCircle size={16}/> Post
            </button>

            {/* Auth buttons */}
            <button className="btn btn-sm btn--ghost" onClick={()=>{ setOpen(false); nav('/login'); }}>
              <LogIn size={16}/> Log in
            </button>
            <button className="btn btn-sm btn--ghost" onClick={()=>{ setOpen(false); nav('/register'); }}>
              <UserPlus size={16}/> Sign up
            </button>

            {/* Language dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn--ghost d-flex align-items-center"
                onClick={() => setLangOpen(!langOpen)}
              >
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