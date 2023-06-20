import "bootstrap/dist/css/bootstrap.css";
import "./navbar.css";
import logo from "./../images/parikrama_logo.jpg";

function navbar() {
  return (
    <>
      {/* Navbar  */}
      <nav className="navbar navbar-expand-lg navbar-light ">
        {/* Container wrapper */}
        <div className="container-fluid">
          {/* Collapsible wrapper */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <a className="nav-link nav-ele" href="#">
              All Tours
            </a>
          </div>
          {/* Collapsible wrapper */}

          <div className="navbar-logo">
            <img src={logo} alt="Parikrama_Logo" />
          </div>

          {/* Right elements */}
          <div className="d-flex align-items-center">
            <a className="nav-link nav-ele" href="/login">
              Log in
            </a>

            <a className="nav-link nav-ele nav-signup" href="#">
              Sign up
            </a>
          </div>
          {/* Right elements */}
        </div>
        {/* Container wrapper */}
      </nav>
      {/* Navbar */}
    </>
  );
}

export default navbar;
