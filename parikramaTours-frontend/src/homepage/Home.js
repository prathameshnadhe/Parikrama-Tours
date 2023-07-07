import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import icons from "../images/icons.svg";
import { useSelector } from "react-redux";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourImages = importAll(require.context("../images/tours"));

function Home() {
  const userData = useSelector((state) => state.user);
  const [tours, setTours] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:8080/api/v1/tours";

        // Check if the URL should be changed to "top-5-cheap"
        if (window.location.href.includes("top-6-cheap")) {
          url = "http://localhost:8080/api/v1/tours/top-6-cheap";
        }
        const response = await axios.get(url);
        setTours(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  console.log(tours);
  return (
    <div>
      <main className="main">
        <div className="container">
          <div className="row">
            {tours.map((tour) => (
              <div key={tour.id} className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card__header">
                    <div className="card__picture">
                      <div className="card__picture-overlay">&nbsp;</div>
                      <img
                        className="card__picture-img-cover"
                        key={tour.id}
                        src={tourImages[`${tour.imageCover}`]}
                        alt={`${tour.name}`}
                      />
                    </div>
                    <h3 className="card__title heading-tertirary">
                      <span>{tour.name}</span>
                    </h3>
                  </div>
                  <div className="card__details">
                    <h4 className="card__sub-heading">{`${tour.difficulty} ${tour.duration}-day tour`}</h4>
                    <p className="card__text">{tour.summary}</p>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref={`${icons}#icon-map-pin`}></use>
                      </svg>
                      <span>{tour.startLocation.description}</span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref={`${icons}#icon-calendar`}></use>
                      </svg>
                      <span>
                        {tour.startDates[0] && (
                          <span className="overview-box__text">
                            {new Date(tour.startDates[0]).toLocaleString(
                              "en-us",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref={`${icons}#icon-flag`}></use>
                      </svg>
                      <span>{`${tour.locations.length} stops`}</span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref={`${icons}#icon-user`}></use>
                      </svg>
                      <span>{`${tour.maxGroupSize} people`}</span>
                    </div>
                  </div>
                  {userData &&
                  (userData.role === "admin" ||
                    userData.role === "lead-guide") ? (
                    <div className="card__footer">
                      <div className="row">
                        <div className="col-md-12">
                          <span className="card__footer-value">{`₹${tour.price}`}</span>
                          <span className="card__footer-text"> per person</span>
                        </div>
                        <div className="col-md-12 card__ratings">
                          <span className="card__footer-value">
                            {tour.ratingsAverage}
                          </span>
                          <span className="card__footer-text">{` rating (${tour.ratingsQuantity})`}</span>
                        </div>
                      </div>
                      <div className="row" style={{ alignItems: "center" }}>
                        <div className="col-md-12">
                          <a
                            className="btn btn--green btn--small"
                            // href={`/tour/${tour.slug}`}
                            href={`/tour-details/${tour.id}`}
                          >
                            Details
                          </a>
                        </div>
                        <div className="col-md-12">
                          {((userData && userData.role === "admin") ||
                            "lead-guide") && (
                            <div className="vertical-button">
                              <a
                                className="btn btn--yellow btn--small"
                                // href={`/tour/${tour.slug}`}
                                href={`/tour-update/${tour.id}`}
                              >
                                Update
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card__footer">
                      <p>
                        <span className="card__footer-value">{`₹${tour.price}`}</span>
                        <span className="card__footer-text"> per person</span>
                      </p>
                      <p className="card__ratings">
                        <span className="card__footer-value">
                          {tour.ratingsAverage}
                        </span>
                        <span className="card__footer-text">{` rating (${tour.ratingsQuantity})`}</span>
                      </p>
                      <a
                        className="btn btn--green btn--small"
                        // href={`/tour/${tour.slug}`}
                        href={`/tour-details/${tour.id}`}
                      >
                        Details
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
