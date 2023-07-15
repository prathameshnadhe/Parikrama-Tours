import React, { useEffect, useState } from "react";
import icons from "../images/icons.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "../auth/css/updateUser.css";

const divItem = (title, type, value, setValue) => (
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
  </div>
);

function UpdateTour() {
  const [tour, setTour] = useState({});
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [name, setTourName] = useState({});
  const [duration, setTourDuration] = useState({});
  const [maxGroupSize, setTourMaxGroupSize] = useState({});
  const [difficulty, setTourDifficulty] = useState({});
  const [price, setTourPrice] = useState({});
  const [summary, setTourSummary] = useState({});
  const [description, setTourDescription] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/tours/${id}`
        );
        setTour(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setTourName(tour.name || "");
    setTourDuration(tour.duration || "");
    setTourMaxGroupSize(tour.maxGroupSize || "");
    setTourDifficulty(tour.difficulty || "");
    setTourPrice(tour.price || "");
    setTourSummary(tour.summary || "");
    setTourDescription(tour.description || "");
  }, [tour]);

  const handleTourFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/tours/${id}`;
      const data = {
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        summary,
        description,
      };
      const response = await axios.patch(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = response.data;
      if (responseData.status === "success") {
        toast.success("Tour has been updated");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 404) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleTourDelete = async (event) => {
    event.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete tour? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/v1/tours/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Tour has been Deleted");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="main1">
      <div className="user-view">
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">{tour.name}</h2>
            <form
              className="form form-user-data"
              onSubmit={handleTourFormSubmit}
            >
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

              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Update Tour
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Delete Tour</h2>
            <div className="form__group right">
              <button
                className="btn btn--small btn--red "
                type="button"
                onClick={handleTourDelete}
              >
                Delete Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UpdateTour;
