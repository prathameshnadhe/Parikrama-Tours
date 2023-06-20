import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import mapPin from "../images/icons/mapPin.svg";
import calendar from "../images/icons/calendar.svg";
import flag from "../images/icons/flag.svg";
import user from "../images/icons/user.svg";
import { ReactComponent as CalendarIcon } from "../images/icons/calendar.svg";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const images = importAll(require.context("../images/tours"));

function Home() {
  const [tours, setTours] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/tours");
        setTours(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  // console.log(tours[0]);
  return (
    <>
      <main className="main">
        <div className="card-container">
          {tours.map((tour) => (
            <div key={tour.id} className="card">
              <div className="card__header">
                <div className="card__picture">
                  <div className="card__picture-overlay">&nbsp;</div>
                  <img
                    className="card__picture-img"
                    key={tour.id}
                    src={images[`${tour.imageCover}`]}
                    alt={`${tour.name}`}
                  />
                </div>
                <h3 className="heading-tertirary">
                  <span>{tour.name}</span>
                </h3>
              </div>
              <div className="card__details">
                <h4 className="card__sub-heading">{`${tour.difficulty} ${tour.duration}-day tour`}</h4>
                <p className="card__text">{tour.summary}</p>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref={`${mapPin}#icon-map-pin`}></use>
                  </svg>
                  <span>{tour.startLocation.description}</span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref={`#${calendar.id}`} />
                  </svg>
                  <span>
                    {new Date(tour.startDates[0]).toLocaleString("en-us", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref={`${flag}#icon-flag`}></use>
                  </svg>
                  <span>{`${tour.locations.length} stops`}</span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref={`${user}#icon-user`}></use>
                  </svg>
                  <span>{`${tour.maxGroupSize} people`}</span>
                </div>
              </div>
              <div className="card__footer">
                <p>
                  <span className="card__footer-value">{`₹${tour.price}`}</span>
                  <span className="card__footer-text"> per person</span>
                </p>
                <p className="card__ratings">
                  <span className="card__footer-value">
                    {tour.ratingsAverage}
                  </span>
                  <span className="card__footer-text">{`rating (${tour.ratingsQuantity})`}</span>
                </p>
                <a
                  className="btn btn--green btn--small"
                  href={`/tour/${tour.slug}`}
                >
                  Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;
