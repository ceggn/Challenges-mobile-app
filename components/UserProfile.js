import React, { Component } from 'react';
import {
  ImageBackground,
  SectionList,
  StyleSheet,
  View,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  Platform,
  NativeModules,
  StatusBar
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import {
  Row,
  Container,
  Header,
  Left,
  Right,
  Body,
  Col,
  Thumbnail,
  Grid,
  Button,
  StyleProvider,
  ActionSheet,
  Text, } from 'native-base';
import icoMoonConfig from './selection.json';
import getTheme from '../native-base-theme/components';
import customStyle from '../native-base-theme/variables/platform';
import TimeAgo from './TimeAgo';

import { Auth, API, I18n } from 'aws-amplify';

import cahallengesDict from '../dictionary';
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
      lineHeight: 22,
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
export default class UserProfileScreen extends Component {
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
          followLoading: true,
          following: false,
          followersNumber: 0,
          followingNumber: 0,
          videos: [],
          totalVideos: 0,
          likes: 0,
        }
        this._loadUser = this._loadUser.bind(this);
        this._follow = this._follow.bind(this);
        this._loadFollowers = this._loadFollowers.bind(this);
        this.showReportActions = this.showReportActions.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
      }
      showActionSheet(){
        var BUTTONS = [I18n.get('Report'), I18n.get('Block'), I18n.get('Cancel')];
        var CANCEL_INDEX = 2;
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: this.state.preferred_username
            },
            buttonIndex => {
                if( buttonIndex == 0 ){
                    // Report
                    this.showReportActions()
                }
                if( buttonIndex == 1 ){
                    // Block
                    Auth.currentAuthenticatedUser().then(
                      data => {
                        const path = "/blockedUsers";
                        let newBlockedUser = {
                            body: {
                                "blockedSub": this.state.sub,
                                "userSub": data.signInUserSession.idToken.payload.sub,
                            }
                        }
                        API.put("blockedUsersCRUD", path, newBlockedUser)
                        .then(
                            result => {
                                Alert.alert(
                                    I18n.get('Block'),
                                    I18n.get('The user has been blocked'),
                                )
                                this._follow(this.state.sub, true)
                            }
                        ).catch(err => console.log(err));                    
                      }
                    );
                }
            }
        )
      }
      showReportActions(){
        var REPORTBUTTONS = [ I18n.get('Abuse'), I18n.get('Inappropriate Content'), I18n.get('Spam'), I18n.get('Other'), I18n.get('Cancel')];
        var CANCEL_INDEX = 4;
        ActionSheet.show(
            {
                options: REPORTBUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: this.state.preferred_username,
                message: I18n.get('Select report reason'),
            },
            buttonIndex => {
                if( buttonIndex != CANCEL_INDEX ){
                    // Report has been chosen
                    const path = "/reports";
                    let newReport = {
                        body: {
                            "itemId": this.state.sub,
                            "itemType": "User",
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
      _videoRender({item, index}){
        return (
          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Grid>
              <Row>
                <Col style={{ width: 66 }}>
                    <TouchableHighlight onPress={() => item.videoFile == '-' ? '':this.props.navigation.navigate('Video', {
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
                      needUpdate: true,
                      authorSub: item.authorSub, authorUsername: item.authorUsername
                    })}
                  >
                    <FastImage
                      style={{ borderRadius: 3.7, width: null, height: null, aspectRatio: 1000 / 564 }}
                      source={
                        (item.userThumb == '-' || !item.userThumb) && item.videoThumb == '-' ?
                        require('../assets/images/placeholder-alt-1.jpg') :
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
                      style={{ width: 110, height: 110, borderRadius: 55, zIndex:2 }}
                      source={
                        this.state.avatar ? 
                        {
                            uri: this.state.avatar,
                            priority: FastImage.priority.normal
                        } : require('../assets/images/avatar.png')
                      }
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <FastImage
                      style={{ top: 29, width: 110, height: 110, position: 'absolute', zIndex:1 }}
                      source={require('../assets/images/oval.png')}
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
            <Row>
              <Col style={{paddingRight:5}}>
                <Button disabled={this.state.followLoading} onPress={() => this._follow( this.state.sub )} full style={{ marginTop: 20, height: 37, borderRadius: 18.5, backgroundColor: this.state.following ? 'rgb(237,146,61)' : '#fafbfc' }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0.39,
                    color: this.state.following ? "#ffffff" : "#373744"}}>{ this.state.followLoading ? I18n.get('Loading...') : this.state.following ? I18n.get('Following'):I18n.get('Follow') }</Text>
                </Button>
              </Col>
              <Col style={{paddingLeft:5}}>
                <Button onPress={() => this.props.navigation.navigate('Message', {
                  username: this.state.username,
                  sub: this.state.sub,
                  partnerPreferedName: this.state.preferred_username,
                  partnerPicture: this.state.avatar,
                  needToCheck: true
                })} full style={{ marginTop: 20, height: 37, borderRadius: 18.5, backgroundColor: '#2e3841' }}>
                <Text style={{
                    fontSize: 14,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0.39,
                    color: "#ffffff"}}>{I18n.get('Message')}</Text>
                </Button>
              </Col>
              <Col style={{ width: 30 }}>
                <TouchableOpacity onPress={() => this.showActionSheet() }>
                  <Text style={{
                      textAlign: 'center',
                      marginTop: 27,
                    }}>
                    <Icon name={'dots-horizontal-triple'} size={20} color={'#373744'} />
                  </Text>
                </TouchableOpacity>
              </Col>
            </Row>
            <Row style={{ marginTop: 22, marginBottom: 19 }}>
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
                <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                  <Text style={styles.profileCounter}>{ this.state.totalVideos }</Text>
                  <Text style={styles.profileCounterDescription}>{I18n.get('Videos').toUpperCase()}</Text>
                </View>
              </Col>
              <Col>
                <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                  <Text style={styles.profileCounter}>{ this.state.likes }</Text>
                  <Text style={styles.profileCounterDescription}>{I18n.get('Likes').toUpperCase()}</Text>
                </View>
              </Col>
            </Row>
          </Grid>
        </View>
        );
      }
      componentDidMount() {
        this._loadUser(this.props.navigation.getParam('user', ''));
      }
      componentDidUpdate(){
        if( this.props.navigation.getParam('needUpdate', '') ){
          this.props.navigation.setParams({
            needUpdate: false,
          });
          this.setState({
            username: undefined,
            sub: undefined,
            preferred_username: undefined,
            country: undefined,
            description: undefined,
            avatar: undefined,
            loading: true,
            followLoading: true,
            following: false,
            followersNumber: 0,
            followingNumber: 0,
            videos: [],
            totalVideos: 0,
            likes: 0,
          }, this._loadUser(this.props.navigation.getParam('user', '')))
        }
      }
      _loadUser(user){
        const path = "/videos?userName="+user;
        API.get("videosCRUD", path)
          .then(
            data => {
                console.log(data);
                var avatarObj = data[0].UserAttributes.find(function (obj) { return obj.Name === 'picture'; });
                var descriptionObj = data[0].UserAttributes.find(function (obj) { return obj.Name === 'profile'; });
                var countryObj = data[0].UserAttributes.find(function (obj) { return obj.Name === 'custom:country'; });
                var prefferedusernameObj = data[0].UserAttributes.find(function (obj) { return obj.Name === 'preferred_username'; });
                var subObj = data[0].UserAttributes.find(function (obj) { return obj.Name === 'sub'; });
                this._loadFollowers(subObj.Value);
                Auth.currentAuthenticatedUser().then(
                    currentUser => {
                        const myUserPath = "/Followers/object/"+currentUser.signInUserSession.idToken.payload.sub;
                        API.get("FollowersCRUD", myUserPath)
                        .then(
                            followers => {
                              var origVideos = data[1].filter( function(el) { return el.approved; } );
                              var videos = data[1].filter( function(el) { return el.approved; } );
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
                              if( followers.following && followers.following.values.indexOf( subObj.Value ) != -1 ){
                                this.setState({
                                    username: data[0].Username,
                                    sub: subObj.Value,
                                    preferred_username: prefferedusernameObj ? prefferedusernameObj.Value : data[0].Username,
                                    country: countryObj ? countryObj.Value : '-',
                                    description: descriptionObj ? descriptionObj.Value : '-',
                                    avatar: avatarObj ? avatarObj.Value : undefined,
                                    loading: false,
                                    following: true,
                                    followLoading: false,
                                    videos: videos,
                                    totalVideos: origVideos.length,
                                    likes: origVideos.length > 0 ? origVideos.reduce((prev,next) => prev + next.rating,0) : 0
                                });
                              }else{
                                  this.setState({
                                      username: data[0].Username,
                                      sub: subObj.Value,
                                      preferred_username: prefferedusernameObj ? prefferedusernameObj.Value : data[0].Username,
                                      country: countryObj ? countryObj.Value : '-',
                                      description: descriptionObj ? descriptionObj.Value : '-',
                                      avatar: avatarObj ? avatarObj.Value : undefined,
                                      loading: false,
                                      followLoading: false,
                                      videos: videos,
                                      totalVideos: origVideos.length,
                                      likes: origVideos.length > 0 ? origVideos.reduce((prev,next) => prev + next.rating,0) : 0
                                  });
                              }
                            }
                        ).catch(err => console.log(err));
                    }
                );
            }
          ).catch(err => console.log(err));
      }
      _follow(sub, unsubscribe = false){
        this.setState({
            followLoading: true
        });
        Auth.currentAuthenticatedUser().then(
            data => {
                const path = "/Followers";
                let newFollower = {
                    body: {
                        "userId": data.signInUserSession.idToken.payload.sub,
                        "following": sub,
                        "unfollow": unsubscribe ? unsubscribe : this.state.following
                    }
                }
                let newFollowing = {
                    body: {
                        "userId": sub,
                        "followers": data.signInUserSession.idToken.payload.sub,
                        "unfollow": unsubscribe ? unsubscribe : this.state.following
                    }
                }
                API.post("FollowersCRUD", path, newFollower)
                .then(
                    result => {
                        console.log(result);
                        this.setState({
                            following: unsubscribe ? false : !this.state.following,
                            followLoading: false
                        });
                    }
                ).catch(err => console.log(err));
                API.post("FollowersCRUD", path, newFollowing)
                .then(
                    result => {
                        console.log(result);
                        this._loadFollowers(sub);
                    }
                ).catch(err => console.log(err));
            }
        );
      }
      _loadFollowers(sub){
        const userPath = "/Followers/object/"+sub;
        API.get("FollowersCRUD", userPath)
        .then(
            followers => {
                this.setState({
                    followersNumber: followers.followers ? followers.followers.values.length : 0
                });
            }
        ).catch(err => console.log(err));
      }
      render() {
        return (
          <ImageBackground
            source={require('../assets/images/screen-bg.png')}
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
                    <Left>
                      <Button transparent onPress={() => this.props.navigation.goBack()}>
                          <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
                      </Button>
                    </Left>
                    <Body></Body>
                    <Right></Right>
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
                                <Text style={[styles.trendingTitleDescriptionText, {color: "#000000", textAlign: 'center'}] }>{I18n.get('This user does not have any videos yet')}</Text>
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
                      onRefresh={ () => this._loadUser(this.props.navigation.getParam('user', ''))}
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