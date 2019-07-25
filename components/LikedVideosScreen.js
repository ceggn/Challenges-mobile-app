import React, { Component } from 'react';
import {
    ImageBackground,
    FlatList,
    View,
    TouchableHighlight,
    Image,
    StyleSheet,
    Platform,
    NativeModules,
    StatusBar
} from 'react-native';
import getTheme from '../native-base-theme/components';
import customStyle from '../native-base-theme/variables/platform';
import FastImage from 'react-native-fast-image';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';
import TimeAgo from './TimeAgo';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
import { API, I18n } from 'aws-amplify';
import {
    Container,
    Content,
    Grid,
    Row,
    Col,
    Header,
    Left,
    Right,
    Body,
    Title,
    Text,
    Button,
    StyleProvider
} from 'native-base';
import cahallengesDict from '../dictionary';
if( Platform.OS === 'ios' ){
  var locale = NativeModules.SettingsManager.settings.AppleLocale;
}else{
  var locale = NativeModules.I18nManager.localeIdentifier;
}
var languageCode = locale.substring(0, 2);
I18n.setLanguage(languageCode);
I18n.putVocabularies(cahallengesDict);

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
      lineHeight: 22,
      letterSpacing: -0.05,
      textAlign: "left",
      color: "#9b9b9b"
    }
});

export default class LikedVideosScreen extends Component {
    state = {
        refreshing: true,
        result: [],
    };
    constructor(props) {
        super(props);
        this._loadLikedVideos = this._loadLikedVideos.bind(this);
        this._loadVideo = this._loadVideo.bind(this);
    }
    componentDidMount(){
        this._loadLikedVideos();
    }
    _loadVideo( challengeId ){
        if( !challengeId ){
            return
        }
        const path = "/videos/object/"+challengeId;
        API.get("videosCRUD", path)
            .then(
            challenge => {
                if(challenge){
                    this.setState(
                        {
                            result: [...this.state.result, challenge]
                        }
                    );
                }
            }
            ).catch(err => console.log(err));
    }
    _loadLikedVideos(){
        if( !this.state.refreshing ){
            this.setState({
                refreshing: true
            });
        }
        const path = "/likes";
        API.get("likesCRUD", path)
        .then(
            async (likes) => {
                if( likes.length > 0 ){
                    likes.map( async likeData => {
                        await this._loadVideo( likeData.challengeId );
                    });
                    this.setState({
                        refreshing: false
                    });
                }else{
                    this.setState({
                        refreshing: false
                    });
                }
            }
        ).catch(err => console.log(err));
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
                      videoCategory: 'Profile',
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
              </Row>
            </Grid>
          </View>
        );
    }
    static navigationOptions = ({ navigate, navigation }) => ({
        header: null,
        tabBarVisible: true,
    });
    // static navigationOptions = ({ navigation  }) => {
    //     return {
    //       headerLeft: (
    //         <Button transparent onPress={() => navigation.goBack()}>
    //             <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
    //         </Button>
    //       ),
    //       tabBarVisible: true,
    //       headerTransparent: true,
    //       headerStyle: {
    //         borderBottomWidth: 0,
    //       },
    //       headerTintColor: '#ED923D',
    //       headerTitleStyle: { color: '#373744' },
    //       title: "Followers"
    //     }
    // }

    render() {
        return (
            <ImageBackground
                source={require('../assets/images/screen-bg.png')}
                style={{
                flex: 1,
                width: null,
                height: null,
            }}>
                <StyleProvider style={getTheme(customStyle)}>
                <Container style={{...Platform.select({
                    android: {
                        marginTop: StatusBar.currentHeight
                    }
                })}}>
                    <Header noShadow transparent style={{borderBottomWidth: 0}}>
                        <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#373744' }}>{I18n.get('Liked Videos')}</Title>
                        </Body>
                        <Right>

                        </Right>
                    </Header>
                    <Content>
                        <FlatList
                            style={{
                                minHeight: 100
                            }}
                            extraData={this.state}
                            keyExtractor={item => item.challengeId}
                            data={this.state.result}
                            refreshing={this.state.refreshing}
                            onRefresh={ () => this._loadLikedVideos()}
                            renderItem={this._videoRender.bind(this)}
                            ListEmptyComponent={
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text style={[styles.trendingTitleDescriptionText, {color: "#000000"}] }>{I18n.get('You do not have any liked videos yet')}</Text>
                                </View>
                            }
                        />
                    </Content>
                </Container>
                </StyleProvider>
            </ImageBackground>
        );
    }
}