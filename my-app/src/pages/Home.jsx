import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.scss';
import { LISTINGS } from '../mock/listings';
import { getAllListings } from '../utils/listingsStore';

// Korea provinces & major cities (autocomplete)
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

// Helpers
const fmtK = (n) => `₩${Math.round(n/1000)}k`;
const fmtM = (n) => `₩${Math.round(n/1_000_000)}M`;
const monthlySteps = Array.from({ length: 19 }, (_, i) => 200_000 + i * 100_000); // 200k..2,000k
const depositStepsM = [0, 1, 5, 10, 20, 30, 40, 50, 70, 100]; // in millions

export default function Home() {
  const nav = useNavigate();
  const listings = getAllListings(); // mock + user

  // Autocomplete state
  const [locQ, setLocQ] = useState('');
  const [locOpen, setLocOpen] = useState(false);

  const locFiltered = useMemo(() => {
    const q = locQ.trim().toLowerCase();
    if (!q) return KOREA_LOCS;
    return KOREA_LOCS.filter((x) => x.toLowerCase().includes(q));
  }, [locQ]);

  // blurda darhol yopilmasin
  const closeLocLater = () => setTimeout(() => setLocOpen(false), 120);

  // Submit -> /search?...
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [k, v] of fd.entries()) {
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

            {/* SEARCH BAR (full width) */}
            <div className="col-12">
              <div className="card-soft p-3 search-pill">
                <form onSubmit={onSearchSubmit}>
                  <div className="row g-2 align-items-end">

                    {/* Location + autocomplete */}
                    <div className="col-12 col-xl-4">
                      <label className="form-label small text-secondary">Location</label>
                      <div className="locbox position-relative">
                        <input
                          name="q"
                          className="form-control"
                          placeholder="University, station or city"
                          value={locQ}
                          onChange={(e) => setLocQ(e.target.value)}
                          onFocus={() => setLocOpen(true)}
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
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setLocQ(item);
                                    setLocOpen(false);
                                  }}
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
                        {monthlySteps.map((v) => (
                          <option key={v} value={v}>{fmtK(v)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Monthly max */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Monthly max</label>
                      <select name="monthlyMax" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {monthlySteps.map((v) => (
                          <option key={v} value={v}>{fmtK(v)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Deposit min */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Deposit min</label>
                      <select name="depositMin" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {depositStepsM.map((m) => (
                          <option key={m} value={m * 1_000_000}>
                            {m === 0 ? 'No deposit' : fmtM(m * 1_000_000)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Deposit max */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Deposit max</label>
                      <select name="depositMax" className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {depositStepsM.map((m) => (
                          <option key={m} value={m * 1_000_000}>
                            {m === 0 ? 'No deposit' : fmtM(m * 1_000_000)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Floor */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Floor</label>
                      <select name="floor" className="form-select">
                        <option value="">Any</option>
                        <option>1F</option>
                        <option>2F</option>
                        <option>3F+</option>
                      </select>
                    </div>

                    {/* Other options */}
                    <div className="col-6 col-md-3 col-xl-2">
                      <label className="form-label small text-secondary">Other options</label>
                      <select name="opt" className="form-select">
                        <option value="">None</option>
                        <option>Furnished</option>
                        <option>Parking</option>
                        <option>Pet Friendly</option>
                      </select>
                    </div>

                    {/* Refresh */}
                    <div className="col-6 col-md-2 col-xl-1 d-flex align-items-end">
                      <button
                        type="reset"
                        className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center"
                        title="Reset filters"
                      >
                        <i className="bi bi-arrow-clockwise fs-5"></i>
                      </button>
                    </div>

                    {/* Search */}
                    <div className="col-12 col-md-4 col-xl-2 d-flex align-items-end">
                      <button type="submit" className="btn btn-brand w-100 d-flex justify-content-center">
                        Search
                      </button>
                    </div>
                  </div>
                </form>

                {/* Popular shortcuts */}
                <div className="d-flex gap-2 flex-wrap mt-3 align-items-center">
                  <span className="text-secondary small">Popular:</span>
                  {['Hongdae','Gangnam','Jamsil','Haeundae','Seomyeon'].map((c)=>(
                    <button key={c} type="button" className="btn btn-sm btn-outline-secondary rounded-pill"
                      onClick={()=>setLocQ(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED (placeholder) */}
      <section className="py-5">
        <div className="container-narrow">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h4 m-0">Featured homes</h2>
            <button className="btn btn-link fw-bold">View all</button>
          </div>

          <div className="row g-3">
            {LISTINGS.map((x) => (
              <div className="col-12 col-sm-6 col-lg-4" key={x.id}>
                <a href={`/listing/${x.id}`} className="card-soft d-block h-100 p-0 text-reset">
                  <div className="position-relative ratio ratio-4x3">
                    <img src={x.img} alt={x.title} className="rounded-top-4 object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="h6 m-0">{x.title}</h3>
                    <div className="text-secondary small mt-1">{x.city} • {x.meta}</div>
                    <div className="d-flex align-items-baseline gap-2 mt-2">
                      <span className="fw-bold">₩{x.priceMonthly.toLocaleString()}</span>
                      <span className="text-secondary small">/mo</span>
                      <span className="text-secondary small ms-2">
                        {x.deposit === 0 ? 'No deposit' : `Deposit ₩${x.deposit.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}