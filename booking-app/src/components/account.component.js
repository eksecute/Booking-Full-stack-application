import React, { Component } from "react";
import axios from 'axios';

export default class CreateUser extends Component{

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: '',
      password:'',
      isLoggedIn: false
    }
  }

  componentDidMount() {

    axios.get('http://localhost:8080/auth/getUser', {
      withCredentials: true
    }).then(res => {
      console.log(res.data);
      console.log(res._id);
      console.log(res.data.id);

      this.setState({
        isLoggedIn: true,
        username: res.data.username,
        userId: res.data._id
        // user: res.data,
      });
      console.log(this.state);
      console.log(res.data);
    }).catch((err) =>  {
      console.log(err)
    });
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
      password: this.state.password,
    };

    console.log(user);
    axios.post('http://localhost:8080/auth/edit', user, {
      withCredentials: true
    })
        .then(res => {
          console.log(res.data);
          alert("Changed!")
          window.location = '/';
        })
        .catch((err) => {
          console.log(err);
        });
  }

  deleteAccount(id) {
    axios.delete('http://localhost:8080/auth/delete/' + id)
        .then(res => console.log(res.data))
        .catch((err) => console.log(err));

    axios.get('http://localhost:8080/auth/logout/', {
      withCredentials: true
    }).catch((err) => { console.log(err); });

    alert("Deleted!");
    window.location = '/login';
  }


  accComponent() {
    const DeleteBtn = props => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" className="btn btn-outline-danger" onClick={ () => {
          props.deleteAccount(props.userId)}} onSubmit="onDelete">
          Delete account
        </a>
    );

      return <DeleteBtn userId = { this.state.userId }
                        deleteAccount = { this.deleteAccount }
                        currentUser/>
  }


// {isLoggedIn ? (<Link to={ "booking/add/" + props.placement._id }> pick dates </Link>):<span>not authorised</span>}

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    return (
        <div className="container">
          { isLoggedIn ?
              (
                  <form onSubmit={this.onSubmit}>
                    <h3>Edit "{this.state.username}" user</h3>
                    <div className="form-group">
                      <label>Enter new username: </label>
                      <input
                          type="text"
                          required
                          className="form-control"
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                      />
                    </div>
                    <div className="form-group">
                      <label>Enter new password: </label>
                      <input
                          type="text"
                          required
                          className="form-control"
                          onChange={this.onChangePassword}
                      />
                    </div>
                    <div className="other">
                      <div className="form-group mr-sm-3">
                        <input type="submit" value="Edit" className="btn btn-outline-info"/>
                      </div>
                      <span className="m-or mr-sm-3">or</span>
                      <div className="form-group">
                        { this.accComponent() }
                      </div>
                    </div>
                  </form>
              )
              : <h3>not authorised</h3> }
          {/*{ this.accComponent }*/}
        </div>
    );
  }
}
