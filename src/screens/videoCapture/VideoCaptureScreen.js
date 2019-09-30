import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Platform,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  Container,
  Row,
  Col,
  Grid,
  Button,
  StyleProvider,
} from 'native-base';
import { RNCamera } from 'react-native-camera';
import { BlurView } from 'react-native-blur';
import getTheme from '../../library/native-base-theme/components';
import customStyle from '../../library/native-base-theme/variables/platform';

import { I18n } from 'aws-amplify';
import cahallengesDict from '../../config/dictionary';
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
import icoMoonConfig from '../../config/selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const styles = StyleSheet.create({
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
});

export default class VideoCapture extends React.Component {
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
        quality: RNCamera.Constants.VideoQuality["480p"],
        flashMode: this.state.isTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off,
        type: this.state.isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back,
        orientation: 'portrait'
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
            console.log('Video Recorded: ' + JSON.stringify(data));
            if (data.uri) {
              this.setState({
                isRecording: false,
                videoURL: data.uri
              });
              this.props.navigation.navigate('Edit', {
                videoURL: data.uri,
                parentChallengeId: this.props.navigation.getParam('parent', '')
              });
            }
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