import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../tourDetails/manageTours.css";
import icons from "../images/icons.svg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function getMonthName(month) {
  const date = new Date();
  date.setMonth(month - 1); // Months are zero-based in JavaScript (0 - 11)
  const monthName = date.toLocaleString("en-US", { month: "long" });
  return monthName;
}

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

function UserBookings() {
  const userData = useSelector((state) => state.user);
  const [userId, setUserId] = useState(userData ? userData._id : "");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (userData) {
      setUserId(userData._id);
    }
  }, [userData]);
  console.log(userId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/booking/${userId}`
        );
        const bookedTours = response.data;
        console.log(bookedTours.data);
        setBookings(bookedTours.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel your booking? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/v1/booking/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Booking has been canceled");
      window.location.reload();
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
          {(userData.role === "admin" || userData.role === "lead-guide") && (
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
              <h1 className="h1-title">Your Bookings</h1>
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade active show"
                      id="home"
                      role="tabpanel"
                    >
                      {bookings.length > 0 && (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Tour Name
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Start Date
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Members
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Price
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Total Price
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Cancel Booking
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking) => (
                                <tr key={booking._id} className="inner-box">
                                  <th scope="row">
                                    <div className="text-user">
                                      {booking.tourName}
                                    </div>
                                  </th>
                                  <td>
                                    <div className="text-user">
                                      {new Date(
                                        booking.startDate
                                      ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {booking.members}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {booking.price}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {booking.totalPrice}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="event-wrap">
                                      <button
                                        className="btn btn--small btn--red "
                                        type="button"
                                        onClick={() =>
                                          handleDeleteBooking(booking._id)
                                        }
                                      >
                                        Cancel Booking
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {bookings.length === 0 && (
                        <p className="no-data">You have no tour bookings.</p>
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

export default UserBookings;
