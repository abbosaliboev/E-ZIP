// src/pages/Post/NewListing.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './post.scss';

import { createRoomMultipart } from '../../services/room';
import { addUserListingFromForm } from '../../utils/listingsStore';

const ROOM_TYPES = ['ONE_ROOM', 'TWO_ROOM', 'THREE_ROOM', 'OFFICETEL', 'APARTMENT'];
const DIRECTIONS = ['EAST', 'WEST', 'SOUTH', 'NORTH', 'SOUTHEAST', 'SOUTHWEST', 'NORTHEAST', 'NORTHWEST'];
const HEATING = ['INDIVIDUAL', 'CENTRAL', 'DISTRICT'];
const ENTRANCE = ['STAIR', 'ELEVATOR'];

export default function NewListing() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    uploaderId: '',
    address: '',
    monthlyRentWon: '',
    depositWon: '',
    maintenanceFeeWon: '',
    roomType: 'ONE_ROOM',
    areaM2: '',
    roomCount: 1,
    bathroomCount: 1,
    direction: 'SOUTH',
    heatingType: 'INDIVIDUAL',
    entranceType: 'STAIR',
    buildingUse: '',
    approvalDate: '',
    floor: '',
    parkingAvailable: false,
    totalParkingSpots: '',
    availableFrom: '',
    description: '',
    options: '',
    securityFacilities: '',
    landlordName: '',
    landlordPhone: '',
    landlordBusinessRegNo: '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const onChange = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: v }));
  };
  const onFiles = (e) => setFiles(Array.from(e.target.files || []));

  const requiredOk = form.address && form.monthlyRentWon && form.depositWon && form.roomType;

  const submit = async (e) => {
    e.preventDefault();
    if (!requiredOk) {
      setErr('Please fill all required fields (address, monthly, deposit, room type).');
      return;
    }
    try {
      setSubmitting(true);
      setErr('');

      console.log('[POST] form:', form);
      console.log('[POST] files:', files.map(f => ({ name: f.name, size: f.size })));

      const res = await createRoomMultipart(form, files);
      console.log('[POST] response:', res);

      const newId = res?.roomId || res?.id;

      await addUserListingFromForm(newId, form, files); // optimistik ko‘rsatish
      alert(`Listing created!${newId ? `\nroomId: ${newId}` : ''}`);

      if (newId) nav(`/listing/${newId}`); else nav('/search');
    } catch (e2) {
      console.error('[POST] error:', e2);
      const apiMsg = e2?.response?.data?.message || e2?.message || 'Failed to create listing.';
      setErr(apiMsg);
      alert(`Create failed:\n${apiMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-narrow py-4">
      <h1 className="h4">Post a Room</h1>
      <p className="text-secondary small">Address will be geocoded by server. Images are uploaded via multipart/form-data.</p>

      {err && <div className="alert alert-warning">{err}</div>}

      <form onSubmit={submit} className="card-soft p-3">
        <div className="row g-3">

          <div className="col-12 col-md-6">
            <label className="form-label">Address *</label>
            <input className="form-control" placeholder="Road-name address" value={form.address} onChange={onChange('address')} required />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Monthly (₩) *</label>
            <input className="form-control" type="number" placeholder="Won" value={form.monthlyRentWon} onChange={onChange('monthlyRentWon')} required />
            <div className="form-text">Will be converted to 만원</div>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Deposit (₩) *</label>
            <input className="form-control" type="number" placeholder="Won" value={form.depositWon} onChange={onChange('depositWon')} required />
            <div className="form-text">Will be converted to 만원</div>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Maintenance fee (₩/mo)</label>
            <input className="form-control" type="number" placeholder="0" value={form.maintenanceFeeWon} onChange={onChange('maintenanceFeeWon')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Room type *</label>
            <select className="form-select" value={form.roomType} onChange={onChange('roomType')} required>
              {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Area (m²)</label>
            <input className="form-control" type="number" value={form.areaM2} onChange={onChange('areaM2')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Rooms</label>
            <input className="form-control" type="number" min="1" value={form.roomCount} onChange={onChange('roomCount')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Baths</label>
            <input className="form-control" type="number" min="1" value={form.bathroomCount} onChange={onChange('bathroomCount')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Direction</label>
            <select className="form-select" value={form.direction} onChange={onChange('direction')}>
              {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Heating</label>
            <select className="form-select" value={form.heatingType} onChange={onChange('heatingType')}>
              {HEATING.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Entrance</label>
            <select className="form-select" value={form.entranceType} onChange={onChange('entranceType')}>
              {ENTRANCE.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Building use</label>
            <input className="form-control" value={form.buildingUse} onChange={onChange('buildingUse')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Approval date</label>
            <input className="form-control" type="date" value={form.approvalDate} onChange={onChange('approvalDate')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Floor</label>
            <input className="form-control" type="number" value={form.floor} onChange={onChange('floor')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Parking available</label>
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" id="pk" checked={form.parkingAvailable} onChange={onChange('parkingAvailable')} />
              <label className="form-check-label" htmlFor="pk">Yes</label>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Total parking spots</label>
            <input className="form-control" type="number" value={form.totalParkingSpots} onChange={onChange('totalParkingSpots')} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Available from</label>
            <input className="form-control" type="date" value={form.availableFrom} onChange={onChange('availableFrom')} />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={form.description} onChange={onChange('description')} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Options (comma separated)</label>
            <input className="form-control" placeholder="Washer, Fridge, Air conditioner" value={form.options} onChange={onChange('options')} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Security (comma separated)</label>
            <input className="form-control" placeholder="CCTV, Digital lock" value={form.securityFacilities} onChange={onChange('securityFacilities')} />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Landlord name</label>
            <input className="form-control" value={form.landlordName} onChange={onChange('landlordName')} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Landlord phone</label>
            <input className="form-control" value={form.landlordPhone} onChange={onChange('landlordPhone')} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Business reg. no.</label>
            <input className="form-control" value={form.landlordBusinessRegNo} onChange={onChange('landlordBusinessRegNo')} />
          </div>

          <div className="col-12">
            <label className="form-label">Images (multiple)</label>
            <input className="form-control" type="file" multiple accept="image/*" onChange={onFiles} />
            <div className="form-text">{files.length} file(s) selected</div>
          </div>

          <div className="col-12">
            <button className="btn btn-brand" type="submit" disabled={submitting || !requiredOk}>
              {submitting ? 'Saving…' : 'Create listing'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}