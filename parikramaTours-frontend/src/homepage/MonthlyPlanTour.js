import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./monthlyPlanTour.css";

function getMonthName(month) {
  const date = new Date();
  date.setMonth(month - 1); // Months are zero-based in JavaScript (0 - 11)
  const monthName = date.toLocaleString("en-US", { month: "long" });
  return monthName;
}

function MonthlyPlanTour() {
  const [tour, setTour] = useState([]);
  const [error, setError] = useState(false);
  const { year } = useParams();

  const [activeTab, setActiveTab] = useState(year);

  const handleTabClick = (year) => {
    setActiveTab(year);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/tours/monthly-plan/${year}`
        );
        setTour(response.data.data.plan);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, [year]);
  console.log("Tour:", tour);

  return (
    <div>
      <div className="event-schedule-area-two bg-color pad100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <div className="title-text">
                  <h1 className="h1-title">Monthly Plans</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ul className="nav custom-tab" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "2023" ? "active show" : ""
                    }`}
                    id="home-taThursday"
                    data-toggle="tab"
                    href="/monthly-plan/2023"
                    role="tab"
                    aria-controls="home"
                    aria-selected={activeTab === "2023" ? "true" : "false"}
                    onClick={() => handleTabClick("2023")}
                  >
                    2023
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "2024" ? "active show" : ""
                    }`}
                    id="profile-tab"
                    data-toggle="tab"
                    href="/monthly-plan/2024"
                    role="tab"
                    aria-controls="profile"
                    aria-selected={activeTab === "2024" ? "true" : "false"}
                    onClick={() => handleTabClick("2024")}
                  >
                    2024
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "2025" ? "active show" : ""
                    }`}
                    id="profile-tab"
                    data-toggle="tab"
                    href="/monthly-plan/2025"
                    role="tab"
                    aria-controls="profile"
                    aria-selected={activeTab === "2025" ? "true" : "false"}
                    onClick={() => handleTabClick("2025")}
                  >
                    2025
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade active show"
                  id="home"
                  role="tabpanel"
                >
                  {tour.length > 0 && (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-center title-list" scope="col">
                              Month
                            </th>
                            <th className="text-center title-list" scope="col">
                              Tours
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tour.map((item) => (
                            <tr key={item.month} className="inner-box">
                              <th scope="row">
                                <div className="event-date">
                                  <span>{getMonthName(item.month)}</span>
                                </div>
                              </th>
                              <td>
                                <div className="event-wrap">
                                  {item.tours.length > 0 ? (
                                    <h3>
                                      {item.tours.map((tour) => (
                                        <a
                                          key={tour.tourId}
                                          href={`/tour-details/${tour.tourId}`}
                                        >
                                          <div className="text-center">
                                            {tour.tourName}
                                          </div>
                                        </a>
                                      ))}
                                    </h3>
                                  ) : (
                                    <p>No tours available for {year}.</p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {tour.length === 0 && (
                    <p className="no-data">No tours available for {year}.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyPlanTour;
