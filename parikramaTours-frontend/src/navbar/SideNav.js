import React, { useState } from "react";
import icons from "../images/icons.svg";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faCogs,
  faTable,
  faList,
  faUser,
  faStar,
  faCreditCard,
  faBriefcase,
  faMap,
} from "@fortawesome/free-solid-svg-icons";

function SideNav({ isAdmin }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleTrigger = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="trigger" onClick={handleTrigger}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </div>
      <nav className="user-view__menu">
        <div className="side-nav">
          <a href="/user-profile">
            <FontAwesomeIcon icon={faUser} />
            {isOpen && <p className="text-update">Settings</p>}
          </a>
        </div>
        <div className="side-nav">
          <a href="/my-tours">
            <FontAwesomeIcon icon={faBriefcase} />
            {isOpen && <p className="text-update">My bookings</p>}
          </a>
        </div>
        <div className="side-nav">
          <a href="/my-reviews">
            <FontAwesomeIcon icon={faStar} />
            {isOpen && <p className="text-update">My reviews</p>}
          </a>
        </div>
        <div className="side-nav">
          <a href="#">
            <FontAwesomeIcon icon={faCreditCard} />
            {isOpen && <p className="text-update">Billing</p>}
          </a>
        </div>
        {isAdmin && (
          <div className="admin-nav">
            {isOpen && <h5 className="admin-nav__heading">Admin</h5>}
            <div className="side-nav">
              <a href="/manage-tours/2023">
                <FontAwesomeIcon icon={faMap} />
                {isOpen && <p className="text-update">Manage tours</p>}
              </a>
            </div>
            <div className="side-nav">
              <a href="/manage-users">
                <FontAwesomeIcon icon={faUser} />
                {isOpen && <p className="text-update">Manage users</p>}
              </a>
            </div>
            <div className="side-nav">
              <a href="/manage-reviews">
                <FontAwesomeIcon icon={faStar} />
                {isOpen && <p className="text-update">Manage reviews</p>}
              </a>
            </div>
            <div className="side-nav">
              <a href="/manage-bookings">
                <FontAwesomeIcon icon={faBriefcase} />
                {isOpen && <p className="text-update">Manage bookings</p>}
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default SideNav;
