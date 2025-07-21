import Swal from 'sweetalert2';

export default function EmployerAccess() {
    const handleSignOut = () => {
        Swal.fire({
            title: 'Logging out',
            text: 'You are being logged out...',
            icon: 'info',
            showConfirmButton: false,
            timer: 1500,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.dispatchEvent(new Event('storage'));
                window.location.href = '/login';
            }
        });
    };
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center p-4 p-md-5">
              <div className="mb-4">
                <i
                  className="bi bi-briefcase-fill text-primary"
                  style={{ fontSize: "3rem" }}
                ></i>
                <p className="text-muted mb-4">
                  Sign in to access employer features or register your company
                  with us.
                </p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <a href="/login" className="btn btn-primary px-4 me-md-2">
                  <i className="fas fa-right-to-bracket me-2"></i>Login
                  </a>
                  <a
                    href="/register"
                    className="btn btn-outline-primary px-4"
                  >
                    <i className="bi bi-building me-2"></i>Register as Employer
                  </a>
                </div>
                <p className="text-muted mb-4">
                  Your current account doesn't have employer privileges.
                </p>
                <p className="small text-muted mt-3 mb-0">
                  Already have an employer account?{" "}
                  <a href="#" onClick={handleSignOut}>Log out</a> to switch accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
