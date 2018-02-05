/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import FBSD,{ LoginManager,AccessToken } from 'react-native-fbsdk'


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class LoginView extends Component<{}> {

  _fbAuth(){
    LoginManager.logInWithReadPermissions(['public_profile']).then(function(result) {
      if (result.isCancelled) {
        alert('Login cancelled');
      } else {
        AccessToken.getCurrentAccessToken().then((data) => {
                    console.log(data.accessToken.toString());
                    console.log(data.toString());
                });
        alert('Login success with permissions: '
          +result.grantedPermissions.toString());
      }
    },
    function(error) {
      alert('Login fail with error: ' + error);
    }
);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native! LoginView
        </Text>
          <TouchableOpacity onPress={this._fbAuth}>
            <Text>facebookLogin</Text>
          </TouchableOpacity>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
