import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Home from "./homepage/Home";
import Navbar from "./navbar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
