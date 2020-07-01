import React, { Component } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';

export default class CreatePlacement extends Component{

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeHousename = this.onChangeHousename.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);

    this.state = {
      landlordName: '',
      landlordId: '',
      housename: '',
      description: '',
      address: '',
      price: 0,
      user: null
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/auth/getUser', {
      withCredentials: true
    })
        .then(res => {
          this.setState({ user: res.data });
        })
        .catch((err) => {
          // this.setState({ error: "getUser got an Error " });
          console.log("getUser got: " + err);
        });
  }

  onChangeHousename(e) {
    this.setState({
      housename: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    })
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();
    const placement = {
      landlordName: this.state.user.username,
      landlordId: this.state.user._id,
      housename: this.state.housename,
      description: this.state.description,
      address: this.state.address,
      price: this.state.price,
    };
    console.log(placement);
    axios.post('http://localhost:8080/placement/add', placement)
        .then(res => console.log(res.data))
        .catch((err) => {
          console.log("01:" + err);
        });
    window.location = '/placements';
  }

  render() {
    return (
        <div className="container">
          <h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Housename: </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    // value={this.state.housename}
                    onChange={this.onChangeHousename}
                >
                </input>
              </div>
              <div className="form-group">
                <label>Description: </label>
                <textarea
                    className="form-control textarea"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label>Address </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={this.onChangeAddress}
                />
              </div>
              <div className="form-group">
                <label>Price: </label>
                <input
                    type="number"
                    required
                    className="form-control"
                    value={this.state.price}
                    onChange={this.onChangePrice}
                >
                </input>
              </div>
              <div className="form-group justify-content-around">
                  <input type="submit" value="Add" className="btn btn-outline-info"/>
              </div>

            </form>
          </h4>
        </div>
    );
  }
}
