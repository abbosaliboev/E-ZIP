import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoom } from '../../services/room';
import { geocodeFallback } from '../../utils/geoFallback';
import './listingDetail.scss';

const FAV_KEY = 'fav_ids_v1';
const getFavs = () => {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
  catch { return new Set(); }
};
const saveFavs = (set) => localStorage.setItem(FAV_KEY, JSON.stringify([...set]));

export default function ListingDetail(){
  const { id } = useParams();
  const nav = useNavigate();

  const [room, setRoom] = useState(null);
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState(getFavs());
  const isFav = favs.has(String(id));

  useEffect(() => {
    (async () => {
      try {
        const r = await fetchRoom(id);
        // backend coords bo'lmasa – manzildan fallback topamiz
        const coords = r.coords ?? geocodeFallback(r.address);
        setRoom({ ...r, coords });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const images = useMemo(() => {
    if (!room) return [];
    if (room.images?.length) return room.images;
    return room.img ? [room.img] : [];
  }, [room]);

  const priceMonthlyText = useMemo(() => {
    if (!room) return '';
    const v = Number(room.priceMonthly || 0);
    return `₩${v.toLocaleString()}만`;
  }, [room]);

  const depositText = useMemo(() => {
    if (!room) return '';
    const d = Number(room.deposit || 0);
    return d === 0 ? 'No deposit' : `Deposit ₩${d.toLocaleString()}만`;
  }, [room]);

  const toggleFav = () => {
    const next = new Set(favs);
    const key = String(id);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setFavs(next);
    saveFavs(next);
  };

  if (!room) return <div className="container py-4">Loading…</div>;

  return (
    <section className="listing-detail">
      {/* TOP PHOTOS */}
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
                      onClick={()=> setIdx((p)=>(p-1+images.length)%images.length)}
                      aria-label="Previous image"
                    >‹</button>
                    <button
                      className="ld-nav ld-next"
                      type="button"
                      onClick={()=> setIdx((p)=>(p+1)%images.length)}
                      aria-label="Next image"
                    >›</button>
                  </>
                )}

                {/* Thumbs */}
                {images.length > 1 && (
                  <div className="ld-thumbs">
                    {images.map((src, i)=>(
                      <button
                        key={i}
                        className={`ld-thumb ${i===idx?'is-active':''}`}
                        onClick={()=>setIdx(i)}
                        aria-label={`Go to image ${i+1}`}
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

      {/* Body */}
      <div className="container-narrow ld-body">
        {/* Title & price */}
        <h1 className="h4 mb-1 ">{room.title}</h1>
        <div className="ld-price mb-1">
          <span className="ld-price__main mb-1">{priceMonthlyText}</span>
          <span className="ld-price__sub mb-1">/mo</span>
          <span className="ld-price__dep mb-1">{depositText}</span>
        </div>
        <div className="ld-meta text-secondary mb-3">
          {room.city} • {room.meta}
          {room.address ? <> • {room.address}</> : null}
        </div>

        {/* Actions */}
        <div className="ld-actions mb-3">
          <button
            className="btn btn-primary"
            onClick={() =>
              nav(`/chat?roomId=${room.id}&to=${encodeURIComponent(room.raw?.landlordName || 'Landlord')}`)
            }
          >
            Chat with landlord
          </button>
          <button
            className="btn btn-outline-secondary"
            title="Send contract request in chat"
            onClick={() =>
              nav(`/chat?roomId=${room.id}&to=${encodeURIComponent(room.raw?.landlordName || 'Landlord')}&mode=request`)
            }
          >
            Request contract
          </button>
          <button
            className={`btn ${isFav ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={toggleFav}
            title="Save to favorites"
          >
            {isFav ? 'Saved ♥' : 'Save ♥'}
          </button>
        </div>

        {/* Details */}
        <div className="card-soft p-3 ld-details">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="text-secondary small">Area</div>
              <div className="fw-semibold">
                {room.raw?.areaM2 ? `${Math.round(room.raw.areaM2)} m²` : '—'}
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary small">Rooms / Baths</div>
              <div className="fw-semibold">
                {(room.raw?.roomCount ?? 1)} / {(room.raw?.bathroomCount ?? 1)}
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary small">Floor</div>
              <div className="fw-semibold">{room.raw?.floor ?? '—'}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary small">Heating / Entrance</div>
              <div className="fw-semibold">
                {(room.raw?.heatingType || '—')} / {(room.raw?.entranceType || '—')}
              </div>
            </div>

            <div className="col-12">
              <div className="text-secondary small">Description</div>
              <div className="fw-semibold">
                {room.raw?.description || 'No description provided.'}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="text-secondary small">Options</div>
              <div>{(room.raw?.options || []).join(', ') || '—'}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="text-secondary small">Security</div>
              <div>{(room.raw?.securityFacilities || []).join(', ') || '—'}</div>
            </div>

            <div className="col-12 col-md-6">
              <div className="text-secondary small">Landlord</div>
              <div>{room.raw?.landlordName || '—'}</div>
              <div className="text-secondary small">{room.raw?.landlordPhone || ''}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="text-secondary small">Business reg. no.</div>
              <div>{room.raw?.landlordBusinessRegNo || '—'}</div>
            </div>
          </div>
        </div>

        {/* Map (pastda) */}
        <div className="ld-map">
          <div className="text-secondary small mb-1">Location</div>
          <div className="ratio ratio-16x9 card-soft overflow-hidden">
            {room.coords ? (
              <iframe
                title="map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${room.coords.lng-0.01}%2C${room.coords.lat-0.01}%2C${room.coords.lng+0.01}%2C${room.coords.lat+0.01}&marker=${room.coords.lat}%2C${room.coords.lng}`}
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