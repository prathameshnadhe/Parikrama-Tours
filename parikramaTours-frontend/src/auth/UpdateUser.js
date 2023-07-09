import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./css/updateUser.css";
import icons from "../images/icons.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideNav from "../navbar/SideNav";

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const userImage = importAll(require.context("../images/users"));

const UpdateUser = () => {
  const userData = useSelector((state) => state.user);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [id, setId] = useState(userData ? userData._id : "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setId(userData._id);
    }
  }, [userData]);

  const handleUserFormSubmit = async (event) => {
    console.log(id);
    event.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/users/updateMe`;
      const data = {
        id,
        name,
        email,
      };
      const response = await axios.patch(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = response.data;
      if (responseData.status === "success") {
        const userData = responseData.data.user;
        window.localStorage.removeItem("userData");
        dispatch({ type: "SET_USER_DATA", payload: userData });
        toast.success("Data has been updated");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 401) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleUpdatePasswordFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/users/updateMyPassword`;
      const data = {
        id,
        passwordCurrent,
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
        toast.success("Password has been updated");
        setPasswordCurrent("");
        setPassword("");
        setpasswordConfirm("");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 401) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleDeleteUser = async (event) => {
    event.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/v1/users/deleteMe`, {
        data: { id },
        headers: {
          "Content-Type": "application/json",
        },
      });
      // toast.success("Account has been deleted");
      window.localStorage.removeItem("userData");
      window.location.href = "/";
    } catch (error) {
      if (error.response.data.error.statusCode === 401) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <main className="main">
      <div className="user-view">
        <SideNav
          isAdmin={userData.role === "admin" || userData.role === "lead-guide"}
        />
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <form
              className="form form-user-data"
              onSubmit={handleUserFormSubmit}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  value={name}
                  required
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  value={email}
                  required
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={userImage[`${userData.photo}`]}
                  alt={userData.name}
                />
                <input
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Save settings
                </button>
              </div>
            </form>
          </div>
          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form
              className="form form-user-password"
              onSubmit={handleUpdatePasswordFormSubmit}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordCurrent}
                  onChange={(e) => setPasswordCurrent(e.target.value)}
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordConfirm}
                  onChange={(e) => setpasswordConfirm(e.target.value)}
                />
              </div>
              <div className="form__group right">
                <button
                  className="btn btn--small btn--green btn--save-password"
                  type="submit"
                >
                  Save password
                </button>
              </div>
            </form>
          </div>
          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Delete Account</h2>
            <div className="form__group right">
              <button
                className="btn btn--small btn--red "
                type="button"
                onClick={handleDeleteUser}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UpdateUser;
