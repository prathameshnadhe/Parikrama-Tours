import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/bookingModal.css";

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourImages = importAll(require.context("../images/tours"));

function Loading() {
  return <div>Loading tour details...</div>;
}

function Error() {
  return <div>Error loading tour details. Please try again later.</div>;
}

function BookingModal({ tourId, closeModal }) {
  const userData = useSelector((state) => state.user);
  const [userId, setUserId] = useState(userData ? userData._id : "");
  const [quantity, setQuantity] = useState(1);
  const [tourData, setTourData] = useState(null);
  const [tourName, setTourName] = useState(null);
  const [members, setMembers] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [price, setPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setUserId(userData._id);
    }
  }, [userData]);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/tours/${tourId}`
        );
        const tourData = response.data.data.data;
        setTourData(tourData);
        setTourName(tourData.name);
        setPrice(tourData.price);
      } catch (error) {
        console.error("Error fetching tour details:", error);
        setTour(null);
      }
    };

    fetchTourDetails();
  }, [tourId]);

  useEffect(() => {
    setMembers(quantity);
    setTotalPrice(price * quantity);
  }, [quantity, price]);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < tourData.maxGroupSize) {
      setQuantity(quantity + 1);
    }
  };

  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value;
    setStartDate(selectedStartDate);
  };

  useEffect(() => {
    if (tourData && tourData.startDates.length > 0) {
      setStartDate(tourData.startDates[0]);
    }
  }, [tourData]);

  const handleBookingTourClick = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/booking`;
      const data = {
        tourId,
        userId,
        tourName,
        members,
        price,
        totalPrice,
        startDate,
      };
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = response.data;
      if (responseData.status === "success") {
        toast.success("Booking successful!");
        navigate("/");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!tourData) {
    return <Error />;
  }

  return (
    <Modal show onHide={closeModal} centered dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className="custom-header">Tour Booking Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card1 mb-4">
          <div className="card-body p-4 custom-modal-body">
            <table className="table table-custom">
              <tbody>
                <tr>
                  <td className="text-center">
                    <img
                      className="custom-img"
                      src={`${tourImages[tourData.imageCover]}`}
                      alt={`${tourData.name}`}
                    />
                  </td>
                  <td className="text-center">
                    <p className="small text-muted mb-4">Tour Name</p>
                    <p className="lead fw-normal mb-0 custom-modal-body-1">
                      {tourData.name}
                    </p>
                  </td>
                  <td
                    className="text-center  d-flex justify-content-center align-items-center"
                    style={{ flexDirection: "column" }}
                  >
                    <p className="small text-muted mb-4">Start Dates</p>
                    <br />
                    <select
                      className="form-select select"
                      value={startDate}
                      onChange={handleStartDateChange}
                    >
                      {tourData.startDates.map((date, index) => (
                        <option key={index} value={date}>
                          {new Date(date).toLocaleDateString("en-us", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center">
                    <p className="small text-muted mb-4">Members</p>
                    {tourData && (
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn1 btn-link px-2"
                          onClick={decrementQuantity}
                        >
                          -
                        </button>
                        <input
                          name="quantity"
                          value={quantity}
                          type="text"
                          className="form-control quantity-input"
                          onChange={(e) =>
                            setQuantity(parseInt(e.target.value))
                          }
                        />
                        <button
                          className="btn1 btn-link px-2"
                          onClick={incrementQuantity}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <p className="small text-muted mb-4">Price</p>
                    <p className="lead fw-normal mb-0 custom-modal-body-1">
                      ₹{tourData.price}
                    </p>
                  </td>
                  <td className="text-center">
                    <p className="small text-muted mb-4">Total</p>
                    <p className="lead fw-normal mb-0 custom-modal-body-1">
                      ₹{tourData.price * quantity}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card1 mb-5">
          <div className="card-body p-4  custom-modal-body">
            <div className="float-end custom-modal-body">
              <p className="mb-0 me-5 d-flex align-items-center">
                <span className="small text-muted me-2">Order total:</span>{" "}
                <span className="lead fw-normal custom-modal-body-1">
                  ₹{tourData.price * quantity}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={closeModal} className="me-2">
          Cancel
        </Button>
        <Button
          className="btn btn--green span-all-rows"
          onClick={handleBookingTourClick}
        >
          Book Tour
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BookingModal;
