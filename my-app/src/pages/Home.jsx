import { useMemo, useState } from 'react';
import './home.scss';
import { LISTINGS } from '../mock/listings';

// Location uchun ro'yxat (provinsiyalar + yirik shaharlar)
const KOREA_LOCS = [
  // Special/Metropolitan Cities
  'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Sejong',
  // Provinces (do)
  'Gyeonggi-do · Suwon', 'Gyeonggi-do · Seongnam', 'Gyeonggi-do · Yongin', 'Gyeonggi-do · Goyang', 'Gyeonggi-do · Bucheon',
  'Gangwon-do · Chuncheon', 'Gangwon-do · Gangneung',
  'Chungcheongbuk-do · Cheongju', 'Chungcheongnam-do · Cheonan', 'Chungcheongnam-do · Asan',
  'Jeollabuk-do · Jeonju', 'Jeollanam-do · Yeosu',
  'Gyeongsangbuk-do · Pohang', 'Gyeongsangbuk-do · Gyeongju',
  'Gyeongsangnam-do · Changwon', 'Gyeongsangnam-do · Gimhae',
  'Jeju-do · Jeju City', 'Jeju-do · Seogwipo',
];

// Helpers
const fmtK = (n) => `₩${Math.round(n/1000)}k`;
const fmtM = (n) => `₩${Math.round(n/1_000_000)}M`;
const monthlySteps = Array.from({length: 19}, (_,i)=>200_000 + i*100_000); // 200k..2,000k
const depositStepsM = [0,1,5,10,20,30,40,50,70,100]; // in millions

export default function Home(){
  // Location autocomplete state
  const [locQ, setLocQ] = useState('');
  const [locOpen, setLocOpen] = useState(false);

  const locFiltered = useMemo(() => {
    const q = locQ.trim().toLowerCase();
    if (!q) return KOREA_LOCS;
    return KOREA_LOCS.filter(x => x.toLowerCase().includes(q));
  }, [locQ]);

  // blurda darhol yopilmasligi uchun kichik delay
  const closeLocLater = () => setTimeout(() => setLocOpen(false), 120);

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

            {/* Search Bar — FULL WIDTH, no right image */}
            <div className="col-12">
              <div className="card-soft p-3 search-pill">
                <div className="row g-2 align-items-end">
                  {/* Location with autocomplete */}
                  <div className="col-12 col-xl-4">
                    <label className="form-label small text-secondary">Location</label>
                    <div className="locbox position-relative">
                      <input
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

                  {/* Monthly payment: MIN */}
                  <div className="col-6 col-md-3 col-xl-2">
                    <label className="form-label small text-secondary">Monthly min</label>
                    <select className="form-select" defaultValue="">
                      <option value="">Any</option>
                      {monthlySteps.map(v => (
                        <option key={v} value={v}>{fmtK(v)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly payment: MAX */}
                  <div className="col-6 col-md-3 col-xl-2">
                    <label className="form-label small text-secondary">Monthly max</label>
                    <select className="form-select" defaultValue="">
                      <option value="">Any</option>
                      {monthlySteps.map(v => (
                        <option key={v} value={v}>{fmtK(v)}</option>
                      ))}
                    </select>
                  </div>

                    {/* Deposit min */}
                    <div className="col-6 col-md-3 col-xl-2">
                    <label className="form-label small text-secondary">Deposit min</label>
                    <select className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {depositStepsM.map(m => (
                        <option key={m} value={m*1_000_000}>
                            {m === 0 ? 'No deposit' : fmtM(m*1_000_000)}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Deposit max */}
                    <div className="col-6 col-md-3 col-xl-2">
                    <label className="form-label small text-secondary">Deposit max</label>
                    <select className="form-select" defaultValue="">
                        <option value="">Any</option>
                        {depositStepsM.map(m => (
                        <option key={m} value={m*1_000_000}>
                            {m === 0 ? 'No deposit' : fmtM(m*1_000_000)}
                        </option>
                        ))}
                    </select>
                    </div>

                  {/* Floor */}
                  <div className="col-6 col-md-3 col-xl-2">
                    <label className="form-label small text-secondary">Floor</label>
                    <select className="form-select">
                      <option>Any</option>
                      <option>1F</option>
                      <option>2F</option>
                      <option>3F+</option>
                    </select>
                  </div>

                  {/* Other Options */}
                  <div className="col-6 col-md-3 col-xl-2">
                    <label className="form-label small text-secondary">Other options</label>
                    <select className="form-select">
                      <option>None</option>
                      <option>Furnished</option>
                      <option>Parking</option>
                      <option>Pet Friendly</option>
                    </select>
                  </div>

                  {/* Refresh */}
                  <div className="col-6 col-md-2 col-xl-1 d-flex align-items-end">
                    <button className="btn btn-outline-secondary w-100" title="Reset filters">⟳</button>
                  </div>

                  {/* Search */}
                  <div className="col-12 col-md-4 col-xl-2 d-flex align-items-end">
                    <button className="btn btn-brand w-100">Search</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED (o'zgarmagan) */}
      <section className="py-5">
        <div className="container-narrow">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h4 m-0">Featured homes</h2>
            <button className="btn btn-link fw-bold">View all</button>
          </div>

          <div className="row g-3">
            {LISTINGS.map((x)=>(
              <div className="col-12 col-sm-6 col-lg-4" key={x.id}>
                <a href={`/listing/${x.id}`} className="card-soft d-block h-100 p-0 text-reset">
                  <div className="position-relative ratio ratio-4x3">
                    <img src={x.img} alt={x.title} className="rounded-top-4 object-cover" />
                    {x.deposit===0 && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-white text-dark fw-bold rounded-pill">
                        No deposit
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="h6 m-0">{x.title}</h3>
                    <div className="text-secondary small mt-1">{x.city} • {x.meta}</div>
                    <div className="d-flex align-items-baseline gap-2 mt-2">
                      <span className="fw-bold">${x.priceMonthly}</span>
                      <span className="text-secondary small">/mo</span>
                      <span className="text-secondary small ms-2">
                        {x.deposit===0 ? 'No deposit' : `Deposit $${x.deposit}`}
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