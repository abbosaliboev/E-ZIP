import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { searchRooms, fetchRooms } from '../../services/room';
import { getAllListings } from '../../utils/listingsStore';
import './search.scss';

// Leaflet default marker
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitToActive({ active }) {
  const map = useMap();
  useEffect(() => {
    if (active?.coords) {
      map.setView([active.coords.lat, active.coords.lng], 15, { animate: true });
    }
  }, [active, map]);
  return null;
}

export default function SearchPage() {
  const [params] = useSearchParams();

  // URL -> UI state
  const [q, setQ] = useState(params.get('q') || params.get('keyword') || '');
  const [sort, setSort] = useState(params.get('sort') || 'latest');

  // optional filters (URL’dan o‘qib olamiz)
  const monthlyMin = params.get('monthlyMin') || params.get('minMonthlyRent') || '';
  const monthlyMax = params.get('monthlyMax') || params.get('maxMonthlyRent') || '';
  const depositMin = params.get('depositMin') || params.get('minDeposit') || '';
  const depositMax = params.get('depositMax') || params.get('maxDeposit') || '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Aktiv karta (hover/click)
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx] || null;

  const load = async () => {
    setLoading(true);
    try {
      let rows = [];
      const hasKeyword = !!q;
      const hasFilter = monthlyMin || monthlyMax || depositMin || depositMax;

      if (hasKeyword || hasFilter) {
        const apiParams = { sort };
        if (q) apiParams.keyword = q; // ✅ backend param nomi
        if (monthlyMin) apiParams.minMonthlyRent = monthlyMin;
        if (monthlyMax) apiParams.maxMonthlyRent = monthlyMax;
        if (depositMin) apiParams.minDeposit = depositMin;
        if (depositMax) apiParams.maxDeposit = depositMax;

        rows = await searchRooms(apiParams);
      } else {
        // keyword yo‘q → umumiy ro‘yxat (latest)
        rows = await fetchRooms({ sort: 'latest' });
      }

      // Local user post’larni ham tepaga qo‘shamiz
      const locals = getAllListings();
      rows = [...locals, ...rows];

      // Frontend sort (zarurat bo‘lsa)
      if (sort === 'price_low') {
        rows.sort((a, b) => (Number(a.priceMonthly || 0) - Number(b.priceMonthly || 0)));
      } else if (sort === 'price_high') {
        rows.sort((a, b) => (Number(b.priceMonthly || 0) - Number(a.priceMonthly || 0)));
      }

      setItems(rows);
      setActiveIdx(0);
    } catch (e) {
      console.error(e);
      alert('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  // URL param o‘zgarsa, state yangilaymiz
  useEffect(() => {
    setQ(params.get('q') || params.get('keyword') || '');
    setSort(params.get('sort') || 'latest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Yuklash
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, monthlyMin, monthlyMax, depositMin, depositMax]);

  // Map markazi
  const mapFallbackCenter = useMemo(() => {
    if (active?.coords) return [active.coords.lat, active.coords.lng];
    return [37.5665, 126.9780]; // Seoul (fallback)
  }, [active]);

  return (
    <section className="search container-fluid py-3">
      <div className="container-narrow">
        {/* Top bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          <div className="fw-semibold">
            {loading ? 'Loading…' : `${items.length} places`}
            {q ? <span className="text-secondary"> for “{q}”</span> : null}
          </div>

          <div className="d-flex align-items-center gap-2">
            <label className="text-secondary small">Sort</label>
            <select
              className="form-select form-select-sm"
              style={{ width: 180 }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row gx-3">
          {/* LEFT: cards list */}
          <div className="col-12 col-lg-6 col-xl-7">
            <div className="list-scroll">
              {loading && <div className="text-secondary p-3">Loading…</div>}

              {!loading && items.length === 0 && (
                <div className="text-secondary p-3">No results.</div>
              )}

              <div className="row g-3">
                {items.map((x, idx) => (
                  <div
                    className="col-12"
                    key={x.id || `${x.address}-${idx}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                  >
                    <Link
                      to={`/listing/${x.id}`}
                      className={`card-soft d-block p-0 text-reset search-card ${idx === activeIdx ? 'is-active' : ''}`}
                    >
                      <div className="row g-0">
                        <div className="col-5">
                          <div className="ratio ratio-4x3">
                            <img
                              src={x.img || x.images?.[0]}
                              alt={x.title}
                              className="object-cover rounded-start-3"
                            />
                          </div>
                        </div>
                        <div className="col-7">
                          <div className="p-2">
                            <div className="small text-secondary">{x.city} • {x.meta}</div>
                            <div className="fw-semibold">{x.title}</div>
                            <div className="d-flex align-items-baseline gap-2 mt-1">
                              <span className="fw-bold">₩{Number(x.priceMonthly || 0).toLocaleString()}만</span>
                              <span className="text-secondary small">/mo</span>
                              <span className="text-secondary small ms-2">
                                {Number(x.deposit || 0) === 0
                                  ? 'No deposit'
                                  : `Deposit ₩${Number(x.deposit).toLocaleString()}만`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: sticky map */}
          <div className="col-12 col-lg-6 col-xl-5">
            <div className="map-wrap card-soft p-0 overflow-hidden">
              <MapContainer
                center={mapFallbackCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {items.map((x, idx) =>
                  x.coords ? (
                    <Marker
                      key={x.id || `m-${idx}`}
                      position={[x.coords.lat, x.coords.lng]}
                      icon={markerIcon}
                      eventHandlers={{ click: () => setActiveIdx(idx) }}
                    />
                  ) : null
                )}
                <FitToActive active={active} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}