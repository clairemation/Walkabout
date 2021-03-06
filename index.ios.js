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
  TouchableOpacity,
  ScrollView
} from 'react-native';

var styles = require('./styles.ios.js');
var Sound = require('react-native-sound');

var ENTERING_RADIUS = 0.001
var LEAVING_RADIUS = 0.001

var photoMap = {
  'sssp': require('image!sssp'),
  'cityHall': require('image!CityHall'),
  'brooklynBridge': require('image!BrooklynBridge'),
  'wallStreet': require('image!WallStreet'),
  'astorPlace': require('image!AstorPlace'),
  'WTC': require('image!WTC'),
  'castleClinton': require('image!CastleClinton')
}

var WalkAbout = React.createClass({
  watchID: (null: ?number),
  currentMonument: undefined,

  getInitialState: function() {
    return {
      inGeofence: false,
      monumentArray: require('./ios/monuments.json'),
    };
  },



  enableWatchPosition: function(){
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      if (this.currentMonument)
        this.checkForLeavingGeofence(latitude, longitude, this.currentMonument)
      else
        this.checkForEnteringGeofence(latitude, longitude)
      },
      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000}
    );
    
  },

  checkForLeavingGeofence: function(latitude, longitude, monument){
    var latDistance = latitude - monument.latitude;
    var longDistance = longitude - monument.longitude;
    if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) >= LEAVING_RADIUS) {
      this.currentMonument = null
      this.setState({
          inGeofence: false,
        })
      }
  },

  checkForEnteringGeofence: function(latitude, longitude){
    for(var i = 0; i < this.state.monumentArray.length; i++){
      var monument = this.state.monumentArray[i]
      var latDistance = latitude - monument.latitude;
      var longDistance = longitude - monument.longitude;
      if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < ENTERING_RADIUS) {
        this.currentMonument = this.state.monumentArray[i]
        this.setState({
          inGeofence: true,
        })
      }
    }
  },

  componentDidMount: function(){
    this.enableWatchPosition(); 
  },//relocated from MonumentMap

  render: function() {
    this.state.monumentArray.forEach(function(object){
        object.image = require('image!annotationMarker')});
    if(this.state.inGeofence){
      return (
        <View>
          <Image style={styles.banner}
            source={require('image!banner')} />
          <InGeoFencePage monument={this.currentMonument} monumentArray={this.state.monumentArray} enableWatchLocation={this.enableWatchPosition} />
        </View>
        )
    }
    else{
      return (
        <View>
          <Image style={styles.banner}
            source={require('image!banner')} />
          <MonumentMap monumentArray={this.state.monumentArray}/>
          <Image style={styles.footer}
            source={require('image!footer')} />
        </View>
        )
    }
  }
});


var InGeoFencePage = React.createClass({

  getInitialState: function() {
    return {
      displayComponent: <MonumentDetail monument={this.props.monument} />
    };
  },

  componentDidMount: function(){
    this.props.enableWatchLocation();
  },

  swapComponent: function(event) {
    if (event.nativeEvent.selectedSegmentIndex == 0)
      this.setState({displayComponent: <MonumentMap monumentArray={this.props.monumentArray} />});
    else
      this.setState({displayComponent: <MonumentDetail monument={this.props.monument} />});
  },

  render: function() {
    return(
      <View>
        <SegmentedControlIOS values={['Map', this.props.monument.title]}
                            selectedIndex={1}
                            style={styles.segmentControl}
                            onChange={this.swapComponent} />

        {this.state.displayComponent}
        <Image style={styles.footer}
            source={require('image!footer')} />
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
        annotations={this.props.monumentArray} />

    </View>
  )},

  

  // deleted componentWillUnmount that did nothing but a console.log

})


// deleted H1 component that was never used

var MonumentDetail = React.createClass({

  getInitialState: function() {
    return{
    monument: this.props.monument,
    audioFile: new Sound(this.props.monument.sound, Sound.MAIN_BUNDLE, (error) => {
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
  replayAudio: function() {
    this.state.audioFile.stop();
    this.state.audioFile.play();
  },
  playAudio: function() {
    this.state.audioFile.play();
  },

  componentWillUnmount: function() {
    this.state.audioFile.stop();
    this.state.audioFile.release();
  },

  render: function() {
    return (
      <View>

        <View style={styles.textContainer}>

          <View style={styles.monumentTitleCont}>
            <Text style={styles.monumentTitle}> {this.state.monument.title}</Text>
          </View>

          <Image style={styles.monumentImage}
            source={photoMap[this.state.monument.photo]}/>

          <View style={styles.monumentAudioCont}>
            <TouchableHighlight onPress={this.replayAudio} underlayColor={"white"} >
              <Image source={require('image!replayButton')} style={styles.buttonReplay} />
            </TouchableHighlight>

            <TouchableHighlight onPress={this.playAudio} underlayColor={"white"}>
              <Image source={require('image!playButton')} style={styles.buttonPlay} />
            </TouchableHighlight>

            <TouchableHighlight onPress={this.pauseAudio} underlayColor={"white"}>
              <Image source={require('image!pauseButton')} style={styles.buttonPause}/>
            </TouchableHighlight>
          </View>

          <ScrollView >
          <Text style={styles.description}>{this.state.monument.description}</Text>
          </ScrollView>
        </View>

        <Image style={styles.footer}
            source={require('image!footer')}/>

      </View>
      )
  }
})

AppRegistry.registerComponent('WalkAbout', () => WalkAbout);
