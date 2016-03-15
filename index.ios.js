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



var WalkAbout = React.createClass({
  watchID: (null: ?number),
  currentMonument: undefined,

  getInitialState: function() {
    return {
      lastLat: 'unknown',
      lastLong: 'unknown',
      inGeofence: false,
      monumentArray: require('./ios/monuments.json'),
    };
  },



  enableWatchPosition: function(){
    console.log('enable watch')
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var self = this;
      this.withinGeofence(latitude, longitude, self)
    })
  },

  disableWatchPosition: function(){
    console.log('disable watch')
    navigator.geolocation.clearWatch(this.watchID);
  },


  withinGeofence: function(latitude, longitude, self){
    console.log('checking geoFence')
    for(var i = 0; i < this.state.monumentArray.length; i++){
      var monument = this.state.monumentArray[i]
      var latDistance = latitude - monument.latitude;
      var longDistance = longitude - monument.longitude;
      if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < 0.001) {
        console.log('within a geoFence')
        self.currentMonument = this.state.monumentArray[i]
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
      console.log('rendering MonumentDetail')
      return (<MonumentDetail monument={this.currentMonument}
                              goBack={this.backToMap} />)
    }
    else{
      console.log('rendering map')
      return (<MonumentMap enableWatchLocation={this.enableWatchPosition} disableWatchLocation={this.disableWatchPosition} monumentArray={this.state.monumentArray}/>)
    }
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

  componentDidMount: function(){
    console.log('map mounted')
    this.props.enableWatchLocation();
  },

  componentWillUnmount: function() {
    console.log('map un-mounted')
    this.props.disableWatchLocation();
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

  componentWillUnmount: function() {
    this.state.audioFile.stop();
    this.state.audioFile.release();
  },

  render: function() {
    return (
      <View>
        <SegmentedControlIOS values={['Map', this.state.monument.title]}
                            selectedIndex={1}
                            style={{marginTop: 30}}
                            onChange={this.props.goBack} />
        <View style={styles.textContainer}>
          <H1>{this.state.monument.title}</H1>
          <Image source={{uri: this.state.monument.uri}}
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
