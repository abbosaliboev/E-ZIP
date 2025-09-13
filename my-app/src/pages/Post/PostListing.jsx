import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './post.scss';

// Select opsiyalar (kerak bo‘lsa keyin API dan keladi)
const ROOM_TYPES = ['Studio', '1 Bedroom', '2 Bedrooms', 'Officetel', 'Villa'];
const DIRECTIONS = ['South', 'North', 'East', 'West', 'South-East', 'South-West'];
const HEATING_TYPES = ['Individual', 'Central'];
const ENTRANCE_TYPES = ['Stair', 'Elevator'];
const BUILDING_USES = ['Apartment', 'Officetel', 'Multi-family', 'Row house', 'Detached'];
const OPTIONS = ['Furnished', 'Air conditioner', 'Washer', 'Parking', 'Pet Friendly', 'Elevator', 'Balcony'];
const SECURITY = ['CCTV', 'Intercom', 'Doorlock', 'Security guard', 'Fire alarm'];

export default function PostListing(){
  const nav = useNavigate();
  const [photos, setPhotos] = useState([]); // File[]
  const [errors, setErrors] = useState({});

  const onPickPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    const merged = [...photos, ...files].slice(0, 10); // 10 ta limit
    setPhotos(merged);
  };
  const removePhoto = (idx) => {
    setPhotos(prev => prev.filter((_,i)=>i!==idx));
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Minimal tekshiruvlar
    const err = {};
    if(!fd.get('rent')) err.rent = 'Monthly rent is required';
    if(!fd.get('deposit')) err.deposit = 'Deposit is required';
    if(!fd.get('address1')) err.address1 = 'Address is required';
    if(!fd.get('landlordName')) err.landlordName = 'Landlord name is required';
    if(Object.keys(err).length){
      setErrors(err);
      window.scrollTo({ top: 0, behavior:'smooth' });
      return;
    }

    // Hozircha demo: FormData key-value log
    // Backendga yuborish o‘rniga, muvaffaqiyat xabari
    alert('Your listing has been submitted! (demo)');
    nav('/mypage');
  };

  return (
    <section className="container-narrow py-4">
      <h1 className="h4 mb-3">Post a Home</h1>

      <form className="post card-soft p-3" onSubmit={submit}>
        <div className="row g-3">
          {/* Col 1 */}
          <div className="col-12 col-lg-4">
            <div className="form-floating">
              <input name="rent" type="number" className={`form-control ${errors.rent?'is-invalid':''}`} placeholder="e.g., 50" />
              <label>Monthly rent (₩, x1,000)</label>
              {errors.rent && <div className="invalid-feedback">{errors.rent}</div>}
            </div>

            <div className="form-floating mt-3">
              <input name="roomType" className="form-control" placeholder="Room type" list="room-types" />
              <label>Room type</label>
              <datalist id="room-types">
                {ROOM_TYPES.map(x=><option key={x} value={x} />)}
              </datalist>
            </div>

            <div className="form-floating mt-3">
              <input name="floor" className="form-control" placeholder="e.g., 2F" />
              <label>Floor</label>
            </div>

            <div className="form-floating mt-3">
              <select name="parkingAllowed" className="form-select">
                <option value="yes">Available</option>
                <option value="no">Not available</option>
              </select>
              <label>Parking</label>
            </div>

            {/* Photos upload */}
            <div className="mt-4">
              <div className="fw-semibold mb-2">Photos <small className="text-secondary">({photos.length}/10)</small></div>
              <div className="post__photos">
                <label className="post__upload">
                  <input type="file" accept="image/*" multiple onChange={onPickPhotos} hidden />
                  <div className="post__uploadInner">
                    <span className="post__camera">📷</span>
                    <div className="text-secondary small">Add photos</div>
                  </div>
                </label>
                {photos.map((f, i)=>(
                  <div className="post__thumb" key={i}>
                    <img src={URL.createObjectURL(f)} alt={`photo-${i}`} />
                    <button type="button" className="post__remove" onClick={()=>removePhoto(i)}>×</button>
                  </div>
                ))}
              </div>
              <small className="text-secondary">Upload up to 10 images.</small>
            </div>
          </div>

          {/* Col 2 */}
          <div className="col-12 col-lg-4">
            <div className="form-floating">
              <input name="deposit" type="number" className={`form-control ${errors.deposit?'is-invalid':''}`} placeholder="e.g., 1000" />
              <label>Deposit (₩, x10,000)</label>
              {errors.deposit && <div className="invalid-feedback">{errors.deposit}</div>}
            </div>

            <div className="form-floating mt-3">
              <select name="direction" className="form-select">
                {DIRECTIONS.map(x=><option key={x}>{x}</option>)}
              </select>
              <label>Direction</label>
            </div>

            <div className="form-floating mt-3">
              <input name="area" type="number" className="form-control" placeholder="e.g., 50" />
              <label>Area (m²)</label>
            </div>

            <div className="form-floating mt-3">
              <select name="heating" className="form-select">
                {HEATING_TYPES.map(x=><option key={x}>{x}</option>)}
              </select>
              <label>Heating</label>
            </div>

            <div className="form-floating mt-3">
              <select name="entrance" className="form-select">
                {ENTRANCE_TYPES.map(x=><option key={x}>{x}</option>)}
              </select>
              <label>Entrance type</label>
            </div>

            <div className="form-floating mt-3">
              <input name="moveIn" type="date" className="form-control" />
              <label>Available from</label>
            </div>
          </div>

          {/* Col 3 */}
          <div className="col-12 col-lg-4">
            <div className="form-floating">
              <input name="rooms" type="number" className="form-control" placeholder="e.g., 1" />
              <label>Rooms</label>
            </div>

            <div className="form-floating mt-3">
              <input name="baths" type="number" className="form-control" placeholder="e.g., 1" />
              <label>Bathrooms</label>
            </div>

            <div className="form-floating mt-3">
              <select name="buildingUse" className="form-select">
                {BUILDING_USES.map(x=><option key={x}>{x}</option>)}
              </select>
              <label>Building use</label>
            </div>

            <div className="form-floating mt-3">
              <input name="approvalDate" type="date" className="form-control" />
              <label>Approval date</label>
            </div>

            <div className="form-floating mt-3">
              <input name="managementFee" type="number" className="form-control" placeholder="e.g., 50" />
              <label>Maintenance fee (₩/mo)</label>
            </div>

            <div className="form-floating mt-3">
              <input name="parkingCount" type="number" className="form-control" placeholder="e.g., 10" />
              <label>Total parking spots</label>
            </div>
          </div>

          {/* Options / Security multiline */}
          <div className="col-12 col-lg-6">
            <div className="form-floating">
              <input name="options" className="form-control" placeholder="e.g., options" list="opts" />
              <label>Options</label>
              <datalist id="opts">
                {OPTIONS.map(x=><option key={x} value={x} />)}
              </datalist>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="form-floating">
              <input name="security" className="form-control" placeholder="e.g., security" list="secs" />
              <label>Security / Safety</label>
              <datalist id="secs">
                {SECURITY.map(x=><option key={x} value={x} />)}
              </datalist>
            </div>
          </div>

          {/* Address */}
          <div className="col-12 col-lg-6">
            <div className="form-floating">
              <input name="address1" className={`form-control ${errors.address1?'is-invalid':''}`} placeholder="Road address" />
              <label>Address</label>
              {errors.address1 && <div className="invalid-feedback">{errors.address1}</div>}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="form-floating">
              <input name="address2" className="form-control" placeholder="Apt / Unit / Room" />
              <label>Address detail</label>
            </div>
          </div>

          <div className="col-12">
            <div className="form-floating">
              <textarea name="description" className="form-control" placeholder="Describe the place" style={{height:120}} />
              <label>Additional description</label>
            </div>
          </div>

          {/* Landlord info card */}
          <div className="col-12">
            <div className="card-soft p-3">
              <div className="fw-semibold mb-3">Landlord Information</div>
              <div className="row g-3">
                <div className="col-12 col-lg-6">
                  <div className="form-floating">
                    <input name="landlordName" className={`form-control ${errors.landlordName?'is-invalid':''}`} placeholder="Name" />
                    <label>Full name</label>
                    {errors.landlordName && <div className="invalid-feedback">{errors.landlordName}</div>}
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="form-floating">
                    <input name="phone" className="form-control" placeholder="010-1234-5678" />
                    <label>Phone</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input name="bizNo" className="form-control" placeholder="123-45-67890" />
                    <label>Business registration no. (optional)</label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={()=>nav(-1)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit listing</button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </section>
  );
}