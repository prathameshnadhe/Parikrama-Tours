import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ModalForm from "./ModalForm";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourImages = importAll(require.context("../images/tours"));
const imageKeys = Object.keys(tourImages);
const randomIndex = Math.floor(Math.random() * imageKeys.length);
const randomImageKey = imageKeys[randomIndex];
const randomImageSrc = tourImages[randomImageKey];

function LoginUser() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:8080/api/v1/users/login";
      const data = {
        email,
        password,
      };
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = response.data;
      if (responseData.status === "success") {
        const userData = responseData.data.user;
        // save user and token to local storage
        dispatch({ type: "SET_USER_DATA", payload: userData }); // Update user data in the navbar
        navigate("/");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 401) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRegisterClick = () => {
    navigate("/signup");
  };

  return (
    <section className="section-data">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img className="img-fluid" alt="Tours" src={randomImageSrc} />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form className="form-data" onSubmit={handleFormSubmit}>
              <h2 className="h2-title">Login Here</h2>
              <br />

              {/* Email input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">
                  Email address:
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {email &&
                  !email.match(
                    /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
                  ) && (
                    <small className="text-danger">
                      Valid Email is Required
                    </small>
                  )}
              </div>

              {/* Password input */}
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Password:
                </label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div
                className="text-center text-lg-start mt-4 pt-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    cursor: "pointer",
                  }}
                  disabled={!email || !password}
                >
                  Login
                </button>
                &nbsp;
                <div className="para-small">
                  Don't have an account?
                  <a
                    onClick={handleRegisterClick}
                    className="link-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Register
                  </a>
                  <br />
                  <a
                    href="#"
                    onClick={handleForgotPasswordClick}
                    className="link-primary"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showModal && <ModalForm closeModal={closeModal} />}
    </section>
  );
}

export default LoginUser;
