import React from 'react';
import {
  ImageBackground,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Platform,
  StatusBar,
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import FastImage from 'react-native-fast-image';
import {
  Container,
  Row,
  Col,
  Grid,
  Header,
  Button,
  Text,
  StyleProvider,
  Left, Body, Right, Title,
  Form, Item, Input, Label, Textarea, Picker } from 'native-base';
import VideoAf from 'react-native-af-video-player';
import { BlurView } from 'react-native-blur';
import UUIDGenerator from 'react-native-uuid-generator';
import ImagePicker from 'react-native-image-picker';
import ProgressCircle from 'react-native-progress/Circle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getTheme from '../../library/native-base-theme/components';
import customStyle from '../../library/native-base-theme/variables/platform';
import TimeAgo from '../../components/TimeAgo';

import { I18n, Auth, API, Storage } from 'aws-amplify';
import * as mime from 'react-native-mime-types';
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
import Images from '../../config/Images';

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#3b3b48"
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
});

export default class AddChallengeScreen extends React.Component {
  _isMounted = false;

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
      thumbResponse: {},
      thumbnail: ''
    };
    this.share = this.share.bind(this);
    this.addChallenge = this.addChallenge.bind(this);
    this.setDate = this.setDate.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    Auth.currentAuthenticatedUser().then(
      data => {
        if (this._isMounted && data) {
          const userAttributes = data.attributes;
          this.setState({
            pp: userAttributes && userAttributes.picture ? userAttributes.picture : null,
            sub: data.signInUserSession.idToken.payload.sub,
            username: userAttributes.preferred_username ? userAttributes.preferred_username : data.username,
            isParent: this.props.navigation.getParam('parentChallengeId', '') ? true : false
          })
        }
      }
    );

    if( this.props.navigation.getParam('parentChallengeId', '') ){
      console.log( this.props.navigation.getParam('parentChallengeId', '') );
      const path = "/videos/object/"+this.props.navigation.getParam('parentChallengeId', '');
      API.get("videosCRUD", path)
        .then(
          challenge => {
            if (this._isMounted) {
              this.setState({
                parentVideo: challenge
              });
            }
          }
        ).catch(err => console.log(err));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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
        if (self._isMounted) {
          self.setState({
            progress: progress.loaded / progress.total,
          });
        }
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

  share() {
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
      maxWidth: 720,
      maxHeight: 1280,
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
        source={Images.ScreenBg}
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
                                  } : Images.Upload }
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