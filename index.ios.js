  'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  MapView
} from 'react-native';
var styles = require('./styles.ios.js');

var MONUMENTS = [
  {
    title: "NYSE!",
    latitude: 40.706911, 
    longitude: -74.011045
  }
]

var WalkAbout = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      initialLat: 'unknown',
      initialLong: 'unknown',
      lastLat: 'unknown',
      lastLong: 'unknown',
      inGeofence: false
    };
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          initialLat: position.coords.latitude,
          initialLong: position.coords.longitude,
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 0}
    );
    
    var self = this
    if (this.state.inGeofence == false){
      this.watchID = navigator.geolocation.watchPosition((position) => {
        this.setState({
          lastLat: position.coords.latitude,
          lastLong: position.coords.longitude,
        });
        for(var i = 0; i < MONUMENTS.length; i++){
          var monument = MONUMENTS[i]
          var latDistance = position.coords.latitude - monument.latitude;
          var longDistance = position.coords.longitude - monument.longitude;
          if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < 0.001) {
            self.setState({inGeofence: true})
            console.log(latDistance, longDistance) 
            console.log(self.state.inGeofence)
            break          
          }
        }
      });
    }
    
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    if(this.state.inGeofence == true){
      return this.renderGeoPage();
    }
    else{
    return this.renderMap();
    }
  },

  renderMap: function(){
    return (
      <View>
       <MapView 
        style={styles.map}
        showsUserLocation={true}
        followUserLocation={true}
        annotations={MONUMENTS} />
        <Text>
        {"\n"}
          <Text style={styles.title}>Initial position: </Text>
          {JSON.stringify(this.state.initialLat)}
          {JSON.stringify(this.state.initialLong)}

        </Text>
        <Text>
        {"\n"}
          <Text style={styles.title}>Current position: </Text>
          {JSON.stringify(this.state.lastLat)}
          {JSON.stringify(this.state.lastLong)}
        </Text>
      </View>
    );
  },


  renderGeoPage: function(){
    return (
      <View>
        <Text style={styles.title}>
        {"\n"}
        You Are Inside a Geofence! 
        </Text>
      </View>
    );
  }

});



AppRegistry.registerComponent('WalkAbout', () => WalkAbout);