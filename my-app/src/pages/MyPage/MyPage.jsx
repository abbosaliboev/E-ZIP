import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './mypage.scss';
import { LISTINGS } from '../../mock/listings';
import ProfileEditor from './components/ProfileEditor';
import Reviews from './components/Reviews';

const TABS = ['recent', 'saved', 'reviews', 'contracts', 'profile'];

const mockSavedIds = new Set([LISTINGS[0]?.id, LISTINGS[2]?.id].filter(Boolean));
const mockRecent = LISTINGS.slice(0, 3);
const mockContracts = LISTINGS.slice(0, 3).map((x, i) => ({
  ...x,
  status: i === 0 ? 'In progress' : 'Completed',
}));

const mockReviewsMine = [
  {
    id: 'r1',
    place: 'Buldang-dong • school area',
    when: '1 year ago',
    body: 'Kept it clean and quiet. Thanks!',
    by: 'You',
    city: 'Cheonan-si • Seobuk-gu',
    good: true,
  },
  {
    id: 'r2',
    place: 'Cheongju • Bungmun-dong',
    when: '2 years ago',
    body: 'Not bad overall. No smell issues.',
    by: 'You',
    city: 'Cheongju-si • Heungdeok-gu',
    good: false,
  },
];

const mockReviewsAboutMe = [
  {
    id: 'a1',
    by: 'Tenant A',
    place: 'Buldang-dong • school area',
    when: '1 year ago',
    body: 'Very tidy and quiet tenant. Thank you!',
    city: 'Cheonan-si • Seobuk-gu',
    good: true,
  },
];

function ListingCard({ item, compact=false, footer }) {
  return (
    <div className={`card-soft listing ${compact ? 'listing--compact':''}`}>
      <Link to={`/listing/${item.id}`} className="ratio ratio-4x3 d-block rounded-3 overflow-hidden">
        <img src={item.img} alt={item.title} className="object-cover" />
      </Link>
      <div className="p-3">
        <div className="small text-secondary">{item.city} • {item.meta}</div>
        <div className="fw-semibold mt-1">{item.title}</div>
        <div className="d-flex align-items-baseline gap-2 mt-1">
          <span className="fw-bold">₩{item.priceMonthly.toLocaleString()}</span>
          <span className="text-secondary small">/mo</span>
          <span className="text-secondary small ms-2">
            {item.deposit===0 ? 'No deposit' : `Deposit ₩${item.deposit.toLocaleString()}`}
          </span>
        </div>
        {footer}
      </div>
    </div>
  );
}

export default function MyPage(){
  const [tab, setTab] = useState('recent');
  const saved = useMemo(()=> LISTINGS.filter(x => mockSavedIds.has(x.id)), []);
  const recent = mockRecent;
  const contracts = mockContracts;

  return (
    <section className="container-narrow py-4 mypage">
      <h1 className="mypage__title">My Page</h1>

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
                        <Link to={`/search?q=${encodeURIComponent(it.city)}`} className="btn btn-brand-subtle">Find similar</Link>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'reviews' && <Reviews />}

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
          </>
        )}

        {tab==='profile' && (
        <div className="profile card-soft p-3">
            <ProfileEditor
            user={{ email: 'user@example.com', phone: '010-1234-5678', avatarUrl: '' }}
            onSave={async (payload)=>{
                // TODO: backend'ga yuborish (fetch/axios)
                // Misol uchun:
                // const fd = new FormData();
                // Object.entries(payload).forEach(([k,v])=> fd.append(k, v));
                // await fetch('/api/me', { method:'PUT', body: fd });

                console.log('Saving profile…', payload);
                alert('Saved! (demo)');
            }}
            />
        </div>
        )}
      </div>
    </section>
  );
}