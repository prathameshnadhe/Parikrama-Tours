import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

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

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/users/resetPassword/${token}`;
      const data = {
        password,
        passwordConfirm,
      };
      const response = await axios.patch(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = response.data;
      if (responseData.status === "success") {
        const userData = responseData.data.user;
        toast.success("Password has beed reset successfully");
        navigate("/login");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.error.statusCode === 400) {
        toast.error(error.response.data.message);
      }
    }
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
              <h2 className="h2-title">Reset Password Here</h2>
              <br />

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

              {/* confirmPassword input */}
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password again"
                  value={passwordConfirm}
                  onChange={(e) => setpasswordConfirm(e.target.value)}
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
                  disabled={!passwordConfirm || !password}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
