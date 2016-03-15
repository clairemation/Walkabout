'use strict';


import React, {
  StyleSheet,
} from 'react-native';

var styles = StyleSheet.create({
  map: {
    height: 650,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    height: 40,
    width: 60,
  },
  textContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    height: 600,
    marginTop: 20,
  },
});

module.exports = styles;
