import React, { Component } from 'react';
import {
    ImageBackground,
    FlatList,
    Platform,
    NativeModules,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
import TimeAgo from './TimeAgo';
import {
    Container,
    Row,
    Content,
    Col,
    Thumbnail,
    Header,
    Title,
    Button,
    Text,
    ListItem,
    Item,
    Input,
    Left,
    Body,
    Right,
    StyleProvider,
    View
} from 'native-base';
import FastImage from 'react-native-fast-image';
import getTheme from '../native-base-theme/components';
import customStyle from '../native-base-theme/variables/platform';
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
var isGuest = false;

export default class SearchScreen extends Component {
    state = {
        refreshing: false,
        mode: 1,
        searchResult: [],
        s: "",
        input: "",
        myUsername: ''
    };
    input = "";
    timeout = null;
    constructor(props) {
        super(props);
        this.clearSearchInput = this.clearSearchInput.bind(this);
        this.refreshSearchResult = this.refreshSearchResult.bind(this);
        this.search = this.search.bind(this);
    }
    static navigationOptions = ({ navigation  }) => {
        return {
            tabBarVisible: true,
            header: null
        }
      }
    componentWillMount() {
        
    }
    componentWillUnmount() {
        clearTimeout(this.timeout);
    }
    componentDidUpdate(){
        
    }
    componentDidMount(){
        Auth.currentAuthenticatedUser().then(
            myUser => {
                if( myUser.username == 'Guest' && myUser.attributes.sub == 'cc84d13e-6f1c-4539-a741-73f59a9648ac' ){
                    isGuest = true;
                }
                this.setState({
                    myUsername: myUser.username
                });
            }
        );
    }
    clearSearchInput(){
        this.setState({
            s: '',
            input: '',
            searchResult: []
        })
    }
    search( s ){
        // if( this.state.refreshing){
        //     return;
        // }else if( !s ){
        //     this.setState({
        //         refreshing: false,
        //         searchResult: [],
        //         s: s
        //     })
        //     return;
        // }
        if( !s || s == "" || s == undefined ){
            this.setState({
                refreshing: false,
                searchResult: [],
                s: s
            })
            return;
        }
        const mode = this.state.mode;
        this.setState({
            refreshing: true,
            s: s,
            searchResult: [],
        })
        if( mode == 1 ){
            const path = "/videos?usersSearch="+this.state.s;
            API.get("videosCRUD", path)
            .then(
                data => {
                    this.setState({
                        searchResult: data.Users,
                        refreshing: false
                    });
                }
            ).catch(
                err => {
                    console.log(err);
                    this.setState({
                        refreshing: false
                    });
                }
            );
        }else if( mode == 2 ){
            const path = "/videos?category=all&s="+this.state.s;
            API.get("videosCRUD", path)
            .then(
                data => {
                    this.setState({
                        searchResult: data.hits.found > 0 ? data.hits.hit : [],
                        refreshing: false
                    });
                    console.log(data);
                }
            ).catch(
                err => {
                    console.log(err);
                    this.setState({
                        refreshing: false
                    });
                }
            );
        }else if( mode == 3 ){
            const path = "/videos?category=all&s=%23"+this.state.s;
            API.get("videosCRUD", path)
            .then(
                data => {
                    this.setState({
                        searchResult: data.hits.found > 0 ? data.hits.hit : [],
                        refreshing: false
                    });
                    console.log(data);
                }
            ).catch(
                err => {
                    console.log(err);
                    this.setState({
                        refreshing: false
                    });
                }
            );
        }
    }
    refreshSearchResult(){
        // NO to do
    }
    getPrefferedUsername(user){
        var prefferedusernameObj = user.Attributes.find(function (obj) { return obj.Name === 'preferred_username'; });
        return prefferedusernameObj ? prefferedusernameObj.Value : user.Username;
    }
    getUserAvatar(user){
        var avatarObj = user.Attributes.find(function (obj) { return obj.Name === 'picture'; });
        return avatarObj ? avatarObj.Value : undefined;
    }

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
                <Container style={{ flex: 1, ...Platform.select({
                        android: {
                            marginTop: StatusBar.currentHeight
                        }
                    }) }}>
                    <Header noShadow transparent style={{borderBottomWidth: 0}}>
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
                            }}>{I18n.get('Search')}</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <Item style={{
                        paddingHorizontal: 15,
                        borderBottomColor: "transparent"
                    }}>
                        <Input
                            placeholder={I18n.get('Write here...')}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            style={{
                                fontSize: 18,
                                fontWeight: "300",
                                fontStyle: "normal",
                                letterSpacing: -0.14,
                                color: "#000000"
                            }}
                            onChangeText={ (input) => {
                                this.input = input;
                                this.setState({input:input});
                                clearTimeout(this.timeout); // clears the old timer
                                this.timeout = setTimeout(() => this.search(this.input), 700);
                            } }
                            value={this.state.input}
                        />
                        <TouchableOpacity onPress={() => this.clearSearchInput()}>
                            <Icon name="close" size={18} />
                        </TouchableOpacity>
                    </Item>
                    <Item style={{
                        height: 34,
                        backgroundColor: "rgba(255, 255, 255, 0.83)",
                        paddingHorizontal: 20,
                        borderBottomColor: "transparent"
                    }}>
                        <Row>
                            <View style={{marginRight: 14}}>
                                <TouchableOpacity onPress={() => this.setState({ mode: 1, searchResult: [] }, () => this.search(this.state.s))}>
                                    <Text style={[
                                        {
                                            fontSize: 15,
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 1,
                                            color: "#2d3741"
                                        },
                                        this.state.mode == 1 ? {
                                            color: "#ED923D"
                                        }:{}
                                    ]}>{I18n.get('People')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginRight: 14}}>
                                <TouchableOpacity onPress={() => this.setState({ mode: 2, searchResult: [] }, () => this.search(this.state.s))}>
                                    <Text style={[
                                        {
                                            fontSize: 15,
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 1,
                                            color: "#2d3741"
                                        },
                                        this.state.mode == 2 ? {
                                            color: "#ED923D"
                                        }:{}
                                    ]}>{I18n.get('Challenges')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ mode: 3, searchResult: [] }, () => this.search(this.state.s))}>
                                    <Text style={[
                                        {
                                            fontSize: 15,
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 1,
                                            color: "#2d3741"
                                        },
                                        this.state.mode == 3 ? {
                                            color: "#ED923D"
                                        }:{}
                                    ]}>{I18n.get('Hashtags')}</Text>
                                </TouchableOpacity>
                            </View>
                        </Row>
                    </Item>
                    <Content>
                        <FlatList
                            style={{
                                minHeight: 100
                            }}
                            extraData={this.state}
                            keyExtractor={item => this.state.mode == 1 ? item.Username : item.id}
                            data={this.state.searchResult}
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshSearchResult}
                            renderItem={({item}) => this.state.mode == 1 ? (
                                isGuest && this.state.myUsername == item.Username ? null : <ListItem avatar>
                                    <Left>
                                        <TouchableOpacity onPress={() => this.state.myUsername == item.Username ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                                            user: item.Username
                                        })}>
                                            <FastImage
                                                style={{ width: 30, height: 30, borderRadius: 15 }}
                                                source={
                                                    this.getUserAvatar(item) ?
                                                    {
                                                        uri: this.getUserAvatar(item),
                                                        priority: FastImage.priority.normal
                                                    } : require('../assets/images/avatar.png')
                                                }
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                        </TouchableOpacity>
                                    </Left>
                                    <Body>
                                        <TouchableOpacity onPress={() => this.state.myUsername == item.Username ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                                                user: item.Username
                                        })}>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "normal",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                color: "#2c2c2c"
                                            }}>{ this.getPrefferedUsername(item) }</Text>
                                            <Text note style={{
                                                fontSize: 11,
                                                fontWeight: "normal",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                color: "#818488"
                                            }}>{item.Username}</Text>
                                        </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        {/* <Text note>+</Text> */}
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem avatar>
                                    <Left>
                                        <FastImage
                                            style={{ width: 30, height: 30, borderRadius: 15 }}
                                            source={
                                                item.fields.author[0] == '-' ?
                                                require('../assets/images/avatar.png') : 
                                                {
                                                    uri: item.fields.author[0],
                                                    priority: FastImage.priority.normal
                                                }
                                            }
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </Left>
                                    <Body>
                                        <TouchableOpacity onPress={() => item.fields.videofile[0] == '-' ? '':this.props.navigation.navigate('Video', {
                                            videoThumb: item.fields.videothumb[0] ? item.fields.videothumb[0] : '-',
                                            videoURL: item.fields.videofile[0],
                                            videoTitle: item.fields.title[0] ? item.fields.title[0] : '-',
                                            videoDescription: item.fields.description[0] ? item.fields.description[0] : '-',
                                            videoAuthor: item.fields.author[0],
                                            videoDate: Number.parseInt(item.fields.creationdate[0]),
                                            videoDeadline: Number.parseInt(item.fields.deadlinedate[0]),
                                            hasParent: item.fields.parent[0] == 'null' ? false : item.fields.parent[0],
                                            videoCategory: I18n.get('Search'),
                                            videoPayment: 0,
                                            challengeId: item.fields.challengeid[0],
                                            views: Number.parseInt(item.fields.views[0]),
                                            rating: Number.parseInt(item.fields.rating[0]),
                                            needUpdate: true,
                                            authorSub: item.fields.authorsub[0],
                                            authorusername: item.fields.authorusername[0]
                                        })}>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "normal",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                color: "#2c2c2c"
                                            }}>{item.fields.title[0]}</Text>
                                            <Text note style={{
                                                fontSize: 11,
                                                fontWeight: "normal",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                color: "#818488"
                                            }}><TimeAgo time={Number.parseInt(item.fields.creationdate[0])} /></Text>
                                        </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        {/* <Text note>+</Text> */}
                                    </Right>
                                </ListItem>
                            )}
                        />
                    </Content>
                </Container>
                </StyleProvider>
            </ImageBackground>
        );
    }
}