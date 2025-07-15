import { useLocation } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import '../../style/App.css';

export default function AccountPage() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-vh-100 vw-100 overflow-hidden bg-img">
      <div className="row vh-100 justify-content-center align-items-center g-0">
        <div className="d-none d-md-flex flex-column justify-content-evenly flex-wrap col-md-6 mt-5 h-75">
          <h3 className="text-light ps-5 mt-5">
            Intilaq
          </h3>

          <div className="d-flex flex-column gap-5 text-light">
            <h3 className="px-5 fs-2 fw-bold">
              Your Journey Starts Here
            </h3>
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators ">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner my-5 px-5">
                <div className="carousel-item active">
                  <p className="fs-6">
                    Discover opportunities that match your skills and passion.
                  </p>
                </div>
                <div className="carousel-item">
                  <p className="fs-6">
                    Connect with top employers and grow your career.
                  </p>
                </div>
                <div className="carousel-item">
                  <p className="fs-6">
                    Take the next step towards your professional goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {path === '/login' ? (
          <div className="col-10 col-md-4 rounded-5 h-100 h-85 bg-white d-flex align-items-center">
            <LoginForm />
          </div>
        ) : path === '/register' ? (
          <div className="col-10 col-md-4 rounded-5 h-100 h-85 bg-white d-flex align-items-center">
            <RegisterForm />
          </div>
        ) : null}
      </div>
    </div>
  );
}
