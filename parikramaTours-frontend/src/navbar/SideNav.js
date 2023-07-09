import React from "react";
import icons from "../images/icons.svg";

const navItem = (link, text, icon, active) => (
  <li className={`${active ? "side-nav--active" : ""} li-update`}>
    <a href={`${link}`}>
      <svg className="svg-update">
        <use xlinkHref={`${icons}#icon-${icon}`} />
      </svg>
      <p className="text-update">{text}</p>
    </a>
  </li>
);

const SideNav = ({ isAdmin }) => {
  return (
    <nav className="user-view__menu">
      <ul className="side-nav">
        {navItem("/user-profile", "Settings", "settings", true)}
        {navItem("/my-tours", "My bookings", "briefcase")}
        {navItem("/my-reviews", "My reviews", "star")}
        {navItem("#", "Billing", "credit-card")}
      </ul>
      {isAdmin && (
        <div className="admin-nav">
          <h5 className="admin-nav__heading">Admin</h5>
          <ul className="side-nav">
            {navItem("/manage-tours/2023", "Manage tours", "map")}
            {navItem("/manage-users", "Manage users", "users")}
            {navItem("/manage-reviews", "Manage reviews", "star")}
            {navItem("#", "Manage bookings", "briefcase")}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default SideNav;
