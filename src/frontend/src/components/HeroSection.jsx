export default function HeroSection() {
  return (
    <section className="hero bg-light py-5 py-lg-7">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">
              Find Your <span className="text-primary">Dream Job</span> Today
            </h1>
            <p className="lead text-muted mb-4">
              Join thousands of companies and candidates making connections on
              the most trusted employment platform.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="#jobs" className="btn btn-primary btn-lg px-4 py-2">
                Browse Jobs
              </a>
              <a
                href="#hire"
                className="btn btn-outline-secondary btn-lg px-4 py-2"
              >
                Hire Talent
              </a>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center">
                <div className="d-flex me-3">
                  <img
                    src="/images/user1.jpg"
                    alt="User 1"
                    className="rounded-circle border border-white"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      marginRight: '-8px',
                      zIndex: 1,
                      borderWidth: '2px'
                    }}
                  />
                  <img
                    src="/images/user2.jpg"
                    alt="User 2"
                    className="rounded-circle border border-white"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      marginRight: '-8px',
                      zIndex: 2,
                      borderWidth: '2px'
                    }}
                  />
                  <img
                    src="/images/user3.jpg"
                    alt="User 3"
                    className="rounded-circle border border-white"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      zIndex: 3,
                      borderWidth: '2px'
                    }}
                  />
                </div>
                <div>
                  <p className="small mb-0">
                    <strong>10,000+</strong> professionals hired this month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <img
              src="/images/HeroImage.jpg"
              alt="Happy professionals"
              className="img-fluid rounded-3 shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
