import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./manageTours.css";
import icons from "../images/icons.svg";
import { useSelector } from "react-redux";

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const userImage = importAll(require.context("../images/users"));

const navItem = (link, text, icon, active) => (
  <li className={`${active ? "side-nav--active" : ""} li-update`}>
    <a href={`${link}`}>
      <svg className="svg-update">
        <use xlinkHref={`${icons}#icon-${icon}`} />
      </svg>
      <p className="text-update">{text}</p>
    </a>
  </li>
);

function ManageUsers() {
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users`);
        console.log("response: ", response);
        setUserData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, []);
  console.log("User:", userData);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete user account? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Account has been deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            {navItem("/user-profile", "Settings", "settings", true)}
            {navItem("/my-tours", "My bookings", "briefcase")}
            {navItem("/my-reviews", "My reviews", "star")}
            {navItem("#", "Billing", "credit-card")}
          </ul>
          {(user.role === "admin" || user.role === "lead-guide") && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                {navItem("/manage-tours/2023", "Manage tours", "map")}
                {navItem("/manage-users", "Manage users", "users")}
                {navItem("/manage-reviews", "Manage reviews", "star")}
                {navItem("#", "Manage bookings", "briefcase")}
              </ul>
            </div>
          )}
        </nav>
        <div className="user-view__content">
          <div className="event-schedule-area-two bg-color pad100">
            <div className="container">
              <h1 className="h1-title">Manage Users</h1>
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade active show"
                      id="home"
                      role="tabpanel"
                    >
                      {userData.length > 0 && (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Photo
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Name
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Email
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Role
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Delete User
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {userData
                                .filter(
                                  (item) =>
                                    item.role === "user" ||
                                    item.role === "guide" ||
                                    item.role === "lead-guide"
                                )
                                .map((user) => (
                                  <tr key={user._id} className="inner-box">
                                    <th scope="row">
                                      <div className="form__group">
                                        <img
                                          className="form__user-photo"
                                          src={userImage[user.photo]}
                                          alt={user.name}
                                        />
                                      </div>
                                    </th>
                                    <td>
                                      <div className="text-user">
                                        {user.name}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-user">
                                        {user.email}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-user">
                                        {user.role}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="event-wrap">
                                        <button
                                          className="btn btn--small btn--red "
                                          type="button"
                                          onClick={() =>
                                            handleDeleteUser(user._id)
                                          }
                                        >
                                          Delete Account
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ManageUsers;
