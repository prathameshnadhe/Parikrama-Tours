import React, { useEffect, useState } from "react";
import axios from "axios";
import "../tourDetails/css/manageTours.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SideNav from "../navbar/SideNav";

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
        <SideNav
          isAdmin={userData.role === "admin" || userData.role === "lead-guide"}
        />
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
