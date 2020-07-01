import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';


const CardTenant = props => (
    <div className="card">
      <div className={`border border-${props.colorPicker(props.status)} rounded`} >
        {/*<img src="..." className="card-img-top" alt="..."/>*/}
        <div className="card-body">

          {/*   Status & title   */}
          <div className="card-group">
            <h5 className={`text-${props.colorPicker(props.status)}`}>
              { props.booking.status }:&nbsp;
            </h5>
            <h5 className="card-title">
              { props.booking.housename }
            </h5>
          </div>

          {/*   Description   */}
          <div>
            <h6 className="one-row">Descriprion:</h6>
            <p className="one-row">&nbsp;{ props.booking.houseDescription.description }</p>
            <br/>
          </div>

          {/*   Address   */}
          <div>
            <h6 className="one-row">Address:</h6>
            <p className="one-row">&nbsp;{ props.booking.houseDescription.address }</p>
            <br/>
          </div>

          {/*   Comment   */}
          <div>
            <h6 className="one-row">Comment:</h6>
            <span className="one-row">&nbsp;{ props.booking.comment }</span>
            <br/>
          </div>

          {/*   Date   */}
          <div>
            <h6 className="one-row">Date:</h6>
            <span className="one-row">&nbsp;
              {
                new Date(props.booking.date).getDate() + "." +
                new Date(props.booking.date).getMonth() + "." +
                new Date(props.booking.date).getFullYear()
              }
            </span>
            <br/>
          </div>

          {/*   Buttons   */}
          {
            (props.status === "pending"   || props.status === "approved") ?
                <div>
                  <Link className="btn btn-outline-secondary mr-2" to={ "/booking/edit/" + props.booking._id }>
                    Edit
                  </Link>
                  <button className="btn btn-outline-danger  mr-2" onClick={ () => {props.cancelBooking(props.booking._id)}}>
                    Cancel
                  </button>
                </div>
                : ''
          }

        </div>
      </div>
    </div>
);

const CardLandlord = props => (
    <div className="card">
      <div className={`border border-${props.colorPicker(props.status)} rounded`} >
        {/*<img src="..." className="card-img-top" alt="..."/>*/}
        <div className="card-body">

          {/*   Status & title   */}
          <div className="card-group">
            <h5 className={`text-${props.colorPicker(props.status)}`}>
              { props.booking.status }:&nbsp;
            </h5>
            <h5 className="card-title">
              { props.booking.housename }
            </h5>
          </div>

          {/*   Description   */}
          <div>
            <h6 className="one-row">Descriprion:</h6>
            <p className="one-row">&nbsp;{ props.booking.houseDescription.description }</p>
            <br/>
          </div>

          {/*   Address   */}
          <div>
            <h6 className="one-row">Address:</h6>
            <p className="one-row">&nbsp;{ props.booking.houseDescription.address }</p>
            <br/>
          </div>

          {/*   Comment   */}
          <div>
            <h6 className="one-row">Comment:</h6>
            <span className="one-row">&nbsp;{ props.booking.comment }</span>
            <br/>
          </div>

          {/*   Date   */}
          <div>
            <h6 className="one-row">Date:</h6>
            <span className="one-row">&nbsp;
              {
                new Date(props.booking.date).getDate() + "." +
                new Date(props.booking.date).getMonth() + "." +
                new Date(props.booking.date).getFullYear()
              }
            </span>
            <br/>
          </div>

          {/*   Buttons   */}
          {
            (props.status === "pending") ?
                <div>
                  <button className="btn btn-outline-success mr-2" onClick={ () => {props.approveBooking(props.booking._id)}}>
                    Approve
                  </button>
                  <button className="btn btn-outline-danger  mr-2" onClick={ () => {props.cancelBooking(props.booking._id)}}>
                    Cancel
                  </button>
                </div>
                : (props.status === "approved") ?
                <div>
                  <button className="btn btn-outline-danger  mr-2" onClick={ () => {props.cancelBooking(props.booking._id)}}>
                    Cancel
                  </button>
                </div>
                :
                ''
          }

        </div>
      </div>
    </div>
);

export default class BookingList extends Component{

  constructor(props) {
    super(props);

    this.deleteBooking = this.deleteBooking.bind(this);
    this.colorPicker = this.colorPicker.bind(this);
    this.onApprove = this.onApprove.bind(this);

    this.state = { tenantBookings: [], landlordBookings: [], error: '', accentColor: "dark" };
  }

  componentDidMount() {

    axios.get('http://localhost:8080/auth/getUserId/encrypted', {
      withCredentials: true
    }).then(res => {

          axios.get('http://localhost:8080/booking/getAllBookings/tenant/' + res.data, {
            withCredentials: true,
          }).then(res => {
            this.setState({ tenantBookings: res.data });
            console.log(res.data);
          }).catch((err) => { console.log(err) });

          //добавитьбукинги лендлорда
          axios.get('http://localhost:8080/booking/getAllBookings/landlord/' + res.data, {
            withCredentials: true,
          }).then(res => {
            this.setState({ landlordBookings: res.data });
          }).catch((err) => { console.log(err) });
        })
        .catch((err) => {

      this.setState({ error: "Please login to see list of " });
      console.log(err);
    })
  }

  deleteBooking(id) {
    axios.delete('http://localhost:8080/booking/single/' + id)
        .then(res => console.log(res.data));
    this.setState({
      tenantBookings: this.state.tenantBookings.filter(el => el._id !== id),
      landlordBookings: this.state.landlordBookings.filter(el => el._id !== id)
    })
  }

  colorPicker(status) {
    switch (status) {
      case ("pending")   : {
        return "warning";
      }
      case ("approved")  : {
        return "success";
      }
      case ("cancelled") : {
        return "danger";
      }
      case ("completed") : {
        return "secondary";
      }
      default : {
        return "dark";
      }
    }
  }

  onApprove(id) {
    const updateParams = {
      status: "approved",
    };
    console.log(updateParams);

    axios.post('http://localhost:8080/booking/single/update/status/' + id, updateParams)
        .then(res => console.log(res.data));
  }

  onCancel(id) {
    const updateParams = {
      status: "cancelled",
    };
    console.log(updateParams);

    axios.post('http://localhost:8080/booking/single/update/status/' + id, updateParams)
        .then(res => console.log(res.data));
  }

  tenantBookingList() {
    return this.state.tenantBookings.map(tenantBooking => {
      if ( new Date(tenantBooking.date) < new Date()) {
        tenantBooking.status = "completed";
      }
      return <CardTenant
          colorPicker = { this.colorPicker }
          // accentColor = { this.state. }
          // onApprove = { this.onApprove }
          cancelBooking = { this.onCancel }
          deleteBooking = { this.deleteBooking }
          status = { tenantBooking.status }
          booking = { tenantBooking }
          currentUser/>
    })
  }

  landlordBookingList() {
    return this.state.landlordBookings.map(landlordBooking => {
      if ( new Date(landlordBooking.date) < new Date()) {
        landlordBooking.status = "completed";
      }
      return <CardLandlord
          colorPicker = { this.colorPicker }
          approveBooking = { this.onApprove }
          // deleteBooking = { this.deleteBooking }
          cancelBooking = { this.onCancel }
          status = { landlordBooking.status }
          booking = { landlordBooking }
          currentUser/>
    })
  }

  render() {
    return (
        <div className="container">

          <div className="bookings ">
            <div>
              <h3> { this.state.error } </h3>
            </div>
            <h3>Current bookings</h3>
            <div className="card-columns">
              { this.tenantBookingList() }
            </div>
          </div>

          <div className="orders">
            <div>
              <h3> { this.state.error } </h3>
            </div>
            <h3>Current orders</h3>
            <div className="card-columns">
              { this.landlordBookingList() }
            </div>
          </div>

        </div>
    );
  }
}
