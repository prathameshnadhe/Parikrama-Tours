import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
// Components
import Login from "./auth/LoginUser";
import Signup from "./auth/SignupUser";
import ResetPassword from "./auth/ResetPassword";
import Home from "./homepage/Home";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import TourDetails from "./tourDetails/TourDetails";
import MonthlyPlanTour from "./homepage/MonthlyPlanTour";

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Navbar />

        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/top-6-cheap" element={<Home />} />
          <Route
            exact
            path="/monthly-plan/:year"
            element={<MonthlyPlanTour />}
          />
          <Route exact path="/tour-details/:id" element={<TourDetails />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route
            exact
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
        </Routes>
        <Footer />
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
