import "bootstrap/dist/css/bootstrap.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "./../images/prikrama-tours-logo.png";
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
        <nav className="navbar navbar-expand-lg float-left">
          <div className="container-fluid">
            <a href="/" className="text-black">
              <img className="navbar-logo" src={logo} alt="Parikrama logo" />
            </a>
          </div>
        </nav>
        <nav className="navbar navbar-expand-lg  float-right">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              {userData ? (
                <div className="user-nav">
                  <li className="nav-item">
                    <Link className="btn1" to="/">
                      All Tours
                    </Link>
                  </li>
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
                      style={{ textAlign: "center" }}
                    >
                      <li>
                        <a className="dropdown-item" href="/top-6-cheap">
                          Top 6 Affordable Tours
                        </a>
                      </li>
                      {/* <li>
                        <a className="dropdown-item" href="/monthly-plan/2023">
                          Monthly Plan Tours
                        </a>
                      </li> */}
                    </ul>
                  </div>
                  <div className="dropdown dropdown-hover">
                    <button
                      className="btn2 btn1 btn-trans"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={userImage[`${userData.photo}`]}
                        alt={userData.name}
                        className="card__picture-img-user-nav"
                      />
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                      style={{ textAlign: "center" }}
                    >
                      <li>
                        <Link to="/user-profile" className="dropdown-item">
                          {userData.name}
                        </Link>
                      </li>
                      <li>
                        <Link to="/user-profile" className="dropdown-item">
                          Settings
                        </Link>
                      </li>
                      <li>
                        {userData.role === "user" && (
                          <Link to="#" className="dropdown-item">
                            Booked Tours
                          </Link>
                        )}
                      </li>
                      <li>
                        {(userData.role === "admin" ||
                          userData.role === "lead-guide") && (
                          <Link to="/add-tour" className="dropdown-item">
                            Add Tours
                          </Link>
                        )}
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <li className="nav-item">
                    <Link className="btn1" to="/">
                      All Tours
                    </Link>
                  </li>
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
                      {/* <li>
                        <a className="dropdown-item" href="/monthly-plan/2023">
                          Monthly Plan Tours
                        </a>
                      </li> */}
                    </ul>
                  </div>
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
