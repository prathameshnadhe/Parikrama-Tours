import axios from "axios";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./css/forgotPasswordForm.css";

function ModalForm({ closeModal }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleFormReset = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/forgotPassword",
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      console.log(responseData);
      if (responseData.status === "success") {
        toast.success(responseData.message);
        navigate("/");
      } else {
        console.log("responseData error", responseData);
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 404) {
        toast.error(error.response.data.message);
      }
      if (error.response.data.error.statusCode === 500) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Modal show={true} onHide={closeModal} centered className="modal top fade ">
      <div className="modal-content text-center main-custom">
        <Modal.Header
          className="modal-header text-white bg-primary "
          closeButton
        >
          <Modal.Title className="title-custom">Password Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="py-2 p-custom">
            Enter your email address and we'll send you an email with
            instructions to reset your password.
          </p>

          <form className="form-outline" onSubmit={handleFormReset}>
            <input
              type="email"
              id="typeEmail"
              className="form-control my-3 input-custom"
              placeholder="Enter a valid email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" type="submit" disabled={!email}>
              Reset password
            </Button>
          </form>
          <div className="d-flex justify-content-between mt-4 button-custom">
            <a className="a-custom" href="/login">
              Login
            </a>
            <a className="a-custom" href="/signup">
              Register
            </a>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}

export default ModalForm;
