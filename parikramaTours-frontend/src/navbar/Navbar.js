import "bootstrap/dist/css/bootstrap.css";
import "./navbar.css";
import logo from "./../images/parikrama_logo.jpg";

function navbar() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              All Tours
            </a>
          </div>
        </nav>
        <div className="navbar-logo">
          <img src={logo} alt="Parikrama_Logo" />
        </div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="collapse navbar-collapse d-flex justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="btn" href="/">
                  Log in
                </a>
              </li>
              <li className="nav-item">
                <a className=" btn" href="/">
                  Sign up
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default navbar;
