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
      if (Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2)) < 0.1) {
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
     
     <Image style={styles.banner}
            source={require('image!banner')} />
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followUserLocation={true}
        annotations={this.props.monumentArray} />
      <Image style={styles.footer}
            source={require('image!footer')} />

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
        
        <Image style={styles.banner}
            source={require('image!banner')} />
        
        <View style={styles.textContainer}>
          
          <SegmentedControlIOS values={['Map', this.state.monument.title]}
                      selectedIndex={1}
                      onChange={this.props.goBack} />
           
          <View style={styles.monumentTitleCont}>
            <Text style={styles.monumentTitle}> {this.state.monument.title}</Text>
          </View>

          <Image style={styles.monumentImage} 
            source={{uri: this.state.monument.uri}}/>
          
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
