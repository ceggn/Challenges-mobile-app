var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//window.LOG_LEVEL = 'DEBUG'
import React, { Component } from 'react';
import {
  ImageBackground,
  Alert,
  FlatList,
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  PushNotificationIOS,
  Share,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  SectionList,
  NativeModules,
  Platform,
  Modal,
  StatusBar,
  PermissionsAndroid
} from 'react-native';

import { WebView } from "react-native-webview";
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator, createStackNavigator, SafeAreaView } from 'react-navigation';
import DatePicker from 'react-native-datepicker'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import InViewPort from 'react-native-inviewport';
import FastImage from 'react-native-fast-image';
import {
  Root,
  Toast,
  Container,
  Row,
  Col,
  Grid,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  Button,
  Text,
  StyleProvider,
  ActionSheet,
  Left, Body, Right, Title, CheckBox, Content, ListItem,
  Form, Item, Input, Label, Textarea, Picker } from 'native-base';
import icoMoonConfig from './components/selection.json';
import getTheme from './native-base-theme/components';
import customStyle from './native-base-theme/variables/platform';
//import VideoPlayer from 'react-native-video-player';
import VideoAf from 'react-native-af-video-player'
import { RNCamera } from 'react-native-camera';
import { BlurView } from 'react-native-blur';
import UUIDGenerator from 'react-native-uuid-generator';
import ImagePicker from 'react-native-image-picker';
import TimeAgo from './components/TimeAgo';
import { RNS3 } from 'react-native-aws3';
import ProgressCircle from 'react-native-progress/Circle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Amplify, { I18n, Auth, API, Storage, Hub } from 'aws-amplify';
import PushNotification from '@aws-amplify/pushnotification';
import * as mime from 'react-native-mime-types';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);
PushNotification.configure(aws_exports);
Amplify.configure({
  Auth: {
      oauth: {
        // Domain name
        domain : 'challenges.auth.us-west-2.amazoncognito.com', 
        // Authorized scopes
        scope : ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'], 
        // Callback URL
        redirectSignIn : 'challenges://', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'
        // Sign out URL
        redirectSignOut : 'challenges://', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'
        // 'code' for Authorization code grant, 
        // 'token' for Implicit grant
        responseType: 'code',
      }
  },
});
import { ErrorRow, Loading, SignIn, SignUp, ConfirmSignUp, ConfirmSignIn, VerifyContact, ForgotPassword, RequireNewPassword, AmplifyTheme } from 'aws-amplify-react-native';
import { withAuthenticator } from './components/customAuth';
import { LoginUsername, LoginPassword } from './custom-login-ui/FormElements';

// i18n
import cahallengesDict from './dictionary';
let moment = require('moment/min/moment-with-locales');
if( Platform.OS === 'ios' ){
  var locale = NativeModules.SettingsManager.settings.AppleLocale;
}else{
  var locale = NativeModules.I18nManager.localeIdentifier;
}
var languageCode = locale.substring(0, 2);
moment.locale(languageCode);
I18n.setLanguage(languageCode);
I18n.putVocabularies(cahallengesDict);
var isGuest = false;

// AppSync
import AppSync from './AppSync.js';
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

//Pages
import MessagesPage from './components/MessagesPage';
import ChatScreen from './components/ChatScreen';
import SearchScreen from './components/SearchScreen';
import FollowersScreen from './components/FollowersScreen';
import AllFollowersScreen from './components/AllFollowersScreen';
import LikedVideosScreen from './components/LikedVideosScreen';
import UserProfileScreen from './components/UserProfile';
import PayOutScreen from './components/PayOutScreen';

// Custom UI
//const FBLoginButton = require('./components/FBLoginButton');
const AuthTheme = Object.assign({}, AmplifyTheme, {
  container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingTop: 0,
      width: '100%',
  },
  section: {
      flex: 1,
      width: '100%',
      backgroundColor: 'transparent'
  },
  sectionHeader: {},
  sectionHeaderText: {
      width: '100%',
      padding: 10,
      textAlign: 'center',
      backgroundColor: '#007bff',
      color: '#ffffff',
      fontSize: 20,
      fontWeight: '500'
  },
  sectionFooter: {
      width: '100%',
      marginTop: 15,
      padding: 10,
      flexDirection: 'column',
      justifyContent: 'flex-start'
  },
  sectionFooterLink: {
      fontSize: 14,
      color: '#007bff',
      alignItems: 'flex-start',
      textAlign: 'center'
  },
  sectionBody: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
  },
  sectionBodyTop: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start'
  },
  cell: {
      flex: 1,
      width: '50%'
  },
  errorRow: {
      
  },
  erroRowText: {
      color: '#f6af46',
      paddingLeft: 20,
      paddingRight: 20,
  },
  erroRowTextDark: {
      color: '#4d2643',
      paddingLeft: 20,
      paddingRight: 20,
  },

  photo: {
      width: '100%'
  },
  album: {
      width: '100%'
  },

  a: {},
  button: {
      width: 190,
      height: 43,
      borderRadius: 26.5,
      backgroundColor: "#ffffff",
      marginTop: 15,
      marginBottom: 15,
  },
  halfbutton: {
      flex: 1,
      minWidth: 140,
      height: 32,
      borderRadius: 16,
      marginTop: 15,
      marginBottom: 15,
      marginHorizontal: 4
  },
  googlebtn: {
    backgroundColor: "#ffffff",
  },
  fbbtn: {
      backgroundColor: "#3b5998",
  },
  activeButton: {
      width: 190,
      height: 43,
      borderRadius: 26.5,
      backgroundColor: "#FFBC00",
      marginTop: 15,
      marginBottom: 15,
      alignSelf: 'center',
      alignContent: 'center'
  },
  tagline: {
      fontSize: 32,
      fontWeight: "bold",
      fontStyle: "normal",
      lineHeight: 46,
      letterSpacing: 0,
      color: "#ffffff",
      width: '100%',
      marginLeft: 60,
      marginTop: 10,
      marginBottom: 30,
      textAlign: "left",
  },
  buttonText: {
      fontSize: 15,
      fontWeight: "500",
      fontStyle: "normal",
      backgroundColor: "transparent",
      letterSpacing: 0.75,
      textAlign: "center",
      color: "#373744",
      width: '100%'
  },

  login: {
      margin: 6,
      borderRadius: 26.5,
      backgroundColor: "rgba(0, 0, 0, 0.32)",
      width: 265,
      height: 43,
      color: '#ffffff',
      textAlign: 'center'
  },
  input: {
      margin: 6,
      borderRadius: 6,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      width: 312,
      height: 40,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      lineHeight: 20,
      letterSpacing: 0,
      color: "#353131",
  }
});
const FormField = props => {
  const theme = props.theme || AmplifyTheme;
  return React.createElement(TextInput, _extends({
    style: theme.input,
    autoCapitalize: 'none',
    autoCorrect: false
  }, props));
};
class MyLoading extends Loading {
  showComponent() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center'
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      }
    })
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator/>
        </View>
    );
  }
}
class MySignIn extends SignIn {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigate, navigation }) => ({
    header: null,
    tabBarVisible: false,
  });
  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          Auth.currentAuthenticatedUser().then(user => {
            this.setState({ user, error: null, loading: false });
          });
          break;
        case "signOut":
          this.setState({ user: null, error: null, loading: false });
          break;
      }
    });
  }
  showComponent(theme) {
    const Footer = props => {
      const { theme, onStateChange } = props;
      return (
          <View style={theme.sectionFooter}>
              <TouchableOpacity onPress={() => onStateChange('signUp')}>
                  <Text style={{
                          fontSize: 14,
                          fontWeight: "normal",
                          fontStyle: "normal",
                          letterSpacing: 0.57,
                          color: "#ffffff",
                          alignItems: 'flex-start',
                          textAlign: 'center'
                      }} >
                      {I18n.get('Do not have an account?')}&nbsp;
                      <Text style={{ color: '#FFBC00', fontSize: 14, fontWeight: "bold"}}>{I18n.get('Sign Up')}</Text>
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onStateChange('forgotPassword')}>
                  <Text style={{
                          fontSize: 11,
                          marginTop: 40,
                          fontWeight: "normal",
                          fontStyle: "normal",
                          letterSpacing: 0.45,
                          color: "#ffffff",
                          alignItems: 'flex-start',
                          textAlign: 'center'
                      }} >
                      {I18n.get('Forgot Password')}
                  </Text>
              </TouchableOpacity>
          </View>
      );
    };
    return React.createElement(
      ImageBackground,
      {
          source: require('./assets/images/BG.jpg'),
          style: {
              flex: 1,
              width: '100%',
              height: null
          }
      },
      React.createElement(
        StyleProvider,
          {
            style:getTheme(customStyle)
          },
          React.createElement(
            Container,
            { style: [theme.section, {...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight
                }
            })}] },
            React.createElement(
                Header,
                {
                    transparent: true,
                    noShadow: true,
                    style:{
                      borderBottomWidth: 0
                    }
                },
                React.createElement(
                  Left,
                  {}
                ),
                React.createElement(
                  Body
                ),
                React.createElement(
                  Right
                ),
                React.createElement(
                  StatusBar,
                  {
                    backgroundColor: "#ED923D",
                    barStyle: "light-content"
                  }
                )
            ),
            React.createElement(
                KeyboardAvoidingView,
                {
                    style: theme.sectionBody,
                    behavior: Platform.OS === 'ios' ? "padding":""
                },
                React.createElement(Image, {
                    source: require('./assets/logo-large.png'),
                    style: {
                        marginBottom: 15,
                        width: '30%',
                        height: null,
                        resizeMode: 'cover',
                        aspectRatio: 369 / 462
                    }
                }),
                React.createElement(LoginUsername, {
                    theme: theme,
                    placeholderTextColor: '#ffffff',
                    onChangeText: text => this.setState({ username: text })
                }),
                React.createElement(LoginPassword, {
                    theme: theme,
                    placeholderTextColor: '#ffffff',
                    onChangeText: text => this.setState({ password: text })
                }),
                React.createElement(
                    View,
                    {
                        style: {
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    },
                    React.createElement(
                        Button, {
                            style: theme.button,
                            light: true,
                            onPress: this.signIn,
                            disabled: !this.state.username || !this.state.password
                        },
                        React.createElement(
                            Text,
                            {
                                style: theme.buttonText
                            },
                            I18n.get('Sign In'),
                        )
                    ),
                    React.createElement(
                      View,
                      {
                          style: {
                              flexDirection: 'row',
                              justifyContent: 'center'
                          }
                      },
                      React.createElement(
                        Button, {
                            style: [theme.halfbutton, theme.bbtn],
                            onPress: () => Auth.federatedSignIn({provider: 'Facebook'}),
                        },
                        React.createElement(
                            Text,
                            {
                              style: [theme.buttonText, {color: '#ffffff',}]
                            },
                            I18n.get('Facebook'),
                        )
                      ),
                      React.createElement(
                          Button, {
                              style: [theme.halfbutton, theme.googlebtn],
                              onPress: () => Auth.federatedSignIn({provider: 'Google'}),
                          },
                          React.createElement(
                              Text,
                              {
                                  style: [theme.buttonText, {color: '#4285F4',}]
                              },
                              I18n.get('Google'),
                          )
                      )
                    ),
                ),
                React.createElement(
                    ErrorRow,
                    { theme: theme },
                    this.state.error
                ),
                React.createElement(Footer, { theme: theme, onStateChange: this.changeState }),
            ),
          ),
        )
    );
  }
}
class MySignUp extends SignUp {
  state = {
    modalVisible: false,
  };
  componentDidMount(){
    this.setState({ isPrivate: true});
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  customSignUp() {
    const { username, password, email, isPrivate } = this.state;
    this.setModalVisible(false);
    Auth.signUp(
      {
        username,
        password,
        attributes: {
          email,
          'custom:isPrivate': '1'
        },
        validationData: []
        }
    ).then(data => {
        this.changeState('confirmSignUp', username);
    }).catch(err => this.error(err));
  }
  indicator() {
		return (<ActivityIndicator size="small" color="#ED923D" />);
	}
  showComponent(theme){
    const Footer = props => {
      const { theme, onStateChange } = props;
      return (
          <View style={theme.sectionFooter}>
              <TouchableOpacity onPress={() => onStateChange('confirmSignUp')}>
                  <Text style={{
                          fontSize: 14,
                          fontWeight: "normal",
                          fontStyle: "normal",
                          letterSpacing: 0.57,
                          color: "#ffffff",
                          alignItems: 'flex-start',
                          textAlign: 'center'
                      }} >
                      {I18n.get('Confirm a Code')}
                  </Text>
              </TouchableOpacity>
          </View>
      );
    };
    const HeaderCustom = props => {
      const { onStateChange } = props;
      return (
        <Header noShadow transparent>
          <Left>
            <Button transparent onPress={() => onStateChange('signIn')} style={{ left: 15 }}>
              <Icon name="close" style={{color: '#ffffff'}} />
            </Button>
          </Left>
          <Body style={{width: 320}}>
            <Title style={{width: 320, color: '#ffffff',fontWeight: '500'}}>{I18n.get('Create a new account')}</Title>
          </Body>
          <Right></Right>
        </Header>
      );
    };
    const TermsModal = props => {
      return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{ flex: 1, ...Platform.select({
              android: {
                  marginTop: StatusBar.currentHeight
              }
          }) }}>
            <Header noShadow transparent>
              <Left>
                <Button transparent onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }} style={{ left: 15 }}
                >
                  <Icon name="close" style={{color: '#000000'}} />
                </Button>
              </Left>
              <Body style={{width: 320}}>
                <Title style={{width: 320, color: '#000000',fontWeight: '500'}}>{I18n.get('EULA')}</Title>
              </Body>
              <Right></Right>
            </Header>
            <View style={{flex: 1, padding: 20}}>
              <WebView
                style={{
                  width: '100%',
                  height: null,
                  padding: 10,
                  flex: 1
                }}
                startInLoadingState
                renderLoading={this.indicator}
                source={{ uri: "https://challenges.de/%20agb.html" }}
              />
            </View>
            <View>
                <Button style={theme.activeButton} onPress={this.customSignUp.bind(this)}><Text style={{width: '100%', textAlign: 'center'}}>{I18n.get('I Accept')}</Text></Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      );
    };
    return React.createElement(
      ImageBackground,
      {
          source: require('./assets/images/BG.jpg'),
          style: {
              flex: 1,
              width: '100%',
              height: null
          }
      },
      React.createElement(
          Container,
          { style: theme.section },
          React.createElement(
            HeaderCustom,
            {
                onStateChange: this.changeState
            },
          ),
          React.createElement(
            TermsModal,
            {}
          ),
          React.createElement(
              KeyboardAvoidingView,
              {
                  style: theme.sectionBody,
                  behavior: Platform.OS === 'ios' ? "padding":""
              },
              React.createElement(FormField, {
                theme: theme,
                onChangeText: text => this.setState({ username: text }),
                label: I18n.get('Username'),
                placeholder: I18n.get('Enter your username'),
                required: true
              }),
              React.createElement(FormField, {
                theme: theme,
                onChangeText: text => this.setState({ password: text }),
                label: I18n.get('Password'),
                placeholder: I18n.get('Enter your password'),
                secureTextEntry: true,
                required: true
              }),
              React.createElement(
                Text,
                {
                    style: {
                      fontSize: 11,
                      color: '#303030',
                      paddingHorizontal: 32,
                      paddingVertical: 10
                    }
                },
                I18n.get('The password must be at least 8 characters length, include a number, an uppercase and a lowercase letter.')
            ),
              React.createElement(FormField, {
                theme: theme,
                onChangeText: text => this.setState({ password2: text }),
                label: I18n.get('Repeat password'),
                placeholder: I18n.get('Enter your password again'),
                secureTextEntry: true,
                required: true
              }),
              React.createElement(FormField, {
                theme: theme,
                onChangeText: text => this.setState({ email: text }),
                label: I18n.get('Email'),
                placeholder: I18n.get('Enter your email'),
                keyboardType: 'email-address',
                required: true
              }),
              React.createElement(
                  View,
                  {
                      style: {
                          flexDirection: 'column',
                          justifyContent: 'center'
                      }
                  },
                  React.createElement(
                      Button, {
                          style: !this.state.email || !this.state.username || !this.state.password || this.state.password != this.state.password2 ? theme.button : [theme.button, {backgroundColor:'#ED923D'}],
                          onPress: () => this.setModalVisible(true),
                          disabled: !this.state.email || !this.state.username || !this.state.password || this.state.password != this.state.password2
                      },
                      React.createElement(
                          Text,
                          {
                              style: theme.buttonText
                          },
                          I18n.get('Sign Up')
                      )
                  ),
              ),
              React.createElement(
                  ErrorRow,
                  { theme: theme },
                  this.state.error
              ),
              React.createElement(Footer, { theme: theme, onStateChange: this.changeState }),
          ),
      )
    );
  }
}
class MyConfirmSignUp extends ConfirmSignUp {
  showComponent(theme){
    const Footer = props => {
      const { theme, onStateChange } = props;
      return (
          <View style={theme.sectionFooter}>
              <TouchableOpacity onPress={() => this.resend}>
                  <Text style={{
                          fontSize: 14,
                          fontWeight: "normal",
                          fontStyle: "normal",
                          letterSpacing: 0.57,
                          color: "#ffffff",
                          alignItems: 'flex-start',
                          textAlign: 'center'
                      }} >
                      {I18n.get('Resend code')}
                  </Text>
              </TouchableOpacity>
          </View>
      );
    };
    const HeaderCustom = props => {
      const { onStateChange } = props;
      return (
        <Header noShadow transparent>
          <Left>
            <Button transparent onPress={() => onStateChange('signIn')} style={{ left: 15 }}>
              <Icon name="close" style={{color: '#ffffff'}} />
            </Button>
          </Left>
          <Body style={{width: 320}}>
            <Title style={{width: 320, color: '#ffffff',fontWeight: '500'}}>{I18n.get('Confirm Sign Up')}</Title>
          </Body>
          <Right></Right>
        </Header>
      );
    };
    return React.createElement(
      ImageBackground,
      {
          source: require('./assets/images/BG.jpg'),
          style: {
              flex: 1,
              width: '100%',
              height: null,
              marginBottom: -14
          }
      },
      React.createElement(
          Container,
          { style: theme.section },
          React.createElement(
            HeaderCustom,
            {
                onStateChange: this.changeState
            },
          ),
          React.createElement(
              KeyboardAvoidingView,
              {
                  style: theme.sectionBody,
                  behavior: Platform.OS === 'ios' ? "padding":""
              },
              React.createElement(FormField, {
                theme: theme,
                onChangeText: text => this.setState({ username: text }),
                label: I18n.get('Username'),
                placeholder: I18n.get('Enter your username'),
                required: true,
                value: this.state.username
              }),
              React.createElement(FormField, {
                  theme: theme,
                  onChangeText: text => this.setState({ code: text }),
                  label: I18n.get('Confirmation Code'),
                  placeholder: I18n.get('Enter your confirmation code'),
                  required: true
              }),
              React.createElement(
                  View,
                  {
                      style: {
                          flexDirection: 'column',
                          justifyContent: 'center'
                      }
                  },
                  React.createElement(
                      Button, {
                          style: theme.button,
                          onPress: this.confirm,
                          disabled: !this.state.username || !this.state.code
                      },
                      React.createElement(
                          Text,
                          {
                              style: theme.buttonText
                          },
                          I18n.get('Confirm')
                      )
                  ),
              ),
              React.createElement(
                  ErrorRow,
                  { theme: theme },
                  this.state.error
              ),
              React.createElement(Footer, { theme: theme, onStateChange: this.changeState }),
          ),
      )
    )
  }
}
class MyForgotPassword extends ForgotPassword {
  showComponent(theme) {
    const HeaderCustom = props => {
      const { onStateChange } = props;
      return (
          <Header noShadow transparent>
            <Left>
              <Button transparent onPress={() => onStateChange('signIn')} style={{ left: 15 }}>
                <Icon name="close" style={{color: '#ffffff'}} />
              </Button>
            </Left>
            <Body style={{width: 280}}>
              <Title style={{width: 280, color: '#ffffff',fontWeight: '500'}}>{I18n.get('Forgot Password')}</Title>
            </Body>
            <Right></Right>
          </Header>
      );
    };
    return React.createElement(
        ImageBackground,
        {
            source: require('./assets/images/BG.jpg'),
            style: {
                flex: 1,
                width: '100%',
                height: null
            }
        },
        React.createElement(
            View,
            { style: theme.section },
            React.createElement(
                HeaderCustom,
                {
                    onStateChange: this.changeState
                },
            ),
            React.createElement(
                KeyboardAvoidingView,
                {
                    style: theme.sectionBodyTop,
                    behavior: Platform.OS === 'ios' ? "padding":""
                },
                React.createElement(
                    Text,
                    {
                        style: theme.tagline
                    },
                    I18n.get('Forgot Password?')
                ),
                !this.state.delivery && React.createElement(FormField, {
                    theme: theme,
                    onChangeText: text => this.setState({ username: text }),
                    label: I18n.get('Username'),
                    placeholder: I18n.get('Enter your username'),
                    required: true
                }),
                !this.state.delivery && React.createElement(
                    View,
                    {
                        style: {
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }
                    },
                    React.createElement(
                        Button, {
                            style: theme.button,
                            onPress: this.send,
                            disabled: !this.state.username
                        },
                        React.createElement(
                            Text,
                            {
                                style: theme.buttonText
                            },
                            I18n.get('Send code')
                        )
                    ),
                ),
                this.state.delivery && React.createElement(FormField, {
                    theme: theme,
                    onChangeText: text => this.setState({ code: text }),
                    label: I18n.get('Confirmation Code'),
                    placeholder: I18n.get('Enter your confirmation code'),
                    required: true
                }),
                this.state.delivery && React.createElement(FormField, {
                    theme: theme,
                    onChangeText: text => this.setState({ password: text }),
                    label: I18n.get('Password'),
                    placeholder: I18n.get('Enter your new password'),
                    secureTextEntry: true,
                    required: true
                }),
                this.state.delivery && React.createElement(
                    View,
                    {
                        style: {
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    },
                    React.createElement(
                        Button, {
                            style: theme.button,
                            onPress: this.submit,
                            disabled: !this.state.username
                        },
                        React.createElement(
                            Text,
                            {
                                style: theme.buttonText
                            },
                            I18n.get('Submit')
                        )
                    ),
                ),
                React.createElement(
                    ErrorRow,
                    { theme: theme },
                    this.state.error
                ),
            ),
        )
    )
  }
}
class MyVerifyContact extends VerifyContact {
  verifyBody(theme) {
    const { unverified } = this.props.authData;
    if (!unverified) {
        logger.debug('no unverified contact');
        return null;
    }

    const { email, phone_number } = unverified;
    return React.createElement(
        View,
        { style: {
            flexDirection: 'column',
            justifyContent: 'center'
        } },
        this.createPicker(unverified),
        React.createElement(
          Button, {
              style: theme.button,
              onPress: this.verify,
              disabled: !this.state.pickAttr
          },
          React.createElement(
              Text,
              {
                  style: theme.buttonText
              },
              I18n.get('Verify')
          )
        ),
    );
  }

  submitBody(theme) {
      return React.createElement(
          View,
          { style: {
              flexDirection: 'column',
              justifyContent: 'center'
          } },
          React.createElement(FormField, {
              theme: theme,
              onChangeText: text => this.setState({ code: text }),
              label: I18n.get('Confirmation Code'),
              placeholder: I18n.get('Enter your confirmation code'),
              required: true
          }),
          React.createElement(
            Button, {
                style: [theme.button, {alignSelf: 'center'}],
                onPress: this.submit,
                disabled: !this.state.code
            },
            React.createElement(
                Text,
                {
                    style: theme.buttonText
                },
                I18n.get('Submit')
            )
          ),
      );
  }
  showComponent(theme) {
    const HeaderCustom = props => {
      const { onStateChange } = props;
      return (
          <Header noShadow transparent>
            <Left>
              <Button transparent onPress={() => onStateChange('signIn')} style={{ left: 15 }}>
                <Icon name="close" style={{color: '#ffffff'}} />
              </Button>
            </Left>
            <Body style={{width: 320}}>
              <Title style={{width: 320, color: '#ffffff',fontWeight: '500'}}>{I18n.get('Verify Contact')}</Title>
            </Body>
            <Right></Right>
          </Header>
      );
    };
    return React.createElement(
      ImageBackground,
      {
          source: require('./assets/images/BG.jpg'),
          style: {
              flex: 1,
              width: '100%',
              height: null
          }
      },
      React.createElement(
          Container,
          { style: theme.section },
          React.createElement(
            HeaderCustom,
            {
                onStateChange: this.changeState
            },
          ),
          React.createElement(
              KeyboardAvoidingView,
              {
                  style: theme.sectionBody,
                  behavior: Platform.OS === 'ios' ? "padding":""
              },
              !this.state.verifyAttr && this.verifyBody(theme),
              this.state.verifyAttr && this.submitBody(theme),
              React.createElement(
                  View,
                  {
                      style: {
                          flexDirection: 'column',
                          justifyContent: 'center'
                      }
                  },
                  React.createElement(
                      Button, {
                          style: theme.button,
                          onPress: () => this.changeState('signedIn'),
                      },
                      React.createElement(
                          Text,
                          {
                              style: theme.buttonText
                          },
                          I18n.get('Skip')
                      )
                  ),
              ),
              React.createElement(
                  ErrorRow,
                  { theme: theme },
                  this.state.error
              ),
          ),
      )
    );
  }
}
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
const styles = StyleSheet.create({
  tab: {
    backgroundColor: 'transparent'
  },
  trendingTitleText: {
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: -0.21,
    textAlign: "left",
    color: "#373744"
  },
  trendingTitleDescriptionText: {
    opacity: 0.8,
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 12,
    letterSpacing: -0.05,
    textAlign: "left",
    color: "#9b9b9b"
  },
  trendingExcerpt: {
    opacity: 0.8,
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: -0.06,
    textAlign: "left",
    color: "#535353"
  },
  videoTitleText: {
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.19,
    color: "#373744"
  },
  videoTitleDescriptionText: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.15,
    color: "rgba(55, 55, 68, 0.72)"
  },
  videoDescriptionNumberText: {
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.22,
    textAlign: "right",
    color: "#373744"
  },
  videoDescriptionNumberDescriptionText: {
    fontSize: 10,
    textAlign: 'right',
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.12,
    color: "#959598"
  },
  tabHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: -0.25,
    textAlign: "left",
    color: "#373744",
    left: 15
  },
  trendingCardFooter: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  trendingCardHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: {
      width: 0,
      height: -16
    },
    shadowRadius: 60,
    shadowOpacity: 1,
    backgroundColor: '#F7F8F8',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  trendingStackedAvatars: {
    width: 25,
    height: 25,
    position: 'absolute',
    borderRadius: 12
  },
  trendingCardFooterText: {
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.16,
    textAlign: "left",
    color: "#373744",
    marginRight: 15,
  },
  profileStatisticsWrapper: {
    marginTop: 22,
    flexDirection: 'row',
  },
  profileCounter: {
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744"
  },
  profileCounterDescription: {
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    marginTop: 7,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    textAlign: "center",
  },
  profileNameLocation: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    marginBottom: 17,
    textAlign: "center",
  },
  profileNameDescription: {
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#3b3b48"
  },
  heading: {
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#3b3b48"
  },
  commentName: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    marginBottom: 3
  },
  commentText: {
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  videoCaptureFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 22,
    paddingHorizontal: 20,
    backgroundColor: 'transparent'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class VideoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendingComment: false,
      loadingComments: true,
      allcomments: [],
      allchallengers: [],
      message: '',
      views: 0,
      rating: 0,
      liked: false,
      commentsView: false,
      hasParent: true,
      myUsername: '',
      mySub: '',
      authorName: '',
      allowed: false,
      canParticipate: false,
      videoExpanded: false,
      liking: false
    };
    this.renderHeader = this.renderHeader.bind(this);
    this.postComment = this.postComment.bind(this);
    this.setNewView = this.setNewView.bind(this);
    this._like = this._like.bind(this);
    this.purchase = this.purchase.bind(this);
    this._loadData = this._loadData.bind(this);
    this.hasMyVideo = this.hasMyVideo.bind(this);
    this._processNavigate = this._processNavigate.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);
  }
  static navigationOptions = ({ navigation  }) => {
    return {
      header: null,
      tabBarVisible: true,
    }
  }
  async componentWillMount() {
  }
  componentDidMount(){
    Auth.currentAuthenticatedUser().then(
      myUser => {
        this.setState({
          myUsername: myUser.username,
          mySub: myUser.signInUserSession.idToken.payload.sub
        });
        this._loadData();
      }
    );
    this._firstVideoPopup();
  }
  componentWillUnmount(){
    this.player.pause();
  }
  _firstVideoPopup = async () => {
    try {
      const value = await AsyncStorage.getItem('first_video');
      if (value !== null) {
        // We have data
      }else{
        this._storeVideoData();
        Alert.alert(
          I18n.get('Challenge'),
          I18n.get('Watch Challenges and upload your own video to take part!'),
        );
      }
     } catch (error) {
       // Error retrieving data
     }
  }
  _storeVideoData = async () => {
    try {
      await AsyncStorage.setItem('first_video', '1');
    } catch (error) {
      // Error saving data
    }
  }
  componentDidUpdate(){
    if( this.props.navigation.getParam('needUpdate', '') ){
      this.props.navigation.setParams({
        needUpdate: false,
      });
      this.player.pause();
      this.player.play();
      this._loadData();
    }
  }
  hasMyVideo(video){
    return video.authorSub == this.state.mySub;
  }
  _loadData(){
    this.setState({
      hasParent: this.props.navigation.getParam('hasParent', '') ? true : false,
      commentsView: this.props.navigation.getParam('hasParent', '')? true : false
    });
    const path = "/comments?getAllCommentsForChallenge=1&challengeId="+this.props.navigation.getParam('challengeId', '');
    API.get("commentsCRUD", path)
      .then(
        data => {
          this.setState({
            allcomments: data,
            loadingComments: false,
            views: this.props.navigation.getParam('views', '') ? this.props.navigation.getParam('views', '') : 0,
            rating: this.props.navigation.getParam('rating', '') ? this.props.navigation.getParam('rating', '') : 0
          });
        }
      ).catch(err => console.log(err));
    const likesPath = "/likes/object/"+this.props.navigation.getParam('challengeId', '');
    API.get("likesCRUD", likesPath)
    .then(
        like => {
          if( like && like.challengeId == this.props.navigation.getParam('challengeId', '') ){
            this.setState({
              liked: true
            });
          }
        }
    ).catch(err => console.log(err));
    const userPath = "/videos?userSub="+this.props.navigation.getParam('authorSub', '');
    API.get("videosCRUD", userPath)
    .then(
        data => {
            var prefferedusernameObj = data.Attributes.find(function (obj) { return obj.Name === 'preferred_username'; });
            this.setState({
              authorName: prefferedusernameObj ? I18n.get('by')+' '+prefferedusernameObj.Value : I18n.get('by')+' '+data.Username
            });
        }
    ).catch(err => console.log(err));
    const challengersPath = "/videos?parent="+this.props.navigation.getParam('challengeId', '');
    API.get("videosCRUD", challengersPath)
    .then(
        challengersVideos => {
          if( challengersVideos ){
            var sortedVideos = challengersVideos;
            sortedVideos.sort(function(a, b) {
              return b.rating - a.rating;
            });
            for( $i = 0; $i < sortedVideos.length; $i++ ){
              sortedVideos[$i].place = $i+1;
            }
            this.setState({
              allchallengers: sortedVideos,
              canParticipate: sortedVideos.some(this.hasMyVideo) || this.props.navigation.getParam('authorSub', '') == this.state.mySub ? false : true
            });
          }else{
            this.setState({
              canParticipate: true
            });
          }
        }
    ).catch(err => console.log(err));
  }
  postComment() {
    this.setState({
      sendingComment: true
    })
    const { navigation } = this.props;
    var currDate = new Date().valueOf();
    let newComment = {
      body: {
        "avatar": undefined,
        "challengeId": navigation.getParam('challengeId', ''),
        "creationDate": currDate,
        "message": this.state.message,
        "username": undefined,
        "displayName": undefined
      }
    }
    const path = "/comments";

    Auth.currentAuthenticatedUser().then(
      data => {
        newComment.body.avatar = data.attributes.picture && data && data.attributes ? data.attributes.picture : null;
        newComment.body.username = data.username;
        newComment.body.displayName = data.attributes.preferred_username ? data.attributes.preferred_username : data.username;
        
        // Use the API module to save the comment to the database
        API.put("commentsCRUD", path, newComment).then(
          apiResponse => {
            console.log('Post comment response', apiResponse);
            let commentsArr = [];
            commentsArr = this.state.allcomments;
            commentsArr.unshift({
              creationDate: currDate.toString(),
              challengeId: navigation.getParam('challengeId', ''),
              username: data.username,
              displayName: data.attributes.preferred_username ? data.attributes.preferred_username : data.username,
              message: this.state.message,
              avatar: data.attributes.picture && data && data.attributes ? data.attributes.picture : null
            });

            this.setState({
              message: '',
              allcomments: commentsArr,
              sendingComment: false
            })
          }
        );
      }
    ).catch(
      e => {
        console.log(e);
      }
    );

  }
  showCommentReportActions(commentId){
    var REPORTBUTTONS = [ I18n.get('Abuse'), I18n.get('Inappropriate Content'), I18n.get('Other'), I18n.get('Cancel')];
    var CANCEL_INDEX = 3;
    ActionSheet.show(
        {
            options: REPORTBUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            title: I18n.get('Report a comment'),
            message: I18n.get('Select report reason'),
        },
        buttonIndex => {
            if( buttonIndex != CANCEL_INDEX ){
                // Report has been chosen
                const path = "/reports";
                let newReport = {
                    body: {
                        "itemId": commentId.toString(),
                        "itemType": "Comment",
                        "reason": REPORTBUTTONS[buttonIndex],
                        "reportDate": new Date().valueOf()
                    }
                }
                API.post("reportsCRUD", path, newReport)
                .then(
                    result => {
                        Alert.alert(
                          I18n.get('Report'),
                          I18n.get('Your report has been sent'),
                        )
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                );
            }
        }
    )
  }
  showReportActions(){
    var REPORTBUTTONS = [ I18n.get('Abuse'), I18n.get('Inappropriate Content'), I18n.get('Other'), I18n.get('Cancel')];
    var CANCEL_INDEX = 3;
    ActionSheet.show(
        {
            options: REPORTBUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            title: this.props.navigation.getParam('videoTitle', ''),
            message: I18n.get('Select report reason'),
        },
        buttonIndex => {
            if( buttonIndex != CANCEL_INDEX ){
                // Report has been chosen
                const path = "/reports";
                let newReport = {
                    body: {
                        "itemId": this.props.navigation.getParam('challengeId', ''),
                        "itemType": "Video",
                        "reason": REPORTBUTTONS[buttonIndex],
                        "reportDate": new Date().valueOf()
                    }
                }
                API.post("reportsCRUD", path, newReport)
                .then(
                    result => {
                        Alert.alert(
                          I18n.get('Report'),
                          I18n.get('Your report has been sent'),
                        )
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                );
            }
        }
    )
  }
  renderHeader = () => {
    if( isGuest ){
      return null;
    }else{
      return (
        <View>
          <Form style={{marginBottom: 10}}>
            <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, marginBottom: 15}}>
              <Label style={{fontSize: 12}}>{I18n.get('Leave a comment')}</Label>
              <Textarea
                rowSpan={2}
                onChangeText={(input) => this.setState({
                  message: input
                })}
                value={this.state.message}
                style={{
                  width: '100%',
                  borderRadius: 12,
                  marginTop: 10,
                  color: '#a8adb2',
                  paddingHorizontal: 4,
                  fontSize: 12,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                }} />
            </Item>
            <Button small light full onPress={this.postComment} disabled={ !this.state.message || this.state.sendingComment } style={{
              marginTop: 15,
              borderRadius: 12,
              backgroundColor: '#ED923D',
            }}>
              <Text style={{color: '#ffffff'}}>{ this.state.sendingComment ? I18n.get('SENDING...') : I18n.get('LEAVE COMMENT') }</Text>
            </Button>
          </Form>
          { this.state.loadingComments && <ActivityIndicator size="small" color="#ED923D" /> }
        </View>
      );
    }
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          opacity: 0.64,
          width: "100%",
          backgroundColor: "#b4b4b4",
        }}
      />
    );
  };
  _like(challengeId){
    let self = this;
    self.setState({
      liking: true
    });
    if( self.state.liked ){
      const path = "/likes/object/"+challengeId;
      API.del("likesCRUD", path)
      .then(
        like => {
          self.setState({
            liked: false,
            liking: false,
            rating: self.state.rating == 0 ? 0 : (self.state.rating - 1)
          });
        }
      ).catch(err => console.log(err));
    }else{
      const path = "/likes";
      API.put("likesCRUD", path, {
        body: {
          "challengeId": challengeId
        }
      })
        .then(
          like => {
            self.setState({
              liked: true,
              liking: false,
              rating: self.state.rating + 1
            });
          }
        ).catch(err => console.log(err));
    }
  }
  _share(challengeId, title){
    Share.share(
      {
        message: Platform.OS === 'ios' ? title:title+' https://challenges.de?video='+challengeId,
        url: 'https://challenges.de?video='+challengeId
      },
      {
        dialogTitle: I18n.get('Share')+' '+title
    }).then(({action, activityType}) => {
      if(action === Share.dismissedAction) console.log('Share dismissed');
      else console.log('Share successful');
    });
  }
  _processNavigate(item){
    if( item.videoFile == '-' ){

    }else{
      this.player.pause();
      this.props.navigation.push('Video', {
        videoThumb: item.videoThumb,
        userThumb: item.userThumb,
        videoURL: item.videoFile,
        videoTitle: item.title,
        videoDescription: item.description,
        videoAuthor: item.author,
        videoDate: item.creationDate,
        videoDeadline: item.deadlineDate,
        videoCompleted: item.completed,
        prizeTitle: item.prizeTitle,
        prizeDescription: item.prizeDescription,
        prizeUrl: item.prizeUrl,
        prizeImage:item.prizeImage,
        hasParent: item.parent == 'null' ? false : item.parent,
        videoCategory: I18n.get('Challenge'),
        videoPayment: item.payment,
        challengeId: item.challengeId,
        views: item.views,
        rating: item.rating,
        needUpdate: true,
        authorSub: item.authorSub,
        authorUsername: item.authorUsername
      });
    }
  }
  _videoRender({item, index}){
    return (
      <View style={{ marginTop: 20, paddingHorizontal: 0 }}>
        <Grid>
          <Row>
            <Col style={{ width: 46, justifyContent: 'center' }}>
              { item.place == 1 && <Icon name='trophy, cup, prize, award, winner, tournament' size={35} color='#D6AF36' style={{
                position: 'absolute',
                top: '50%',
                marginTop: -12,
                left: 6
              }} />}
              { item.place == 2 && <Icon name='trophy, cup, prize, award, winner, tournament' size={35} color='#A7A7AD' style={{
                position: 'absolute',
                top: '50%',
                marginTop: -12,
                left: 6
              }} />}
              { item.place == 3 && <Icon name='trophy, cup, prize, award, winner, tournament' size={35} color='#824A02' style={{
                position: 'absolute',
                top: '50%',
                marginTop: -12,
                left: 6
              }} />}
              <Text style={[styles.trendingTitleText, {fontSize:20, textAlign: 'center'}, item.place == 1 || item.place == 2 || item.place == 3 ? {color: "#ffffff"}:{}]}>{ item.place }</Text>
            </Col>
            <Col style={{ justifyContent: 'center' }}>
              <TouchableHighlight
                  onPress={ () => this._processNavigate(item)}
                  style={[{
                    alignItems: 'stretch',
                    backgroundColor: "transparent",
                    flex: 1,
                    alignSelf: "stretch",
                  }]} 
              >
                <View
                  style={{
                    flex:1,
                }}>
                  <FastImage
                      style={{
                        flex: 1,
                        width: null,
                        height: null,
                        aspectRatio: 1000 / 564,
                        borderRadius: 3.7
                      }}
                      source={
                        (item.userThumb == '-' || !item.userThumb) && item.videoThumb == '-' ?
                        require('./assets/images/placeholder-alt-1.jpg') :
                        {
                          uri: item.userThumb == '-' || !item.userThumb ? item.videoThumb : item.userThumb,
                          priority: FastImage.priority.normal,
                        }
                      }
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity onPress={() =>
                    {
                      this.player.pause();
                      this.state.myUsername == item.authorUsername ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                          user: item.authorUsername
                      })
                    }}
                    style={{
                      top: 10,
                      right: 10,
                      flex:1,
                      position: 'absolute',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}>
                    <FastImage
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        aspectRatio: 1,
                        borderColor: '#373744',
                        borderWidth: 1
                      }}
                      source={
                        item.author == '-' ? require('./assets/images/avatar.png') : 
                        {
                          uri: item.author,
                          priority: FastImage.priority.normal,
                        }
                      }
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </TouchableOpacity>
                  <Button block bordered dark style={{
                    height: 26,
                    top: 10,
                    left: 10,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    flex:1,
                    position: 'absolute',
                    justifyContent: 'flex-start',
                  }}>
                    <Text style={{
                      fontSize: 10.8,
                      fontWeight: "500",
                      fontStyle: "normal",
                      letterSpacing: 0.45,
                      color: "#373744"
                    }}>{item.rating} {I18n.get('Likes')}</Text>
                  </Button>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={ ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)'] }
                    style={{
                      bottom: 0,
                      left: 0,
                      right: 0,
                      flex:1,
                      borderBottomRightRadius: 3.7,
                      borderBottomLeftRadius: 3.7,
                      position: 'absolute',
                      justifyContent: 'flex-end',
                      paddingBottom: 15,
                      paddingTop: 15,
                    }}
                  >
                    <Text style={{
                        fontSize: 16,
                        lineHeight: 18,
                        color: '#ffffff',
                        textAlign: 'center',
                        width: '100%',
                        paddingHorizontal: 5
                    }}>{item.title}</Text>
                    <Text style={{
                      fontSize: 10,
                      lineHeight: 14,
                      color: '#ffffff',
                      textAlign: 'center',
                    }}>{ I18n.get('by')+' '+item.authorUsername} <TimeAgo time={item.creationDate} /></Text>
                  </LinearGradient>
                </View>
              </TouchableHighlight>
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
  deleteComment( commentDate ){
    let self = this;
    Alert.alert(
      I18n.get('Remove Comment?'),
      '',
      [
        {text: I18n.get('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: I18n.get('Ok'), onPress: () => {
          const removePath = "/comments/object/"+commentDate+"?challengeID="+self.props.navigation.getParam('challengeId', '');
          API.del("commentsCRUD", removePath)
          .then(
            result => {
              console.log('Remove Comment', result)
              const getPath = "/comments?getAllCommentsForChallenge=1&challengeId="+self.props.navigation.getParam('challengeId', '');
              API.get("commentsCRUD", getPath)
                .then(
                  data => {
                    self.setState({
                      allcomments: data,
                    });
                  }
                ).catch(err => console.log(err));
            }
          ).catch(err => console.log(err));
        }},
      ],
      { cancelable: true }
    )
  }
  _commentRender({item, index}){
    return (
      <TouchableOpacity onPress={() =>
        {
          this.player.pause();
          this.state.myUsername == item.username ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
          user: item.username
        })
      }
    }>
        <Grid style={{ paddingVertical: 11 }}>
          <Row>
            <Col style={{ width: 25 }}>
              <FastImage
                  style={{ width: 21, height: 21, borderRadius: 10, aspectRatio: 1 }}
                  source={
                    !item.avatar || item.avatar == '-' ? require('./assets/images/avatar.png') : 
                    {
                      uri: item.avatar,
                      priority: FastImage.priority.normal,
                    }
                  }
                  resizeMode={FastImage.resizeMode.cover}
              />
            </Col>
            <Col>
                <Text style={styles.commentName}>{item.displayName ? item.displayName : item.username}</Text>
                <Text style={styles.commentText}>{item.message}</Text>
            </Col>
            { this.state.myUsername == item.username ?
            <Col style={{
              width: 26,
              paddingLeft: 0
            }}>
              <Button onPress={() => this.deleteComment(item.creationDate)} block bordered danger style={{
                height: 26,
                width: 26
              }}>
                <Icon name='bin, trashcan, remove, delete, recycle, dispose' size={13} style={{color: "#d88586"}} />
              </Button>
            </Col>:
            <Col style={{ width: 30, paddingTop: 4 }}>
              <TouchableOpacity onPress={() => this.showCommentReportActions(item.creationDate) }>
                <Text style={{
                    textAlign: 'center',
                  }}>
                  <Icon name={'dots-horizontal-triple'} size={20} color={'#373744'} />
                </Text>
              </TouchableOpacity>
            </Col>
            }
          </Row>
        </Grid>
      </TouchableOpacity>
    );
  }
  setNewView(uuid){
    const path = "/videos?uuid="+uuid+"&view=1";
    API.put("videosCRUD", path, {})
      .then(
        challenge => {
          console.log(challenge);
        }
      ).catch(err => console.log(err));
  }
  purchase = async (price) => {
    let self = this;
    try{
      this.player.pause();
      self.props.navigation.navigate('Shoot', {
        parent: self.state.hasParent ? self.state.hasParent : self.props.navigation.getParam('challengeId', '')
      })
    } catch (error) {
      console.log(error);
    }
  }
  onFullScreen(status) {
    this.setState({
      videoExpanded: !this.state.videoExpanded
    });
  }
  render() {
    const { navigation } = this.props;
    const videoThumb = navigation.getParam('videoThumb', '');
    const videoURL = navigation.getParam('videoURL', '');
    const videoTitle = navigation.getParam('videoTitle', '');
    const videoDescription = navigation.getParam('videoDescription', '');
    const videoAuthor = navigation.getParam('videoAuthor', '');
    const videoDate = navigation.getParam('videoDate', '');
    const videoDeadline = navigation.getParam('videoDeadline', '');
    const videoCompleted = navigation.getParam('videoCompleted', '');
    //const videoPayment = navigation.getParam('videoPayment', '');
    const videoPayment = 0;
    const challengeId = navigation.getParam('challengeId', '');
    const authorUsername = navigation.getParam('authorUsername', '');
    var currentDate = new Date().valueOf();
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null,
      }}>
        <StyleProvider style={getTheme(customStyle)}>
          <Container style={{...Platform.select({
                android: {
                    marginTop: this.state.videoExpanded ? 0 : StatusBar.currentHeight
                }
            })}}>
            { !this.state.videoExpanded &&
            <Header hasTabs transparent >
              <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
              <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                  <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
                </Button>
              </Left>
              <Body>
                <Title style={{
                    fontSize: 20,
                    fontWeight: "700",
                    fontStyle: "normal",
                    letterSpacing: -0.25,
                    textAlign: "left",
                    color: "#373744",
                }}>{navigation.getParam('videoCategory', '')}</Title>
              </Body>
              <Right></Right>
            </Header>
            }
            <KeyboardAwareScrollView {...( Platform.OS === 'ios' ? { stickyHeaderIndices: [1]} : {})}>
              { this.state.videoExpanded ? <Grid></Grid>:
              <Grid style={styles.trendingCardHeader} >
                <Row>
                  <Col style={{ width: 50 }}>
                    <TouchableOpacity onPress={() =>
                    {
                      this.player.pause();
                      this.state.myUsername == authorUsername ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                        user: authorUsername
                    })
                  }
                  }>
                      <FastImage
                          style={{ width: 34, height: 34, borderRadius: 17, aspectRatio: 1 }}
                          source={
                            videoAuthor == '-' ? require('./assets/images/avatar.png') : 
                            {
                              uri: videoAuthor,
                              priority: FastImage.priority.normal,
                            }
                          }
                          resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                  </Col>
                  <Col>
                      <Text style={styles.trendingTitleText}>{videoTitle}</Text>
                      <Text style={styles.trendingTitleDescriptionText}><TimeAgo time={videoDate} /> {this.state.authorName}</Text>
                      <Text style={styles.trendingTitleDescriptionText}>{I18n.get('Deadline')}: { moment( Number.isInteger(videoDeadline) ? parseInt( videoDeadline ) : videoDeadline ).format('lll') } (<TimeAgo time={ Number.isInteger(videoDeadline) ? parseInt( videoDeadline ) : videoDeadline } />)</Text>
                  </Col>
                  <Col style={{ width: 30 }}>
                    <TouchableOpacity onPress={() => this.showReportActions() }>
                      <Text style={{
                          textAlign: 'center',
                        }}>
                        <Icon name={'dots-horizontal-triple'} size={20} color={'#373744'} />
                      </Text>
                    </TouchableOpacity>
                  </Col>
                  <Col style={{ width: 30 }}>
                    <TouchableOpacity onPress={() => this._share(challengeId, videoTitle) }>
                      <Text style={{
                          textAlign: 'center',
                        }}>
                        <Icon name={'share-2'} size={20} color={'#373744'} />
                      </Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
                <Row marginTop={15}>
                  <Text style={styles.trendingExcerpt}>{videoDescription}</Text>
                </Row>
              </Grid>
              }
              <View>
                <VideoAf
                  url={videoURL}
                  placeholder={videoThumb}
                  autoPlay={true}
                  ref={r => this.player = r}
                  onEnd={ () => {this.setNewView(challengeId)} }
                  onFullScreen={status => this.onFullScreen(status)}
                  resizeMode='cover'
                  theme={{
                    title: '#FFF',
                    more: '#FFF',
                    center: '#ED923D',
                    fullscreen: '#FFF',
                    volume: '#FFF',
                    scrubberThumb: '#E75B3A',
                    scrubberBar: '#ED923D',
                    seconds: '#FFF',
                    duration: '#FFF',
                    progress: '#E75B3A',
                    loading: '#ED923D'
                  }}
                  lockRatio={16/9}
                />
              </View>
              <Grid style={styles.trendingCardFooter} >
                <Col>
                  <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 4}}>
                    { !this.state.hasParent &&
                    <Text style={styles.trendingCardFooterText}>
                      <Icon name={'award1'} size={15} color={'#000000'} /> { this.state.allchallengers ? this.state.allchallengers.length : 0 }</Text>
                    }
                    <Text style={styles.trendingCardFooterText}>
                      <Icon name={'chat'} size={15} color={'#000000'} /> {this.state.allcomments.length}</Text>
                    <Text style={styles.trendingCardFooterText}>
                      <Icon name={'whatshot'} size={15} color={'#000000'} /> { this.state.rating }</Text>
                  </View>
                </Col>
              </Grid>
              <Grid style={[styles.trendingCardFooter, {
                paddingVertical: 0,
                marginBottom: 10
              }]} >
              { videoDeadline > currentDate || (videoDeadline < currentDate && !videoCompleted && !this.state.hasParent) ?
                <Row>
                  { this.state.canParticipate && !this.state.hasParent ?
                  <Col style={{
                    borderRadius: 12,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    height: 30,
                    marginHorizontal: 2,
                    paddingVertical: 5,
                    alignSelf: 'center',
                  }}>
                    <TouchableOpacity onPress={() => this.purchase(videoPayment)}>
                      <Text style={{
                        height: 24,
                        textAlign: 'center',
                        color: "#ffffff",
                      }}>
                        {I18n.get('Participate')}
                        {/* { videoPayment == 0 ? I18n.get('Free') : '$'+videoPayment } */}
                      </Text>
                    </TouchableOpacity>
                  </Col>:
                  <Col style={{
                      height: 30,
                      marginHorizontal: 2,
                      paddingVertical: 5,
                      alignSelf: 'center',
                    }}>
                  </Col>
                  }
                  <Col style={{
                    height: 30,
                    width: 80,
                    marginHorizontal: 2,
                    alignSelf: 'center',
                    borderRadius: 12,
                    backgroundColor: this.state.liked ? '#BA0B0B' : '#bebebe',
                    height: 30,
                    marginHorizontal: 2,
                    paddingVertical: 5,
                    alignSelf: 'center',
                  }}>
                    <TouchableOpacity disabled={this.state.liking} onPress={() => this._like(challengeId) }>
                      <Text style={{
                          textAlign: 'center',
                          height: 24,
                          textAlign: 'center',
                          color: this.state.liked ? '#ffffff' : '#373744'
                        }}>
                        Like
                      </Text>
                    </TouchableOpacity>
                  </Col>
                </Row> : <Row>
                  <Col style={{
                    borderRadius: 12,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    height: 30,
                    marginHorizontal: 2,
                    paddingVertical: 7,
                    alignSelf: 'center',
                  }}>
                    <Text style={{
                        height: 24,
                        textAlign: 'center',
                        color: "#ffffff",
                        fontSize: 12
                      }}>
                        {I18n.get('Challenge completed')} <TimeAgo time={videoDeadline} />
                      </Text>
                  </Col>
                </Row>
              }
              </Grid>
              <Grid style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                { !this.state.hasParent &&
                <TouchableOpacity onPress={() => this.setState({commentsView: false})}>
                  <Text style={[styles.profileCounterDescription, this.state.commentsView&& {marginRight: 15, color: "rgba(55, 55, 68, 0.49)"}]}>
                  {I18n.get('Show').toUpperCase()} { this.state.allchallengers.length } {I18n.get('Challengers').toUpperCase()}
                  </Text>
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.setState({commentsView: true})}>
                  <Text style={[styles.profileCounterDescription, !this.state.commentsView && {marginLeft: 15, color: "rgba(55, 55, 68, 0.49)"}]}>
                  {I18n.get('Recent Comments').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </Grid>
              { this.state.commentsView ?
              <Grid style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <FlatList
                  ItemSeparatorComponent={this.renderSeparator}
                  extraData={this.state}
                  keyExtractor={item => item.creationDate.toString()}
                  data={this.state.allcomments}
                  renderItem={this._commentRender.bind(this)}
                  ListHeaderComponent={this.renderHeader}
                />
              </Grid> :
              <Grid style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <FlatList
                  extraData={this.state}
                  keyExtractor={item => item.challengeId}
                  data={this.state.allchallengers}
                  renderItem={this._videoRender.bind(this)}
                />
              </Grid>
              }
            </KeyboardAwareScrollView>
          </Container>
          </StyleProvider>
      </ImageBackground>
    );
  }
}

class AddChallengeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: '',
      height: '',
      title: '',
      prizeTitle: '',
      website: '',
      description: '',
      prizeDescription: '',
      prizeImageAws: '',
      deadline: new Date(Date.now() + 14*24*60*60*1000),
      category: 'SPORT',
      payment: 0,
      progress: 0,
      pp: undefined,
      sub: '',
      isParent: false,
      parentVideo: [],
      thumbResponse: {}
    };
    this.share = this.share.bind(this);
    this.addChallenge = this.addChallenge.bind(this);
    this.setDate = this.setDate.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser().then(
      data => {
        this.setState({
          pp: data.attributes.picture && data && data.attributes ? data.attributes.picture : null,
          sub: data.signInUserSession.idToken.payload.sub,
          username: data.username,
          isParent: this.props.navigation.getParam('parentChallengeId', '') ? true : false
        })
      }
    );
    if( this.props.navigation.getParam('parentChallengeId', '') ){
      console.log( this.props.navigation.getParam('parentChallengeId', '') );
      const path = "/videos/object/"+this.props.navigation.getParam('parentChallengeId', '');
      API.get("videosCRUD", path)
        .then(
          challenge => {
            this.setState({
              parentVideo: challenge
            });
          }
        ).catch(err => console.log(err));
    }
  }
  componentWillUnmount() {
    this.setState({
      thumbnail: '',
      width: '',
      height: ''
    })
  }
  static navigationOptions = ({ navigation  }) => {
    return {
      header: null,
      tabBarVisible: false
    }
  }
  categoryChange(value) {
    this.setState({
      category: value
    });
  }
  onFullScreen(status) {
    this.setState({
      videoExpanded: !this.state.videoExpanded
    });
  }
  paymentChange(value) {
    this.setState({
      payment: value
    });
  }
  setDate(newDate) {
    this.setState({
      deadline: moment(newDate)
    });
  }
  async uploadFile(uuid, uri) {
    let self = this;
    const videorResponse = await fetch( uri );
    const blob = await videorResponse.blob();
    const fileName = uuid;
    const type = mime.lookup(uri);
    const file = {
      uri: uri,
      name: fileName+'.'+mime.extension(type),
      type: type
    }
    Storage.put(file.name, blob, {
      level: "private",
      contentType: file.type,
      progressCallback(progress) {
        self.setState({
          progress: progress.loaded / progress.total,
        });
      },
    }).then(
      response => {
        console.log(response);
      }
    )
    .catch(err => console.log(err));
  }
  addChallenge( uuid, isThumbImage ) {
    let self = this;
    let newChallenge = {
      body: {
        "author": this.state.pp ? this.state.pp : '-',
        "category": this.state.isParent ? this.state.parentVideo.category : this.state.category,
        "challengeId": uuid,
        "creationDate": new Date().valueOf(),
        "deadlineDate": this.state.isParent ? this.state.parentVideo.deadlineDate : this.state.deadline.valueOf(),
        "description": this.state.description,
        //"payment": this.state.isParent ? this.state.parentVideo.payment : this.state.payment,
        "payment": 0,
        "rating": 0,
        "participants": 0,
        "title": this.state.title,
        "prizeTitle": this.state.prizeTitle ? this.state.prizeTitle : '-',
        "prizeDescription": this.state.prizeDescription ? this.state.prizeDescription : '-',
        "prizeUrl": this.state.website ? this.state.website : '-',
        "prizeImage": '-',
        "videoFile": '-',
        "videoThumb": '-',
        "userThumb": isThumbImage ? isThumbImage : '-',
        "parent": this.props.navigation.getParam('parentChallengeId', '') ? this.props.navigation.getParam('parentChallengeId', '') : 'null',
        "authorSub": this.state.sub,
        "authorUsername": this.state.username,
        "completed": false,
        "approved": true,
      }
    }
    const path = "/videos";

    // Upload Video
    self.uploadFile( uuid, self.props.navigation.getParam('videoURL', '') ).then((result) => {
      // Video Uploaded
      console.log('Video Uploaded.');
      // Use the API module to save the challenge to the database
      API.put("videosCRUD", path, newChallenge).then(
        challenge => {
          // Challenge Added to the DB
          console.log('Challenge Added.');
          // Adding a new participant value
          if( self.props.navigation.getParam('parentChallengeId', '') ){
            let uuid = self.props.navigation.getParam('parentChallengeId', '');
            const valuepath = "/videos?uuid="+uuid+"&participant=1";
            API.put("videosCRUD", valuepath, {});
          }
          self.setState({
            loading: false
          });
          self.props.navigation.navigate('Home');
        }
      ).catch(
        err => {
          console.log(err);
          Alert.alert(
            I18n.get('Error'),
            err,
          );
        }
      );
    }).catch(
      err => {
        console.log(err);
        Alert.alert(
          I18n.get('Error'),
          err,
        );
      }
    );
  }
  share(){
    let self = this;
    this.setState({
      loading: true
    });
    UUIDGenerator.getRandomUUID((uuid) => {
      if( self.state.thumbResponse && self.state.thumbResponse.data ){
        console.log('Thumb Image Present');
        Storage.put( uuid+'_'+self.state.thumbResponse.fileSize.toString()+'.jpg', new Buffer(self.state.thumbResponse.data, 'base64'), {
          level: "public",
          contentType: mime.lookup(self.state.thumbResponse.uri),
        })
        .then(
          storageData => {
            console.log('Thumb Image Upload Data', storageData);
            console.log('Thumb Image Uploaded. Starting Adding Challenge...');
            self.addChallenge( uuid, 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/'+storageData.key );
          }
        )
        .catch(err => console.log(err));
      }else{
        console.log('No Thumb Image');
        self.addChallenge( uuid, false );
      }
    });
  }
  getPhotos = () => {
    let self = this;
    var options = {
      title: I18n.get('Upload a thumbnail'),
      cancelButtonTitle: I18n.get('Cancel'),
      takePhotoButtonTitle: I18n.get('Take Photo'),
      chooseFromLibraryButtonTitle: I18n.get('Choose from Library'),
      quality: 0.8,
      maxWidth: 1280,
      maxHeight: 720,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        console.log('Gallery picture', response);
        self.setState({
          thumbResponse: response
        });
      }
    });
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null,
      }}>
        <StyleProvider style={getTheme(customStyle)}>
          <Container style={{...Platform.select({
                android: {
                    marginTop: this.state.videoExpanded ? 0 : StatusBar.currentHeight
                }
            })}}>
            { !this.state.videoExpanded &&
            <Header hasTabs transparent>
              <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
              <Left>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
                </Button>
              </Left>
              <Body>
                <Title style={{
                    fontSize: 20,
                    fontWeight: "700",
                    fontStyle: "normal",
                    letterSpacing: -0.25,
                    textAlign: "left",
                    color: "#373744",
                }}>{I18n.get('Edit')}</Title>
              </Body>
              <Right>
                <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                  <Icon name='close' size={14} color='#373744' style={{ right: 20 }} />
                </Button>
              </Right>
            </Header>
            }
            <KeyboardAwareScrollView>
              <Grid style={{
                paddingVertical: this.state.videoExpanded ? 0 : 40
              }}>
                <Row style={{
                  marginTop: this.state.videoExpanded ? 0 : 40,
                  zIndex: 2
                  }}>
                  <Col></Col>
                  <Col style={{width: this.state.videoExpanded ? '100%' : '60%'}}>
                    <VideoAf
                      style={{
                        marginBottom: 0
                      }}
                      url={this.props.navigation.getParam('videoURL', '')}
                      autoPlay={true}
                      ref={r => this.player = r}
                      onFullScreen={status => this.onFullScreen(status)}
                      resizeMode='contain'
                      loop={true}
                      theme={{
                        title: '#FFF',
                        more: '#FFF',
                        center: '#ED923D',
                        fullscreen: '#FFF',
                        volume: '#FFF',
                        scrubberThumb: '#E75B3A',
                        scrubberBar: '#ED923D',
                        seconds: '#FFF',
                        duration: '#FFF',
                        progress: '#E75B3A',
                        loading: '#ED923D'
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row style={{
                  marginTop: -50,
                  zIndex: 1
                }}>
                  <Col></Col>
                  <Col style={{
                    width: '80%',
                    borderRadius: 9.1,
                    backgroundColor: '#f5f7fa',
                    paddingTop: 65,
                    paddingHorizontal: 20,
                    paddingBottom: 20
                    }}>
                    <Text style={styles.heading}>{I18n.get('Details')}</Text>
                    <Form>
                      <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0}}>
                        <Label style={{fontSize: 12}}>{I18n.get('Title')}</Label>
                        <Input
                          onChangeText={(title) => this.setState({title})}
                          style={{
                            width: '100%',
                            marginTop: 10,
                            color: '#a8adb2',
                            paddingHorizontal: 4,
                            fontSize: 12,
                            backgroundColor: '#f2f3f6',
                            height: 20
                          }} />
                      </Item>
                      <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, height: 90}}>
                        <Label style={{fontSize: 12}}>{I18n.get('Description')}</Label>
                        <Textarea
                          rowSpan={5}
                          onChangeText={(description) => this.setState({description})}
                          style={{
                            width: '100%',
                            height: 60,
                            marginTop: 10,
                            color: '#a8adb2',
                            paddingHorizontal: 4,
                            fontSize: 12,
                            backgroundColor: '#f2f3f6',
                          }} />
                      </Item>
                      <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0}}>
                        <Label style={{fontSize: 12}}>{I18n.get('Deadline')}</Label>
                        { this.state.isParent ? <View style={{
                          width: '100%',
                          marginTop: 10,
                          paddingHorizontal: 4,
                          backgroundColor: '#f2f3f6',
                        }}>
                          <Text style={{
                            color: '#a8adb2',
                            fontSize: 12,
                            padding: 10
                          }}><TimeAgo time={ parseInt(this.state.parentVideo.deadlineDate) } /></Text>
                        </View> :
                        <View style={{
                          width: '100%',
                          marginTop: 10,
                          paddingHorizontal: 4,
                          backgroundColor: '#f2f3f6',
                        }}>
                          <DatePicker
                            style={{
                              width: '100%'
                            }}
                            customStyles={{
                              placeholderText: {
                                color: '#a8adb2',
                                fontSize: 12,
                              },
                              dateText: {
                                color: '#a8adb2',
                                fontSize: 12,
                              },
                              dateInput:{
                                borderWidth: 0,
                                alignItems: 'flex-start',
                                paddingLeft: 10
                              },
                              btnTextConfirm: {
                                color: 'rgb(237, 146, 61)',
                              },
                            }}
                            date={this.state.deadline ? this.state.deadline : new Date(Date.now() + 14*24*60*60*1000)}
                            mode="datetime"
                            placeholder={I18n.get('Select Date')}
                            showIcon={false}
                            locale={locale}
                            //format="YYYY-MM-DD"
                            minDate={new Date()}
                            maxDate={new Date(Date.now() + 12096e5)}
                            confirmBtnText={I18n.get('Confirm')}
                            cancelBtnText={I18n.get('Cancel')}
                            onDateChange={(date) => {this.setDate(date)}}
                          />
                        </View>}
                      </Item>
                      <Item stackedLabel picker style={{borderBottomWidth: 0, marginLeft: 0}}>
                        <Label style={{fontSize: 12}}>{I18n.get('Category')}</Label>
                        { this.state.isParent ? <View style={{
                          width: '100%',
                          marginTop: 10,
                          paddingHorizontal: 4,
                          backgroundColor: '#f2f3f6',
                        }}>
                          <Text style={{
                            color: '#a8adb2',
                            fontSize: 12,
                            padding: 10
                          }}>{ this.state.parentVideo.category }</Text>
                        </View> : <View style={{
                          width: '100%',
                          marginTop: 10,
                          paddingHorizontal: 4,
                          backgroundColor: '#f2f3f6',
                        }}>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="dropdown" size={9} />}
                            style={{
                              width: '100%',
                              paddingRight: 10
                            }}
                            textStyle={{
                              color: '#a8adb2',
                              fontSize: 12,
                            }}
                            placeholder={I18n.get('Category')}
                            placeholderStyle={{
                              color: '#a8adb2',
                              fontSize: 12,
                            }}
                            placeholderIconColor="#a8adb2"
                            selectedValue={this.state.category}
                            onValueChange={this.categoryChange.bind(this)}
                          >
                            <Picker.Item label={I18n.get('Sport')} value="SPORT" />
                            <Picker.Item label={I18n.get('Games')} value="GAMES" />
                            <Picker.Item label={I18n.get('Music')} value="MUSIK" />
                            <Picker.Item label={I18n.get('Live')} value="LIVE" />
                          </Picker>
                        </View>
                      }
                      </Item>
                      <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, height: 200}}>
                        <Label style={{fontSize: 12, marginTop: 20}}>{I18n.get('Upload a thumbnail')}</Label>
                        <TouchableOpacity onPress={() => this.getPhotos()}>
                          <FastImage
                                style={{ marginTop: 12, width: '100%', borderRadius: 9.1, height: null, aspectRatio: 1280/720 }}
                                source={
                                  this.state.thumbResponse.uri ? {
                                    uri: this.state.thumbResponse.uri,
                                    priority: FastImage.priority.normal,
                                  } :
                                  require('./assets/images/upload.jpg')
                                }
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                      </Item>
                    </Form>
                  </Col>
                  <Col></Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col style={{
                    width: '80%'
                    }}>
                    { this.state.isParent ?
                      <Button
                        full
                        danger
                        onPress={this.share}
                        disabled={!this.state.title || !this.state.description || !this.state.parentVideo.category }
                        style={{
                          borderRadius: 9.1,
                          marginTop: 10,
                          backgroundColor: !this.state.title || !this.state.description || !this.state.parentVideo.category ? '#333333' : 'rgb(237, 146, 61)'
                        }}>
                        <Text>{I18n.get('Share')}</Text>
                      </Button>:
                      <Button
                        full
                        danger
                        onPress={this.share}
                        disabled={!this.state.title || !this.state.description || !this.state.category }
                        style={{
                          borderRadius: 9.1,
                          marginTop: 10,
                          backgroundColor: !this.state.title || !this.state.description || !this.state.category ? '#333333' : 'rgb(237, 146, 61)' 
                        }}>
                        <Text>{I18n.get('Share')}</Text>
                      </Button>
                    }
                    </Col>
                  <Col></Col>
                </Row>
              </Grid>
            </KeyboardAwareScrollView>
            {this.state.loading && Platform.OS === 'ios' &&
              <BlurView
                style={styles.loading}
                blurType="light"
                blurAmount={5}>
                <ProgressCircle
                  size={100}
                  progress={this.state.progress}
                  showsText={true}
                  color={'rgb(237, 146, 61)'}
                  formatText={() => `${Math.round(this.state.progress * 100)}%`}
                />
                <Text style={{paddingHorizontal:15, marginTop: 15}}>{I18n.get('Please stand by. Your video is uploading')}</Text>
              </BlurView>
            }
            {this.state.loading && Platform.OS !== 'ios' &&
              <View
                style={[styles.loading, {backgroundColor: 'rgba(255,255,255,0.7)'}]}>
                <ProgressCircle
                  size={100}
                  progress={this.state.progress}
                  showsText={true}
                  color={'rgb(237, 146, 61)'}
                  formatText={() => `${Math.round(this.state.progress * 100)}%`}
                />
                <Text style={{paddingHorizontal:15, marginTop: 15}}>{I18n.get('Please stand by. Your video is uploading')}</Text>
              </View>
            }
          </Container>
        </StyleProvider>
      </ImageBackground>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      modalVisible: false,
      filterOnlyLive: false,
      apiResponse: [],
      adsResponse: [],
      lastEvaluatedKey: null,
      refreshing: true,
      loadingMore: true,
      FRIENDS: [],
      FRIENDSloaded: false,
      FRIENDSrefreshing: false,
      SPORT: [],
      SPORTloaded: false,
      SPORTrefreshing: false,
      SPORTlastEvaluatedKey: null,
      SPORTloadingMore: null,
      GAMES: [],
      GAMESloaded: false,
      GAMESrefreshing: false,
      GAMESlastEvaluatedKey: null,
      GAMESloadingMore: null,
      MUSIK: [],
      MUSIKloaded: false,
      MUSIKrefreshing: false,
      MUSIKlastEvaluatedKey: null,
      MUSIKloadingMore: null,
      LIVE: [],
      LIVEloaded: false,
      LIVErefreshing: false,
      LIVElastEvaluatedKey: null,
      LIVEloadingMore: null,
      hiddenVideos: []
     };
     this._get_all_challenges = this._get_all_challenges.bind(this);
     this._get_challenges_by_cat = this._get_challenges_by_cat.bind(this);
     this._loadmore = this._loadmore.bind(this);
     this._loadmore_category = this._loadmore_category.bind(this);
     this.checkVisible = this.checkVisible.bind(this);
  }
  componentDidMount(){
    Auth.currentAuthenticatedUser().then(
      myUser => {
        this.setState({
          myUsername: myUser.username,
          mySub: myUser.signInUserSession.idToken.payload.sub
        });
      }
    );
    this._firstHomePopup();
    AsyncStorage.getItem('hiddenVideos')
    .then(
      hidden => {
        //console.log('Hidden Videos: ', JSON.parse(hidden));
        this.setState({
          hiddenVideos: hidden ? JSON.parse(hidden) : []
        }, function() {
          this._get_all_challenges();
        });
      }
    )
    .catch(
      e => console.log(e)
    );
    AsyncStorage.getItem('filterOnlyLive')
    .then(
      filter => {
        this.setState({
          filterOnlyLive: filter == 'yes' ? true : false
        });
      }
    )
    .catch(
      e => console.log(e)
    );
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  filterChange(){
    var currTime = new Date().valueOf();
    var currVideos = this.state.apiResponse;
    if( !this.state.filterOnlyLive ){
      var filtered = currVideos.filter( function(el) {
        if( el.deadlineDate > currTime || (el.deadlineDate < currTime && !el.completed) ){
          return true;
        }else{
          return false;
        }
      } );
    }else{
      var needUpdate = true;
    }
    this.setState({
      filterOnlyLive: !this.state.filterOnlyLive,
      modalVisible: false,
      apiResponse: filtered ? filtered : currVideos
    }, () => {
      if(needUpdate){
        this._get_all_challenges();
      }
      AsyncStorage.setItem('filterOnlyLive', this.state.filterOnlyLive ? 'yes' : 'no');
    });
  }
  _firstUploadPopup = async () => {
    try {
      const value = await AsyncStorage.getItem('first_upload');
      if (value !== null) {
        // We have data
        if( !isGuest ){
          this.props.navigation.navigate('Shoot');
          //this.props.navigation.navigate('Edit');
        }else{
          Auth.signOut()
            .then(() => {
              this.props.screenProps.logOut('signedOut');
            })
            .catch(err => console.log(err));
        }
      }else{
        this._storeUploadData();
        Alert.alert(
            I18n.get('Upload'),
            I18n.get('Upload a new challenge and let other people participate!'),
            [
              {
                text: I18n.get('Ok'), onPress: () => {
                  if( !isGuest ){
                    this.props.navigation.navigate('Shoot');
                  }else{
                    Auth.signOut()
                      .then(() => {
                        this.props.screenProps.logOut('signedOut');
                      })
                      .catch(err => console.log(err));
                  }
                }
              },
            ],
        );
      }
     } catch (error) {
       // Error retrieving data
     }
  }
  _storeUploadData = async () => {
    try {
      await AsyncStorage.setItem('first_upload', '1');
    } catch (error) {
      // Error saving data
    }
  }
  _firstHomePopup = async () => {
    try {
      const value = await AsyncStorage.getItem('first_home');
      if (value !== null) {
        // We have data
      }else{
        this._storeHomeData();
        Alert.alert(
            I18n.get('Welcome!'),
            I18n.get('This is your personal startpage. Here you will see the challenges of your friends and challenges that you might like.'),
        );
      }
     } catch (error) {
       // Error retrieving data
     }
  }
  _storeHomeData = async () => {
    try {
      await AsyncStorage.setItem('first_home', '1');
    } catch (error) {
      // Error saving data
    }
  }
  _setHiddenVideos(challengeId){
    let currVideos = this.state.apiResponse;
    AsyncStorage.getItem('hiddenVideos')
    .then(
      hidden => {
        var hiddenVideosArray = hidden ? JSON.parse(hidden) : [];
        hiddenVideosArray.push(challengeId);
        this.setState({
          hiddenVideos: hiddenVideosArray,
          apiResponse: currVideos.filter( function(el) { return !hiddenVideosArray.includes(el.challengeId); } )
        });
        AsyncStorage.setItem('hiddenVideos', JSON.stringify(hiddenVideosArray));
      }
    )
    .catch(
      e => console.log(e)
    );
  }
  checkVisible(isVisible){
    if(isVisible){
      if(!this.state.visible){
        this.setState({visible: true});
      }
    }else{
      if(this.state.visible){
        this.setState({visible: false});
      }
    }
  }
  _set_adv_view( id ){
    const path = "/ads?id="+id+"&view=1";
    API.put("adsCRUD", path, {})
      .then(
        adv => {
          console.log(adv);
        }
      ).catch(err => console.log(err));
  }
  _get_all_challenges(){
    let self = this;
    if( !this.state.refreshing ){
      this.setState({
        refreshing: true
      });
    }
    const adsPath = "/ads";
    API.get("adsCRUD", adsPath)
      .then(
        adsData => {
          this.setState({
            adsResponse: adsData
          });
          const path = "/videos?category=all";
          API.get("videosCRUD", path)
            .then(
              data => {
                if( this.state.filterOnlyLive ){
                  var currTime = new Date().valueOf();
                  var filtered = data[0].filter( function(el) { return el.deadlineDate > currTime; } );
                  data[0] = filtered;
                }
                this.setState({
                  apiResponse: data[0].filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } ),
                  refreshing: false,
                  lastEvaluatedKey: data[1],
                  loadingMore: false
                });
              }
            ).catch(err => console.log(err));
        }
      ).catch(err => console.log(err));
  }
  _loadmore(){
    let self = this;
    if( this.state.lastEvaluatedKey && !this.state.refreshing && !this.state.loadingMore ){
      this.setState({
        loadingMore: true
      });
      var str = "";
      for (var key in this.state.lastEvaluatedKey) {
          if (str != "") {
              str += "&";
          }
          str += key + "=" + encodeURIComponent(this.state.lastEvaluatedKey[key]);
      }
      const path = "/videos?category=all&"+str;
      API.get("videosCRUD", path)
        .then(
          data => {
            data[0] = data[0].filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } );
            if( this.state.filterOnlyLive ){
              var currTime = new Date().valueOf();
              var filtered = data[0].filter( function(el) { return el.deadlineDate > currTime; } );
              data[0] = filtered;
            }
            this.setState({
              apiResponse: [...this.state.apiResponse, ...data[0]].filter((elem, index, self) => self.findIndex(
                (t) => {return (t.challengeId === elem.challengeId)}) === index),
              refreshing: false,
              loadingMore: false,
              lastEvaluatedKey: data[1]
            });
          }
        ).catch(err => console.log(err));
    }else{
      return;
    }
  }
  _loadmore_category(cat_name){
    letself = this;
    if( this.state[cat_name+'lastEvaluatedKey'] && !this.state[cat_name+'refreshing'] && !this.state[cat_name+'loadingMore'] ){
      this.setState({
        [`${cat_name}loadingMore`]: true
      });
      var str = "";
      for (var key in this.state[cat_name+'lastEvaluatedKey']) {
          if (str != "") {
              str += "&";
          }
          str += key + "=" + encodeURIComponent(this.state[cat_name+'lastEvaluatedKey'][key]);
      }
      const path = "/videos?category="+cat_name+"&"+str;
      API.get("videosCRUD", path)
        .then(
          data => {
            var filtered = data[0].filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } ).filter( function(el) { return el.parent == 'null'; } );
            data[0] = filtered;
            if( this.state.filterOnlyLive ){
              var currTime = new Date().valueOf();
              filtered = data[0].filter( function(el) { return el.deadlineDate > currTime; } );
              data[0] = filtered;
            }
            this.setState({
              [`${cat_name}`] : [...this.state[`${cat_name}`], ...data[0]].filter((elem, index, self) => self.findIndex(
                (t) => {return (t.challengeId === elem.challengeId)}) === index),
              [`${cat_name}refreshing`] : false,
              [`${cat_name}lastEvaluatedKey`]: data[1],
              [`${cat_name}loadingMore`]: false
            });
          }
        ).catch(err => console.log(err));
    }else{
      return;
    }
  }
  _get_challenges_by_cat(tab_id){
    let self = this;
    switch (tab_id) {
      case 1:
        var cat_name = 'FRIENDS';
        break;
      case 2:
        var cat_name = 'SPORT';
        break;
      case 3:
        var cat_name = 'GAMES';
        break;
      case 4:
        var cat_name = 'MUSIK';
        break;
      case 5:
        var cat_name = 'LIVE';
        break;
      default:
        var cat_name = false;
    }
    if( cat_name ){
      if( cat_name == 'FRIENDS' ){
        if( !this.state[cat_name+'refreshing'] ){
          this.setState({
            [`${cat_name}refreshing`] : true
          });
          const path = "/videos?friends="+this.state.mySub;
          API.get("videosCRUD", path)
            .then(
              data => {
                data = data.filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } );
                if( this.state.filterOnlyLive ){
                  var currTime = new Date().valueOf();
                  var filtered = data.filter( function(el) { return el.deadlineDate > currTime; } );
                  data = filtered;
                }
                this.setState({
                  [`${cat_name}`] : data,
                  [`${cat_name}refreshing`] : false,
                  [`${cat_name}loaded`] : true
                });
              }
            ).catch(err => console.log(err));
        }
      }else{
        if( !this.state[cat_name+'refreshing'] ){
          this.setState({
            [`${cat_name}refreshing`] : true
          });
          const path = "/videos?category="+cat_name;
          API.get("videosCRUD", path)
            .then(
              data => {
                data[0] = data[0].filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } );
                var filtered = data[0].filter( function(el) { return el.parent == 'null'; } );
                data[0] = filtered;
                if( this.state.filterOnlyLive ){
                  var currTime = new Date().valueOf();
                  filtered = data[0].filter( function(el) { return el.deadlineDate > currTime; } );
                  data[0] = filtered;
                }
                this.setState({
                  [`${cat_name}`] : data[0].filter((elem, index, self) => self.findIndex(
                    (t) => {return (t.challengeId === elem.challengeId)}) === index),
                  [`${cat_name}refreshing`] : false,
                  [`${cat_name}loaded`] : true,
                  [`${cat_name}lastEvaluatedKey`]: data[1],
                  [`${cat_name}loadingMore`]: false
                });
              }
            ).catch(err => console.log(err));
        }
      }
    }
  }
  static navigationOptions = ({ navigate, navigation }) => ({
    header: null,
    tabBarVisible: true,
  });
  showReportActions(challengeId, challengeTitle){
    var REPORTBUTTONS = [ I18n.get('Hide'), I18n.get('Abuse'), I18n.get('Inappropriate Content'), I18n.get('Other'), I18n.get('Cancel')];
    var CANCEL_INDEX = 4;
    ActionSheet.show(
        {
            options: REPORTBUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            title: challengeTitle,
            message: I18n.get('Select report reason'),
        },
        buttonIndex => {
          if( buttonIndex == 0 ){
            this._setHiddenVideos(challengeId);
          }  
          else if( buttonIndex != CANCEL_INDEX ){
                // Report has been chosen
                const path = "/reports";
                let newReport = {
                    body: {
                        "itemId": challengeId,
                        "itemType": "Video",
                        "reason": REPORTBUTTONS[buttonIndex],
                        "reportDate": new Date().valueOf()
                    }
                }
                API.post("reportsCRUD", path, newReport)
                .then(
                    result => {
                        Alert.alert(
                          I18n.get('Report'),
                          I18n.get('Your report has been sent'),
                        )
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                );
            }
        }
    )
  }
  _challengeRender({item, index}){
    item.payment = 0;
    if( !item.approved ){
      return;
    }
    return (
      <View>
        { ( Platform.OS === 'ios' && this.state.adsResponse && index % 2 === 0 && index != 0 && this.state.adsResponse[index/2-1] ) &&
        <InViewPort onChange={this.checkVisible}>
          <Text style={{
            color: "rgb(231,91,58)",
            fontSize: 11,
            textAlign: "right",
            paddingRight: 15,
            paddingBottom: 5
          }}>{I18n.get('Advertisement')}</Text>
          <VideoAf
            style={{
              marginBottom: 0
            }}
            url={this.state.adsResponse[index/2-1].resource}
            autoPlay={true}
            rate={this.state.visible ? 1.0 : 0}
            onEnd={ () => this._set_adv_view(this.state.adsResponse[index/2-1].id) }
            resizeMode='contain'
            loop={true}
            inlineOnly={true}
            volume={0}
            theme={{
              title: '#FFF',
              more: '#FFF',
              center: '#ED923D',
              fullscreen: '#FFF',
              volume: '#FFF',
              scrubberThumb: '#E75B3A',
              scrubberBar: '#ED923D',
              seconds: '#FFF',
              duration: '#FFF',
              progress: '#E75B3A',
              loading: '#ED923D'
            }}
          />
        </InViewPort>
        }
        { ( Platform.OS === 'android' && this.state.adsResponse && index % 2 === 0 && index != 0 && this.state.adsResponse[index/2-1] ) &&
        <View>
          <Text style={{
            color: "rgb(231,91,58)",
            fontSize: 11,
            textAlign: "right",
            paddingRight: 15,
            paddingBottom: 5
          }}>{I18n.get('Advertisement')}</Text>
          <VideoAf
            style={{
              marginBottom: 0
            }}
            url={this.state.adsResponse[index/2-1].resource}
            autoPlay={false}
            onEnd={ () => this._set_adv_view(this.state.adsResponse[index/2-1].id) }
            resizeMode='contain'
            loop={true}
            inlineOnly={true}
            volume={0}
            theme={{
              title: '#FFF',
              more: '#FFF',
              center: '#ED923D',
              fullscreen: '#FFF',
              volume: '#FFF',
              scrubberThumb: '#E75B3A',
              scrubberBar: '#ED923D',
              seconds: '#FFF',
              duration: '#FFF',
              progress: '#E75B3A',
              loading: '#ED923D'
            }}
          />
        </View>
        }
        <View style={{ marginTop: 20 }}>
          <Grid style={styles.trendingCardHeader} >
            <Row>
              <Col style={{ width: 50 }}>
                <TouchableOpacity onPress={() => this.state.myUsername == item.authorUsername ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                    user: item.authorUsername
                })}>
                  <FastImage
                        style={{ width: 34, height: 34, borderRadius: 17, aspectRatio: 1 }}
                        source={
                          item.author == '-' ? require('./assets/images/avatar.png') : 
                          {
                            uri: item.author,
                            priority: FastImage.priority.normal,
                          }
                        }
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
              </Col>
              <Col>
                  <Text style={styles.trendingTitleText}>{item.title}</Text>
                  <Text style={styles.trendingTitleDescriptionText}><TimeAgo time={item.creationDate} /></Text>
                  { item.deadlineDate > new Date().valueOf() || ( item.deadlineDate < new Date().valueOf() && !item.completed ) ?
                    <Text style={[styles.trendingTitleDescriptionText, {color: '#e6643a', fontSize: 12, fontWeight: "bold", lineHeight: 14, marginTop: 4}]}>{I18n.get('Live')}</Text>:
                    <Text style={[styles.trendingTitleDescriptionText, {color: '#e6643a', fontSize: 12, fontWeight: "bold", lineHeight: 14, marginTop: 4}]}>{I18n.get('Ended')} { moment( parseInt( item.deadlineDate ) ).format('lll') }</Text>
                  }
              </Col>
              <Col style={{ width: 30 }}>
                  <TouchableOpacity onPress={() => this.showReportActions(item.challengeId, item.title) }>
                    <Text style={{
                        textAlign: 'center',
                      }}>
                      <Icon name={'dots-horizontal-triple'} size={20} color={'#373744'} />
                    </Text>
                  </TouchableOpacity>
                </Col>
            </Row>
            <Row marginTop={15}>
              <Text style={styles.trendingExcerpt}>{item.description}</Text>
            </Row>
          </Grid>
          <TouchableHighlight style={{backgroundColor: "#F7F8F8"}} onPress={() => item.videoFile == '-' ? '':this.props.navigation.navigate('Video', {
              videoThumb: item.videoThumb,
              userThumb: item.userThumb,
              videoURL: item.videoFile,
              videoTitle: item.title,
              videoDescription: item.description,
              videoAuthor: item.author,
              videoDate: item.creationDate,
              videoDeadline: item.deadlineDate,
              videoCompleted: item.completed,
              prizeTitle: item.prizeTitle,
              prizeDescription: item.prizeDescription,
              prizeUrl: item.prizeUrl,
              prizeImage:item.prizeImage,
              hasParent: item.parent == 'null' ? false : item.parent,
              videoCategory: I18n.get('Popular'),
              videoPayment: item.payment,
              challengeId: item.challengeId,
              views: item.views,
              rating: item.rating,
              authorSub: item.authorSub, authorUsername: item.authorUsername
            })}
          >
            <FastImage
              style={{
                width: null,
                height: null,
                aspectRatio: 1000 / 564
              }}
              source={
                (item.userThumb == '-' || !item.userThumb) && item.videoThumb == '-' ?
                require('./assets/images/placeholder-alt-1.jpg') :
                {
                  uri: item.userThumb == '-' || !item.userThumb ? item.videoThumb : item.userThumb,
                  priority: FastImage.priority.normal,
                }
              }
              resizeMode={FastImage.resizeMode.cover}
            />    
          </TouchableHighlight>
          <Grid style={styles.trendingCardFooter} >
            <Col>
              <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Text style={styles.trendingCardFooterText}>
                  <Icon name={'award1'} size={15} color={'#000000'} /> { item.participants ? item.participants : 0 }</Text>
                <Text style={styles.trendingCardFooterText}>
                  <Icon name={'chat'} size={15} color={'#000000'} /> { item.comments ? item.comments : 0 }</Text>
                <Text style={styles.trendingCardFooterText}>
                  <Icon name={'whatshot'} size={15} color={'#000000'} /> {item.rating}</Text>
              </View>
            </Col>
          </Grid>
        </View>
      </View>
    )
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null,
      }}>
        <View style={{ flex: 1, ...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight
                }
            }) }}>
          <StyleProvider style={getTheme(customStyle)}>
            <Container>
              <Header hasTabs transparent>
                <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
                <Left style={{flex: 1}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')} style={{ left: 15 }} >
                    <Icon name='Search' size={20} color='#373744'/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.setModalVisible(true); }} style={{ position: 'absolute',left: 60 }} >
                    <Icon name='filter_white' size={20} color='#373744'/>
                  </TouchableOpacity>
                </Left>
                <Body style={{flex: 1, alignItems: 'center'}}>
                  <FastImage
                    style={{ width: 30, height: 30 }}
                    source={require('./assets/logo.png')}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </Body>
                <Right style={{flex: 1}}>
                  <TouchableOpacity onPress={() => this._firstUploadPopup() } style={{ right: 15 }}>
                    <Icon name='add_a_photo' size={25} color='#373744' />
                  </TouchableOpacity>
                </Right>
              </Header>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  console.log('Modal has been closed.');
                }}>
                <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                  <View style={{
                          width: 300,
                          backgroundColor: '#ffffff',
                          borderRadius: 12,
                          ...Platform.select({
                            ios: {
                              height: 100,
                            },
                            android: {
                              height: 150,
                            }
                        })}}>
                    <Content>
                      <ListItem itemHeader first>
                        <Body><Text>{I18n.get('Filter').toUpperCase()}</Text></Body>
                        <Right><TouchableOpacity onPress={() => this.setModalVisible(false)}><Icon name="close" size={16} /></TouchableOpacity>
                        </Right>
                      </ListItem>
                      <ListItem last>
                        <CheckBox
                          color='rgb(237, 146, 61)'
                          onPress={ () => { this.filterChange() }}
                          checked={this.state.filterOnlyLive} />
                        <Body><Text>{I18n.get('Show only live challenges')}</Text></Body>
                      </ListItem>
                    </Content>
                  </View>
                </View>
              </Modal>
              <Tabs onChangeTab={({ i, ref, from })=> this._get_challenges_by_cat( isGuest ? i+1 : i)} renderTabBar={()=> <ScrollableTab />} tabBarBackgroundColor={'transparent'}>
                <Tab heading={I18n.get('Popular')} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.apiResponse}
                    keyExtractor={item => item.challengeId}
                    onEndReached={ () => this._loadmore()}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.refreshing}
                       onRefresh={ () => this._get_all_challenges()}
                      />
                    }
                    renderItem={this._challengeRender.bind(this)}
                  />
                </Tab>
                { !isGuest &&
                <Tab heading={I18n.get('Friends').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.FRIENDS}
                    keyExtractor={item => item.challengeId}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.FRIENDSrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(1) }
                      />
                    }
                    renderItem={this._challengeRender.bind(this)}
                  />
                </Tab>
                }
                <Tab heading={I18n.get('Sport').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.SPORT}
                    keyExtractor={item => item.challengeId}
                    onEndReached={ () => this._loadmore_category('SPORT')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.SPORTrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(2) }
                      />
                    }
                    renderItem={this._challengeRender.bind(this)}
                  />
                </Tab>
                <Tab heading={I18n.get('Games').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.GAMES}
                    keyExtractor={item => item.challengeId}
                    onEndReached={ () => this._loadmore_category('GAMES')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.GAMESrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(3) }
                      />
                    }
                    renderItem={this._challengeRender.bind(this)}
                  />
                </Tab>
                <Tab heading={I18n.get('Music').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.MUSIK}
                    keyExtractor={item => item.challengeId}
                    onEndReached={ () => this._loadmore_category('MUSIK')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.MUSIKrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(4) }
                      />
                    }
                    renderItem={this._challengeRender.bind(this)}
                  />
                </Tab>
                <Tab heading={I18n.get('Live').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.LIVE}
                    keyExtractor={item => item.challengeId}
                    onEndReached={ () => this._loadmore_category('LIVE')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.LIVErefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(5) }
                      />
                    }
                    renderItem={this._challengeRender.bind(this)}
                  />
                </Tab>
              </Tabs>
            </Container>
          </StyleProvider>
        </View>
      </ImageBackground>
    );
  }
}

class TrendingScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      trending: [],
      trendingrefreshing: true,
      loadingMore: true,
      compactLayout: true,
      lastEvaluatedKey: null,
      itemHeight: 0
     };
     this._get_trending_challenges = this._get_trending_challenges.bind(this);
     this._get_trending_challenges();
  }
  componentDidMount(){
    Auth.currentAuthenticatedUser().then(
      myUser => {
        this.setState({
          myUsername: myUser.username
        });
      }
    );
  }
  _get_trending_challenges(){
    if( !this.state.trendingrefreshing ){
      this.setState({
        trendingrefreshing: true
      });
    }
    const path = "/videos?trending=1";
    API.get("videosCRUD", path)
      .then(
        data => {
          var sortedVideos = data[0].filter( function(el) { return el.approved; } );
          var currentDate = new Date().valueOf();
          sortedVideos.sort(function (a, b) {
            if ( ( a.views / (currentDate - a.creationDate) ) > ( b.views / (currentDate - b.creationDate) ) ) {
              return -1;
            }
            if ( ( a.views / (currentDate - a.creationDate) ) < ( b.views / (currentDate - b.creationDate) ) ) {
              return 1;
            }
            return 0;
          });
          this.setState({
            trending: sortedVideos,
            trendingrefreshing: false,
            loadingMore: false,
            lastEvaluatedKey: data[1]
          });
          console.log('Trending', this.state.trending);
        }
      ).catch(err => console.log(err));
  }
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      header: null,
      tabBarVisible: true,
    }
  }
  _loadmore(){
    if( this.state.lastEvaluatedKey && !this.state.trendingrefreshing && !this.state.loadingMore ){
      this.setState({
        loadingMore: true
      });
      var str = "";
      for (var key in this.state.lastEvaluatedKey) {
          if (str != "") {
              str += "&";
          }
          str += key + "=" + encodeURIComponent(this.state.lastEvaluatedKey[key]);
      }
      const path = "/videos?trending=1&"+str;
      API.get("videosCRUD", path)
        .then(
          data => {
            var sortedVideos = data[0];
            var currentDate = new Date().valueOf();
            sortedVideos.sort(function (a, b) {
              if ( ( a.views / (currentDate - a.creationDate) ) > ( b.views / (currentDate - b.creationDate) ) ) {
                return -1;
              }
              if ( ( a.views / (currentDate - a.creationDate) ) < ( b.views / (currentDate - b.creationDate) ) ) {
                return 1;
              }
              return 0;
            });
            this.setState({
              trending: [...this.state.trending, ...sortedVideos].filter((elem, index, self) => self.findIndex(
                (t) => {return (t.challengeId === elem.challengeId)}) === index),
              loadingMore: false,
              lastEvaluatedKey: data[1]
            });
          }
        ).catch(err => console.log(err));
    }else{
      return;
    }
  }
  _challengeRender(item, index){
      item = item.item;
      return (
        <TouchableHighlight
          style={[{
            alignItems: 'stretch',
            backgroundColor: "transparent",
            flex: 1/3,
            alignSelf: "stretch",
          }]} onPress={() => item.videoFile == '-' ? '':this.props.navigation.navigate('Video', {
          videoThumb: item.videoThumb,
          userThumb: item.userThumb,
          videoURL: item.videoFile,
          videoTitle: item.title,
          videoDescription: item.description,
          videoAuthor: item.author,
          videoDate: item.creationDate,
          videoDeadline: item.deadlineDate,
          videoCompleted: item.completed,
          prizeTitle: item.prizeTitle,
          prizeDescription: item.prizeDescription,
          prizeUrl: item.prizeUrl,
          prizeImage:item.prizeImage,
          hasParent: item.parent == 'null' ? false : item.parent,
          videoCategory: I18n.get('Trending'),
          videoPayment: item.payment,
          challengeId: item.challengeId,
          views: item.views,
          rating: item.rating,
          authorSub: item.authorSub, authorUsername: item.authorUsername
        })}
      >
        <ImageBackground
          source={require('./assets/images/placeholder-alt.gif')}
          resizeMode="cover"
          style={{
            flex:1,
            width: this.state.itemHeight
        }}>
          <FastImage
              style={{
                flex: 1,
                width: null,
                height: null,
                margin: 1,
                aspectRatio: 1
              }}
              source={
                (item.userThumb == '-' || !item.userThumb) && item.videoThumb == '-' ?
                require('./assets/images/placeholder-alt-1.jpg') :
                {
                  uri: item.userThumb == '-' || !item.userThumb ? item.videoThumb : item.userThumb,
                  priority: FastImage.priority.normal,
                }
              }
              resizeMode={FastImage.resizeMode.cover}
          />
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={ ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'] }
            style={{
              bottom: 0,
              left: 1,
              flex:1,
              position: 'absolute',
              justifyContent: 'flex-end',
              paddingBottom: 15,
              paddingTop: 15,
              width: (this.state.itemHeight-2)
            }}
          >
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              color: '#ffffff',
              textAlign: 'center',
              width: '100%',
              paddingHorizontal: 5
          }}>{item.title}</Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableHighlight>
      );
  }
  _onLayout = e => {
    const width = e.nativeEvent.layout.width
    this.setState({
        itemHeight: width / 3,
    })
  }
  _getItemLayout = (data, index) => {
    const { itemHeight } = this.state
    return { length: itemHeight, offset: itemHeight * index, index }
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null,
      }}>
        <View style={{ flex: 1, ...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight
                }
            }) }}>
          <StyleProvider style={getTheme(customStyle)}>
          <Container>
            <Header hasTabs>
              <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
              <Body>
                <Title style={{
                    fontSize: 20,
                    fontWeight: "700",
                    fontStyle: "normal",
                    letterSpacing: -0.25,
                    textAlign: "left",
                    color: "#373744",
                }}>{I18n.get('Trending Challenges')}</Title>
              </Body>
            </Header>
              <FlatList
                onLayout={this._onLayout}
                columnWrapperStyle={[
                  {
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: -1,
                    marginRight: -1,
                    height: this.state.itemHeight
                  },
                ]}
                data={this.state.trending}
                refreshControl={
                  <RefreshControl
                   refreshing={this.state.trendingrefreshing}
                   onRefresh={ () => this._get_trending_challenges() }
                  />
                }
                numColumns={3}
                keyExtractor={item => item.challengeId}
                onEndReached={this._loadmore.bind(this)}
                getItemLayout={this._getItemLayout}
                renderItem={this._challengeRender.bind(this)}
              />
          </Container>
          </StyleProvider>
        </View>
      </ImageBackground>
    );
  }
}

class VideoCapture extends React.Component {
  constructor(){
    super();
    this.state = {
      isRecording: false,
      videoURL: '',
      isTorch: false,
      isFront: false,
    }
  }
  static navigationOptions = ({ navigate, navigation }) => ({
    header: null,
    tabBarVisible: false
  });
  turnFlash = async function(){
    this.setState({
      isTorch: !this.state.isTorch
    });
    console.log( 'Supported ratios: ', await this.Rcamera.getSupportedRatiosAsync());
  }
  turnFront = function(){
    this.setState({
      isFront: !this.state.isFront
    });
  }
  getFormattedTime(time) {
    this.currentTime = time;
  };
  takeVideo = async function() {
    let allowed = false;
    if( Platform.OS === 'android' ){
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            'title': 'Challenges Record Audio Permission',
            'message': 'We need your permission to access your microphone'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the microphone");
          allowed = true;
        } else {
          console.log("Record Audio permission denied");
          allowed = false;
        }
      } catch (err) {
        console.warn(err)
      }
    }else{
      allowed = true;
    }

    if (this.Rcamera && allowed) {
      const options = {
        quality: RNCamera.Constants.VideoQuality["720p"],
        flashMode: this.state.isTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off,
        type: this.state.isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
      };
      if(this.state.isRecording){
        this.Rcamera.stopRecording();
        this.setState({
          isRecording: false
        });
      }else{
        this.setState({
          isRecording: true
        });
        this.Rcamera.recordAsync(options)
        .then(
          data => {
            console.log('Video Recorded: '+data);
            this.setState({
              isRecording: false,
              videoURL: data.uri
            });
            this.props.navigation.navigate('Edit', {
              videoURL: data.uri,
              parentChallengeId: this.props.navigation.getParam('parent', '')
            });
          }
        )
        .catch(
          err => console.log(err)
        );
      }
    }
  };
  render() {
    return (
      <StyleProvider style={getTheme(customStyle)}>
        <SafeAreaView style={{flex:1,...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight
                }
            })}} forceInset={{ top: 'never' }}>
          <Container>
              <Button style={{zIndex: 100, position: 'absolute', left: 30, top: 30}} transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='back' size={15} color='#ffffff' />
              </Button>
            <Grid>
              <Row>
                <RNCamera
                    ref={ref => {
                      this.Rcamera = ref;
                    }}
                    //quality = {RNCamera.Constants.VideoQuality["720p"]}
                    style = {styles.preview}
                    type={this.state.isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                    flashMode={this.state.isTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                      title: I18n.get('Permission to use camera'),
                      message: I18n.get('We need your permission to use your camera'),
                      buttonPositive: I18n.get('Ok'),
                      buttonNegative: I18n.get('Cancel'),
                    }}
                    androidRecordAudioPermissionOptions={{
                      title: I18n.get('Permission to use audio recording'),
                      message: I18n.get('We need your permission to use your audio'),
                      buttonPositive: I18n.get('Ok'),
                      buttonNegative: I18n.get('Cancel'),
                    }}
                />
              </Row>
              { Platform.OS === 'ios' ?
              <BlurView
                style={styles.videoCaptureFooter}
                blurType="light"
                blurAmount={10}>
                <Row>
                  <Col style={{alignItems: 'flex-start', alignSelf: 'center'}}>
                    <TouchableOpacity onPress={this.turnFlash.bind(this)}>
                      <Icon name='Trending_Nonselected' size={30} color={ '#ffffff' } />
                    </TouchableOpacity>
                  </Col>
                  <Col style={{alignItems: 'center' , alignSelf: 'center'}}>
                    <TouchableOpacity onPress={this.takeVideo.bind(this)}>
                      <Icon name='btn_shoot' size={60} color={ this.state.isRecording ? '#ED3D3D':'#ED923D' } />
                    </TouchableOpacity>
                    {/* <Stopwatch
                      start={this.state.isRecording}
                      getTime={this.getFormattedTime}
                      options={{
                        container: {
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          padding: 4,
                          borderRadius: 4,
                          marginTop: 8,
                          marginBottom: 0,
                        },
                        text: {
                          fontSize: 16,
                          color: '#FFF',
                          marginLeft: 0,
                        }
                      }}
                    /> */}
                  </Col>
                  <Col style={{alignItems: 'flex-end', alignSelf: 'center'}}>
                    <TouchableOpacity onPress={this.turnFront.bind(this)}>
                      <Icon name='camera-toggle' size={30} color={ '#ffffff' } />
                    </TouchableOpacity>
                  </Col>
                </Row>
              </BlurView>
              :
              <View
                style={[styles.videoCaptureFooter, {backgroundColor: 'rgba(255,255,255,0.3)'}]}>
                <Row>
                  <Col style={{alignItems: 'flex-start', alignSelf: 'center'}}>
                    <TouchableOpacity onPress={this.turnFlash.bind(this)}>
                      <Icon name='Trending_Nonselected' size={30} color={ '#ffffff' } />
                    </TouchableOpacity>
                  </Col>
                  <Col style={{alignItems: 'center' , alignSelf: 'center'}}>
                    <TouchableOpacity onPress={this.takeVideo.bind(this)}>
                      <Icon name='btn_shoot' size={60} color={ this.state.isRecording ? '#ED3D3D':'#ED923D' } />
                    </TouchableOpacity>
                    {/* <Stopwatch
                      start={this.state.isRecording}
                      getTime={this.getFormattedTime}
                      options={{
                        container: {
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          padding: 4,
                          borderRadius: 4,
                          marginTop: 8,
                          marginBottom: 0,
                        },
                        text: {
                          fontSize: 16,
                          color: '#FFF',
                          marginLeft: 0,
                        }
                      }}
                    /> */}
                  </Col>
                  <Col style={{alignItems: 'flex-end', alignSelf: 'center'}}>
                    <TouchableOpacity onPress={this.turnFront.bind(this)}>
                      <Icon name='camera-toggle' size={30} color={ '#ffffff' } />
                    </TouchableOpacity>
                  </Col>
                </Row>
              </View>
              }
            </Grid>
          </Container>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: true,
    header: null
  });
  constructor(){
    super();
    this.state = {
      username: undefined,
      sub: undefined,
      preferred_username: undefined,
      country: undefined,
      description: undefined,
      avatar: undefined,
      loading: true,
      followersNumber: 0,
      followingNumber: 0,
      videos: [],
      totalVideos: 0,
      likes: 0,
      mylikes: 0,
      balance: "0.00",
    }
    this._loadUser = this._loadUser.bind(this);
    this._loadFollowers = this._loadFollowers.bind(this);
  }
  deleteVideo( challengeId, parentId = false ){
    Alert.alert(
      I18n.get('Remove Video?'),
      '',
      [
        {text: I18n.get('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: I18n.get('Ok'), onPress: () => {
          const path = "/videos/object/"+challengeId;
          API.del("videosCRUD", path)
          .then(
            result => {
              console.log(result);
              this._loadUser();
            }
          ).catch(err => console.log(err));
          if(parentId && parentId != 'null'){
            // Removing a participant value
            let uuid = parentId;
            const path = "/videos?uuid="+uuid+"&participant=1&remove=1";
            API.put("videosCRUD", path, {});
          }
        }},
      ],
      { cancelable: true }
    )
  }
  _videoRender({item, index}){
    return (
      <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
        <Grid>
          <Row>
            <Col style={{ width: 66 }}>
                <TouchableHighlight style={{backgroundColor: "#F7F8F8"}} onPress={() => item.videoFile == '-' ? '':this.props.navigation.navigate('Video', {
                  videoThumb: item.videoThumb,
                  userThumb: item.userThumb,
                  videoURL: item.videoFile,
                  videoTitle: item.title,
                  videoDescription: item.description,
                  videoAuthor: item.author,
                  videoDate: item.creationDate,
                  videoDeadline: item.deadlineDate,
                  videoCompleted: item.completed,
                  prizeTitle: item.prizeTitle,
                  prizeDescription: item.prizeDescription,
                  prizeUrl: item.prizeUrl,
                  prizeImage:item.prizeImage,
                  hasParent: item.parent == 'null' ? false : item.parent,
                  videoCategory: I18n.get('Profile'),
                  videoPayment: item.payment,
                  challengeId: item.challengeId,
                  views: item.views,
                  rating: item.rating,
                  authorSub: item.authorSub, authorUsername: item.authorUsername
                })}
              >
                <FastImage
                  style={{ borderRadius: 3.7, width: null, height: null, aspectRatio: 1000 / 564 }}
                  source={
                    (item.userThumb == '-' || !item.userThumb) && item.videoThumb == '-' ?
                    require('./assets/images/placeholder-alt-1.jpg') :
                    {
                      uri: item.userThumb == '-' || !item.userThumb ? item.videoThumb : item.userThumb,
                      priority: FastImage.priority.normal,
                    }
                  }
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableHighlight>
            </Col>
            <Col style={{
              paddingHorizontal: 15
            }}>
                <Text style={[styles.trendingTitleText, {fontSize:13}]}>{item.title}</Text>
                <Text style={styles.trendingTitleDescriptionText}><TimeAgo time={item.creationDate} /></Text>
            </Col>
            <Col style={{
              width: 78,
            }}>
              <Button block bordered dark style={{
                height: 26,
              }}>
                <Text style={{
                  fontSize: 10.8,
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0.45,
                  color: "#373744"
                }}>{item.rating} {I18n.get('Likes')}</Text>
              </Button>
            </Col>
            <Col style={{
              width: 26,
              paddingLeft: 6
            }}>
              <Button onPress={() => this.deleteVideo(item.challengeId, item.parent)} block bordered danger style={{
                height: 26,
                width: 26
              }}>
                <Icon name='bin, trashcan, remove, delete, recycle, dispose' size={13} style={{color: "#d88586"}} />
              </Button>
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
  _profileRender(){
    return (
    <View>
      <Grid style={{ paddingHorizontal: 15, alignItems: "center" }}>
        <Row style={{ marginBottom: 29 }}>
            <Col style={{ width: 110 }}>
              <FastImage
                  style={{ width: 110, height: 110, borderRadius: 55, zIndex: 2 }}
                  source={
                    !this.state.avatar ? require('./assets/images/avatar.png') : 
                    {
                      uri: this.state.avatar,
                      priority: FastImage.priority.normal,
                    }
                  }
                  resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                  style={{ top: 29, width: 110, height: 110, position: 'absolute', zIndex:1 }}
                  source={require('./assets/images/oval.png')}
                  resizeMode={FastImage.resizeMode.cover}
              />
            </Col>
        </Row>
        <Row>
          <Col>
            <Text style={styles.profileName}>{this.state.preferred_username ? this.state.preferred_username : this.state.username }</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={styles.profileNameLocation}>{this.state.country}</Text>
          </Col>
        </Row>
        <Row>
          <Col>
          <Text style={styles.profileNameDescription}>{this.state.description}</Text>
          </Col>
        </Row>
        <Row style={{ marginTop: 22 }}>
          <Col>
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={styles.profileCounter}>{this.state.totalVideos}</Text>
              <Text style={styles.profileCounterDescription}>{I18n.get('Videos').toUpperCase()}</Text>
            </View>
          </Col>
          <Col>
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={styles.profileCounter}>{ this.state.mylikes }</Text>
              <Text style={styles.profileCounterDescription}>{I18n.get('Likes').toUpperCase()}</Text>
            </View>
          </Col>
          <Col>
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
              {/* <Text style={styles.profileCounter}>${this.state.balance}</Text>
              <Text style={styles.profileCounterDescription}>{I18n.get('Balance').toUpperCase()}</Text> */}
            </View>
          </Col>
        </Row>
        <Row style={{ marginTop: 22, marginBottom: 19 }}>
          <Col>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Followers', {
                  sub: this.state.sub,
                })}
              >
              <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={styles.profileCounter}>{ this.state.followingNumber }</Text>
                <Text style={styles.profileCounterDescription}>{I18n.get('Following').toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AllFollowers', {
                  sub: this.state.sub,
                })}
              >
              <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={styles.profileCounter}>{ this.state.followersNumber }</Text>
                <Text style={styles.profileCounterDescription}>{I18n.get('Followers').toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LikedVideos', {
                  sub: this.state.sub,
                })}
              >
              <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={styles.profileCounter}>{ this.state.likes }</Text>
                <Text style={styles.profileCounterDescription}>{I18n.get('My Likes').toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    </View>
    );
  }
  componentDidMount() {
    this._loadUser();
    this._firstProfilePopup();
  }
  _firstProfilePopup = async () => {
    try {
      const value = await AsyncStorage.getItem('first_profile');
      if (value !== null) {
        // We have data
        
      }else{
        this._storeProfileData();
        Alert.alert(
            I18n.get('Profile'),
            I18n.get('Edit your profile here.'),
        );
      }
     } catch (error) {
       // Error retrieving data
     }
  }
  _storeProfileData = async () => {
    try {
      await AsyncStorage.setItem('first_profile', '1');
    } catch (error) {
      // Error saving data
    }
  }
  _loadUser(){
    this.setState({
      loading: true
    });
    Auth.currentAuthenticatedUser().then(
      data => {
        this._loadFollowers(data.signInUserSession.idToken.payload.sub);
        const path = "/videos";
        API.get("videosCRUD", path)
          .then(
            videos => {
              var origVideos = videos;
              if( videos.length > 0 ){
                var challenges = [];
                var attended = [];
                for (var i = 0; i < videos.length; i++) {
                  if( videos[i].parent == 'null' ){
                    challenges.push(videos[i]);
                  }else{
                    attended.push(videos[i]);
                  }
                }
                videos = [
                  {
                    title: I18n.get('Challenges'),
                    data: challenges
                  },
                  {
                    title: I18n.get('Attended'),
                    data: attended
                  },
                ];
              }
              this.setState({
                mylikes: origVideos.length > 0 ? origVideos.reduce((prev,next) => prev + next.rating,0) : 0,
                videos: videos,
                totalVideos: origVideos.length,
                username: data.username,
                preferred_username: data.attributes.preferred_username,
                country: data.attributes['custom:country'],
                balance: data.attributes['custom:balance'] ? data.attributes['custom:balance'] : "0.00",
                description: data.attributes.profile,
                avatar: data.attributes.picture && data && data.attributes ? data.attributes.picture : null,
                sub: data.signInUserSession.idToken.payload.sub,
                loading: false
              });
              this._load_my_likes();
            }
          ).catch(err => console.log(err));
      }
    );
  }
  _load_my_likes(){
    const path = "/likes";
    API.get("likesCRUD", path)
      .then(
        likes => {
          this.setState({
            likes: likes.length,
          });
        }
      ).catch(err => console.log(err));
  }
  componentDidUpdate(){
    if( this.props.navigation.getParam('needUpdate', '') ){
      console.log('Need Update');
      Auth.currentAuthenticatedUser({
        bypassCache: true
      }).then(
        data => {
          console.log('Need Update Data', data);
          this.props.navigation.setParams({
            needUpdate: false,
          });
          this.setState({
            username: data.username,
            preferred_username: data.attributes.preferred_username,
            country: data.attributes['custom:country'],
            description: data.attributes.profile,
            avatar: data.attributes.picture && data && data.attributes ? data.attributes.picture : null
          })
        }
      );
    }
  }
  _loadFollowers(sub){
    const userPath = "/Followers/object/"+sub;
    API.get("FollowersCRUD", userPath)
    .then(
        followers => {
          this.setState({
            followersNumber: followers.followers ? followers.followers.values.length : 0,
            followingNumber: followers.following ? followers.following.values.length : 0
          });
        }
    ).catch(err => console.log(err));
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null
      }}>
        <View style={{ flex: 1, ...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight
                }
            }) }}>
          <StyleProvider style={getTheme(customStyle)}>
            <Container style={{
              ...Platform.select({
                ios: {
                  paddingBottom: 40
                }
              })
            }}>
              <Header hasTabs transparent>
                <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
                <Left></Left>
                <Body></Body>
                <Right>
                  <Button transparent>
                    <Icon name='gear' size={20} color='#373744' onPress={() => this.props.navigation.navigate('EditProfile')} style={{ right: 15 }} />
                  </Button>
                </Right>
              </Header>
              <SectionList
                ListHeaderComponent={this._profileRender.bind(this)}
                sections={this.state.videos}
                keyExtractor={item => item.challengeId}
                renderItem={this._videoRender.bind(this)}
                ListEmptyComponent={
                  <View>
                    <Grid style={{ paddingHorizontal: 15, alignItems: "center" }}>
                      <Row>
                        <Col>
                          <View>
                            <Text style={[styles.trendingTitleDescriptionText, {color: "#000000", textAlign: 'center'}] }>{I18n.get('You do not have any videos yet')}</Text>
                          </View>
                          </Col>
                      </Row>
                    </Grid>
                  </View>
                }
                renderSectionHeader={({section: {title}}) => (
                  <View>
                    <Grid style={{ paddingHorizontal: 15, alignItems: "center" }}>
                      <Row>
                        <Col>
                          <View>
                            <Text style={{
                              fontSize: 20,
                              fontWeight: "500",
                              fontStyle: "normal",
                              letterSpacing: -0.25,
                              color: "#3b3b48",
                              marginTop: 20
                            }}>{title}</Text>
                          </View>
                        </Col>
                      </Row>
                    </Grid>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={ () => this._loadUser()}
                  />
                }
              />
              </Container>
            </StyleProvider>
        </View>
      </ImageBackground>
    );
  }
}

class EditProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: true,
    header: null
  });
  constructor(){
    super();
    this.state = {
      user: undefined,
      preferred_username: undefined,
      country: undefined,
      balance: 0.00,
      description: undefined,
      avatarSource: undefined,
      savingActive: false,
      pictureChanged: false,
      avatarPath: null,
      avatarResponse: []
    }
    this.saveProfile = this.saveProfile.bind(this);
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser().then(
      data => {
        this.setState({
          user: data,
          preferred_username: data.attributes.preferred_username,
          country: data.attributes['custom:country'],
          balance: data.attributes['custom:balance'] ? data.attributes['custom:balance'] : "0.00",
          description: data.attributes.profile,
          avatarSource: data.attributes.picture && data && data.attributes ? data.attributes.picture : null
        });
      }
    );
  }
  payOut(){
    this.props.navigation.navigate('PayOutRequest');
  }
  signOut() {
    Auth.currentAuthenticatedUser().then(
      user => {
        Auth.updateUserAttributes(user, {
          'custom:pushToken': '',
          'custom:os': '',
        }).then(
          updatedUser => {
            Auth.signOut()
            .then(() => {
              this.props.screenProps.logOut('signedOut');
            })
            .catch(err => console.log(err));
          }
        ).catch(
          err => {
            console.log(err);
          }
        );
      }
    );
  }
  saveProfile() {
    this.setState({
      savingActive: true
    });
    if( this.state.avatarResponse && this.state.pictureChanged ){
      UUIDGenerator.getRandomUUID( async (uuid) => {
        Storage.put( uuid+'_'+this.state.avatarResponse.fileSize.toString()+'.jpg', new Buffer(this.state.avatarResponse.data, 'base64'), {
          level: "public",
          contentType: mime.lookup(this.state.avatarResponse.uri),
        })
        .then(
          storageData => {
            let avatarPath = 'https://s3-us-west-1.amazonaws.com/challengesapp-userfiles-mobilehub-1228559550/public/'+storageData.key;
            Auth.updateUserAttributes(this.state.user, {
              'preferred_username': this.state.preferred_username ? this.state.preferred_username : '-',
              'custom:country': this.state.country ? this.state.country : '-',
              'profile': this.state.description ? this.state.description : '-',
              'picture': avatarPath
            }).then(
              data => {
                this.setState({
                  savingActive: false
                }, () => {
                  this.props.navigation.navigate('Profile', {needUpdate:true});
                });
              }
            ).catch(
              err => {
                console.log(err);
                this.setState({
                  savingActive: false
                });
              }
            );
          }
        )
        .catch(err => console.log(err))
      });
    }else{
      console.log('User description to update ', this.state.description);
      Auth.updateUserAttributes(this.state.user, {
        'preferred_username': this.state.preferred_username ? this.state.preferred_username : '-',
        'custom:country': this.state.country ? this.state.country : '-',
        'profile': this.state.description ? this.state.description : '-',
      }).then(
        data => {
          console.log('Saved Data', data);
          this.setState({
            savingActive: false
          }, () => {
            this.props.navigation.navigate('Profile', {needUpdate:true});
          });
        }
      ).catch(
        err => {
          console.log(err);
          this.setState({
            savingActive: false
          });
        }
      );
    }
  }
  getPhotos = () => {
    var options = {
      title: I18n.get('Select Picture'),
      cancelButtonTitle: I18n.get('Cancel'),
      takePhotoButtonTitle: I18n.get('Take Photo'),
      chooseFromLibraryButtonTitle: I18n.get('Choose from Library'),
      quality: 0.8,
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        console.log('Gallry picture', response);
        this.setState({
          avatarSource: response.uri,
          pictureChanged: true,
          avatarResponse: response
        });
      }
    });
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null
      }}>
      <StyleProvider style={getTheme(customStyle)}>
        <Container style={{...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight
                }
            })}}>
          <Header hasTabs transparent>
            <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
                <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
              </Button>
            </Left>
            <Body>
              <Title style={{
                    fontSize: 20,
                    fontWeight: "700",
                    fontStyle: "normal",
                    letterSpacing: -0.25,
                    textAlign: "left",
                    color: "#373744",
                }}>{I18n.get('Edit')}</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
                <Icon name='close' size={20} color='#373744' style={{ right: 15 }} />
              </Button>
            </Right>
          </Header>
          <KeyboardAwareScrollView>
              <Grid>
              { this.state.savingPictureActive && <Row style={{paddingBottom: 16}}><Col><ActivityIndicator size="small" color="#ED923D" /></Col></Row> }
              <Row style={{paddingBottom: 16}}>
                <Col style={{width: 100, paddingLeft:20}}>
                  <FastImage
                      style={{ width: 55, height: 55, borderRadius: 27, zIndex: 2 }}
                      source={
                        !this.state.avatarSource ? require('./assets/images/avatar.png') : 
                        {
                          uri: this.state.avatarSource,
                          priority: FastImage.priority.normal,
                        }
                      }
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <FastImage
                      style={{ top: 13, left: 20, width: 55, height: 55, position: 'absolute', zIndex:1 }}
                      source={require('./assets/images/oval.png')}
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity onPress={this.getPhotos} style={{ top:40, left: 61, width: 17, height: 17, position: 'absolute', zIndex:3}}>
                    <FastImage
                        style={{ width: 17, height: 17 }}
                        source={require('./assets/images/plus.png')}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                  </TouchableOpacity>
                </Col>
                <Col>
                  <Button transparent full light style={{backgroundColor: 'rgba(255,255,255,0.28)'}} onPress={this.getPhotos}>
                    <Text style={{width: '100%', color: '#2D3741', fontSize:14, textAlign:'left', fontWeight: '300'}}>{I18n.get('Select Image')}</Text>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col style={{
                  width: '100%',
                  paddingHorizontal: 0
                  }}>
                  <Form>
                    <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.28)', paddingHorizontal: 20, height: 86}}>
                      <Label style={{color: '#2D3741', fontSize: 12, fontWeight: '300'}}>{I18n.get('Preferred Name')}</Label>
                      <Input
                        onChangeText={(preferred_username) => { this.setState({preferred_username}) }  }
                        value={this.state.preferred_username}
                        style={{
                          width: '100%',
                          marginTop: 10,
                          color: '#373744',
                          paddingHorizontal: 0,
                          fontSize: 16,
                          height: 26
                        }} />
                    </Item>
                    <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.28)', paddingHorizontal: 20, height: 86}}>
                      <Label style={{color: '#2D3741', fontSize: 12, fontWeight: '300'}}>{I18n.get('Country')}</Label>
                      <Input
                        onChangeText={(country) => { this.setState({country}) } }
                        value={this.state.country}
                        style={{
                          width: '100%',
                          marginTop: 10,
                          color: '#373744',
                          paddingHorizontal: 0,
                          fontSize: 16,
                          height: 26
                        }} />
                    </Item>
                    <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.28)', paddingHorizontal: 10, height: 100}}>
                      <Label style={{color: '#2D3741', fontSize: 12, paddingHorizontal: 10, fontWeight: '300'}}>{I18n.get('Description')}</Label>
                        <TextInput
                          multiline={true}
                          numberOfLines={3}
                          onChangeText={(description) => { this.setState({description}) } }
                          value={this.state.description}
                          style={{
                            width: '100%',
                            paddingHorizontal: 10,
                            marginTop: 10,
                            marginBottom: 20,
                            color: '#373744',
                            fontSize: 14,
                          }}
                        />
                    </Item>
                    <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, paddingHorizontal: 10, marginBottom: 0}}>
                      <Button small light full onPress={() => this.saveProfile()} style={{
                        marginTop: 10,
                        backgroundColor: '#ED923D',
                      }}>
                        <Text style={{color: '#ffffff'}}>{ this.state.savingActive ? I18n.get('SAVING...') : I18n.get('SAVE') }</Text>
                      </Button>
                    </Item>
                    {/* <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, paddingHorizontal: 10, marginBottom: -10}}>
                      <Button small light full onPress={() => this.payOut()}>
                        <Text style={{
                              fontSize: 14,
                              fontWeight: "normal",
                              fontStyle: "normal",
                              letterSpacing: 0.39,
                              color: "#373744"}}>{I18n.get('Request Payout')}</Text>
                      </Button>
                    </Item> */}
                    <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, paddingHorizontal: 10, marginBottom: 0}}>
                      <Button small light full onPress={ () => this.signOut()}>
                        <Text style={{
                              fontSize: 14,
                              fontWeight: "normal",
                              fontStyle: "normal",
                              letterSpacing: 0.39,
                              color: "#373744"}}>{I18n.get('Logout')}</Text>
                      </Button>
                    </Item>
                  </Form>
                </Col>
              </Row>
            </Grid>
          </KeyboardAwareScrollView>
        {this.state.savingActive && Platform.OS === 'ios' &&
          <BlurView
            style={styles.loading}
            blurType="light"
            blurAmount={5}>
            <ProgressCircle
              size={50}
              indeterminate={true}
              showsText={false}
              color={'rgb(237, 146, 61)'}
            />
          </BlurView>
        }
        {this.state.savingActive && Platform.OS !== 'ios' &&
          <View
            style={[styles.loading, {backgroundColor: 'rgba(255,255,255,0.3)'}]}>
            <ProgressCircle
              size={50}
              indeterminate={true}
              showsText={false}
              color={'rgb(237, 146, 61)'}
            />
          </View>
        }
        </Container>
        </StyleProvider>
      </ImageBackground>
    );
  }
}

class InitialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        image: null,
        isLoading: true,
        isGuest: false
    };
  }
  componentDidMount(){
    Auth.currentAuthenticatedUser().then(
      data => {
        if( data.username == 'Guest' && data.attributes.sub == 'cc84d13e-6f1c-4539-a741-73f59a9648ac' ){
          isGuest = true;
        }else{
          isGuest = false;
          if( Platform.OS === 'ios' ){
            PushNotification.initializeIOS();
          }else{
            PushNotification.initializeAndroid();
          }
          // get the notification data
          PushNotification.onNotification((notification) => {
            // Note that the notification object structure is different from Android and IOS
            console.log('Push message', notification);
            if( Platform.OS === 'ios' ){
              if( notification._alert.title != "New Message" ){
                Toast.show({
                  text: notification._alert.title+": "+notification._alert.body,
                  position: "bottom"
                });
              }
              // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
              notification.finish(PushNotificationIOS.FetchResult.NoData);
            }else{
              if( notification.title != "New Message" ){
                Toast.show({
                  text: notification.title+": "+notification.body,
                  position: "bottom"
                });
              }
            }
          });
          // if push token cached
          const cacheKey = 'push_tokenb49d4d5e7b364ec6bd034bf6796c829b';
          AsyncStorage.getItem(cacheKey).then((lastToken) => {
              if (lastToken){
                Auth.currentAuthenticatedUser().then(
                  user => {
                    Auth.updateUserAttributes(user, {
                      'custom:pushToken': lastToken,
                      'custom:os': Platform.OS.toString(),
                    }).then(
                      updatedUser => {
                        console.log(updatedUser);
                      }
                    ).catch(
                      err => {
                        console.log(err);
                      }
                    );
                  }
                );
              }else{
                // get the registration token
                PushNotification.onRegister((token) => {
                  console.warn('in app registration '+token);
                  Auth.currentAuthenticatedUser().then(
                    user => {
                      Auth.updateUserAttributes(user, {
                        'custom:pushToken': token,
                        'custom:os': Platform.OS.toString(),
                      }).then(
                        updatedUser => {
                          console.log(updatedUser);
                        }
                      ).catch(
                        err => {
                          console.log(err);
                        }
                      );
                    }
                  );
                });
              }
          });

          // Update locale
          Auth.currentAuthenticatedUser().then(
            user => {
              Auth.updateUserAttributes(user, {
                'locale': languageCode,
                'preferred_username': user.preferred_username ? user.preferred_username : user.username
              });
            }
          );
        }
        this.setState({
          image: data.attributes.picture && data && data.attributes ? data.attributes.picture : null,
          isLoading: false,
          isGuest: isGuest
        })
      }
    ).catch(
      error => {
        console.log(error);
      }
    );
  }
  render() {
    if ( this.state.isLoading ) {
      return (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10
          }}>
              <ActivityIndicator/>
          </View>
        );
    }else{
      const tabBarOnPress = ({ navigation, defaultHandler }) => {
        const { isFocused, state, goBack } = navigation;
        if( this.state.isGuest && ( state.key == 'Nachrichten' || state.key == 'Profil' ) ){
          Auth.signOut()
            .then(() => {
              this.props.onStateChange('signedOut');
            })
            .catch(err => console.log(err));
        }else{
          defaultHandler();
        }
      };
      const Tabs = createBottomTabNavigator({
        Home: HomeStack,
        Trending: TrendingStack,
        Nachrichten: MessageStack,
        Profil: ProfileStack,
      },
      {
        navigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Home') {
              iconName = 'Home_Nonselected';
            } else if (routeName === 'Trending') {
              iconName = 'Trending_Nonselected';
            } else if (routeName === 'Nachrichten') {
              iconName = 'message_nonselected';
            }
            if (routeName === 'Profil') {
              return <FastImage
                style={{ width: 25, height: 25, borderRadius: 12 }}
                source={
                  !this.state.image ? require('./assets/images/avatar.png') : 
                  {
                    uri: this.state.image,
                    priority: FastImage.priority.normal,
                  }
                }
                resizeMode={FastImage.resizeMode.cover}
              />
            }else{
              return <Icon name={iconName} size={25} color={tintColor} />;
            }
          },
          tabBarOnPress,
        }),
        tabBarOptions: {
          activeTintColor: '#EB7B3C',
          inactiveTintColor: '#373744',
          style: {
            backgroundColor: '#EDF1F4',
          },
        },
        backBehavior: 'none',
      });
      const client = new AWSAppSyncClient({
        disableOffline: true,
        url: AppSync.graphqlEndpoint,
        region: AppSync.region,
        auth: {
          type: "AMAZON_COGNITO_USER_POOLS",
          jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
        }
      });
      const WithProvider = () => (
        <Root>
          <ApolloProvider client={client}>
            <Rehydrated>
              <Tabs screenProps={ {logOut: this.props.onStateChange}}/>
            </Rehydrated>
          </ApolloProvider>
        </Root>
      );
      return <WithProvider />;
    }
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Video: VideoScreen,
  Shoot: VideoCapture,
  Edit: AddChallengeScreen,
  Search: SearchScreen,
  Followers: FollowersScreen,
  AllFollowers: AllFollowersScreen,
  ViewProfile: UserProfileScreen,
  LikedVideos: LikedVideosScreen,
  Login: MyLoading
});
HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let headerTransparent = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
    headerTransparent = true;
  }
  return {
    tabBarVisible,
    headerTransparent,
    title: I18n.get('Home')
  };
};
const TrendingStack = createStackNavigator({
  Trending: TrendingScreen,
  Video: VideoScreen
});
TrendingStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
    title: I18n.get('Trending')
  };
};
const MessageStack = createStackNavigator({
  Message: MessagesPage,
  Chat: ChatScreen,
  ViewProfile: UserProfileScreen
});
MessageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
    title: I18n.get('Messages')
  };
};
const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  EditProfile: EditProfileScreen,
  Followers: FollowersScreen,
  AllFollowers: AllFollowersScreen,
  LikedVideos: LikedVideosScreen,
  PayOutRequest: PayOutScreen,
  Video: VideoScreen,
});
ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
    title: I18n.get('Profile')
  };
};

function AuthenticatorHOC(App) {
  const AuthenticatorWrappedComponent = withAuthenticator(App, null, [
    <MySignIn key="MySignIn" />,
    <ConfirmSignIn key="ConfirmSignIn" />,
    <MyVerifyContact key="MyVerifyContact" />,
    <MySignUp key="MySignUp" />,
    <MyConfirmSignUp key="MyConfirmSignUp" />,
    <MyForgotPassword key="MyForgotPassword" />,
    <RequireNewPassword key="RequireNewPassword" />,
    <MyLoading key="MyLoading" />
  ]);
  return class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);
    }
    rerender = () => this.forceUpdate();
    render() {
      return (
        <AuthenticatorWrappedComponent
          theme={AuthTheme}
          {...this.props}
          rerender={this.rerender}
        />
      );
    }
  };
}

//export default InitialScreen;
// export default class AuthenticatorApp extends React.Component {
//   render() {
//     const WrappedApp = AuthenticatorHOC(InitialScreen);
//     return <WrappedApp {...this.props} />;
//   }
// }
export default props =>  {
  const WrappedApp = AuthenticatorHOC(InitialScreen);
  return <WrappedApp {...props} />;
}
