import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/manageTours.css";
import { useSelector } from "react-redux";
import SideNav from "../navbar/SideNav";

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const userImage = importAll(require.context("../images/users"));

function ManageUsers() {
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const filteredUsers = userData.filter(
    (user) => user.role === "user" || user.role === "guide"
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users`);
        console.log("response: ", response);
        setUserData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete user account? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Account has been deleted");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(filteredUsers.length);

  return (
    <main className="main1">
      <div className="user-view">
        <SideNav
          isAdmin={user.role === "admin" || user.role === "lead-guide"}
        />
        <div className="user-view__content">
          <div className="event-schedule-area-two bg-color pad100">
            <div className="container">
              <h1 className="h1-title">Manage Users</h1>
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade active show"
                      id="home"
                      role="tabpanel"
                    >
                      {filteredUsers.length > 0 && (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Photo
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Name
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Email
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Role
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Delete User
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentUsers.map((user) => (
                                <tr key={user._id} className="inner-box">
                                  <th scope="row">
                                    <div className="form__group">
                                      <img
                                        className="form__user-photo"
                                        src={userImage[user.photo]}
                                        alt={user.name}
                                      />
                                    </div>
                                  </th>
                                  <td>
                                    <div className="text-user">{user.name}</div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {user.email}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">{user.role}</div>
                                  </td>
                                  <td>
                                    <div className="event-wrap">
                                      <button
                                        className="btn btn--small btn--red"
                                        type="button"
                                        onClick={() =>
                                          handleDeleteUser(user._id)
                                        }
                                      >
                                        Delete Account
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  <br />
                  <div className="pagination">
                    <button
                      className="btn btn--small"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn--small"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={indexOfLastUser >= filteredUsers.length}
                    >
                      Next
                    </button>
                  </div>
                  <div className="btn btn--small disabled">
                    Total Users: {filteredUsers.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ManageUsers;
