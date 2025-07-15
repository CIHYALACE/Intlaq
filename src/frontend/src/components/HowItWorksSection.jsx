export default function HowItWorksSection() {
  return (
    <section class="py-5 py-lg-7 bg-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-5 fw-bold mb-3">How It Works</h2>
          <p class="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Get started in minutes and unlock new opportunities with our simple
            process
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex align-items-center mb-4">
                  <div class="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <span class="fs-2">👨‍💻</span>
                  </div>
                  <h3 class="mb-0">For Job Seekers</h3>
                </div>
                <ul class="list-unstyled">
                  <li class="mb-3 d-flex">
                    <span class="me-3 text-primary fw-bold">1</span>
                    <div>
                      <h5 class="mb-1">Create Your Profile</h5>
                      <p class="text-muted mb-0">
                        Set up your account in just 2 minutes
                      </p>
                    </div>
                  </li>
                  <li class="mb-3 d-flex">
                    <span class="me-3 text-primary fw-bold">2</span>
                    <div>
                      <h5 class="mb-1">Add Skills & Bio</h5>
                      <p class="text-muted mb-0">
                        Showcase your expertise and experience
                      </p>
                    </div>
                  </li>
                  <li class="d-flex">
                    <span class="me-3 text-primary fw-bold">3</span>
                    <div>
                      <h5 class="mb-1">Apply to Matched Jobs</h5>
                      <p class="text-muted mb-0">
                        Get personalized job recommendations
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex align-items-center mb-4">
                  <div class="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                    <span class="fs-2">🧑‍💼</span>
                  </div>
                  <h3 class="mb-0">For Employers</h3>
                </div>
                <ul class="list-unstyled">
                  <li class="mb-3 d-flex">
                    <span class="me-3 text-success fw-bold">1</span>
                    <div>
                      <h5 class="mb-1">Post Job Openings</h5>
                      <p class="text-muted mb-0">
                        List your opportunities in minutes
                      </p>
                    </div>
                  </li>
                  <li class="mb-3 d-flex">
                    <span class="me-3 text-success fw-bold">2</span>
                    <div>
                      <h5 class="mb-1">Filter Candidates</h5>
                      <p class="text-muted mb-0">
                        Find perfect matches with our AI tools
                      </p>
                    </div>
                  </li>
                  <li class="d-flex">
                    <span class="me-3 text-success fw-bold">3</span>
                    <div>
                      <h5 class="mb-1">Hire With Confidence</h5>
                      <p class="text-muted mb-0">
                        Make offers directly through our platform
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
