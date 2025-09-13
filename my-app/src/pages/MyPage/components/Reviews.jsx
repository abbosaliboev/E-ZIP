import { useEffect, useMemo, useState } from 'react';
import './reviews.scss';

// --- helpers (localStorage demo) ---
const LS_ME = 'reviews_mine';
const LS_ABOUT = 'reviews_about_me';

const seedMine = [
  {
    id: 'm1',
    author: 'You',
    target: 'Buldang-dong, Cheonan-si',
    city: 'Cheonan-si • Seobuk-gu',
    when: Date.now() - 320 * 24 * 3600 * 1000,
    rating: 5,
    body: 'Clean and quiet. Landlord was responsive.',
    helpful: 3,
  },
  {
    id: 'm2',
    author: 'You',
    target: 'Bungmun-dong, Cheongju-si',
    city: 'Cheongju-si • Heungdeok-gu',
    when: Date.now() - 670 * 24 * 3600 * 1000,
    rating: 3,
    body: 'Average overall, decent value.',
    helpful: 0,
  },
];

const seedAbout = [
  {
    id: 'a1',
    author: 'Tenant A',
    target: 'Your previous lease',
    city: 'Cheonan-si • Seobuk-gu',
    when: Date.now() - 360 * 24 * 3600 * 1000,
    rating: 5,
    body: 'Very tidy and quiet tenant. Thank you!',
    helpful: 5,
  },
];

function loadLS(key, seed) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    if (Array.isArray(v)) return v;
  } catch {}
  return seed;
}
function saveLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// --- star rating ---
function Stars({ value = 0, onChange, size = 18, readOnly = false }) {
  return (
    <div className="stars" role="radiogroup" aria-label="rating">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          className={`star ${value >= n ? 'is-on' : ''}`}
          style={{fontSize: size}}
          onClick={!readOnly && onChange ? () => onChange(n) : undefined}
          aria-checked={value===n}
          role="radio"
          tabIndex={0}
        >★</button>
      ))}
    </div>
  );
}

// --- single review item ---
function ReviewItem({ item, mine, onEdit, onDelete, onHelpful }) {
  const d = new Date(item.when);
  const dateStr = d.toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});
  return (
    <div className="rev">
      <div className="rev__avatar">{mine ? '🧑' : '🙂'}</div>
      <div className="rev__body">
        <div className="rev__meta">
          <div className="rev__who">
            <b>{item.author}</b> • {item.city} • {dateStr}
          </div>
          <Stars value={item.rating} readOnly />
        </div>
        <div className="rev__target small text-secondary">{item.target}</div>
        <div className="rev__text">{item.body}</div>

        <div className="rev__actions">
          <button className="btn btn-xs btn-outline-secondary" onClick={()=>onHelpful?.(item.id)}>👍 Helpful ({item.helpful || 0})</button>
          {mine && (
            <>
              <button className="btn btn-xs btn-outline-secondary" onClick={()=>onEdit?.(item)}>Edit</button>
              <button className="btn btn-xs btn-outline-danger" onClick={()=>onDelete?.(item.id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- composer (create / edit) ---
function Composer({ initial, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initial?.rating || 5);
  const [target, setTarget] = useState(initial?.target || '');
  const [city, setCity] = useState(initial?.city || '');
  const [body, setBody] = useState(initial?.body || '');

  const canPost = rating>0 && target.trim() && city.trim() && body.trim().length>=5;

  const submit = (e) => {
    e.preventDefault();
    if (!canPost) return;
    onSubmit?.({
      ...initial,
      rating,
      target: target.trim(),
      city: city.trim(),
      body: body.trim(),
    });
  };

  return (
    <form className="composer card-soft p-3" onSubmit={submit}>
      <div className="d-flex align-items-center gap-2 mb-2">
        <div className="fw-semibold">{initial ? 'Edit your review' : 'Write a review'}</div>
        <Stars value={rating} onChange={setRating} />
      </div>
      <div className="row g-2">
        <div className="col-12 col-md-6">
          <input className="form-control" placeholder="Place / listing (e.g., Hongdae studio)" value={target} onChange={e=>setTarget(e.target.value)} />
        </div>
        <div className="col-12 col-md-6">
          <input className="form-control" placeholder="City / district" value={city} onChange={e=>setCity(e.target.value)} />
        </div>
        <div className="col-12">
          <textarea className="form-control" placeholder="Share details about cleanliness, noise, landlord responsiveness…" rows={4} value={body} onChange={e=>setBody(e.target.value)} />
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-2">
        {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>}
        <button className="btn btn-primary" disabled={!canPost}>{initial ? 'Save changes' : 'Post review'}</button>
      </div>
    </form>
  );
}

export default function Reviews(){
  const [mine, setMine] = useState(()=>loadLS(LS_ME, seedMine));
  const [about, setAbout] = useState(()=>loadLS(LS_ABOUT, seedAbout));
  const [sort, setSort] = useState('newest'); // newest|helpful
  const [editing, setEditing] = useState(null); // item or null
  const [showComposer, setShowComposer] = useState(false);

  useEffect(()=>saveLS(LS_ME, mine), [mine]);
  useEffect(()=>saveLS(LS_ABOUT, about), [about]);

  const sortFn = useMemo(()=>{
    if (sort === 'helpful') return (a,b)=> (b.helpful||0) - (a.helpful||0) || (b.when - a.when);
    return (a,b)=> b.when - a.when;
  }, [sort]);

  const mineSorted = useMemo(()=> [...mine].sort(sortFn), [mine, sortFn]);
  const aboutSorted = useMemo(()=> [...about].sort(sortFn), [about, sortFn]);

  const addMine = (payload) => {
    const item = {
      id: 'm' + Math.random().toString(36).slice(2,8),
      author: 'You',
      target: payload.target,
      city: payload.city,
      rating: payload.rating,
      body: payload.body,
      helpful: 0,
      when: Date.now(),
    };
    setMine(prev => [item, ...prev]);
    setShowComposer(false);
  };
  const updateMine = (payload) => {
    setMine(prev => prev.map(x => x.id === payload.id ? {...x, ...payload, when: Date.now()} : x));
    setEditing(null);
  };
  const deleteMine = (id) => {
    if (!window.confirm('Delete this review?')) return;
    setMine(prev => prev.filter(x => x.id !== id));
  };
  const helpful = (list, setList) => (id) => {
    setList(prev => prev.map(x => x.id===id ? {...x, helpful: (x.helpful||0)+1} : x));
  };

  return (
    <div className="reviews-full">
      {/* header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        <div className="h6 m-0">Reviews</div>
        <div className="d-flex align-items-center gap-2">
          <label className="small text-secondary">Sort</label>
          <select className="form-select form-select-sm" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>
      </div>

      {/* About me */}
      <div className="h6 mt-2 mb-2">About me <span className="chev">›</span></div>
      <div className="reviews__list">
        {aboutSorted.map(it=>(
          <ReviewItem key={it.id} item={it} mine={false} onHelpful={helpful(about, setAbout)} />
        ))}
        {aboutSorted.length===0 && <div className="alert alert-light border">No reviews yet.</div>}
      </div>

      {/* My reviews */}
      <div className="h6 mt-4 mb-2">My reviews <span className="chev">›</span></div>

      {editing ? (
        <Composer initial={editing} onSubmit={updateMine} onCancel={()=>setEditing(null)} />
      ) : showComposer ? (
        <Composer onSubmit={addMine} onCancel={()=>setShowComposer(false)} />
      ) : (
        <div className="d-flex gap-2 mb-2">
          <button className="btn btn-outline-secondary" onClick={()=>setShowComposer(true)}>Write a review</button>
          <button className="btn btn-link">Review guidelines</button>
        </div>
      )}

      <div className="reviews__list">
        {mineSorted.map(it=>(
          <ReviewItem
            key={it.id}
            item={it}
            mine
            onHelpful={helpful(mine, setMine)}
            onEdit={setEditing}
            onDelete={deleteMine}
          />
        ))}
        {mineSorted.length===0 && <div className="alert alert-light border">You haven’t written any reviews yet.</div>}
      </div>
    </div>
  );
}