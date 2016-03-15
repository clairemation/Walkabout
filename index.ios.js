'use strict';

import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View,
  MapView,
  SegmentedControlIOS,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

var styles = require('./styles.ios.js');
var Sound = require('react-native-sound');

var MONUMENTS = [
  {
    title: "NYSE!",
    latitude: 40.706851,
    longitude: -74.010158,
    description: "The New York Stock Exchange is the workplace of some of the most stressed out and insane workers in the country. It is the number one source for cocaine and pork belly futures in New York City."
  },

]

var WalkAbout = React.createClass({
  watchID: (null: ?number),
  currentMonument: MONUMENTS[0],

  getInitialState: function() {
    return {
      lastLat: 'unknown',
      lastLong: 'unknown',
      inGeofence: true,
    };
  },

  enableWatchPosition: function(){
    console.log('enable watch')
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var self = this;
      if (this.currentMonument)
        this.checkForLeavingGeofence(latitude, longitude, this.currentMonument, self)
      else
        this.checkForEnteringGeofence(latitude, longitude, self)
    })
  },

  disableWatchPosition: function(){
    console.log('disable watch')
    navigator.geolocation.clearWatch(this.watchID);
  },

  checkForLeavingGeofence: function(latitude, longitude, monument, self){
    console.log('inside geofence, checking for user leaving')
    var latDistance = latitude - monument.latitude;
    var longDistance = longitude - monument.longitude;
    if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) >= 0.001) {
      self.currentMonument = nil
      self.setState({
          lastLat: latitude,
          lastLong: longitude,
          inGeofence: false,
        })
      }
  },

  checkForEnteringGeofence: function(latitude, longitude, self){
    console.log('checking geoFence')
    for(var i = 0; i < MONUMENTS.length; i++){
      var monument = MONUMENTS[i]
      var latDistance = latitude - monument.latitude;
      var longDistance = longitude - monument.longitude;
      if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < 0.001) {
        console.log('within a geoFence')
        self.currentMonument = MONUMENTS[0]
        self.setState({
          lastLat: latitude,
          lastLong: longitude,
          inGeofence: true,
        })
      }
    }
  },

  backToMap: function(){
    this.setState({inGeofence: false})
  },

  render: function() {
    if(this.state.inGeofence){
      console.log('rendering inGeoFencePage')
      return (<InGeoFencePage monument={MONUMENTS[0]} enableWatchLocation={this.enableWatchPosition} />)
    }
    else{
      console.log('rendering map')
      return (<MonumentMap enableWatchLocation={this.enableWatchPosition} disableWatchLocation={this.disableWatchPosition} />)
    }
  }
});


var InGeoFencePage = React.createClass({

  monumentComponent: <MonumentDetail monument={MONUMENTS[0]} />,
  mapComponent: <MonumentMap />,

  getInitialState: function() {
    return {
      displayComponent: <MonumentDetail monument={this.props.monument} />
    };
  },

  swapComponent: function(event) {
    if (event.nativeEvent.selectedSegmentIndex == 0)
      this.setState({displayComponent: <MonumentMap enableWatchLocation={this.props.enableWatchLocation} />});
    else
      this.setState({displayComponent: <MonumentDetail monument={MONUMENTS[0]} />});
  },

  render: function() {
    return(
      <View>
        <SegmentedControlIOS values={['Map', this.props.monument.title]}
                            selectedIndex={1}
                            style={{marginTop: 30}}
                            onChange={this.swapComponent} />

        {this.state.displayComponent}
      </View>
    );
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

  },

})


var H1 = React.createClass({
  render: function() {
    return (
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>{this.props.children}</Text>
    );
  }

})

var MonumentDetail = React.createClass({

  getInitialState: function() {
    return{
    monument: this.props.monument,
    audioFile: new Sound('./ringding.mp3', Sound.MAIN_BUNDLE, (error) => {
      if(error){
        console.log('failed to load sound ', error)
      } else {
        console.log('sound loaded successfully')
        this.playAudio();
      }
    })
  }},
  pauseAudio: function() {
    this.state.audioFile.pause();
  },

  playAudio: function() {
    this.state.audioFile.play();
  },

  render: function() {
    return (
      <View>
        <View style={styles.textContainer}>
          <H1>{this.state.monument.title}</H1>
          <Image source={{uri: 'http://siliconangle.com/files/2015/05/nyse.jpg'}}
                  resizeMode='contain'
                  style={{width: 300, height: 200}} />
          <Text style={styles.title}>{this.state.monument.description}</Text>
          <TouchableHighlight onPress={this.pauseAudio}>
            <Text>Pause</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.playAudio}>
            <Text>Replay</Text>
          </TouchableHighlight>
        </View>
      </View>
      )
  }
})

AppRegistry.registerComponent('WalkAbout', () => WalkAbout);
