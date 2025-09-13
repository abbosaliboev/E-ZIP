import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.scss';
import { fetchRooms } from '../services/room';
import { getAllListings } from '../utils/listingsStore';

// Autocomplete ro'yxat va helperlar sizdagi oldingi koddagidek qolsin (uzoq bo‘lgani uchun qisqartirmayman)
const KOREA_LOCS = [
  'Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju','Ulsan','Sejong',
  'Gyeonggi-do · Suwon','Gyeonggi-do · Seongnam','Gyeonggi-do · Yongin','Gyeonggi-do · Goyang','Gyeonggi-do · Bucheon',
  'Gangwon-do · Chuncheon','Gangwon-do · Gangneung',
  'Chungcheongbuk-do · Cheongju','Chungcheongnam-do · Cheonan','Chungcheongnam-do · Asan',
  'Jeollabuk-do · Jeonju','Jeollanam-do · Yeosu',
  'Gyeongsangbuk-do · Pohang','Gyeongsangbuk-do · Gyeongju',
  'Gyeongsangnam-do · Changwon','Gyeongsangnam-do · Gimhae',
  'Jeju-do · Jeju City','Jeju-do · Seogwipo',
];
const fmtK = (n) => `₩${Math.round(n/1000)}k`;
const fmtM = (n) => `₩${Math.round(n/1_000_000)}M`;
const monthlySteps = Array.from({ length: 19 }, (_, i) => 200_000 + i * 100_000);
const depositStepsM = [0, 1, 5, 10, 20, 30, 40, 50, 70, 100];

export default function Home() {
  const nav = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const apiLatest = await fetchRooms({ sort: 'latest' });
        const locals = getAllListings();
        setFeatured([...locals, ...apiLatest].slice(0, 6));
      } catch (e) {
        console.error(e);
        setFeatured(getAllListings().slice(0, 6));
      }
    })();
  }, []);

  // Autocomplete
  const [locQ, setLocQ] = useState('');
  const [locOpen, setLocOpen] = useState(false);
  const locFiltered = useMemo(() => {
    const q = locQ.trim().toLowerCase();
    if (!q) return KOREA_LOCS;
    return KOREA_LOCS.filter(x => x.toLowerCase().includes(q));
  }, [locQ]);
  const closeLocLater = () => setTimeout(() => setLocOpen(false), 120);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [k,v] of fd.entries()) {
      if (v !== '' && v != null) params.set(k, v);
    }
    nav(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient py-5">
        <div className="container-narrow">
          <div className="row g-4">
            <div className="col-12">
              <span className="badge-soft">Housing in Korea, designed for internationals</span>
              <h1 className="display-5 fw-bold mt-2 lh-1">
                Easy and <span className="highlight">foreigner-friendly</span> housing for everyone.
              </h1>
              <p className="text-secondary mt-2 mb-4">
                We’ve helped <b>9,548</b> tenants in Seoul, Busan, Cheongju and more.
              </p>
            </div>

            {/* SEARCH BAR */}
            <div className="col-12">
              <div className="card-soft p-3 search-pill">
                <form onSubmit={onSearchSubmit}>
                  <div className="row g-2 align-items-end">
                    {/* Location */}
                    <div className="col-12 col-xl-4">
                      <label className="form-label small text-secondary">Location</label>
                      <div className="locbox position-relative">
                        <input
                          name="q"
                          className="form-control"
                          placeholder="University, station or city"
                          value={locQ}
                          onChange={(e)=>setLocQ(e.target.value)}
                          onFocus={()=>setLocOpen(true)}
                          onBlur={closeLocLater}
                          autoComplete="off"
                        />
                        {locOpen && (
                          <div className="locbox__dropdown">
                            {locFiltered.length === 0 ? (
                              <div className="locbox__empty">No matches</div>
                            ) : (
                              locFiltered.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  className="locbox__item"
                                  onMouseDown={(e)=>e.preventDefault()}
                                  onClick={() => { setLocQ(item); setLocOpen(false); }}
                                >
                                  {item}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monthly min */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Monthly min</label>
                      <select name="monthlyMin" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {monthlySteps.map(v => <option key={v} value={v}>{fmtK(v)}</option>)}
                      </select>
                    </div>

                    {/* Monthly max */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Monthly max</label>
                      <select name="monthlyMax" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {monthlySteps.map(v => <option key={v} value={v}>{fmtK(v)}</option>)}
                      </select>
                    </div>

                    {/* Deposit min */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Deposit min</label>
                      <select name="depositMin" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {depositStepsM.map(m => (
                          <option key={m} value={m*1_000_000}>
                            {m===0 ? 'No deposit' : fmtM(m*1_000_000)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Deposit max */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Deposit max</label>
                      <select name="depositMax" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {depositStepsM.map(m => (
                          <option key={m} value={m*1_000_000}>
                            {m===0 ? 'No deposit' : fmtM(m*1_000_000)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search */}
                    <div className="col-12 col-md-4 col-xl-2 d-flex align-items-end">
                      <button type="submit" className="btn btn-brand w-100">Search</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-5">
        <div className="container-narrow">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h4 m-0">Featured homes</h2>
          </div>
          <div className="row g-3">
            {featured.map((x) => (
              <div className="col-12 col-sm-6 col-lg-4" key={x.id}>
                <Link to={`/listing/${x.id}`} className="card-soft d-block h-100 p-0 text-reset">
                  <div className="position-relative ratio ratio-4x3">
                    <img src={x.img} alt={x.title} className="rounded-top-4 object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="h6 m-0">{x.title}</h3>
                    <div className="text-secondary small mt-1">{x.city} • {x.meta}</div>
                    <div className="d-flex align-items-baseline gap-2 mt-2">
                      <span className="fw-bold">₩{Number(x.priceMonthly||0).toLocaleString()}만</span>
                      <span className="text-secondary small">/mo</span>
                      <span className="text-secondary small ms-2">
                        {Number(x.deposit||0)===0 ? 'No deposit' : `Deposit ₩${Number(x.deposit).toLocaleString()}만`}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}