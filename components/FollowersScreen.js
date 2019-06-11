import React, { Component } from 'react';
import {
    ImageBackground,
    FlatList,
    View,
    Alert,
    TouchableOpacity,
    Platform,
    NativeModules,
    StatusBar,
    StyleSheet
} from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
import { API, Auth, I18n} from 'aws-amplify';
import getTheme from '../native-base-theme/components';
import customStyle from '../native-base-theme/variables/platform';
import Loader from './Loader';
import {
    Container,
    Content,
    Grid,
    Row,
    Col,
    Thumbnail,
    Header,
    Button,
    Text,
    ListItem,
    Title,
    Item,
    Input,
    Left,
    Body,
    Right,
    ActionSheet,
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
    trendingTitleDescriptionText: {
      opacity: 0.8,
      fontSize: 10,
      fontWeight: "normal",
      fontStyle: "normal",
      lineHeight: 22,
      letterSpacing: -0.05,
      textAlign: "center",
      color: "#9b9b9b"
    }
});

export default class FollowersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            loading: false,
            myUsername: "",
            result: [],
        };
        this._loadFollowers = this._loadFollowers.bind(this);
        this.showReportActions = this.showReportActions.bind(this);
    }
    componentDidMount(){
        Auth.currentAuthenticatedUser().then(
            myUser => {
                this.setState({
                    myUsername: myUser.username
                });
            }
        );
        this._loadFollowers(this.props.navigation.getParam('sub', ''));
    }
    _loadFollowers(sub){
        if( !this.state.refreshing ){
            this.setState({
                refreshing: true
            });
        }
        const userPath = "/Followers/object/"+sub+"?all=1";
        API.get("FollowersCRUD", userPath)
        .then(
            followers => {
                console.log('Following', followers);
                this.setState({
                    result: Object.keys(followers).length === 0 && followers.constructor === Object ? [] : followers,
                    refreshing: false
                });
            }
        ).catch(err => console.log(err));
    }
    getPrefferedUsername(user){
        var prefferedusernameObj = user.Attributes.find(function (obj) { return obj.Name === 'preferred_username'; });
        return prefferedusernameObj ? prefferedusernameObj.Value : user.Username;
    }
    getUserAvatar(user){
        var avatarObj = user.Attributes.find(function (obj) { return obj.Name === 'picture'; });
        return avatarObj ? avatarObj.Value : undefined;
    }
    getUserSub(user){
        var subObj = user.Attributes.find(function (obj) { return obj.Name === 'sub'; });
        return subObj ? subObj.Value : undefined;
    }
    showActionSheet(user){
        var BUTTONS = [I18n.get('Report'), I18n.get('Block'), I18n.get('Cancel')];
        var CANCEL_INDEX = 2;
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: this.getPrefferedUsername(user)
            },
            buttonIndex => {
                if( buttonIndex == 0 ){
                    // Report
                    this.showReportActions(user)
                }
                if( buttonIndex == 1 ){
                    // Block
                    const path = "/blockedUsers";
                    let newBlockedUser = {
                        body: {
                            "blockedSub": this.getUserSub(user),
                            "userSub": this.props.navigation.getParam('sub', ''),
                        }
                    }
                    API.put("blockedUsersCRUD", path, newBlockedUser)
                    .then(
                        result => {
                            Alert.alert(
                                I18n.get('Block'),
                                I18n.get('The user has been blocked'),
                            )
                            this._unfollow(this.getUserSub(user))
                        }
                    ).catch(err => console.log(err));
                }
            }
        )
    }
    _unfollow(sub){
        Auth.currentAuthenticatedUser().then(
            data => {
                const path = "/Followers";
                let newFollower = {
                    body: {
                        "userId": data.signInUserSession.idToken.payload.sub,
                        "following": sub,
                        "unfollow": true
                    }
                }
                let newFollowing = {
                    body: {
                        "userId": sub,
                        "followers": data.signInUserSession.idToken.payload.sub,
                        "unfollow": true
                    }
                }
                API.post("FollowersCRUD", path, newFollower)
                .then(
                    result => {
                        console.log(result);
                        this._loadFollowers(this.props.navigation.getParam('sub', ''));
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                );
                API.post("FollowersCRUD", path, newFollowing)
                .then(
                    result => {
                        console.log(result);
                    }
                ).catch(err => console.log(err));
            }
        );
    }
    showReportActions(user){
        var REPORTBUTTONS = [ I18n.get('Abuse'), I18n.get('Inappropriate Content'), I18n.get('Spam'), I18n.get('Other'), I18n.get('Cancel')];
        var CANCEL_INDEX = 4;
        ActionSheet.show(
            {
                options: REPORTBUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: this.getPrefferedUsername(user),
                message: I18n.get('Select report reason'),
            },
            buttonIndex => {
                if( buttonIndex != CANCEL_INDEX ){
                    // Report has been chosen
                    const path = "/reports";
                    let newReport = {
                        body: {
                            "itemId": this.getUserSub(user),
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
    static navigationOptions = ({ navigation  }) => {
        return {
            header: null,
            tabBarVisible: true,
        }
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
                            <Title style={{ color: '#373744' }}>{I18n.get('Following')}</Title>
                        </Body>
                        <Right>

                        </Right>
                    </Header>
                    <Content>
                    <Loader loading={this.state.loading} />
                        <FlatList
                            style={{
                                minHeight: 100
                            }}
                            extraData={this.state}
                            keyExtractor={item => item.Username}
                            data={this.state.result}
                            refreshing={this.state.refreshing}
                            onRefresh={ () => this._loadFollowers(this.props.navigation.getParam('sub', ''))}
                            ListEmptyComponent={
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text style={[styles.trendingTitleDescriptionText, {color: "#000000"}] }>{I18n.get('There is no data')}</Text>
                                </View>
                            }
                            renderItem={({item}) =>
                                <ListItem avatar>
                                    <Left>
                                        <TouchableOpacity onPress={() => this.state.myUsername == item.Username ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                                            user: item.Username,
                                            needUpdate: true
                                        })}>
                                            <Thumbnail small style={{ width: 30, height: 30, borderRadius: 15}}  source={ this.getUserAvatar(item) ? { uri: this.getUserAvatar(item) } : require('../assets/images/avatar.png') } />
                                        </TouchableOpacity>
                                    </Left>
                                    <Body>
                                        <TouchableOpacity onPress={() => this.state.myUsername == item.Username ? this.props.navigation.navigate('Profile') : this.props.navigation.navigate('ViewProfile', {
                                            user: item.Username,
                                            needUpdate: true
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
                                        <TouchableOpacity onPress={() => this.showActionSheet(item) }>
                                            <Text style={{
                                                textAlign: 'center',
                                                paddingTop: 6
                                                }}>
                                                <Icon name={'dots-horizontal-triple'} size={20} color={'#373744'} />
                                            </Text>
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>
                            }
                        />
                    </Content>
                </Container>
                </StyleProvider>
            </ImageBackground>
        );
    }
}