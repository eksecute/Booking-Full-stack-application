import React, { Component } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';


export default class EditPlacement extends Component{

  constructor(props) {
    super(props);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeHousename   = this.onChangeHousename.bind(this);
    this.onChangeAddress     = this.onChangeAddress.bind(this);
    this.onChangePrice       = this.onChangePrice.bind(this);
    this.onSubmit            = this.onSubmit.bind(this);
    // this.onChangeFile        = this.onChangeFile.bind(this);

    this.state = {
      landlordName: '',
      description:  '',
      landlordId:   '',
      housename:    '',
      address:      '',
      price:        0,
    }
  }

  componentDidMount() {

    axios.get('http://localhost:8080/placement/single/' + this.props.match.params.id)
        .then(res => {
          this.setState({
            landlordName: res.data.landlordName,
            description:  res.data.description,
            landlordId:   res.data.landlordId,
            housename:    res.data.housename,
            address:      res.data.address,
            price:        res.data.price,
          })
        })
        .catch((err) => {
          console.log(err);
        });
  }

  onChangeHousename(e) {
    this.setState({
      housename:   e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangeAddress(e) {
    this.setState({
      address:     e.target.value
    })
  }

  onChangePrice(e) {
    this.setState({
      price:       e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const placement = {
      landlordName: this.state.landlordName,
      description:  this.state.description,
      landlordId:   this.state.landlordId,
      housename:    this.state.housename,
      address:      this.state.address,
      price:        this.state.price,
      // file:         this.state.file
    };
    console.log(placement);

    axios.post('http://localhost:8080/placement/single/update/' + this.props.match.params.id, placement)
        .then(res => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));

    window.location = '/placements';
  }

  render() {
    return (
        <div>
          <div className="container">
            <h3>Edit "{this.state.housename}" placement</h3>
            <form onSubmit={this.onSubmit}>

              <div className="form-group">
                <label>New house name: </label>
                <input
                    ref="houseInput"
                    required
                    className="form-control"
                    value={this.state.housename || ''}
                    onChange={this.onChangeHousename}
                >
                </input>
              </div>
              <div className="form-group">
                <label>New description: </label>
                <textarea
                    className="form-control textarea"
                    placeholder={ this.state.description  || ''}
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label>New address: </label>
                <input
                    // ref="userInput"
                    required
                    className="form-control"
                    value={this.state.address || ''}
                    onChange={this.onChangeAddress}
                >
                </input>
              </div>
              <div className="form-group">
                <label>New price: </label>
                <input
                    // ref="userInput"
                    type="number"
                    required
                    className="form-control"
                    value={this.state.price || ''}
                    onChange={this.onChangePrice}
                >
                </input>
              </div>
              <div className="form-group">
                <input type="submit" value="Edit!" className="btn btn-outline-info "/>
              </div>
            </form>
          </div>
        </div>
    );
  }
}
