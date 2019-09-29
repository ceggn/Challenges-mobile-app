import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  NativeModules,
  StatusBar
} from 'react-native';
import { Text, Button, Header, Left, Right, Container, Textarea, StyleProvider } from 'native-base';
import { API, Auth, I18n } from 'aws-amplify';
import UUIDGenerator from 'react-native-uuid-generator';
import { graphql, compose } from 'react-apollo';
import ListMessages from '../../api/queries/ListMessages';
import CreateUserConversations from '../../api/mutations/CreateUserConversations';
import CreateMessage from '../../api/mutations/CreateMessage';
import CreateConversation from '../../api/mutations/CreateConversation';
import MessageAddedSubscription from '../../api/subscriptions/MessagesAddedSubscription';
import Message from './message.component';
import FastImage from 'react-native-fast-image';

import getTheme from '../../library/native-base-theme/components';
import customStyle from '../../library/native-base-theme/variables/platform';

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
  container: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'column'
  },
  loading: {
    justifyContent: 'center'
  },
  containerI: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#f7f7f8'
  },
  inputContainerI: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  inputI: {
    backgroundColor: 'white',
    borderColor: '#dbdbdb',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderWidth: 1,
    color: 'black',
    height: 30,
    paddingHorizontal: 8
  },
  sendButtonContainerI: {
    paddingRight: 12,
    paddingVertical: 6,
    height: 80
  }
});
const createUserConversationMutation = graphql(CreateUserConversations, {
  props: ({ mutate }) => ({
    createUserConversation: ({ conversationId, userId }) =>
      mutate({
        variables: { conversationId, userId }
      })
  })
});
const ITEMS_PER_PAGE = 50;
const messagesQuery = graphql(ListMessages, {
  options: props => ({
    variables: {
      conversationId: props.navigation.state.params.conversationId,
      first: ITEMS_PER_PAGE
    },
    fetchPolicy: 'cache-and-network'
  }),
  props: props => ({
    conversation: props.data ? props.data.allMessageConnection : [],
    refetch: props.data.refetch,
    subscribeToNewMessages: params => {
      props.data.subscribeToMore({
        document: MessageAddedSubscription,
        variables: {
          conversationId: props.ownProps.navigation.state.params.conversationId
        },
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { subscribeToNewMessage }
            }
          }
        ) => {
          props.data.refetch().then(messages => {
            return messages;
          });
        }
      });
    }
  })
});
const createMessageMutation = graphql(CreateMessage, {
  props: ({ mutate }) => ({
    createMessage: ({ content, conversationId, createdAt, id, sub }) =>
      mutate({
        variables: { content, conversationId, createdAt, id, sub },
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            author: {
              __typename: 'User',
              username: 'Test'
            },
            content: content,
            conversationId: conversationId,
            createdAt: createdAt,
            id: 'some-id',
            isSent: false,
            recipient: {
              __typename: 'User',
              username: 'Test'
            },
            sender: sub
          }
        },
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          const conversationData = store.readQuery({
            query: ListMessages,
            variables: {
              conversationId: conversationId,
              first: ITEMS_PER_PAGE
            }
          });
          // Add our message from the mutation to the end.
          if (
            conversationData.allMessageConnection &&
            conversationData.allMessageConnection.messages[0] &&
            conversationData.allMessageConnection.messages[0]['id'] != createMessage.id
          ) {
            conversationData.allMessageConnection.messages.unshift(createMessage);
          }
          //Write our data back to the cache.
          store.writeQuery({
            query: ListMessages,
            variables: {
              conversationId: conversationId,
              first: ITEMS_PER_PAGE
            },
            data: conversationData
          });
        }
      })
  })
});
const createConversationMutation = graphql(CreateConversation, {
  props: ({ mutate }) => ({
    createConversation: ({ createdAt, id, name }) =>
      mutate({
        variables: { createdAt, id, name }
      })
  })
});

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      partnerPicture: undefined,
      partnerUsername: undefined,
      partnerPreferedName: undefined,
      text: '',
      checking: false,
      blockActive: true,
      firstMessage: false
    };
    this.sendUserConversation = this.sendUserConversation.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.send = this.send.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
  }
  static defaultProps = {
    conversation: [],
    subscribeToNewMessages: () => null
  };
  onEndReached() {}
  async send() {
    if (this.state.text) {
      let msg = this.state.text.replace(/\n{6}|\n{5}|\n{4}|\n{3}|\n{2}|\n/g, '\\n');
      this.setState({
        text: ''
      });
      if (this.props.navigation.state.params.firstMessage) {
        await this.sendUserConversation();
      }
      UUIDGenerator.getRandomUUID(uuid => {
        this.props
          .createMessage({
            conversationId: this.props.navigation.state.params.conversationId,
            content: msg,
            id: uuid,
            createdAt: new Date().valueOf(),
            sub: this.props.navigation.state.params.me.cognitoId
          })
          .then(data => {
            if (this.props.navigation.state.params.firstMessage) {
              this.props.navigation.state.params.firstMessage = false;
            } else {
              this.flatList.scrollToIndex({ index: 0, animated: true });
            }
          })
          .catch(e => {
            console.log(e);
          });
        this.props.createConversation({
          createdAt: new Date().valueOf(),
          id: this.props.navigation.state.params.conversationId,
          name: this.props.navigation.state.params.conversationName
        });
      });
    }
  }
  keyExtractor = item => item.id.toString();

  renderItem = ({ item }) => {
    let message = item;
    message.content = message.content.replace(/\\n/g, '\n');
    return (
      <Message
        isCurrentUser={this.props.navigation.state.params.me.cognitoId == message.sender ? true : false}
        avatar={
          this.props.navigation.state.params.partnerPicture
            ? this.props.navigation.state.params.partnerPicture
            : undefined
        }
        message={message}
        username={this.props.navigation.state.params.username ? this.props.navigation.state.params.username : undefined}
        navigation={this.props.navigation}
      />
    );
  };
  componentWillMount() {
    this.props.subscribeToNewMessages();
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser().then(data => {
      const path =
        '/blockedUsers?userSub=' +
        data.signInUserSession.idToken.payload.sub +
        '&blockedSub=' +
        this.props.navigation.state.params.sub;
      API.get('blockedUsersCRUD', path)
        .then(users => {
          console.log('Blocked Users', users);
          if (users.length < 1) {
            this.setState({
              blockActive: false
            });
          }
        })
        .catch(err => console.log(err));
    });
  }
  async sendUserConversation() {
    return new Promise((resolve, reject) => {
      this.props
        .createUserConversation({
          conversationId: this.props.navigation.state.params.conversationId,
          userId: this.props.navigation.state.params.me.cognitoId
        })
        .then(data1 => {
          this.props
            .createUserConversation({
              conversationId: this.props.navigation.state.params.conversationId,
              userId: this.props.navigation.state.params.sub
            })
            .then(data2 => {
              resolve(data2);
            })
            .catch(error2 => {
              console.log('Error2', error2);
              reject();
            });
        })
        .catch(error1 => {
          console.log('Error1', error1);
          reject();
        });
    });
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      tabBarVisible: true
    };
  };
  render() {
    const { conversation } = this.props;
    const { checking } = this.state;

    // render loading placeholder while we fetch messages
    if (checking || !conversation) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }
    // render list of messages for conversation
    return (
      <ImageBackground
        source={Images.ScreenBg}
        style={{
          flex: 1,
          width: null,
          height: null
        }}
      >
        <StyleProvider style={getTheme(customStyle)}>
          <Container
            style={{
              flex: 1,
              ...Platform.select({
                android: {
                  marginTop: StatusBar.currentHeight
                }
              })
            }}
          >
            <Header noShadow transparent style={{ borderBottomWidth: 0 }}>
              <StatusBar
                backgroundColor='#ED923D'
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
              />
              <Left>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
                </Button>
              </Left>
              <Right>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    letterSpacing: -0.24,
                    color: '#373744',
                    right: 40
                  }}
                >
                  {this.props.navigation.state.params.partnerPreferedName}
                </Text>
                <FastImage
                  style={{ width: 25, height: 25, borderRadius: 12, right: 15 }}
                  source={
                    this.props.navigation.state.params.partnerPicture
                      ? {
                          uri: this.props.navigation.state.params.partnerPicture,
                          priority: FastImage.priority.normal
                        }
                      : Images.Avatar
                  }
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Right>
            </Header>
            <FlatList
              ref={ref => {
                this.flatList = ref;
              }}
              inverted
              data={conversation.messages}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              ListEmptyComponent={<View />}
              onEndReached={this.onEndReached}
              style={{
                paddingTop: 15
              }}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              contentContainerStyle={styles.containerI}
              style={styles.containerI}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
              <View style={styles.containerI}>
                <View style={styles.inputContainerI}>
                  <Textarea
                    rowSpan={2}
                    ref={ref => {
                      this.textInput = ref;
                    }}
                    onChangeText={input =>
                      this.setState({
                        text: input
                      })
                    }
                    placeholder={I18n.get('Type your message here!')}
                    value={this.state.text}
                    style={{
                      width: '100%',
                      marginTop: 0,
                      color: '#373744',
                      paddingHorizontal: 4,
                      paddingTop: 12,
                      fontSize: 12,
                      backgroundColor: 'transparent'
                    }}
                  />
                </View>
                <View style={styles.sendButtonContainerI}>
                  <Button
                    small
                    light
                    full
                    disabled={this.state.blockActive}
                    onPress={this.send}
                    style={{
                      marginTop: 6,
                      borderRadius: 15,
                      backgroundColor: this.state.blockActive ? '#666666' : '#ED923D'
                    }}
                  >
                    <Text style={{ color: '#ffffff' }}>{I18n.get('Send')}</Text>
                  </Button>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Container>
        </StyleProvider>
      </ImageBackground>
    );
  }
}
export default compose(
  createUserConversationMutation,
  messagesQuery,
  createMessageMutation,
  createConversationMutation
)(ChatScreen);
