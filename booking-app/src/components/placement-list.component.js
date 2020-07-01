import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Placement = props => (
    <tr>
      <td>{ props.placement.landlordName }</td>
      <td>{ props.placement.housename }</td>
      <td>{ props.placement.description }</td>
      <td>{ props.placement.address }</td>
      <td>{ props.placement.price }</td>
      <td>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link to={ "placements/edit/" + props.placement._id }> edit </Link> | <a href="#" onClick={ () => {
        props.deletePlacement(props.placement._id)}}> delete </a>
      </td>
    </tr>
);

export default class PlacementList extends Component{
  constructor(props) {
    super(props);
    this.deletePlacement = this.deletePlacement.bind(this);
    this.state = { placements: [], currentUser: null, error: '', isLoggedIn: false };
  }

  componentDidMount() {
    axios.get('http://localhost:8080/auth/getUserId/encrypted', {
      withCredentials: true
    })
        .then(res => {
          // this.setState({ currentUser: res.data });
          axios.get('http://localhost:8080/placement/' + res.data, {
            withCredentials: true,
            userId: res.data //_id
          })
              .then(res => {
            this.setState({
              placements: res.data,
              isLoggedIn: true
            })
          })
              .catch((err) => {
            this.setState({ error: "Please login to see list of " });
            console.log(err);
          });
        })
        .catch((err) => {
          this.setState({ error: "Please login to see list of " });
          console.log("getUser got: " + err);
        });
  }

  deletePlacement(id) {
    axios.delete('http://localhost:8080/placement/single/' + id)
        .then(res => console.log(res.data))
    this.setState({
      placements: this.state.placements.filter(el => el._id !== id)
    })
  }

  placementList() {
    return this.state.placements.map(currentPlacement => {
      return <Placement
          placement = { currentPlacement }
          deletePlacement = { this.deletePlacement }
          key = { currentPlacement._id }
          currentUser/>
    })
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
        <div className="container">
          <div>
            <h3> { this.state.error } </h3>
          </div>
          <div className="other">
            <h3 className="mt-1">Your accommodations</h3>
            {
              isLoggedIn ?
                <button className="btn btn-outline-info ml-4 mb-2" >
                  <a className="ras" href="http://localhost:3000/placements/add">
                    Add
                  </a>
                </button> : ''
            }
          </div>
          <table className="table">
            <thead className="thead-light">
            <tr>
              <th>landlordName</th>
              <th>housename</th>
              <th>description</th>
              <th>address</th>
              <th>price</th>
              <th>actions</th>
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
