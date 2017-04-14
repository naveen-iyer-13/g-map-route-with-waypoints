import React, { Component } from 'react';
import firebase from 'firebase';
import Maps from './components/Maps';
import './styles.css';

export default class App extends Component {

  constructor(){
    super();
    this.state = {
        name: "",
        latitude: "",
        longitude: "",
        markerData: [],
        showInfo: []
    }
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onSubmitFunction = this.onSubmitFunction.bind(this);
  }

  componentDidMount() {
    var config = {
      apiKey: "AIzaSyDmhScxaAdwgg0d5nQSh6Na7zI_XrKNmbA",
      authDomain: "gmapmarkerspa.firebaseapp.com",
      databaseURL: "https://gmapmarkerspa.firebaseio.com",
      projectId: "gmapmarkerspa",
      storageBucket: "gmapmarkerspa.appspot.com",
      messagingSenderId: "372939241236"
    };
    firebase.initializeApp(config);
    this.getData();
  }

  getData() {
    var tempArray = [];
    firebase.database().ref('markerData').once("value").then(val => {
      if(val.val()) {
        val.val().map((item,index) => {
          return tempArray[index] = false;
        })
      }
      this.setState({
        markerData: val.val() || [],
        showInfo: tempArray || []
      })
    });
  }

  showInfo(id) {
    var tempArray = this.state.showInfo.slice();
    tempArray[id] = true;
    this.setState({
      showInfo : tempArray
    });
  }

  hideInfo(id) {
    var tempArray = this.state.showInfo.slice();
    tempArray[id] = false;
    this.setState({
      showInfo : tempArray
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeLatitude(e) {
    this.setState({
      latitude: e.target.value
    });
  }

  onChangeLongitude(e) {
    this.setState({
      longitude: e.target.value
    });
  }

  onSubmitFunction() {
    var tempArray = [];
    if(this.state.markerData.length) {
      tempArray = this.state.markerData.slice();
    }
    var lat = parseFloat(this.state.latitude,10);
    var lng = parseFloat(this.state.longitude,10);
    tempArray.push({name: this.state.name, position:{lat: lat, lng: lng}});
    firebase.database().ref('markerData').set(tempArray);
    this.setState ({
      name: "",
      latitude: "",
      longitude: ""
    });
    this.getData();
  }

  render() {
    return (
      <div className="container">
        <div className="mapContainer">
          <Maps markerData={this.state.markerData} showInfo={this.showInfo.bind(this)} hideInfo={this.hideInfo.bind(this)} showInfoArray={this.state.showInfo}/></div>
      </div>
    )
  }
}
