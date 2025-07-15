export default function FeaturesSection(){
    return (
        <section class="py-5 py-lg-7 bg-light">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="display-5 fw-bold mb-3">Why Choose Our Platform</h2>
      <p class="lead text-muted mx-auto" style={{maxWidth: "700px"}}>
        Powerful tools designed to streamline your hiring or job search process
      </p>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-body p-4 text-center">
            <div class="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-4">
              <span class="fs-3">🎯</span>
            </div>
            <h4 class="mb-3">Smart Job Matching</h4>
            <p class="text-muted mb-0">
              Our AI matches you with perfect opportunities based on your skills, experience, and preferences.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-body p-4 text-center">
            <div class="bg-info bg-opacity-10 p-3 rounded-circle d-inline-flex mb-4">
              <span class="fs-3">🧠</span>
            </div>
            <h4 class="mb-3">Advanced Filters</h4>
            <p class="text-muted mb-0">
              Find developers by specific skills, years of experience, location, and more.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-body p-4 text-center">
            <div class="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-flex mb-4">
              <span class="fs-3">📬</span>
            </div>
            <h4 class="mb-3">Real-time Alerts</h4>
            <p class="text-muted mb-0">
              Get instant notifications when new jobs match your profile or candidates apply.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-body p-4 text-center">
            <div class="bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-4">
              <span class="fs-3">📊</span>
            </div>
            <h4 class="mb-3">Tracking Dashboard</h4>
            <p class="text-muted mb-0">
              Monitor all your applications or candidates in one organized view.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-body p-4 text-center">
            <div class="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-flex mb-4">
              <span class="fs-3">🔐</span>
            </div>
            <h4 class="mb-3">Secure & Simple</h4>
            <p class="text-muted mb-0">
              Enterprise-grade security with an intuitive interface anyone can use.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 bg-primary text-white">
          <div class="card-body p-4 d-flex flex-column justify-content-center text-center">
            <h3 class="mb-3">Ready to Get Started?</h3>
            <p class="mb-4 opacity-75">
              Join thousands of professionals finding their perfect match today
            </p>
            <div class="d-grid gap-2">
              <a href="#signup" class="btn btn-light btn-lg">Sign Up Free</a>
              <a href="#demo" class="btn btn-outline-light btn-lg">See Demo</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    )
}