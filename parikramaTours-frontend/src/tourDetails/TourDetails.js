import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./tourDetails.css";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourCoverImage = importAll(require.context("../images/tours"));
const guidesImage = importAll(require.context("../images/users"));

function TourDetails() {
  const [tour, setTour] = useState({});
  const [error, setError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/tours/${id}}`
        );
        setTour(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, [id]);
  console.log("Tour:", tour);

  if (error) {
    return <div>Error loading tour data. Please try again later.</div>;
  }

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="card__picture-img"
            key={tour.id}
            src={tourCoverImage[`${tour.imageCover}`]}
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
                <use xlinkHref="/img/icons.svg#icon-clock"></use>
              </svg>
              <span className="heading-box__text">
                {tour.duration}-day tour
              </span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.description}
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
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {new Date(tour.startDates[0]).toLocaleString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-trending-up"></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide) => (
                <div className="overview-box__detail" key={guide.id}>
                  <img
                    className="overview-box__img"
                    src={guidesImage[`${guide.photo}`]}
                    alt={guide.name}
                  />
                  <span className="overview-box__label">
                    {guide.role === "lead-guide" ? "Lead guide" : "Tour guide"}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name}</h2>
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
        </div>
      </section>

      <section className="section-pictures">
        <div className="picture-box">
          <img
            className="picture-box__img picture-box__img--1"
            src="/img/tour-5-1.jpg"
            alt="The Park Camper Tour 1"
          />
        </div>
        <div className="picture-box">
          <img
            className="picture-box__img picture-box__img--2"
            src="/img/tour-5-2.jpg"
            alt="The Park Camper Tour 2"
          />
        </div>
        <div className="picture-box">
          <img
            className="picture-box__img picture-box__img--3"
            src="/img/tour-5-3.jpg"
            alt="The Park Camper Tour 3"
          />
        </div>
      </section>

      {/* <section className="section-map">
        <div id="map"></div>
      </section> */}

      <section className="section-reviews">
        <div className="reviews">
          <div className="reviews__card">
            <div className="reviews__avatar">
              <img
                className="reviews__avatar-img"
                src="/img/users/user-7.jpg"
                alt="Jim Brown"
              />
              <h6 className="reviews__user">Jim Brown</h6>
            </div>
            <p className="reviews__text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              dignissimos sint quo commodi corrupti accusantium veniam saepe
              numquam.
            </p>
            <div className="reviews__rating">
              <svg className="reviews__star reviews__star--active">
                <use xlinkHref="/img/icons.svg#icon-star"></use>
              </svg>
              <svg className="reviews__star reviews__star--active">
                <use xlinkHref="/img/icons.svg#icon-star"></use>
              </svg>
              <svg className="reviews__star reviews__star--active">
                <use xlinkHref="/img/icons.svg#icon-star"></use>
              </svg>
              <svg className="reviews__star reviews__star--active">
                <use xlinkHref="/img/icons.svg#icon-star"></use>
              </svg>
              <svg className="reviews__star reviews__star--active">
                <use xlinkHref="/img/icons.svg#icon-star"></use>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>
          <img
            className="cta__img cta__img--1"
            src="/img/tour-5-2.jpg"
            alt=""
          />
          <img
            className="cta__img cta__img--2"
            src="/img/tour-5-1.jpg"
            alt=""
          />
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              10 days. 1 adventure. Infinite memories. Make it yours today!
            </p>
            <button className="btn btn--green span-all-rows">
              Book tour now!
            </button>
            {/* {user ? (
              <button className="btn btn--green span-all-rows">
                Book tour now!
              </button>
            ) : (
              <a className="btn btn--green span-all-rows" href="/login">
                Login to book tour
              </a>
            )} */}
          </div>
        </div>
      </section>
    </>
  );
}

export default TourDetails;
