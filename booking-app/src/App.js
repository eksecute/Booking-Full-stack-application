import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';


import Navbar from './components/navbar.component';
//
import Login from './components/auth.login.component';
import Logout from './components/auth.logout.component';
import Register from './components/auth.reg.component';
//
import BookingList from './components/booking-list.component';
import EditBooking from './components/booking-edit.component.js';
import CreateBooking from './components/booking-create.component';
//
import PlacementList from './components/placement-list.component.js';
import PlacementEdit from './components/placement-edit.component.js';
import CreatePlacement from './components/placement-create.component';
//
import Account from './components/account.component';
//
import Search from './components/search.component';






function App() {
  return (
      <Router>
        <Navbar />
        <br/>
        <div>
          <Route path="/login" exact component = { Login } />
          <Route path="/logout" exact component = { Logout } />
          <Route path="/register" exact component = { Register } />

          <Route path="/" exact component = { BookingList } />
          <Route path="/booking/edit/:id" exact component = { EditBooking } />
          <Route path="/booking/add/:id" exact component = { CreateBooking } />

          <Route path="/search" exact component = { Search } />

          <Route path="/placements" exact component = { PlacementList } />
          <Route path="/placements/add" exact component = { CreatePlacement } />
          <Route path="/placements/edit/:id" exact component = { PlacementEdit } />

          <Route path="/user" exact component = { Account } />
        </div>
      </Router>

  );
}

export default App;
