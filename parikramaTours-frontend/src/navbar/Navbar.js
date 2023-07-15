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
    <header>
      <a href="/" className="text-black">
        <img className="navbar-logo" src={logo} alt="Parikrama logo" />
      </a>
      <ul className="navbar-nav float-right">
        {userData ? (
          <React.Fragment>
            <li className=" nav-item ">
              <a className="btn-margin-top btn1" href="/">
                All Tours
              </a>
            </li>
            <li className=" nav-item ">
              <a className="btn-margin-top btn1" href="/top-6-cheap">
                Top 6 Affordable
              </a>
            </li>
            <li className="dropdown dropdown-hover">
              <button
                className=" btn1 btn2 btn-transs"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "0rem",
                }}
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
                    <Link to="/my-tours" className="dropdown-item">
                      My Bookings
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
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <li className="nav-item">
              <a className="btn1" style={{ marginTop: "2rem" }} href="/">
                All Tours
              </a>
            </li>
            <li className="nav-item">
              <a
                className="btn1"
                style={{ marginTop: "2rem" }}
                href="/top-6-cheap"
              >
                Top 6 Affordable
              </a>
            </li>
            <li className="nav-item">
              <Link className="btn1" style={{ marginTop: "2rem" }} to="/login">
                Log in
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="btn1" style={{ marginTop: "2rem" }} to="/signup">
                Sign up
              </Link>
            </li> */}
          </React.Fragment>
        )}
      </ul>
    </header>
  );
}

export default Navbar;
