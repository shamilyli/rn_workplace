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
  TouchableOpacity,
  AsyncStorage,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Swiper from 'react-native-swiper'
const { width, height } = Dimensions.get('window')
import FBSD,{ LoginManager,AccessToken,GraphRequestManager,GraphRequest } from 'react-native-fbsdk'
import Router from './routes';



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
export default class LoginView extends Component {
  constructor(props) {
      super(props);
      this.state = {
        isLogin: false
      }
    }
    onChange=()=>{
      this.setState({
        islogin: true
      });
    }
  //facebook login auth
  _fbAuth()
  {
    LoginManager.logInWithReadPermissions(['public_profile']).then(function(result) {
      if (result.isCancelled) {
        alert('Login cancelled');
      } else {
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            let accessToken = data.accessToken;
            alert(accessToken.toString());
            var that = this;

            const responseInfoCallback = (error, result) => {
              if (error) {
                console.log(error)
                alert('Error fetching data: ' + error.toString());
              } else {
                console.log(result);
                AsyncStorage.setItem('user_id', result.id);
                AsyncStorage.setItem('user_firstN', result.first_name);
                AsyncStorage.setItem('user_lastN', result.last_name);
                AsyncStorage.setItem('user_gender', result.gender);
                AsyncStorage.setItem('user_picture_url', result.picture.data.url);
                alert(result.picture.data.url);
                // that.setState({
                //   islogin: false
                // });
                // that.onChange();
              }
              // console.log(AsyncStorage.getItem('user_picture_url'));
            }


            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string: 'email,first_name,last_name,gender,picture.type(large),timezone'
                  }
                }
              },
              responseInfoCallback
            );
            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start();

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
//facebook logout
  fbLogout(){
     LoginManager.logOut();
  }
  //render view
  render() {
    //todo construct a asyncstorage with a default data sturcter, islogin,loginId,firstname,lastname,gender,picture_url
    //read asyncstorage islogin to see what page should go
    if (this.state.isLogin) {
      return(
        <View style={styles.container}>
          <StatusBar barStyle='light-content' />
          <Image
            source={require('./img/bg.jpg')}
            style={styles.imgBackground}
          />
          <Swiper style={styles.wrapper}
            dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            paginationStyle={{
              bottom: 70
            }}
            loop={false}>
            <View style={styles.slide}>
              <Image
                style={styles.image}
                source={require('./img/1.jpg')}
                resizeMode='cover'
              />
            </View>
            <View style={styles.slide}>
              <Image
                style={styles.image}
                source={require('./img/2.jpg')}
                resizeMode='cover'
              />
            </View>
            <View style={styles.slide, {flex:1, flexDirection:'column'}}>
              <Text style={{fontSize: 20,
              textAlign: 'center',
              margin: 10,}}>
                Welcome to React Native! LoginView
              </Text>
              <TouchableOpacity onPress={this._fbAuth}>
                <Text>
                  facebookLogin
                </Text>
              </TouchableOpacity>
              <Text style={{textAlign: 'center',
              color: '#333333',
              marginBottom: 5,}}>
                To get started, edit App.js
              </Text>
              <TouchableOpacity
                onPressOut={() => this.setState({isLogin: false})}>
                <Text>
                  change_state
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.fbLogout}>
                <Text>
                  facebook logout
                </Text>
              </TouchableOpacity>
              <Text style={{textAlign: 'center',
              color: '#333333',
              marginBottom: 5,}}>
                {instructions}
              </Text>
            </View>
          </Swiper>
        </View>
      );
    }else{
    return (
      <View style={{flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5FCFF',}}>
        <Text style={{fontSize: 20,
        textAlign: 'center',
        margin: 10,}}>
          Welcome to React Native! LoginView
        </Text>
        <TouchableOpacity onPress={this._fbAuth}>
          <Text>
            facebookLogin
          </Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center',
        color: '#333333',
        marginBottom: 5,}}>
          To get started, edit App.js
        </Text>
        <TouchableOpacity
          onPressOut={() => this.setState({isLogin: true})}>
          <Text>
            change_state
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.fbLogout}>
          <Text>
            facebook logout
          </Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center',
        color: '#333333',
        marginBottom: 5,}}>
          {instructions}
        </Text>
      </View>
      //todo use the route update the login state
      // <Router/>
    );
  }
}
}

const styles = {
  wrapper: {
    // backgroundColor: '#f00'
  },

  slide: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
  },

  imgBackground: {
    width,
    height,
    backgroundColor: 'transparent',
    position: 'absolute'
  },

  image: {
    width,
    height,
  }
}
