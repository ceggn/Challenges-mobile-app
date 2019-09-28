import React from 'react';
import {
  ImageBackground,
  Alert,
  FlatList,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  AsyncStorage,
  Platform,
  NativeModules,
  StatusBar,
  Dimensions
} from 'react-native';
import {
  Container,
  Row,
  Col,
  Grid,
  Header,
  Button,
  Text,
  StyleProvider,
  ActionSheet,
  Left, Body, Right, Title,
  Form, Item, Label, Textarea } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import VideoAf from 'react-native-af-video-player';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getTheme from '../../library/native-base-theme/components';
import customStyle from '../../library/native-base-theme/variables/platform';
import TimeAgo from '../../components/TimeAgo';

import { Auth, API, I18n } from 'aws-amplify';
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
const Win = Dimensions.get('window');

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
  trendingCardFooterText: {
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.16,
    textAlign: "left",
    color: "#373744",
    marginRight: 15,
  },
  profileCounterDescription: {
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    marginTop: 7,
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

export default class VideoScreen extends React.Component {
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
      liking: false,
      parentVideoTitle: ''
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
    if (this.player) {
      this.player.pause();
    }
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
      commentsView: this.props.navigation.getParam('hasParent', '')? true : false,
      parentVideoTitle: this.props.navigation.getParam('videoTitle', ''),
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
    this._setLike(!this.state.liked, this.state.rating, true)
    let self = this;
    if ( self.state.liked) {
      const path = "/likes/object/"+challengeId;
      API.del("likesCRUD", path).then(like => {
        const rating = self.state.rating == 0 ? 0 : (self.state.rating - 1)
        self._setLike(self.state.liked, rating);
      }).catch(err =>  {
        console.log(err);
        self._setLike(!self.state.liked, self.state.rating);
      });
    } else {
      const path = "/likes";
      API.put("likesCRUD", path, {
        body: {
          "challengeId": challengeId
        }
      }).then(like => {
        const rating = self.state.rating + 1;
        self._setLike(self.state.liked, rating);
      }).catch(err => {
        console.log(err);
        self._setLike(!self.state.liked, self.state.rating);
      });
    }
  }

  _setLike(liked, rating, liking = false) {
    this.setState({
      liked: liked,
      rating: rating,
      liking: liking
    });
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
    if (item && item.videoFile !== '-') {
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
        authorUsername: item.authorUsername,
        parentVideoTitle: this.state.parentVideoTitle
      });
    }
  }
  _videoRender({item, index}){
    return (
      <View style={{ marginTop: 20, paddingHorizontal: 0 }}>
        <Grid>
          <Row>
            <Col style={{ width: 46, justifyContent: 'center' }}>
              { item.place == 1 && <FontAwesomeIcon name='trophy' size={35} color='#D6AF36' style={{
                position: 'absolute',
                top: '50%',
                marginTop: -12,
                left: 6
              }} />}
              { item.place == 2 && <FontAwesomeIcon name='trophy' size={35} color='#A7A7AD' style={{
                position: 'absolute',
                top: '50%',
                marginTop: -12,
                left: 6
              }} />}
              { item.place == 3 && <FontAwesomeIcon name='trophy' size={35} color='#824A02' style={{
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
                        require('../../assets/images/placeholder-alt-1.jpg') :
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
                        item.author == '-' ? require('../../assets/images/avatar.png') : 
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
                    !item.avatar || item.avatar == '-' ? require('../../assets/images/avatar.png') : 
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
    const parentVideoTitle = navigation.getParam('parentVideoTitle', '');
    const videoDescription = navigation.getParam('videoDescription', '');
    const videoAuthor = navigation.getParam('videoAuthor', '');
    const videoDate = navigation.getParam('videoDate', '');
    const videoDeadline = navigation.getParam('videoDeadline', '');
    const videoCompleted = navigation.getParam('videoCompleted', '');
    const userThumb = navigation.getParam('userThumb', '');
    const videoPayment = 0;
    const challengeId = navigation.getParam('challengeId', '');
    const authorUsername = navigation.getParam('authorUsername', '');
    var currentDate = new Date().valueOf();
    return (
      <ImageBackground
        source={require('../../assets/images/screen-bg.png')}
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
            <KeyboardAwareScrollView>
              { this.state.videoExpanded ? <Grid></Grid>:
              <Grid style={styles.trendingCardHeader} >
                { !this.state.hasParent ? <Row></Row>:
                <Row>
                  <Col style={{ marginLeft: 50, marginBottom: 16}}>
                    <TouchableOpacity onPress={() => {}}>
                      <Text style={styles.trendingTitleText}>{parentVideoTitle}</Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
                }
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
                            videoAuthor == '-' ? require('../../assets/images/avatar.png') : 
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
                  placeholder={userThumb ? userThumb: videoThumb}
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
                  lockRatio={9/16}
                  style={{height: Win.height}}
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
                      <Text style={styles.blackButtonText}>
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
