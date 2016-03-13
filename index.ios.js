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
  },
  {
    key: 2,
    title: "The wrong Union Square",
    latitude: 37.787689,
    longitude: -122.406858
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
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var self = this
      this.setState({
        lastLat: position.coords.latitude,
        lastLong: position.coords.longitude,
      });
      console.log(this.state.lastLat)
      console.log(this.state.lastLong)
      MONUMENTS.forEach(function(monument){
        var latDistance = position.coords.latitude - monument.latitude;
        var longDistance = position.coords.longitude - monument.longitude;
        if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < 0.0005) {
          self.setState({inGeofence: true})
        }
        else {
          self.setState({inGeofence: false})
          console.log(self.state.inGeofence)
        }
      });
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
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
  }
});



AppRegistry.registerComponent('WalkAbout', () => WalkAbout);