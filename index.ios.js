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
  currentMonument: undefined,

  getInitialState: function() {
    return {
      lastLat: 'unknown',
      lastLong: 'unknown',
      inGeofence: false,
    };
  },
  
  enableWatchPosition: function(){
    console.log('enable watch')
    this.watchID = navigator.geolocation.watchPosition((position) => {
      alert(position.coords.latitude, position.coords.longitude)
      this.setState({
        lastLat: position.coords.latitude,
        lastLong: position.coords.longitude,
      })
    },(error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
    )},

  disableWatchPosition: function(){
    console.log('disable watch')
    navigator.geolocation.clearWatch(this.watchID); 
  },

  shouldComponentUpdate: function(){
    console.log('component update')
    return this.withinGeofence()
  },

  withinGeofence: function(){
    for(var i = 0; i < MONUMENTS.length; i++){
      var monument = MONUMENTS[i]
      var latDistance = this.state.lastLat - monument.latitude;
      var longDistance = this.state.lastLong - monument.longitude;
      if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < 0.1) {
        this.currentMonument = MONUMENTS[i]
        return true
      }
    }

    return false
  },

  toggleGeofenceState: function() {
    this.state.inGeofence = !this.state.inGeofence;
  },

  render: function() {
    if(this.currentMonument)
      return (<MonumentDetail monument={this.currentMonument} />)
    else
      return (<MonumentMap enableWatchLocation={this.enableWatchPosition} disableWatchLocation={this.disableWatchPosition} />)
  }
});

var MonumentMap = React.createClass({
  render: function(){ return(
     <View>
      <MapView 
        style={styles.map}
        showsUserLocation={true}
        followUserLocation={true}
        annotations={MONUMENTS} />
    </View>
  )},

  componentDidMount: function(){
    console.log('map mounted')
    this.props.enableWatchLocation();
  },

  componentWillUnmount: function() {
    console.log('map un-mounted')
    this.props.disableWatchLocation();
  },

})


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

  goBack: function() {
    console.log("Back to map");
  },
  render: function() {

    this.state.audioFile.play( (success) => {
      if (success) {
        console.log("STEP 3")
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
        <View>
          <TouchableOpacity onPress={this.goBack}>
            <Text>Back to Map</Text>
          </TouchableOpacity>
        </View>
      </View>
      )
  }

})

AppRegistry.registerComponent('WalkAbout', () => WalkAbout);