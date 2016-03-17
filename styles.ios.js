'use strict';


import React, {
  StyleSheet,
} from 'react-native';

var styles = StyleSheet.create({
  banner: {
    height: 54,
    width: 375,
  },
  footer: {
    height: 33,
    width: 375,
  },
  map: {
    height: 552,
    borderColor: '#000000',
  },
  monumentTitleCont: {
    height: 82,
    width: 375,
  },
  monumentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Heiti SC',
    textAlign: 'center'
  },
  monumentImage: {
    height: 242,
    width: 375,
  },
  monumentAudioCont: {
    height: 72,
    width: 375,
    flexDirection: 'row',
  },
  buttonPlay: {
    height: 51,
    width: 51,
    marginLeft: 42,
    marginTop: 10,
  },
  buttonReplay: {
    width: 44,
    height: 39,
    marginLeft: 74,
    marginTop: 16,
  },
  buttonPause: {
    width: 44,
    height: 39,
    marginLeft: 42,
    marginTop: 16,
  },
  description: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
    fontFamily: 'Heiti SC',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    height: 40,
    width: 60,
  },
  textContainer: {
    height: 552,
  },
  mainMap: {
    height: 580,
    borderColor: '#000000',
  },
  segmentControl: {
  }

});

module.exports = styles;
