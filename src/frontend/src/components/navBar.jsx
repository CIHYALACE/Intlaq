import React, { useState, useEffect } from 'react';


export default function NavBar() {
  const [token, setToken] = useState(null);
  console.log(token);

  useEffect(() => {
    const updateToken = () => {
      const token = localStorage.getItem('access_token');
      setToken(token);
    };

    // Initial check
    updateToken();

    // Listen for the custom event
    window.addEventListener('storage', updateToken);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', updateToken);
    };
  }, []);
  
  const HandleSignOut =() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <i className="fab fa-github fa-2x mx-3 ps-1"></i>
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="me-3">
            <div className="form-white input-group" style={{width: '250px'}}>
              <input 
                type="search" 
                className="form-control rounded" 
                placeholder="Search or jump to... ( / )" 
                aria-label="Search"
                aria-describedby="search-addon" 
              />
            </div>
          </form>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">Pull request</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Issues</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Marketplace</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Explore</a>
            </li>
          </ul>
          <ul className="navbar-nav d-flex flex-row ms-auto me-3">
            <li className="nav-item me-3 me-lg-0 dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-plus"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li className="nav-item me-3 me-lg-0 dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown1" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img 
                  src={token? "https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg" : "https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg"} 
                  className="rounded-circle" 
                  height="22" 
                  alt="Profile"
                  loading="lazy" 
                />
              </a>
              { token? 
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown1">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={HandleSignOut}>Sign out</a></li>
              </ul>:
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown1">
                <li><a className="dropdown-item" href="/login">Sign in</a></li>
                <li><a className="dropdown-item" href="/register">Sign up</a></li>
              </ul>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
