import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './mypage.scss';

import { fetchRoom } from '../../services/room';
import { getRecent, getFavs } from '../../utils/historyStore';

// Ixtiyoriy: sizda allaqachon bor bo‘lsa ishlatamiz; bo‘lmasa bu importlarni olib tashlashingiz mumkin
import ProfileEditor from './components/ProfileEditor';
import Reviews from './components/Reviews';

/* ------- Kichik card komponent -------- */
function ListingCard({ item, compact = false, footer }) {
  return (
    <div className={`card-soft listing ${compact ? 'listing--compact' : ''}`}>
      <Link to={`/listing/${item.id}`} className="ratio ratio-4x3 d-block rounded-3 overflow-hidden">
        <img src={item.img} alt={item.title} className="object-cover" />
      </Link>
      <div className="p-3">
        <div className="small text-secondary">{item.city} • {item.meta}</div>
        <div className="fw-semibold mt-1">{item.title}</div>
        <div className="d-flex align-items-baseline gap-2 mt-1">
          <span className="fw-bold">₩{Number(item.priceMonthly || 0).toLocaleString()}</span>
          <span className="text-secondary small">/mo</span>
          <span className="text-secondary small ms-2">
            {Number(item.deposit || 0) === 0 ? 'No deposit' : `Deposit ₩${Number(item.deposit || 0).toLocaleString()}`}
          </span>
        </div>
        {footer}
      </div>
    </div>
  );
}

/* ------- Asosiy MyPage ------- */
export default function MyPage() {
  const [tab, setTab] = useState('recent');

  // Recently viewed: to'g'ridan localStorage'dan mini-objektlar
  const [recent, setRecent] = useState([]);

  // Favorites: faqat ID’lar localStorage’da; detallarni backenddan olib kelamiz
  const [saved, setSaved] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  // Kontraktlar: demo (xohlasangiz keyin backendga ulamiz)
  const [contracts, setContracts] = useState([]);

  // Login bo‘lgan user (Register’da saqlagan ‘user’)
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  }, []);

  // Recently + Saved yuklash
  useEffect(() => {
    // Recently (localdan)
    setRecent(getRecent());

    // Saved (IDs -> fetch details)
    const favIds = [...getFavs()];
    if (favIds.length === 0) {
      setSaved([]);
      return;
    }
    setSavedLoading(true);
    Promise.all(
      favIds.map(async (id) => {
        try {
          // backenddan normalizatsiya qilingan room qaytadi
          return await fetchRoom(id);
        } catch {
          return null;
        }
      })
    )
      .then(rows => setSaved(rows.filter(Boolean)))
      .catch(err => {
        console.error(err);
        setSaved([]);
      })
      .finally(() => setSavedLoading(false));
  }, []);

  // Demo contracts (saved’lardan uchta misol)
  useEffect(() => {
    const sample = saved.slice(0, 3).map((x, i) => ({
      ...x,
      status: i === 0 ? 'In progress' : 'Completed',
    }));
    setContracts(sample);
  }, [saved]);

  return (
    <section className="container-narrow py-4 mypage">
      <h1 className="mypage__title">My Page</h1>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'recent', label: 'Recently viewed' },
          { key: 'saved', label: 'Saved' },
          { key: 'reviews', label: 'Reviews' },
          { key: 'contracts', label: 'Contracts' },
          { key: 'profile', label: 'My info' },
        ].map(t => (
          <button
            key={t.key}
            className={`tabs__item ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {/* RECENTLY VIEWED */}
        {tab === 'recent' && (
          <>
            <div className="muted mb-2">
              You have <b>{recent.length}</b> recently viewed homes.
            </div>

            {recent.length === 0 ? (
              <div className="card-soft p-3">
                <div className="fw-semibold">No recent views yet</div>
                <div className="text-secondary small">Browse homes and your history will appear here.</div>
                <div className="mt-2">
                  <Link to="/search" className="btn btn-brand-subtle">Find homes</Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {recent.map(it => (
                  <div className="col-12 col-md-6 col-lg-4" key={it.id}>
                    <ListingCard item={it} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* SAVED (FAVORITES) */}
        {tab === 'saved' && (
          <>
            <div className="muted mb-2">
              You saved <b>{saved.length}</b> homes.
            </div>

            {savedLoading ? (
              <div className="card-soft p-3">Loading saved homes…</div>
            ) : saved.length === 0 ? (
              <div className="card-soft p-3">
                <div className="fw-semibold">No favorites yet</div>
                <div className="text-secondary small">Tap “Save ♥” on a home to add it here.</div>
                <div className="mt-2">
                  <Link to="/search" className="btn btn-brand-subtle">Explore homes</Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {saved.map(it => (
                  <div className="col-12 col-md-6" key={it.id}>
                    <ListingCard
                      item={it}
                      compact
                      footer={
                        <div className="d-grid mt-2">
                          <Link
                            to={`/search?q=${encodeURIComponent(it.city || '')}`}
                            className="btn btn-brand-subtle"
                          >
                            Find similar
                          </Link>
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && (
          <div className="card-soft p-3">
            {typeof Reviews === 'function' ? (
              <Reviews />
            ) : (
              <>
                <div className="fw-semibold">Reviews module not installed</div>
                <div className="text-secondary small">Add <code>./components/Reviews.jsx</code> to use this tab.</div>
              </>
            )}
          </div>
        )}

        {/* CONTRACTS (demo) */}
        {tab === 'contracts' && (
          <>
            <div className="muted mb-2">You have <b>{contracts.length}</b> contracts.</div>
            {contracts.length === 0 ? (
              <div className="card-soft p-3">
                <div className="fw-semibold">No contracts yet</div>
                <div className="text-secondary small">Request a contract from a listing detail page.</div>
              </div>
            ) : (
              <div className="row g-3">
                {contracts.map(it => (
                  <div className="col-12 col-md-6 col-lg-4" key={it.id}>
                    <ListingCard
                      item={it}
                      footer={
                        <>
                          <div className="badge-soft mt-2 d-inline-block">{it.status}</div>
                          <div className="d-grid mt-2">
                            <Link to={`/contracts/${it.id}`} className="btn btn-brand-subtle">View contract</Link>
                          </div>
                        </>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFILE (My info) */}
        {tab === 'profile' && (
          <div className="profile card-soft p-3">
            {typeof ProfileEditor === 'function' ? (
              <ProfileEditor
                user={{
                  email: user?.email || '',
                  phone: user?.phone || '',
                  avatarUrl: user?.avatarUrl || '',
                  name: user?.name || '',
                }}
                onSave={async (payload) => {
                  // Demo: localStorage ga saqlaymiz
                  const merged = { ...(user || {}), ...payload };
                  localStorage.setItem('user', JSON.stringify(merged));
                  alert('Saved! (demo)');
                }}
              />
            ) : (
              <>
                <div className="fw-semibold">Profile module not installed</div>
                <div className="text-secondary small">Add <code>./components/ProfileEditor.jsx</code> to use this tab.</div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}