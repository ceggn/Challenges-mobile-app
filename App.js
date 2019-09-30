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
  NativeModules,
  Platform,
  Modal,
  StatusBar,
  Dimensions
} from 'react-native';

import { WebView } from "react-native-webview";
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator, createStackNavigator, SafeAreaView } from 'react-navigation';
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
  Form, Item, Input, Label } from 'native-base';
import VideoAf from 'react-native-af-video-player';
import { BlurView } from 'react-native-blur';
import UUIDGenerator from 'react-native-uuid-generator';
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';
import ProgressCircle from 'react-native-progress/Circle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getTheme from './src/library/native-base-theme/components';
import customStyle from './src/library/native-base-theme/variables/platform';
import TimeAgo from './src/components/TimeAgo';

import Amplify, { I18n, Auth, API, Storage, Hub } from 'aws-amplify';
import PushNotification from '@aws-amplify/pushnotification';
import * as mime from 'react-native-mime-types';
import aws_exports from './src/config/aws-exports';
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
// i18n
import cahallengesDict from './src/config/dictionary';
let moment = require('moment/min/moment-with-locales');
let locale = NativeModules.I18nManager.localeIdentifier;
if (Platform.OS === 'ios') {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
  if (locale === undefined) {
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    if (locale == undefined) {
      locale = 'en';
    }
  }
}
const languageCode = locale.substring(0, 2);
moment.locale(languageCode);
I18n.setLanguage(languageCode);
I18n.putVocabularies(cahallengesDict);
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './src/config/selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

import { ErrorRow, Loading, SignIn, SignUp, ConfirmSignUp, ConfirmSignIn, VerifyContact, ForgotPassword, RequireNewPassword, AmplifyTheme } from 'aws-amplify-react-native';

import { Client } from 'bugsnag-react-native';
const bugsnag = new Client("e1899735244c054012ec84f4e239defc");

import { withAuthenticator } from './src/components/customAuth';
import { LoginUsername, LoginPassword } from './src/components/custom-login-ui/FormElements';

const Win = Dimensions.get('window');

// AppSync
import AppSync from './src/config/AppSync.js';
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import Images from './src/config/Images';

//Pages
import MessageScreen from './src/screens/messages/MessagesScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import SearchScreen from './src/screens/search/SearchScreen';
import FollowersScreen from './src/screens/followers/FollowersScreen';
import AllFollowersScreen from './src/screens/allFollowers/AllFollowersScreen';
import LikedVideosScreen from './src/screens/likedVideosScreen/LikedVideosScreen';
import UserProfileScreen from './src/screens/userProfile/UserProfileScreen';
import PayOutScreen from './src/screens/payOut/PayOutScreen';
import VideoScreen from './src/screens/challenge/ChallengeScreen';
import VideoCapture from './src/screens/videoCapture/VideoCaptureScreen';
import AddChallengeScreen from './src/screens/addChallenge/AddChallengeScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

console.disableYellowBox = true;

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
    StatusBar.setHidden(true);
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
          source: Images.ImageBackground,
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
                    source: Images.LogoLarge,
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
          source: Images.ImageBackground,
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
          source: Images.ImageBackground,
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
            source: Images.ImageBackground,
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
          source: Images.ImageBackground,
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
    marginRight: 12,
  },
  trendingToChallenge: {
    width: 150,
    height: 30,
    marginRight: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignSelf: 'center',
  },
  trendingCardRating: {
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.16,
    textAlign: "left",
    color: "#373744",
    marginRight: 0,
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  blackButtonText: {
    height: 24,
    textAlign: 'center',
    color: "#ffffff"
  }
});

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
      hiddenVideos: [],
      _videoRef: [],
      currentVideoKey: null,
      activeTab: 'popular'
     };
     timeout = null;
     this._get_all_challenges = this._get_all_challenges.bind(this);
     this._get_challenges_by_cat = this._get_challenges_by_cat.bind(this);
     this._loadmore = this._loadmore.bind(this);
     this._loadmore_category = this._loadmore_category.bind(this);
     this.checkVisible = this.checkVisible.bind(this);
  }
  componentDidMount() {
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
  componentWillUnmount() {
    clearTimeout(this.timeout);
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
        this.props.navigation.navigate('Shoot');
      } else {
        this._storeUploadData();
        Alert.alert(
            I18n.get('Upload'),
            I18n.get('Upload a new challenge and let other people participate!'),
            [
              {
                text: I18n.get('Ok'), onPress: () => {
                  this.props.navigation.navigate('Shoot');
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
                let challengeData = data[0].filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } );
                if( this.state.filterOnlyLive ){
                  var currTime = new Date().valueOf();
                  challengeData = challengeData.filter( function(el) { return el.deadlineDate > currTime; } );
                }
                this.setState({
                  apiResponse: challengeData,
                  refreshing: false,
                  lastEvaluatedKey: data[1],
                  loadingMore: false
                });
                this._updateChallengeData(challengeData, 'apiResponse');
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
              data[0] = data[0].filter( function(el) { return el.deadlineDate > currTime; } );
            }
            let challengeData = [...this.state.apiResponse, ...data[0]].filter((elem, index, self) => self.findIndex(
              (t) => {return (t.challengeId === elem.challengeId)}) === index);
            this.setState({
              apiResponse: challengeData,
              refreshing: false,
              loadingMore: false,
              lastEvaluatedKey: data[1]
            });
            this._updateChallengeData(challengeData, 'apiResponse');
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
            if( this.state.filterOnlyLive ){
              var currTime = new Date().valueOf();
              filtered = filtered.filter( function(el) { return el.deadlineDate > currTime; } );
            }
            let challengeData = [...this.state[`${cat_name}`], ...filtered].filter((elem, index, self) => self.findIndex(
              (t) => {return (t.challengeId === elem.challengeId)}) === index);
            this.setState({
              [`${cat_name}`] : challengeData,
              [`${cat_name}refreshing`] : false,
              [`${cat_name}lastEvaluatedKey`]: data[1],
              [`${cat_name}loadingMore`]: false
            });
            this._updateChallengeData(challengeData, cat_name);
          }
        ).catch(err => console.log(err));
    }else{
      return;
    }
  }
  _get_challenges_by_cat(tab_id) {
    let cat_name = '';
    switch (tab_id) {
      case 0:
        this.state.activeTab = 'popular';
        break;
      case 1:
        this.state.activeTab = 'friends';
        cat_name = 'FRIENDS';
        break;
      case 2:
        this.state.activeTab = 'sport';
        cat_name = 'SPORT';
        break;
      case 3:
        this.state.activeTab = 'games';
        cat_name = 'GAMES';
        break;
      case 4:
        this.state.activeTab = 'music';
        cat_name = 'MUSIK';
        break;
      case 5:
        this.state.activeTab = 'live';
        cat_name = 'LIVE'
        break;
    }

    let self = this;
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
                let challengeData = data.filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId); } );
                if(this.state.filterOnlyLive) {
                  var currTime = new Date().valueOf();
                  challengeData = challengeData.filter( function(el) { return el.deadlineDate > currTime; } );
                }
                this.setState({
                  [`${cat_name}`] : challengeData,
                  [`${cat_name}refreshing`] : false,
                  [`${cat_name}loaded`] : true
                });
                this._updateChallengeData(challengeData, cat_name);
              }
            ).catch(err => console.log(err));
        }
      } else {
        if( !this.state[cat_name+'refreshing'] ){
          this.setState({
            [`${cat_name}refreshing`] : true
          });
          const path = "/videos?category="+cat_name;
          API.get("videosCRUD", path)
            .then(
              data => {
                let filtered = data[0].filter( function(el) { return !self.state.hiddenVideos.includes(el.challengeId) && el.parent == 'null'; });
                if( this.state.filterOnlyLive ){
                  var currTime = new Date().valueOf();
                  filtered = filtered.filter( function(el) { return el.deadlineDate > currTime; } );
                }
                let challengeData = filtered.filter((elem, index, self) => self.findIndex(
                  (t) => {return (t.challengeId === elem.challengeId)}) === index);
                this.setState({
                  [`${cat_name}`] : challengeData,
                  [`${cat_name}refreshing`] : false,
                  [`${cat_name}loaded`] : true,
                  [`${cat_name}lastEvaluatedKey`]: data[1],
                  [`${cat_name}loadingMore`]: false
                });
                this._updateChallengeData(challengeData, cat_name);
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
  
  _updateChallengeData = (challengeData, cat_name) => {
    for (let key in challengeData) {
      let challenge = challengeData[key];
      if (!challenge.preview && challenge.participants > 0) {
        this._getParticipantsImages(challenge.challengeId).then(videos => {
          let preview = [];
          let participants = 0;
          if(videos && videos.length > 0) {
            participants = videos.length;
            let sortedVideos = videos.sort(function(a, b) {
              return b.rating - a.rating;
            });
            sortedVideos.map(video => {
              if (video && preview.length < 3) {
                let thumb = video.userThumb;
                if (!thumb || thumb == '-') {
                  thumb = video.videoThumb;
                }
                if (thumb && thumb != '-') {
                  preview.push(thumb);
                }
              }
            });
          }
          challengeData[key]['preview'] = preview;
          challengeData[key]['participants'] = participants;
          console.log("cat_name", cat_name)
          this.setState({
            [`${cat_name}`] : challengeData,
          });
        })
      }
    }
  }

  _getParticipantsImages = (challengeId) => {
    return new Promise((resolve, reject) => {
      const challengersPath = `/videos?parent=${challengeId}`;
      API.get("videosCRUD", challengersPath).then(videos => {
        resolve(videos);
      });
    });
  }

  _challengeRender = ({item, index}, type) => {
    item.payment = 0;
    const videoUrl = item.videoFile && item.videoFile != '-' ? item.videoFile : '';
    if (!videoUrl || !item.approved) return;
    const thumb = item.userThumb && item.userThumb != '-' ? item.userThumb : (item.videoThumb && item.videoThumb != '-' ? item.videoThumb : '');
    return (
      <View>
        { ( Platform.OS === 'ios' && this.state.adsResponse && index % 2 === 0 && index != 0 && this.state.adsResponse[index/2-1] ) &&
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
          </View>
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
                          item.author == '-' ? Images.Avatar : 
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
                  <Text style={styles.trendingTitleDescriptionText}><TimeAgo time={item.creationDate} /> {I18n.get('by')+' '+item.authorUsername}</Text>
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
          <TouchableHighlight style={{backgroundColor: "#F7F8F8"}}>
            <VideoAf
              url={item.videoFile}
              placeholder={thumb}
              ref={ref => this.state._videoRef[`${type}-${index}`] = ref}
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
              lockRatio={9/16}
              style={{height: Win.height}}
            />
          </TouchableHighlight>
          <Grid style={styles.trendingCardFooter} >
            <Col>
            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center', justifyContent: 'flex-end'}}>
                {item.preview && item.preview.length !== 0 && item.preview.map((uri, index)=>(
                  <TouchableOpacity style={{ position: 'absolute', top: 0, left: index*10, flexDirection: 'row'}}
                    onPress={() => this._navigateVideoPage(item, index)}>
                      <FastImage
                        key={index}
                        style={{ width: 28, height: 28, borderRadius: 14, aspectRatio: 1}}
                        source={{uri: uri, priority: FastImage.priority.normal}}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.trendingToChallenge} 
                  onPress={() => this._navigateVideoPage(item, index)}>
                  <Text style={styles.blackButtonText}>{I18n.get('To the challenge')}</Text>
                </TouchableOpacity>
                <Text style={styles.trendingCardFooterText}>
                  <Icon name={'award1'} size={15} color={'#000000'} /> { item.participants ? item.participants : 0 }</Text>
                <Text style={styles.trendingCardFooterText}>
                  <Icon name={'chat'} size={15} color={'#000000'} /> { item.comments ? item.comments : 0 }</Text>
                <Text style={styles.trendingCardRating}>
                  <Icon name={'whatshot'} size={15} color={'#000000'} /> {item.rating}</Text>
              </View>
            </Col>
          </Grid>
        </View>
      </View>
    )
  }

  componentDidUpdate(prevProps) {
    clearTimeout(this.timeout);
    let self = this;
    this.timeout = setTimeout(() => {
      try {
        for (let key in self.state._videoRef) {
          if (self.state._videoRef[key]) {
            self.state._videoRef[key].pause();
          }
        }
        const newKey = self.state.currentVideoKey;
        if (self.state._videoRef[newKey]) {
          self.state._videoRef[newKey].play();
        }
      } catch (error) {
        bugsnag.notify(error);
      }
    }, 1000);
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    let videoItem = viewableItems[0];
    if (videoItem && videoItem.index >= 0) {
      const currentVideoKey = `${this.state.activeTab}-${videoItem.index}`;
      this.setState({currentVideoKey: currentVideoKey});
    }
  }

  _navigateVideoPage(item, index) {
    if (item.videoFile != '-') {
      const currentVideoKey = this.state.currentVideoKey;
      if (this.state._videoRef[currentVideoKey]) {
        this.state._videoRef[currentVideoKey].pause();
      }
      this.props.navigation.navigate('Video', {
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
      });
    }
  }

  render() {
    return (
      <ImageBackground
        source={Images.ScreenBg}
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
                    source={Images.Logo}
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
              <Tabs onChangeTab={({ i, ref, from })=> this._get_challenges_by_cat(i)} renderTabBar={()=> <ScrollableTab />} tabBarBackgroundColor={'transparent'}>
                <Tab heading={I18n.get('Popular')} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.apiResponse}
                    keyExtractor={item => item.challengeId}
                    initialNumToRender={3}
                    onEndReached={ () => this._loadmore()}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.refreshing}
                       onRefresh={ () => this._get_all_challenges()}
                      />
                    }
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({item, index}) => this._challengeRender({item, index}, 'popular')}
                  />
                </Tab>
                <Tab heading={I18n.get('Friends').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.FRIENDS}
                    keyExtractor={item => item.challengeId}
                    initialNumToRender={3}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.FRIENDSrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(1) }
                      />
                    }
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({item, index}) => this._challengeRender({item, index}, 'friends')}
                  />
                </Tab>
                <Tab heading={I18n.get('Sport').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.SPORT}
                    keyExtractor={item => item.challengeId}
                    initialNumToRender={3}
                    onEndReached={ () => this._loadmore_category('SPORT')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.SPORTrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(2) }
                      />
                    }
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({item, index}) => this._challengeRender({item, index}, 'sport')}
                  />
                </Tab>
                <Tab heading={I18n.get('Games').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.GAMES}
                    keyExtractor={item => item.challengeId}
                    initialNumToRender={3}
                    onEndReached={ () => this._loadmore_category('GAMES')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.GAMESrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(3) }
                      />
                    }
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({item, index}) => this._challengeRender({item, index}, 'games')}
                  />
                </Tab>
                <Tab heading={I18n.get('Music').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.MUSIK}
                    keyExtractor={item => item.challengeId}
                    initialNumToRender={3}
                    onEndReached={ () => this._loadmore_category('MUSIK')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.MUSIKrefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(4) }
                      />
                    }
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({item, index}) => this._challengeRender({item, index}, 'music')}
                  />
                </Tab>
                <Tab heading={I18n.get('Live').toUpperCase()} textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={this.state.LIVE}
                    keyExtractor={item => item.challengeId}
                    initialNumToRender={3}
                    onEndReached={ () => this._loadmore_category('LIVE')}
                    refreshControl={
                      <RefreshControl
                       refreshing={this.state.LIVErefreshing}
                       onRefresh={ () => this._get_challenges_by_cat(5) }
                      />
                    }
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({item, index}) => this._challengeRender({item, index}, 'live')}
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
          source={Images.placeholderAlt}
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
                Images.placeholderAlt1 :
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
        source={Images.ScreenBg}
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
        source={Images.ScreenBg}
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
                        !this.state.avatarSource ? Images.Avatar : 
                        {
                          uri: this.state.avatarSource,
                          priority: FastImage.priority.normal,
                        }
                      }
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <FastImage
                      style={{ top: 13, left: 20, width: 55, height: 55, position: 'absolute', zIndex:1 }}
                      source={Images.Oval}
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity onPress={this.getPhotos} style={{ top:40, left: 61, width: 17, height: 17, position: 'absolute', zIndex:3}}>
                    <FastImage
                        style={{ width: 17, height: 17 }}
                        source={Images.Plus}
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
    };
  }
  componentDidMount(){
    Auth.currentAuthenticatedUser().then(
      data => {
        if ( Platform.OS === 'ios' ) {
          PushNotification.initializeIOS();
        } else {
          PushNotification.initializeAndroid();
        }
        PushNotification.onNotification((notification) => {
          console.log('Push message', notification);
          if( Platform.OS === 'ios' ){
            if( notification._alert.title != "New Message" ){
              Toast.show({
                text: notification._alert.title+": "+notification._alert.body,
                position: "bottom"
              });
            }
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
        this.setState({
          image: data.attributes.picture && data && data.attributes ? data.attributes.picture : null,
          isLoading: false
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
        defaultHandler();
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
                  !this.state.image ? Images.Avatar : 
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
  Message: MessageScreen,
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

export default props =>  {
  const WrappedApp = AuthenticatorHOC(InitialScreen);
  return <WrappedApp {...props} />;
}
