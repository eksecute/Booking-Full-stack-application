import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component{

  render() {
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg navbar-collapse">
          <div className="container">
            <Link to="/" className="navbar-brand">Booking Application</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/placements" className="nav-link">My rental</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/search" className="nav-link">Find</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/user" className="nav-link">Account</Link>
                </li>
              </ul>

              <ul className="navbar-nav ">
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/logout" className="nav-link">Logout</Link>
                </li>
              </ul>
            </div>


            {/*<div className="collapse navbar-collapse">*/}
            {/*  <ul className="navbar-nav mr-auto">*/}
            {/*    <li className="navbar-item">*/}
            {/*      <Link to="/login" className="nav-link">Login</Link>*/}
            {/*    </li>*/}
            {/*    <li className="navbar-item">*/}
            {/*      <Link to="/logout" className="nav-link">Logout</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
          </div>
        </nav>
    );
  }
}
