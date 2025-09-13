import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './search.scss';
import { LISTINGS } from '../../mock/listings';

// Marker default fix (Leaflet bundling quirk)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25,41], iconAnchor:[12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// City -> approx coords (demo)
const CITY_COORDS = {
  Seoul: [37.5665, 126.9780],
  Busan: [35.1796, 129.0756],
  Incheon: [37.4563, 126.7052],
  Daegu: [35.8714, 128.6014],
  Daejeon: [36.3504, 127.3845],
  Gwangju: [35.1595, 126.8526],
  Ulsan: [35.5384, 129.3114],
  Cheongju: [36.6424, 127.4890],
  Jeju: [33.4996, 126.5312],
};

function useQuery(){
  const { search } = useLocation();
  return useMemo(()=> new URLSearchParams(search), [search]);
}

export default function SearchPage(){
  const q = useQuery();

  // URL params
  const text = q.get('q')?.toLowerCase() || '';
  const monthlyMin = Number(q.get('monthlyMin') || 0);
  const monthlyMax = Number(q.get('monthlyMax') || 9e9);
  const depositMin = q.get('depositMin') === '' ? 0 : Number(q.get('depositMin') || 0);
  const depositMax = q.get('depositMax') === '' ? 9e9 : Number(q.get('depositMax') || 9e9);
  const floor = q.get('floor') || '';
  const opt = q.get('opt') || '';
  const sort = q.get('sort') || 'newest'; // newest | price_low | price_high

  // Enrich listings with coords + createdAt (demo)
  const enriched = LISTINGS.map((x, i)=>({
    ...x,
    // demo createdAt: newer items later
    createdAt: new Date(Date.now() - i*86400000).toISOString(),
    coords: CITY_COORDS[x.city] || CITY_COORDS.Seoul
  }));

  // Filter
  const filtered = enriched.filter(x=>{
    const textOk = !text || `${x.title} ${x.city}`.toLowerCase().includes(text);
    const monthOk = x.priceMonthly >= monthlyMin && x.priceMonthly <= monthlyMax;
    const depOk = (x.deposit ?? 0) >= depositMin && (x.deposit ?? 0) <= depositMax;
    const floorOk = !floor || floor === 'Any' || true; // demo: floor data yo'q, keyin qo‘shamiz
    const optOk = !opt || opt === 'None' || true; // demo: options data yo‘q, keyin qo‘shamiz
    return textOk && monthOk && depOk && floorOk && optOk;
  });

  // Sort
  const sorted = [...filtered].sort((a,b)=>{
    if (sort === 'price_low') return a.priceMonthly - b.priceMonthly;
    if (sort === 'price_high') return b.priceMonthly - a.priceMonthly;
    // newest
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Map center: query city (if any match) else Seoul
  const center = (() => {
    const c = Object.keys(CITY_COORDS).find(k => text && k.toLowerCase().includes(text));
    return CITY_COORDS[c || 'Seoul'];
  })();

  return (
    <section className="container-narrow py-4">
      {/* Top bar: back to Home + result count + sort */}
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="btn btn-sm btn-outline-secondary">← Home</Link>
          <div className="fw-bold">{sorted.length} homes</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="small text-secondary">Sort</label>
          <select
            className="form-select form-select-sm"
            defaultValue={sort}
            onChange={(e)=>{
              q.set('sort', e.target.value);
              window.history.replaceState({}, '', `/search?${q.toString()}`);
              // page rerender uchun:
              window.dispatchEvent(new Event('popstate'));
            }}
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Layout: list + map */}
      <div className="search-layout">
        <div className="search-list">
          <div className="row g-3">
            {sorted.map(item=>(
              <div className="col-12 col-md-6" key={item.id}>
                <Link to={`/listing/${item.id}`} className="card-soft d-block h-100 p-0 text-reset">
                  <div className="position-relative ratio ratio-4x3">
                    <img src={item.img} alt={item.title} className="rounded-top-4 object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="h6 m-0">{item.title}</h3>
                    <div className="text-secondary small mt-1">{item.city} • {item.meta}</div>
                    <div className="d-flex align-items-baseline gap-2 mt-2">
                      <span className="fw-bold">₩{item.priceMonthly.toLocaleString()}</span>
                      <span className="text-secondary small">/mo</span>
                      <span className="text-secondary small ms-2">
                        {item.deposit===0 ? 'No deposit' : `Deposit ₩${item.deposit.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            {sorted.length===0 && (
              <div className="col-12">
                <div className="alert alert-light border">No homes match your filters.</div>
              </div>
            )}
          </div>
        </div>

        <div className="search-map">
          <MapContainer center={center} zoom={11} scrollWheelZoom style={{height:'100%', width:'100%'}}>
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sorted.map((it)=>(
              <Marker key={it.id} position={it.coords}>
                <Popup>
                  <div className="fw-bold mb-1" style={{maxWidth:180}}>{it.title}</div>
                  <div className="small text-secondary mb-1">{it.city} • {it.meta}</div>
                  <div className="small">
                    <b>₩{it.priceMonthly.toLocaleString()}</b>/mo · {it.deposit===0?'No deposit':`Dep ₩${it.deposit.toLocaleString()}`}
                  </div>
                  <div className="mt-2">
                    <Link className="btn btn-sm btn-primary" to={`/listing/${it.id}`}>View</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}