  'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  MapView,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
var styles = require('./styles.ios.js');
var Sound = require('react-native-sound');

var MONUMENTS = [
  {
    title: "NYSE!",
    latitude: 40.706911, 
    longitude: -74.011045,
    description: "The New York Stock Exchange is the workplace of some of the most stressed out and insane workers in the country. It is the number one source for cocaine and pork belly futures in New York City."
  },
  {
    title: "The wrong Union Square",
    latitude: 37.787689,
    longitude: -122.406858,
    description: "This version of Union Square has been deprecated."
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
      inGeofence: false,
      currentMonument: {}
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
            self.setState({
              inGeofence: true,
              currentMonument: monument,
            })
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
      <MonumentDetail monument={this.state.currentMonument}/>
    );
  }

});




var MonumentDetail = React.createClass({

  getInitialState: function() {
    return{
    monument: this.props.monument,
    audioFile: new Sound('./ding.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {console.log('failed to load sound ', error)} else {
        console.log('sound loaded successfully')}
      })
    }},

  pauseAudio: function() {
    this.state.audioFile.pause();
  },

  playAudio: function() {
    this.state.audioFile.play();
  },

  render: function() {
    this.state.audioFile.play((success) => {
      if (success) {
        console.log('Audio played');
      } else {
        console.log('Audio failed to play');
      }
    });
    return (
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{this.state.monument.title}</Text>
          <Text style={styles.title}>{this.state.monument.description}</Text>
        </View>
      </View>
      )
  }

})

AppRegistry.registerComponent('WalkAbout', () => WalkAbout);