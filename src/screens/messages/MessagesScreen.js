import React, { Component } from 'react';
import { View, ImageBackground, Platform, NativeModules, StatusBar } from 'react-native';
import {
    Container,
    Header,
    Body,
    Title,
    StyleProvider,
} from 'native-base';
import { graphql, compose } from 'react-apollo';
import GetMe from '../../api/queries/GetMe';
import AboutMe from './AboutMe';
import getTheme from '../../library/native-base-theme/components';
import customStyle from '../../library/native-base-theme/variables/platform';
import ChatAddedSubscription from '../../api/subscriptions/ChatAddedSubscription';
import CreateConversation from '../../api/mutations/CreateConversation';

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
import Images from '../../config/Images';

export default class MessagesScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        console.log('Messages Page');
    }
    static navigationOptions = ({ navigation }) => {
        const {params = {}} = navigation.state;
        return {
            header: null,
            tabBarVisible: true,
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
                                }}>{I18n.get('Messages')}</Title>
                            </Body>
                        </Header>
                        <MyData navigation={this.props.navigation}/>
                    </Container>
                </StyleProvider>
                </View>
            </ImageBackground>
        );
    }
}
const MyData = compose(
    graphql(GetMe, {
        options: {
            fetchPolicy: 'cache-and-network'
        },
        props: (props) => ({
            me: props.data.me ? props.data.me : undefined,
            refetch: props.data.refetch,
            subscribeToNewChats: params => {
                props.data.me ?
                props.data.subscribeToMore({
                    document: ChatAddedSubscription,
                    variables: {
                        userId: props.data.me ? props.data.me.cognitoId : undefined
                    },
                    updateQuery: (prev, { subscriptionData: { data : { subscribeToNewUCs } } }) => {
                        props.data.refetch().then(
                            data => {
                                console.log("Refetch complete");
                                return data;
                            }
                        );
                    },
                }) : undefined;
            }
        })
    }),
    graphql(CreateConversation, {
        props: ({ mutate }) => ({
            createConversation: ({ createdAt, id, name }) =>
            mutate({
                variables: { createdAt, id, name },
            }),
        }),
    })
)(AboutMe);