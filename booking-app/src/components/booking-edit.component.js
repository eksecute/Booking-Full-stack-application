import React, { Component } from "react";
import DatePicker from "react-datepicker/es";
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';


export default class EditBookings extends Component{

  constructor(props) {
    super(props);

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      houseDescription: {},
      landlordName:     '',
      placementId:      '',
      landlordId:       '',
      tenantName:       '',
      housename:        '',
      tenantId:         '',
      status:           'pending', //static
      //to be edited:
      comment:          '',
      date:             new Date(),
      id:               ''
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/booking/single/' + this.props.match.params.id)
        .then(res => {
          this.setState({
            houseDescription: res.data.houseDescription,
            landlordName:     res.data.landlordName,
            placementId:      res.data.placementId,
            landlordId:       res.data.landlordId,
            tenantName:       res.data.tenantName,
            housename:        res.data.housename,
            tenantId:         res.data.tenantId,
            comment:          res.data.comment,
            date:             res.data.date,
          });
          console.log(this.state.date);
          console.log(this.state.comment);
        })
        .catch((err) => {
          console.log(err);
        });
  }

  onChangeComment(e) {
    this.setState({
      comment:    e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date:        date
    })
    console.log(this.state.date);
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
      status:           this.state.status,
      date:             this.state.date,
    };
    console.log(booking);
    console.log(typeof booking.date);


    //was bookings-service/update
    axios.post('http://localhost:8080/booking/single/update/' + this.props.match.params.id, booking)
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

        <div>
          <div className="container">
            <h3>Edit booking</h3>
            <form onSubmit={this.onSubmit}>

              <div className="form-group">
                <label>New Date: </label>
                <div>
                  <DatePicker
                      required
                      className="form-control"
                      selected={new Date(this.state.date)}
                      // selected={this.state.date}
                      onChange={this.onChangeDate}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>New comment: </label>
                <textarea
                    className="form-control textarea"
                    value={this.state.comment}
                    onChange={this.onChangeComment}
                >
                </textarea>
              </div>
              <div className="form-group">
                <input type="submit" value="Edit!" className="btn btn-primary"/>
              </div>

            </form>
          </div>
        </div>
    );
  }
}
