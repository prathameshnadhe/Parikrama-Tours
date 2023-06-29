import "bootstrap/dist/css/bootstrap.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "./../images/parikrama_logo.jpg";
import { useDispatch, useSelector } from "react-redux";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const userImage = importAll(require.context("../images/users"));

function Navbar() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    window.localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <React.Fragment>
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
              <div className="dropdown dropdown-hover">
                <button
                  className="btn1"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Tour Plans
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <a className="dropdown-item" href="/top-6-cheap">
                      Top 6 Affordable Tours
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/monthly-plan/2023">
                      Monthly Plan Tours
                    </a>
                  </li>
                </ul>
              </div>
              {userData && userData.name ? (
                <React.Fragment>
                  <li className="nav-item">
                    <span className="btn1">{userData.name.split(" ")[0]}</span>
                  </li>
                  <li className="nav-item">
                    <img
                      src={userImage[`${userData.photo}`]}
                      alt={userData.name}
                      className="card__picture-img-user-nav"
                    />
                  </li>
                  <li className="nav-item">
                    <button className="btn1" onClick={handleLogout}>
                      Log out
                    </button>
                  </li>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <li className="nav-item">
                    <Link className="btn1" to="/login">
                      Log in
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn1" to="/signup">
                      Sign up
                    </Link>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </React.Fragment>
  );
}

export default Navbar;
