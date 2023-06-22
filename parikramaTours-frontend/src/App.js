import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Home from "./homepage/Home";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import TourDetails from "./tourDetails/TourDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/tour-details/:id" element={<TourDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
