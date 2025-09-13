export default function Register(){
    return (
      <div className="container-narrow py-5">
        <h1 className="h3">Sign up</h1>
        <div className="row g-3 mt-2">
          <div className="col-12 col-md-4">
            <label className="form-label">Name</label>
            <input className="form-control" placeholder="Your name"/>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Email</label>
            <input className="form-control" placeholder="you@example.com"/>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="Create password"/>
          </div>
          <div className="col-12">
            <button className="btn-brand">Create account</button>
          </div>
        </div>
      </div>
    );
  }