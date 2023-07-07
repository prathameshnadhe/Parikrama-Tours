import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../tourDetails/manageTours.css";
import icons from "../images/icons.svg";
import { useSelector } from "react-redux";

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

function UserReviews() {
  const user = useSelector((state) => state.user);
  const [userId, setUserId] = useState(user ? user._id : "");
  const [reviewData, setReviewData] = useState([]);
  const [error, setError] = useState(false);
  const [tourName, setTourName] = useState("");

  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/reviews`
        );
        console.log("response: ", response.data.data.data);
        const filteredReviews = response.data.data.data.filter(
          (review) => review.user._id === userId
        );
        console.log("filteredReviews: ", filteredReviews);
        setReviewData(filteredReviews);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, []);
  console.log("Review:", reviewData);
  console.log("reviewData.tour: ", reviewData.tour);

  useEffect(() => {
    const fetchTourNames = async () => {
      try {
        if (reviewData.length === 0) {
          // No reviews available, return early
          return;
        }

        const tourIds = reviewData.map((review) => review.tour);
        const requests = tourIds.map((tourId) =>
          fetch(`http://localhost:8080/api/v1/tours/${tourId}`)
        );
        const responses = await Promise.all(requests);

        const tours = await Promise.all(
          responses.map((response) => response.json())
        );

        const tourNames = tours.map((tour) => tour.data.data.name);
        setTourName(tourNames);
      } catch (error) {
        console.error(error);
        // Handle error case
      }
    };

    fetchTourNames();
  }, [reviewData]);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete review? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/v1/reviews/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Review has been deleted");
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
              <h1 className="h1-title">You Reviews</h1>
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade active show"
                      id="home"
                      role="tabpanel"
                    >
                      {reviewData.length > 0 && (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Tour
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Review
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Ratings
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Delete Review
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {reviewData.map((review, index) => (
                                <tr key={review._id} className="inner-box">
                                  <td>
                                    <div className="text-user">
                                      {tourName[index]}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {review.review}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {review.rating}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="event-wrap">
                                      <button
                                        className="btn btn--small btn--red "
                                        type="button"
                                        onClick={() =>
                                          handleDeleteUser(review._id)
                                        }
                                      >
                                        Delete Review
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {reviewData.length === 0 && (
                        <p className="no-data">You did not review any tour.</p>
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

export default UserReviews;
