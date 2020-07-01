import React, { Component } from "react";
import axios from "axios";

export default class Register extends Component{

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: '',
      password: ''
    }
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    console.log(user);

    axios.post('http://localhost:8080/auth/register', user)
        .then(res => {
          console.log(res.data)
          alert("Done");
          window.location = '/login';
        })
        .catch((err) => {
          console.log(err)
          alert(`User "${this.state.username}" already exists`)
        });
  }



  render() {
    return (
        <div className="container col-md-7 col-lg-7 col-xl-5" >
          <div className="card" >
            <div className="card-body">
              <h3 className="card-title">Booking application</h3>
              <h6 className="card-subtitle mb-2 text-muted">Register</h6>

              <form onSubmit={this.onSubmit}>

                <div className="input-group flex-nowrap mb-3">
                  <input type="text"
                         required
                         className="form-control"
                         placeholder="Username"
                         aria-label="Username"
                         aria-describedby="addon-wrapping"
                         onChange={this.onChangeUsername}
                  />

                  <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">@</span>
                  </div>
                </div>

                <div className="input-group flex-nowrap mb-3">
                  {/*<div className="input-group-append">*/}
                  {/*  <span className="input-group-text">##</span>*/}
                  {/*</div>*/}
                  <input type="password"
                         className="form-control"
                         required
                         placeholder="Password"
                         aria-label="v"
                         aria-describedby="addon-wrapping"
                         onChange={this.onChangePassword}/>
                  <div className="input-group-append">
                    <input className="btn btn-success" type="submit" value="Register" />
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
    );
  }
}
