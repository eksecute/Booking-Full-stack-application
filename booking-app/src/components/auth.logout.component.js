import React, {Component} from "react";
import axios from "axios";

export default class Logout extends Component{



  onSubmit(e) {
    e.preventDefault();

    axios.get('http://localhost:8080/auth/logout/', {
      withCredentials: true //correct
    }).catch((err) => {
      console.log(err);
    });

    window.location = '/login';
  }



  render() {
    return (
        <div className="container col-md-7 col-lg-7 col-xl-5" >
          <div className="card" >
            <div className="card-body">
              <h3 className="card-title">Booking application</h3>
              <br/>
              <form onSubmit={this.onSubmit}>
                  <div className="">
                    <input className="btn btn-outline-danger" type="submit" value="Logout" />
                  </div>
              </form>

            </div>
          </div>
        </div>
    );
  }
}
