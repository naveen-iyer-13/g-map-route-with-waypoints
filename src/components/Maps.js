import React, { Component } from 'react';
// import { Map, Marker } from 'google-maps-react';
import {withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';
import Geosuggest from 'react-geosuggest';
import "../styles.css"

const InitMap = withGoogleMap(props => {
  return (
    <GoogleMap defaultZoom={3} defaultCenter={{lat: 9.9312, lng: 76.2673}}>
      {props.markerData}
      {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
  )
});



export default class Maps extends Component {
  constructor(){
    super();
    this.state = {
        directions: null,
        markerData: []
    }
    this.onSuggestSelect = this.onSuggestSelect.bind(this);
    this.getRoute = this.getRoute.bind(this);
  }

  getRoute() {
    var waypts = [];
    var length = this.state.markerData.length-1;
    var i;
    for (i = 1; i < length; i++) {
        waypts.push({
          location: new window.google.maps.LatLng(this.state.markerData[i].position.lat, this.state.markerData[i].position.lng),
          stopover: true
        });
      }

    const DirectionsService = new window.google.maps.DirectionsService();
    DirectionsService.route({
      origin: new window.google.maps.LatLng(this.state.markerData[0].position.lat, this.state.markerData[0].position.lng),
      destination: new window.google.maps.LatLng(this.state.markerData[length].position.lat, this.state.markerData[length].position.lng),
      waypoints: waypts,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  onSuggestSelect(suggest) {
    var tempArray = this.state.markerData;
    var lat = suggest.location.lat;
    var lng = suggest.location.lng;
    tempArray.push({name: suggest.label, position:{lat: lat, lng: lng}});
    this.setState({
      markerData: tempArray
    });
  }

  render() {
    var markerData = (
      this.state.markerData.map((marker,index) => (
        <Marker key={index} position={{lat : marker.position.lat,lng: marker.position.lng}} />
      ))
    )

    var geoSuggest = this.state.markerData.map((item,index) =>
      <Geosuggest key={index} onSuggestSelect={this.onSuggestSelect}/>
    );
    var disabled = true;
    if(this.state.markerData.length > 1) {
      disabled = false;
    }

    return (
      <div style={{height: "100%", width: "100%"}}>
        <div style={{position: "absolute", left: "0px", top: "50px", zIndex: "1000", textAlign: "center"}}>
          <Geosuggest className="geosuggest" onSuggestSelect={this.onSuggestSelect}/>
          {geoSuggest}
          <button onClick={this.getRoute} disabled={disabled}>Get Route</button>
        </div>
        <InitMap containerElement={
          <div style={{height: "100%"}} />
        }
        mapElement={
          <div style={{height: "100%"}} />
        }
         markerData={markerData} directions={this.state.directions}/>
      </div>
    )
  }
}
