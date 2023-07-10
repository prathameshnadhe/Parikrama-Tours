import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/tourDetails.css";
import logo from "./../images/parikrama_logo.jpg";
import icons from "../images/icons.svg";
import { useSelector } from "react-redux";
import BookingModal from "./BookingModal";
import MapboxMap from "./MapboxMap";

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourImages = importAll(require.context("../images/tours"));
const userImage = importAll(require.context("../images/users"));

function TourDetails() {
  const [tour, setTour] = useState({});
  const [error, setError] = useState(false);
  const { id } = useParams();
  const userData = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/tours/${id}`
        );
        setTour(response.data.data.data);
        setLocations(response.data.data.data.locations);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, [id]);

  if (error) {
    return <div>Error loading tour data. Please try again later.</div>;
  }

  const handleBookingTourClick = (id) => {
    setSelectedTourId(id);
    setShowModal(true);
  };
  console.log("selectedTourId :", selectedTourId);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="card__picture-img-cover"
            src={`${tourImages[tour.imageCover]}`}
            alt={`${tour.name}`}
          />
        </div>

        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref={`${icons}#icon-clock`}></use>
              </svg>
              <span className="heading-box__text">
                {tour.duration}-day tour
              </span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref={`${icons}#icon-map-pin`}></use>
              </svg>
              <span className="heading-box__text">
                {tour && tour.startLocation && tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref={`${icons}#icon-calendar`}></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                {tour && tour.startDates && tour.startDates[0] && (
                  <span className="overview-box__text">
                    {new Date(tour.startDates[0]).toLocaleString("en-us", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref={`${icons}#icon-trending-up`}></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref={`${icons}#icon-user`}></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref={`${icons}#icon-star`}></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour &&
                tour.images &&
                tour.images.length > 0 &&
                tour.guides.map((guide) => (
                  <div className="overview-box__detail" key={guide.id}>
                    <img
                      className="overview-box__img"
                      src={userImage[`${guide.photo}`]}
                      alt={guide.name}
                    />
                    <span className="overview-box__label">
                      {guide.role === "lead-guide"
                        ? "Lead guide"
                        : "Tour guide"}
                    </span>
                    <span className="overview-box__text">{guide.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name}</h2>
          {tour && tour.description && (
            <p className="description__text">
              {tour.description.includes("\n")
                ? tour.description.split("\n").map((paragraph, index) => (
                    <div key={index}>
                      {paragraph}
                      <br />
                      <br />
                    </div>
                  ))
                : tour.description}
            </p>
          )}
        </div>
      </section>

      <section className="section-pictures">
        {tour &&
          tour.images &&
          tour.images.length > 0 &&
          tour.images.map((images, index) => (
            <div className="picture-box" key={index}>
              <img
                className="card__picture-img"
                key={tour.id}
                src={tourImages[`${images}`]}
                alt={`${tour.name}`}
              />
            </div>
          ))}
      </section>

      {locations.length > 0 && (
        <section className="section-map">
          <MapboxMap locations={locations} />
        </section>
      )}

      <section className="section-reviews">
        <div className="reviews">
          {tour &&
            tour.images &&
            tour.images.length > 0 &&
            tour.reviews.map((review) => (
              <div className="reviews__card" key={review.id}>
                <div className="reviews__avatar">
                  <img
                    className="card__picture-img-user"
                    src={userImage[`${review.user.photo}`]}
                    alt={`${tour.name}`}
                  />
                  <h6 className="reviews__user">{review.user.name}</h6>
                </div>
                <p className="reviews__text" key={review.id}>
                  {review.review}
                </p>
                <div className="reviews__rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`reviews__star reviews__star--${
                        review.rating >= star ? "active" : "inactive"
                      }`}
                    >
                      <use xlinkHref={`${icons}#icon-star`} />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src={logo} alt="Parikrama_Logo" />
          </div>
          {tour && tour.images && tour.images.length > 0 && (
            <div>
              <img
                className="cta__img cta__img--1"
                src={tourImages[tour.images[1]]}
                alt={tour.name}
              />
              <img
                className="cta__img cta__img--2"
                src={tourImages[tour.images[0]]}
                alt={tour.name}
              />
            </div>
          )}
          <div className="cta__content">
            <h2 className="heading-secondary header-margin">
              What are you waiting for?
            </h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>
            {userData ? (
              userData.role === "admin" || userData.role === "lead-guide" ? (
                <a
                  className="btn btn--green span-all-rows button-margin "
                  href={`/tour-update/${tour.id}`}
                >
                  Update Tour
                </a>
              ) : (
                <a
                  className="btn btn--green span-all-rows button-margin "
                  onClick={() => handleBookingTourClick(id)}
                >
                  Book tour now!
                </a>
              )
            ) : (
              <a
                className="btn btn--green span-all-rows button-margin "
                href="/login"
              >
                Login to book tour
              </a>
            )}
          </div>
        </div>
      </section>
      {showModal && (
        <BookingModal tourId={selectedTourId} closeModal={closeModal} />
      )}
    </div>
  );
}

export default TourDetails;
