export default function Login(){
    return (
      <div className="container-narrow py-5">
        <h1 className="h3">Log in</h1>
        <div className="row g-3 mt-2">
          <div className="col-12 col-md-6">
            <label className="form-label">Email</label>
            <input className="form-control" placeholder="you@example.com"/>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="••••••••"/>
          </div>
          <div className="col-12">
            <button className="btn-brand">Continue</button>
          </div>
        </div>
      </div>
    );
  }