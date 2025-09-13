import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllListings } from '../../utils/listingsStore';

export default function Search(){
  const [params] = useSearchParams();
  const initialQ = params.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [all, setAll] = useState([]);
  const [sort, setSort] = useState('latest'); // default sort

  const reload = () => setAll(getAllListings());

  useEffect(() => {
    reload();
    const onStorage = (e) => { if (e.key === 'user_listings_v1') reload(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // filtered + sorted
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = all.filter(x => {
      if (!s) return true;
      return (
        (x.title||'').toLowerCase().includes(s) ||
        (x.city||'').toLowerCase().includes(s) ||
        (x.address||'').toLowerCase().includes(s) ||
        (x.meta||'').toLowerCase().includes(s)
      );
    });

    // Sort
    if (sort === 'price_low') {
      rows = [...rows].sort((a,b)=> (a.priceMonthly||0) - (b.priceMonthly||0));
    } else if (sort === 'price_high') {
      rows = [...rows].sort((a,b)=> (b.priceMonthly||0) - (a.priceMonthly||0));
    } else if (sort === 'latest') {
      rows = [...rows].sort((a,b)=>{
        const ta = Number((a.id||'').replace('c_','')) || 0;
        const tb = Number((b.id||'').replace('c_','')) || 0;
        return tb - ta; // newest first
      });
    }

    return rows;
  }, [q, all, sort]);

  const active = filtered[0];
  const mapQuery = active ? (active.address || active.city || '') : (q || 'Seoul');

  return (
    <section className="container-fluid py-3">
      <div className="container-narrow mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Search city, title, address…"
              value={q}
              onChange={e=>setQ(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/post" className="btn btn-primary w-100">Post a listing</Link>
          </div>
        </div>
      </div>

      {/* 2 column layout */}
      <div className="row g-0">
        {/* LEFT: scrollable cards */}
        <div className="col-12 col-lg-6 p-3" style={{maxHeight:'calc(100vh - 120px)', overflowY:'auto'}}>
          <div className="small text-secondary mb-2">{filtered.length} results</div>
          <div className="row g-3">
            {filtered.map(x => (
              <div className="col-12" key={x.id}>
                <Link to={`/listing/${x.id}`} className="card-soft d-block text-reset">
                  <div className="ratio ratio-16x9">
                    <img src={x.img || (x.images && x.images[0])} alt={x.title} className="object-cover rounded-top-3" />
                  </div>
                  <div className="p-3">
                    <div className="small text-secondary">{x.city} • {x.meta}</div>
                    <div className="fw-semibold">{x.title}</div>
                    <div className="d-flex gap-2 align-items-baseline mt-1">
                      <b>₩{Number(x.priceMonthly||0).toLocaleString()}</b>
                      <span className="text-secondary">/mo</span>
                      <span className="text-secondary small ms-2">
                        {Number(x.deposit||0)===0 ? 'No deposit' : `Deposit ₩${Number(x.deposit).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            {filtered.length===0 && <div className="text-secondary">No results.</div>}
          </div>
        </div>

        {/* RIGHT: sticky map full height */}
        <div className="col-12 col-lg-6 p-0">
        <div className="position-sticky" style={{ top: '0', height: '80vh' }}>
            <iframe
            key={mapQuery}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`}
            title="map"
            style={{
                width: '100%',
                height: '100%',
                border: '0',
                borderRadius: '0'
            }}
            loading="lazy"
            />
        </div>
        </div>
      </div>
    </section>
  );
}