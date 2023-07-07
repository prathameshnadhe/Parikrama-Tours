import React, { useEffect, useState } from "react";
import icons from "../images/icons.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddTour() {
  const [name, setTourName] = useState("");
  const [duration, setTourDuration] = useState("");
  const [maxGroupSize, setTourMaxGroupSize] = useState("");
  const [difficulty, setTourDifficulty] = useState("");
  const [price, setTourPrice] = useState("");
  const [summary, setTourSummary] = useState("");
  const [description, setTourDescription] = useState("");
  const [startLocation, setStartLocation] = useState({
    coordinates: [],
  });
  const navigate = useNavigate();

  const handleAddTourForm = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/tours`;
      const data = {
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        summary,
        description,
        startLocation,
      };
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = response.data;
      if (responseData.status === "success") {
        toast.success("Tour has been Added");
        navigate("/");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 404) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    setStartLocation({ ...startLocation, type: "Point" });
  }, []);

  const divItem = (title, type, value, setValue, startLocation) => (
    <div className="form__group ma-bt-md">
      <label className="form__label" htmlFor="name">
        {title}
      </label>
      {type !== "textarea" ? (
        <input
          id="name"
          className="form__input"
          type={type}
          value={value}
          placeholder={`Enter a valid ${title}`}
          required
          name="name"
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <textarea
          id="name"
          className="form__input"
          value={value}
          placeholder={`Enter a valid ${title}`}
          required
          onChange={(e) => setValue(e.target.value)}
          style={title === "Description" ? { height: "20rem" } : {}}
        ></textarea>
      )}
      {startLocation && (
        <>
          <input
            id="locationType"
            className="form__input"
            type="text"
            value={startLocation.type}
            required
            name="locationType"
            onChange={(e) =>
              setStartLocation({ ...startLocation, type: e.target.value })
            }
          />
          <input
            id="locationCoordinates"
            className="form__input"
            type="text"
            value={startLocation.coordinates.join(", ")}
            required
            name="locationCoordinates"
            onChange={(e) => {
              const coordinates = e.target.value.split(", ");
              setStartLocation({
                ...startLocation,
                coordinates: coordinates.map((coord) => parseFloat(coord)),
              });
            }}
          />
        </>
      )}
    </div>
  );

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className={"side-nav--active li-update"}>
              <a href={`#`}>
                <svg className="svg-update">
                  <use xlinkHref={`${icons}#icon-settings`} />
                </svg>
                <p className="text-update">Add Tour</p>
              </a>
            </li>
          </ul>
        </nav>
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Add Tour</h2>
            <form className="form form-user-data" onSubmit={handleAddTourForm}>
              {divItem("Tour Name", "text", name, setTourName)}
              {divItem("Duration", "text", duration, setTourDuration)}
              {divItem(
                "MaxGroupSize",
                "text",
                maxGroupSize,
                setTourMaxGroupSize
              )}
              {divItem("Difficulty", "text", difficulty, setTourDifficulty)}
              {divItem("Price", "text", price, setTourPrice)}
              {divItem("Summary", "textarea", summary, setTourSummary)}
              {divItem(
                "Description",
                "textarea",
                description,
                setTourDescription
              )}
              {/* {divItem(
                "Start Location Type",
                "text",
                startLocation.type,
                (value) => setStartLocation({ ...startLocation, type: value })
              )} */}
              {divItem(
                "Start Location Coordinates",
                "text",
                startLocation.coordinates
                  ? startLocation.coordinates.join(", ")
                  : "",
                (value) => {
                  const coordinates = value.split(", ");
                  setStartLocation((prevStartLocation) => ({
                    ...prevStartLocation,
                    coordinates: coordinates.map((coord) => parseFloat(coord)),
                  }));
                }
              )}

              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Add Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AddTour;
