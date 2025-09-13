import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getListingById } from '../../utils/listingsStore';
import './listingDetail.scss';
import ContractModal from './ContractModal';

export default function ListingDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const listing = getListingById(id);

  const [fav, setFav] = useState(false);
  const [openContract, setOpenContract] = useState(false);
  const pictures = (listing.images?.length ? listing.images : [listing.img]).filter(Boolean);


  useEffect(()=>{
    const favs = JSON.parse(localStorage.getItem('favorites')||'[]');
    setFav(favs.includes(id));
  }, [id]);

  if(!listing) return <div className="container py-5">Listing not found.</div>;

  const carouselId = `carousel-${listing.id}`;
  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem('favorites')||'[]');
    const i = favs.indexOf(id); if(i>=0) favs.splice(i,1); else favs.push(id);
    localStorage.setItem('favorites', JSON.stringify(favs));
    setFav(!fav);
  };

  return (
    <section className="container-narrow py-4 listing-detail">
      {/* CAROUSEL ... */}
      <div id={carouselId} className="carousel slide mb-4" data-bs-ride="false">
        <div className="carousel-inner rounded-3 overflow-hidden">
          {pictures.map((src, i) => (
            <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
              <img src={src} className="d-block w-100 ld-img" alt={`photo-${i}`} />
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Prev</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <h1 className="h4">{listing.title}</h1>
          <div className="text-secondary mb-2">{listing.city} • {listing.meta}</div>

          <div className="d-flex align-items-baseline gap-2 mb-3">
            <b className="fs-4">₩{(listing.priceMonthly||0).toLocaleString()}</b>
            <span className="text-secondary">/month</span>
            <span className="text-secondary ms-3">
              {listing.deposit===0?'No deposit':`Deposit ₩${(listing.deposit||0).toLocaleString()}`}
            </span>
            {listing.managementFee>0 && <span className="text-secondary ms-3">Mgmt ₩{listing.managementFee.toLocaleString()}</span>}
          </div>

          {listing.description && <p>{listing.description}</p>}

          {/* SPEC TABLE */}
          <div className="card-soft p-3 mb-3">
            <div className="row g-2">
              <Spec label="Size" value={listing.sizeM2 ? `${listing.sizeM2} m²` : '—'} />
              <Spec label="Rooms" value={listing.rooms ?? '—'} />
              <Spec label="Baths" value={listing.baths ?? '—'} />
              <Spec label="Floor" value={listing.floor || '—'} />
              <Spec label="Built year" value={listing.builtYear || '—'} />
              <Spec label="Heating" value={listing.heating || '—'} />
              <Spec label="Available from" value={listing.availableFrom || 'Immediately'} />
              <Spec label="Parking" value={listing.parking ? 'Available' : 'No'} />
              <Spec label="Pet friendly" value={listing.pet ? 'Yes' : 'No'} />
              <Spec label="Furnished" value={listing.furnished ? 'Yes' : 'No'} />
            </div>
          </div>

          {/* AMENITIES */}
          {listing.amenities?.length > 0 && (
            <>
              <div className="h6">Amenities</div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {listing.amenities.map((a,i)=> <span key={i} className="badge bg-light text-dark">{a}</span>)}
              </div>
            </>
          )}

          {/* RULES */}
          {listing.rules?.length > 0 && (
            <>
              <div className="h6">House rules</div>
              <ul className="mb-3">{listing.rules.map((r,i)=> <li key={i}>{r}</li>)}</ul>
            </>
          )}

          {/* MAP */}
          <div className="mapbox mt-3">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.address || listing.city)}&z=15&output=embed`}
              width="100%" height="320" style={{border:0}} loading="lazy" title="map"
            />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-12 col-lg-4">
          <div className="card-soft p-3 sticky-top" style={{top:'90px'}}>
            <div className="d-grid gap-2">
              <Link to={`/chat/${listing.ownerId || 'landlord_demo'}`} className="btn btn-brand">💬 Chat with landlord</Link>
              <button className="btn btn-outline-secondary" onClick={()=>setOpenContract(true)}>📑 Request contract</button>
              <button className={`btn ${fav?'btn-danger':'btn-outline-secondary'}`} onClick={toggleFav}>
                {fav ? '♥ In favorites' : '♡ Save to favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContractModal
        open={openContract}
        onClose={()=>setOpenContract(false)}
        listing={listing}
        onSent={()=> nav(`/chat/${listing.ownerId || 'landlord_demo'}`)}
      />
    </section>
  );
}

function Spec({label, value}) {
  return (
    <div className="col-6 col-md-4">
      <div className="text-secondary small">{label}</div>
      <div className="fw-semibold">{value}</div>
    </div>
  );
}