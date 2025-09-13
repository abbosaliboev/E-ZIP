import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './mypage.scss';
import { getAllListings } from '../../utils/listingsStore';
import { isAuthed, getSession } from '../../utils/auth';
import {
  loadMyProfile, saveMyProfile,
  loadSavedIds, loadRecent, loadContracts
} from '../../utils/userData';
import ProfileEditor from './components/ProfileEditor';
import Reviews from './components/Reviews';

/* ===== Shared small component ===== */
function ListingCard({ item, compact=false, footer }) {
  return (
    <div className={`card-soft listing ${compact ? 'listing--compact':''}`}>
      <Link to={`/listing/${item.id}`} className="ratio ratio-4x3 d-block rounded-3 overflow-hidden">
        <img src={item.img || (item.images && item.images[0])} alt={item.title} className="object-cover" />
      </Link>
      <div className="p-3">
        <div className="small text-secondary">{item.city} • {item.meta}</div>
        <div className="fw-semibold mt-1">{item.title}</div>
        <div className="d-flex align-items-baseline gap-2 mt-1">
          <span className="fw-bold">₩{Number(item.priceMonthly||0).toLocaleString()}</span>
          <span className="text-secondary small">/mo</span>
          <span className="text-secondary small ms-2">
            {Number(item.deposit||0)===0 ? 'No deposit' : `Deposit ₩${Number(item.deposit).toLocaleString()}`}
          </span>
        </div>
        {footer}
      </div>
    </div>
  );
}

/* ===== Guest view (no hooks needed) ===== */
function MyPageGuest() {
  return (
    <section className="container-narrow py-5 text-center">
      <h1 className="h5 mb-2">Please log in</h1>
      <p className="text-secondary mb-3">You need an account to view your page.</p>
      <div className="d-flex gap-2 justify-content-center">
        <Link to="/login" className="btn btn-primary">Log in</Link>
        <Link to="/register" className="btn btn-outline-secondary">Sign up</Link>
      </div>
    </section>
  );
}

/* ===== Authed view (all hooks here) ===== */
function MyPageAuthed() {
  const me = getSession();

  const [tab, setTab] = useState('recent');
  const [profile, setProfile] = useState(loadMyProfile());
  const [all, setAll] = useState(getAllListings());
  const [savedIds, setSavedIds] = useState(loadSavedIds());        // Set bo‘lishi mumkin — loadSavedIds shuni qaytaradi
  const [recentRefs, setRecentRefs] = useState(loadRecent());      // [{id, at}]
  const [contracts, setContracts] = useState(loadContracts());     // demo: [{id, status}, ...]

  useEffect(() => {
    const onStorage = () => {
      setAll(getAllListings());
      setProfile(loadMyProfile());
      setSavedIds(loadSavedIds());
      setRecentRefs(loadRecent());
      setContracts(loadContracts());
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth', onStorage);
    };
  }, []);

  const saved = useMemo(() => {
    const rows = getAllListings();
    const ids = savedIds instanceof Set ? savedIds : new Set(savedIds || []);
    return rows.filter(x => ids.has(x.id));
  }, [savedIds]);

  const recent = useMemo(() => {
    const dict = new Map(getAllListings().map(x => [x.id, x]));
    return recentRefs.map(ref => dict.get(ref.id)).filter(Boolean);
  }, [recentRefs]);

  return (
    <section className="container-narrow py-4 mypage">
      <h1 className="mypage__title">My Page</h1>
      <div className="muted">Signed in as <b>{me?.name}</b> ({me?.email})</div>

      {/* Tabs */}
      <div className="tabs">
        {[
          {key:'recent', label:'Recently viewed'},
          {key:'saved', label:'Saved'},
          {key:'reviews', label:'Reviews'},
          {key:'contracts', label:'Contracts'},
          {key:'profile', label:'My info'},
        ].map(t => (
          <button
            key={t.key}
            className={`tabs__item ${tab===t.key?'is-active':''}`}
            onClick={()=>setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-3">
        {/* RECENT */}
        {tab==='recent' && (
          <>
            <div className="muted mb-2">You have <b>{recent.length}</b> recently viewed homes.</div>
            <div className="row g-3">
              {recent.map(it=>(
                <div className="col-12 col-md-6 col-lg-4" key={it.id}>
                  <ListingCard item={it} />
                </div>
              ))}
            </div>
            <div className="muted mt-2">We keep up to 50 recent items.</div>
          </>
        )}

        {/* SAVED */}
        {tab==='saved' && (
          <>
            <div className="muted mb-2">You saved <b>{saved.length}</b> homes.</div>
            <div className="row g-3">
              {saved.map(it=>(
                <div className="col-12 col-md-6" key={it.id}>
                  <ListingCard
                    item={it}
                    compact
                    footer={
                      <div className="d-grid mt-2">
                        <Link to={`/search?q=${encodeURIComponent(it.city || '')}`} className="btn btn-brand-subtle">Find similar</Link>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && <Reviews />}

        {/* CONTRACTS */}
        {tab==='contracts' && (
          <>
            <div className="muted mb-2">You have <b>{contracts.length}</b> contracts.</div>
            <div className="row g-3">
              {contracts.map(it=>(
                <div className="col-12 col-md-6 col-lg-4" key={it.id}>
                  <ListingCard
                    item={it}
                    footer={
                      <>
                        <div className="badge-soft mt-2 d-inline-block">{it.status || 'In progress'}</div>
                        <div className="d-grid mt-2">
                          <Link to={`/contracts/${it.id}`} className="btn btn-brand-subtle">View contract</Link>
                        </div>
                      </>
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* PROFILE */}
        {tab==='profile' && (
          <div className="profile card-soft p-3">
            <ProfileEditor
              user={profile}
              onSave={async (payload)=>{
                const next = saveMyProfile(payload);
                setProfile(next);
                alert('Saved! (demo)');
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ===== Wrapper without hooks ===== */
export default function MyPage(){
  const authed = isAuthed(); // hook emas, oddiy funksiya — xavfsiz
  return authed ? <MyPageAuthed /> : <MyPageGuest />;
}