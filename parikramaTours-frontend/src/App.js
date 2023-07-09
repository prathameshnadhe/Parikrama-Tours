import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
// Components
import Login from "./auth/LoginUser";
import Signup from "./auth/SignupUser";
import UpdateUser from "./auth/UpdateUser";
import UserTours from "./auth/UserBookings";
import ResetPassword from "./auth/ResetPassword";
import Home from "./homepage/Home";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import TourDetails from "./tourDetails/TourDetails";
import UpdateTour from "./tourDetails/UpdateTour";
import AddTour from "./tourDetails/AddTour";
import ManageTours from "./tourDetails/ManageTours";
import ManageUsers from "./tourDetails/ManageUsers";
import ManageReviews from "./tourDetails/ManageReviews";
import UserBookings from "./auth/UserBookings";
import UserReviews from "./auth/UserReviews";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <>
        <Navbar />

        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/top-6-cheap" element={<Home />} />
          <Route exact path="/tour-details/:id" element={<TourDetails />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/user-profile" element={<UpdateUser />} />
          <Route exact path="/my-tours" element={<UserBookings />} />
          <Route exact path="/my-reviews" element={<UserReviews />} />
          <Route
            exact
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/manage-reviews"
            element={<ProtectedRoute Component={ManageReviews} />}
          />
          <Route
            path="/manage-users"
            element={<ProtectedRoute Component={ManageUsers} />}
          />
          <Route
            path="/tour-update/:id"
            element={<ProtectedRoute Component={UpdateTour} />}
          />
          <Route
            path="/add-tour"
            element={<ProtectedRoute Component={AddTour} />}
          />
          <Route
            path="/manage-tours/:year"
            element={<ProtectedRoute Component={ManageTours} />}
          />
        </Routes>
        <Footer />
      </>
    </BrowserRouter>
  );
}

export default App;
