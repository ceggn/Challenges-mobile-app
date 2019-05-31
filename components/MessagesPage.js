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
//import update from 'immutability-helper';
import GetMe from '../queries/GetMe';
import AboutMe from './AboutMe';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';
import getTheme from '../native-base-theme/components';
import customStyle from '../native-base-theme/variables/platform';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
import ChatAddedSubscription from '../subscriptions/ChatAddedSubscription';
import CreateConversation from '../mutations/CreateConversation';

import { I18n } from 'aws-amplify';
import cahallengesDict from '../dictionary';
if( Platform.OS === 'ios' ){
  var locale = NativeModules.SettingsManager.settings.AppleLocale;
}else{
  var locale = NativeModules.I18nManager.localeIdentifier;
}
var languageCode = locale.substring(0, 2);
I18n.setLanguage(languageCode);
I18n.putVocabularies(cahallengesDict);

export default class MessagesPage extends Component {
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
                source={require('../assets/images/screen-bg.png')}
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
                        // const newConversation = subscribeToNewUCs;
                        // return update(prev, {
                        //     me: {
                        //         conversations: {
                        //             userConversations: {
                        //                 $unshift: [newConversation],
                        //             },
                        //         },
                        //     },
                        // });
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