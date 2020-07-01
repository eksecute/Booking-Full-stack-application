import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

export default class Search extends Component{

  constructor(props) {
    super(props);

    this.onChangeForm = this.onChangeForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = { placements: [], form: '', isLoggedIn: false};
  }

  componentDidMount() {
      axios.get('http://localhost:8080/placement/', {
        withCredentials: true,
      }).then(res => {
        this.setState({ placements: res.data })
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      });

      axios.get('http://localhost:8080/auth/', {
        withCredentials: true,
      }).then(res => {
        this.setState({ isLoggedIn: true });
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      });
}

  placementList() {
    const isLoggedIn = this.state.isLoggedIn;
    const Placement = props => (
        <tr>
          <td>{ props.placement.landlordName }</td>
          <td>{ props.placement.housename }</td>
          <td>{ props.placement.description }</td>
          <td>{ props.placement.address }</td>
          <td>{ props.placement.price }</td>
          <td>
            {isLoggedIn ? (<Link to={ "booking/add/" + props.placement._id }> pick dates </Link>):<span>not authorised</span>}
          </td>
        </tr>
    );
    return this.state.placements.map(currentPlacement => {
      return <Placement placement = { currentPlacement } currentUser/>
    })
  }

  onChangeForm(e) {
    this.setState({
      form: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("pressed");
    console.log(this.state.form);
    axios.get('http://localhost:8080/placement/search/' + this.state.form, {
      withCredentials: true
    }).then(res => {
      this.setState({ placements: res.data })
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
        <div className="container">

          <form className="input-group flex-nowrap mb-3" onSubmit={ this.onSubmit }>
            <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={this.onChangeForm}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-success my-2 my-sm-0 " type="submit">Search</button>
            </div>
          </form>

          <table className="table">
            <thead className="thead-light">
            <tr>
              <th>landlordName</th>
              <th>housename</th>
              <th>description</th>
              <th>address</th>
              <th>price</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            { this.placementList() }
            </tbody>
          </table>
        </div>
    );
  }
}
