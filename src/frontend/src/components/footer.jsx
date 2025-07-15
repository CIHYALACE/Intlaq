export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="container-fluid p-0 mt-5">
      <footer
        className="text-center text-lg-start text-white"
        style={{backgroundColor: "#2c3e50"}}
      >
        <div className="container p-4 pb-0">
          <section className="">
            <div className="row">
              <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  Intilaq
                </h6>
                <p>
                  Connecting top talent with leading employers. Our platform makes it easy to find your dream job or the perfect candidate.
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Quick Links</h6>
                <p>
                  <a href="/jobs" className="text-white text-decoration-none">Browse Jobs</a>
                </p>
                <p>
                  <a href="/employees" className="text-white text-decoration-none">Find Employees</a>
                </p>
                <p>
                  <a href="/about" className="text-white text-decoration-none">About Us</a>
                </p>
                <p>
                  <a href="/contact" className="text-white text-decoration-none">Contact Us</a>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p>
                  <i className="fas fa-home mr-3"></i> 123 Job Street, Career City
                </p>
                <p>
                  <i className="fas fa-envelope mr-3"></i> info@intilaq.com
                </p>
                <p>
                  <i className="fas fa-phone mr-3"></i> +1 234 567 890
                </p>
                <p>
                  <i className="fas fa-clock mr-3"></i> Mon - Fri: 9:00 AM - 6:00 PM
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Follow Us</h6>

                <a
                  className="btn btn-primary btn-floating m-1"
                  style={{backgroundColor: "#3b5998"}}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>

                <a
                  className="btn btn-primary btn-floating m-1"
                  style={{backgroundColor: "#1DA1F2"}}
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                >
                  <i className="fab fa-twitter"></i>
                </a>

                <a
                  className="btn btn-primary btn-floating m-1"
                  style={{backgroundColor: "#0077B5"}}
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>

                <a
                  className="btn btn-primary btn-floating m-1"
                  style={{backgroundColor: "#E1306C"}}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
          &copy; {currentYear} Intilaq. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
