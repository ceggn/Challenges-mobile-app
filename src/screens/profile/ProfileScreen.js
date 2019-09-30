import React from 'react';
import {
  ImageBackground,
  Alert,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  AsyncStorage,
  SectionList,
  NativeModules,
  Platform,
  StatusBar,
  PermissionsAndroid,
  CameraRoll,
} from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
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
  Left, Body, Right} from 'native-base';

import getTheme from '../../library/native-base-theme/components';
import customStyle from '../../library/native-base-theme/variables/platform';
import TimeAgo from '../../components/TimeAgo';

import { I18n, Auth, API } from 'aws-amplify';
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
});

export default class ProfileScreen extends React.Component {
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
    this._checkDownloadPermission = this._checkDownloadPermission.bind(this);
    this._loadUser = this._loadUser.bind(this);
    this._loadFollowers = this._loadFollowers.bind(this);
  }

  _checkDownloadPermission = async () => {
    if(Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
      } catch (err) {
        console.warn(err)
      }
    }
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
  downloadVideo(challengeId) {
    Alert.alert(
      I18n.get('Download Video?'),
      '',
      [
        {text: I18n.get('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: I18n.get('Ok'), onPress: () => {
          const path = "/videos/object/"+challengeId;
          API.get("videosCRUD", path)
          .then(
            result => {
              let destinationPath = `${RNFS.DocumentDirectoryPath}/${challengeId}.mp4`;
              console.log(result, destinationPath); 
              RNFS.downloadFile({
                fromUrl: result.videoFile,
                toFile: destinationPath,
              }).promise.then((r) => {
                console.log('video download complete', r);
                if(Platform.OS === 'android') {
                  destinationPath = `file://${destinationPath}`;
                }
                CameraRoll.saveToCameraRoll(destinationPath);
              });
            }
          ).catch(err => console.log(err));
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
                    Images.placeholderAlt1 :
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
              width: 32,
              paddingLeft: 6,
            }}>
              <Button onPress={() => this.downloadVideo(item.challengeId)} block bordered danger style={{
                height: 26,
                width: 26
              }}>
                <FontAwesomeIcon name='download' size={20} color={'#373744'} />
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
                <FontAwesomeIcon name='trash' size={14} style={{color: "#d88586"}} />
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
                    !this.state.avatar ? Images.Avatar : 
                    {
                      uri: this.state.avatar,
                      priority: FastImage.priority.normal,
                    }
                  }
                  resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                  style={{ top: 29, width: 110, height: 110, position: 'absolute', zIndex:1 }}
                  source={Images.Oval}
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
    this._checkDownloadPermission();
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
        source={Images.ScreenBg}
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