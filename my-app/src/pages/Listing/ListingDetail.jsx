// src/pages/Listing/ListingDetail.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoom } from '../../services/room';
import { geocodeFallback } from '../../utils/geoFallback';
import './listingDetail.scss';

// historyStore: recently viewed + favorites (localStorage)
import {
  addRecent,
  getFavs,
  toggleFav as toggleFavStore,
} from '../../utils/historyStore';

export default function ListingDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [room, setRoom] = useState(null);
  const [idx, setIdx] = useState(0);

  // Favorite ids (localStorage’dan)
  const [favs, setFavs] = useState(getFavs());
  const isFav = favs.has(String(id));

  // Load room + add to recent
  useEffect(() => {
    (async () => {
      try {
        const r = await fetchRoom(id);
        const coords = r.coords ?? geocodeFallback(r.address);
        const full = { ...r, coords };
        setRoom(full);

        // Recently viewed’ga qo‘shamiz (saqlanadigan mini subset)
        addRecent({
          id: full.id,
          title: full.title,
          city: full.city,
          img: full.img,
          priceMonthly: full.priceMonthly,
          deposit: full.deposit,
          meta: full.meta,
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  // Rasm massivini tayyorlash
  const images = useMemo(() => {
    if (!room) return [];
    if (room.images?.length) return room.images;
    return room.img ? [room.img] : [];
  }, [room]);

  // Narx matni
  const priceMonthlyText = useMemo(() => {
    if (!room) return '';
    const v = Number(room.priceMonthly || 0);
    return `₩${v.toLocaleString()}만`;
  }, [room]);

  // Depozit matni
  const depositText = useMemo(() => {
    if (!room) return '';
    const d = Number(room.deposit || 0);
    return d === 0 ? 'No deposit' : `Deposit ₩${d.toLocaleString()}만`;
  }, [room]);

  // Favorite toggle
  const onToggleFav = () => {
    const next = toggleFavStore(String(id)); // historyStore qaytaradi: Set
    setFavs(next);
  };

  if (!room) return <div className="container py-4">Loading…</div>;

  return (
    <section className="listing-detail">
      {/* PHOTOS */}
      <div className="ld-photos">
        <div className="container-narrow">
          <div className="ld-photo-wrap">
            {images.length > 0 ? (
              <>
                <img
                  src={images[idx]}
                  alt={`photo-${idx}`}
                  className="ld-photo-main"
                />

                {/* Prev / Next */}
                {images.length > 1 && (
                  <>
                    <button
                      className="ld-nav ld-prev"
                      type="button"
                      onClick={() => setIdx((p) => (p - 1 + images.length) % images.length)}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      className="ld-nav ld-next"
                      type="button"
                      onClick={() => setIdx((p) => (p + 1) % images.length)}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Thumbs */}
                {images.length > 1 && (
                  <div className="ld-thumbs">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        className={`ld-thumb ${i === idx ? 'is-active' : ''}`}
                        onClick={() => setIdx(i)}
                        aria-label={`Go to image ${i + 1}`}
                      >
                        <img src={src} alt={`thumb-${i}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="ld-photo-empty">No photos</div>
            )}
          </div>
        </div>
      </div>

      {/* INFO BODY */}
      <div className="container-narrow ld-body">
        <div className="ld-info">
          {/* Title */}
          <h1 className="ld-title">{room.title}</h1>

          {/* Address */}
          <div className="ld-address">{room.address || room.city || '—'}</div>

          {/* Meta pills */}
          <div className="ld-meta-inline">
            {room.meta
              ?.split('·')
              .map((t, i) => <span key={i} className="pill">{t.trim()}</span>)}
            {room?.raw?.floor != null && <span className="pill">{room.raw.floor}F</span>}
          </div>

          {/* Price */}
          <div className="ld-price">
            <span className="ld-price-main">{priceMonthlyText}</span>
            <span className="ld-price-sub">/ month</span>
            <span className="ld-price-sub">• {depositText}</span>
            {Number(room.deposit || 0) === 0 && <span className="badge-soft">No deposit</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="ld-actions mb-2">
          <button
            className="btn btn-primary"
            onClick={() =>
              nav(
                `/chat?roomId=${room.id}` +
                `&to=${encodeURIComponent(room.raw?.landlordName || 'Landlord')}`
              )
            }
          >
            Chat with landlord
          </button>

          <button
            className="btn btn-outline-secondary"
            title="Send contract request in chat"
            onClick={() =>
              nav(
                `/chat?roomId=${room.id}` +
                `&to=${encodeURIComponent(room.raw?.landlordName || 'Landlord')}` +
                `&mode=request` +
                `&address=${encodeURIComponent(room.address || '')}` +
                `&monthly=${encodeURIComponent(room.priceMonthly ?? '')}` +
                `&deposit=${encodeURIComponent(room.deposit ?? '')}`
              )
            }
          >
            Request contract
          </button>

          <button
            className={`btn ${isFav ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={onToggleFav}
            title="Save to favorites"
          >
            {isFav ? 'Saved ♥' : 'Save ♥'}
          </button>
        </div>

        {/* DETAILS */}
        <div className="ld-section">
          <div className="ld-section__title">Description</div>
          <div className="ld-desc">
            {room.raw?.description || 'No description provided.'}
          </div>
        </div>

        <div className="ld-section">
          <div className="ld-section__title">Details</div>
          <ul className="ld-list">
            <li>Area: {room.raw?.areaM2 ? `${Math.round(room.raw.areaM2)} m²` : '—'}</li>
            <li>Rooms: {room.raw?.roomCount ?? 1}</li>
            <li>Bathrooms: {room.raw?.bathroomCount ?? 1}</li>
            <li>Floor: {room.raw?.floor ?? '—'}</li>
            <li>Heating: {room.raw?.heatingType || '—'}</li>
            <li>Entrance: {room.raw?.entranceType || '—'}</li>
            <li>Parking: {room.raw?.parkingAvailable ? 'Available' : '—'}</li>
          </ul>
        </div>

        <div className="ld-section">
          <div className="ld-section__title">Facilities</div>
          <ul className="ld-list">
            {(room.raw?.options || ['—']).map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>

        <div className="ld-section">
          <div className="ld-section__title">Security</div>
          <ul className="ld-list">
            {(room.raw?.securityFacilities || ['—']).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="ld-section">
          <div className="ld-section__title">Owner</div>
          <div className="ld-owner">
            <div className="avatar">{(room.raw?.landlordName || 'L').slice(0, 1)}</div>
            <div>
              <div className="name">{room.raw?.landlordName || '—'}</div>
              <div className="meta">{room.raw?.landlordPhone || ''}</div>
              {room.raw?.landlordBusinessRegNo && (
                <div className="meta">Reg. No: {room.raw.landlordBusinessRegNo}</div>
              )}
            </div>
          </div>
        </div>

        {/* MAP */}
        <div className="ld-section ld-map">
          <div className="ld-section__title">Location</div>
          <div className="ratio ratio-16x9 card-soft overflow-hidden">
            {room.coords ? (
              <iframe
                title="map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${room.coords.lng - 0.01}%2C${room.coords.lat - 0.01}%2C${room.coords.lng + 0.01}%2C${room.coords.lat + 0.01}&marker=${room.coords.lat}%2C${room.coords.lng}`}
              />
            ) : (
              <div className="ld-map__empty">Map is unavailable</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}