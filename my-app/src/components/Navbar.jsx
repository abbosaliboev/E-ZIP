import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X } from 'lucide-react';
import logo from '../assets/logo_ezip-2.png';
import './navbar.scss';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="nav__inner container-narrow">
        {/* Left: Logo */}
        <Link to="/" className="nav__brand">
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
          <div className="nav__actions">
            <button className="btn btn--ghost" onClick={()=>{ setOpen(false); nav('/login'); }}>
              <LogIn size={18}/> Log in
            </button>
            <button className="btn btn--primary" onClick={()=>{ setOpen(false); nav('/register'); }}>
              <UserPlus size={18}/> Sign up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}