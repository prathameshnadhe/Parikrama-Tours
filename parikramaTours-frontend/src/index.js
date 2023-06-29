import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import favicon from "./images/parikrama_logo.jpg";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";

// Create user reducer function
const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return action.payload;
    case "LOGOUT":
      return action.payload;
    default:
      return state;
  }
};

// Combine multiple reducers (if you have more than one)
const rootReducer = combineReducers({
  user: userReducer,
});

// Create the Redux store
const store = createStore(rootReducer, composeWithDevTools());

// Subscribe to changes in the Redux store and save user data to localStorage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("userData", JSON.stringify(state.user));
});

// Load user data from localStorage and set it in the Redux store
const userData = localStorage.getItem("userData");
if (userData) {
  store.dispatch({ type: "SET_USER_DATA", payload: JSON.parse(userData) });
}


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

document.querySelector("link[rel*='icon']").href = favicon;

reportWebVitals();
