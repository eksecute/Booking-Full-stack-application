import React, { Component } from "react";
import DatePicker from "react-datepicker/es";
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';

export default class CreateBooking extends Component{

   constructor(props) {
    super(props);

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      houseDescription: {},
      landlordName: '',
      placementId: '',
      landlordId: '',
      tenantName: '',
      housename: '',
      tenantId: '',
      comment: '',
      status: 'pending', //static
      date: new Date(),
    }
  }

  componentDidMount() {
    //copy date from placement to state
    axios.get('http://localhost:8080/placement/single/' + this.props.match.params.id, {
      withCredentials: true
    })
        .then(res => {
          console.log(this.state.date)
            this.setState({
              houseDescription: {
                description: res.data.description,
                address: res.data.address,
                price: res.data.price,
              },
              landlordName: res.data.landlordName,
              placementId: res.data._id,
              landlordId: res.data.landlordId,
              housename: res.data.housename
            });
        })
        .catch((err) => {
          console.log(err);
        });

    //query current user and copy data to state
    axios.get('http://localhost:8080/auth/getUser', {
      withCredentials: true
    })
        .then(res => {
          this.setState({
            tenantName: res.data.username,
            tenantId: res.data._id
          });
        })
        .catch((err) => {
          console.log("getUser got: " + err);
        });
  }

  onChangeComment(e) {
    this.setState({
      comment:  e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date:     date
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const booking = {
      houseDescription: this.state.houseDescription,
      landlordName:     this.state.landlordName,
      placementId:      this.state.placementId,
      landlordId:       this.state.landlordId,
      tenantName:       this.state.tenantName,
      housename:        this.state.housename,
      tenantId:         this.state.tenantId,
      comment:          this.state.comment,
      status:           this.state.status, //static
      date:             this.state.date,
    };

    axios.post('http://localhost:8080/booking/add', booking)
        .then(res => {
          console.log(res.data);
          window.location = '/';
        })
        .catch((err) => {
          this.setState( { err: err });
          console.log(err);
          alert("This date is already taken");
        });

  }

  render() {
    return (
        <div className="container">
        <h3>
          <div className="mb-4 mt-3 text-justify">
            To finish booking <span className="text-danger">
               "{ this.state.housename }"
            </span> please fill following fields
          </div>
        <form onSubmit={this.onSubmit}>

          <div className="form-group">
            <label>Comment: </label>
            <textarea
                className="form-control textarea"
                onChange={this.onChangeComment}
            />
          </div>
          <div className="form-group">
            <label>Date: </label>
            <div>
              <DatePicker
                  selected={this.state.date}
                  onChange={this.onChangeDate}
              />
            </div>
          </div>

          <div className="form-group">
            <input type="submit" value="Book" className="btn btn-outline-info mt-2"/>
          </div>

        </form>
        </h3>
        </div>
    );
  }
}
