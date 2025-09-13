import { useNavigate } from 'react-router-dom';
import { addListing } from '../utils/listingsStore';

export default function NewListing(){
  const nav = useNavigate();
  const onSubmit = (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row = addListing({
      title: fd.get('title'),
      city: fd.get('city'),
      address: fd.get('address'),
      priceMonthly: Number(fd.get('price')||0),
      deposit: Number(fd.get('deposit')||0),
      meta: fd.get('meta'),
      img: fd.get('img') || 'https://picsum.photos/seed/custom/1000/600',
      images: [fd.get('img') || 'https://picsum.photos/seed/custom/1000/600'],
      description: fd.get('desc') || '',
      ownerId: 'landlord_demo',
      // Qo‘shimcha maydonlar (quyida detail’da ko‘rinadi)
      sizeM2: Number(fd.get('size')||0),
      rooms: Number(fd.get('rooms')||0),
      baths: Number(fd.get('baths')||0),
      floor: fd.get('floor') || '',
      builtYear: fd.get('builtYear') || '',
      heating: fd.get('heating') || '',
      parking: fd.get('parking') === 'on',
      pet: fd.get('pet') === 'on',
      furnished: fd.get('furnished') === 'on',
      managementFee: Number(fd.get('mgmt')||0),
      availableFrom: fd.get('availableFrom') || '',
      amenities: (fd.get('amenities')||'').split(',').map(s=>s.trim()).filter(Boolean),
      rules: (fd.get('rules')||'').split(',').map(s=>s.trim()).filter(Boolean),
    });
    nav(`/listing/${row.id}`); // darhol detailga
  };

  return (
    <section className="container-narrow py-4">
      <h1 className="h5 mb-2">Post a new listing</h1>
      <form onSubmit={onSubmit} className="card-soft p-3">
        <div className="row g-2">
          <div className="col-md-6"><input name="title" className="form-control" placeholder="Title *" required/></div>
          <div className="col-md-3"><input name="city" className="form-control" placeholder="City *" required/></div>
          <div className="col-md-3"><input name="address" className="form-control" placeholder="Address"/></div>

          <div className="col-md-3"><input name="price" type="number" className="form-control" placeholder="Monthly ₩ *" required/></div>
          <div className="col-md-3"><input name="deposit" type="number" className="form-control" placeholder="Deposit ₩"/></div>
          <div className="col-md-3"><input name="size" type="number" className="form-control" placeholder="Size m²"/></div>
          <div className="col-md-3"><input name="meta" className="form-control" placeholder="Meta (e.g. 1 bed · 28m²)"/></div>

          <div className="col-md-2"><input name="rooms" type="number" className="form-control" placeholder="Rooms"/></div>
          <div className="col-md-2"><input name="baths" type="number" className="form-control" placeholder="Baths"/></div>
          <div className="col-md-2"><input name="floor" className="form-control" placeholder="Floor (e.g. 3F)"/></div>
          <div className="col-md-2"><input name="builtYear" className="form-control" placeholder="Built year"/></div>
          <div className="col-md-2"><input name="heating" className="form-control" placeholder="Heating type"/></div>
          <div className="col-md-2"><input name="mgmt" type="number" className="form-control" placeholder="Mgmt fee ₩"/></div>

          <div className="col-md-4"><input name="img" className="form-control" placeholder="Main image URL"/></div>
          <div className="col-md-4"><input name="amenities" className="form-control" placeholder="Amenities (comma separated)"/></div>
          <div className="col-md-4"><input name="rules" className="form-control" placeholder="Rules (comma separated)"/></div>

          <div className="col-md-3"><input type="date" name="availableFrom" className="form-control" placeholder="Available from"/></div>
          <div className="col-md-9"><input name="desc" className="form-control" placeholder="Short description"/></div>

          <div className="col-12 d-flex gap-3 mt-2">
            <label className="form-check"><input type="checkbox" name="parking" className="form-check-input"/> <span className="form-check-label">Parking</span></label>
            <label className="form-check"><input type="checkbox" name="pet" className="form-check-input"/> <span className="form-check-label">Pet friendly</span></label>
            <label className="form-check"><input type="checkbox" name="furnished" className="form-check-input"/> <span className="form-check-label">Furnished</span></label>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-primary">Post</button>
        </div>
      </form>
    </section>
  );
}