import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Row, Col, Grid, Text } from 'native-base';
import { API } from 'aws-amplify';
import SingleMessage from './single.message.component';
import FastImage from 'react-native-fast-image';
import Images from '../../config/Images';

const styles = StyleSheet.create({
  userName: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#373744',
    marginBottom: 3
  },
  conversationBorder: {
    height: 1,
    opacity: 0.18,
    backgroundColor: '#979797',
    marginTop: 15,
    marginBottom: 0
  }
});

export default class AboutMe extends Component {
  state = {
    username: undefined,
    sub: undefined,
    preferred_username: undefined,
    avatar: undefined,
    refreshing: false
  };

  constructor(props) {
    super(props);
    this.getUserAvatar = this.getUserAvatar.bind(this);
    this.getUserName = this.getUserName.bind(this);
    this.getAvatar = this.getAvatar.bind(this);
    this.getPrefferedName = this.getPrefferedName.bind(this);
    this.sendConversation = this.sendConversation.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  sendConversation(conversationId = false) {
    this.props
      .createConversation({
        createdAt: new Date().valueOf(),
        id: conversationId ? conversationId : this.props.me.cognitoId + '-' + this.props.navigation.state.params.sub,
        name: this.props.navigation.state.params.partnerPreferedName
      })
      .then(data => {
        this.props.navigation.navigate('Chat', {
          username: this.props.navigation.state.params.username,
          sub: this.props.navigation.state.params.sub,
          partnerPreferedName: this.props.navigation.state.params.partnerPreferedName,
          partnerPicture: this.props.navigation.state.params.partnerPicture,
          firstMessage: true,
          me: this.props.me,
          conversationId: conversationId
            ? conversationId
            : this.props.me.cognitoId + '-' + this.props.navigation.state.params.sub,
          conversationName: this.props.navigation.state.params.partnerPreferedName
        });
      })
      .catch(error => console.log('Create converstion error', error));
  }

  componentWillMount() {
    this.props.subscribeToNewChats();
  }

  componentDidUpdate() {
    if (this.props.navigation.getParam('needToCheck', '')) {
      if (!this.props.me) {
        this.props.subscribeToNewChats();
        return;
      }
      var myID = this.props.me.cognitoId;
      var partnerID = this.props.navigation.state.params.sub;
      if (this.props.me && this.props.me.conversations) {
        var chat = this.props.me.conversations.userConversations.find(function(chat) {
          return chat.conversationId === myID + '-' + partnerID || chat.conversationId === partnerID + '-' + myID;
        });
      }
      if (!chat) {
        this.props.navigation.setParams({
          needToCheck: false
        });
        this.sendConversation();
      } else if (chat.conversationId && !chat.associated) {
        this.props.navigation.setParams({
          needToCheck: false
        });
        this.sendConversation(chat.conversationId);
      } else {
        this.props.navigation.setParams({
          needToCheck: false
        });
        this.sendConversation(chat.conversationId);
      }
    }
  }

  refresh() {
    this.setState({
      refreshing: true
    });
    this.props.refetch();
    this.setState({
      refreshing: false
    });
  }

  getUserName(sub) {
    if (this.state[sub]) {
      return this.state[sub]['username'];
    } else {
      return false;
    }
  }

  getAvatar(sub) {
    if (this.state[sub]) {
      return this.state[sub]['avatar'];
    } else {
      return false;
    }
  }

  getPrefferedName(sub) {
    if (this.state[sub]) {
      return this.state[sub]['name'];
    } else {
      return false;
    }
  }

  getUserAvatar(sub) {
    if (this.state[sub]) {
      return this.state[sub]['avatar'];
    } else {
      const path = '/videos?userSub=' + sub;
      API.get('videosCRUD', path)
        .then(data => {
          var avatarObj = data.Attributes.find(function(obj) {
            return obj.Name === 'picture';
          });
          var prefferedusernameObj = data.Attributes.find(function(obj) {
            return obj.Name === 'preferred_username';
          });
          this.setState({
            [`${sub}`]: {
              avatar: avatarObj ? avatarObj.Value : undefined,
              name: prefferedusernameObj ? prefferedusernameObj.Value : data.Username,
              username: data.Username
            }
          });
          return avatarObj ? avatarObj.Value : undefined;
        })
        .catch(err => console.log(err));
    }
  }

  _conversationRender(item) {
    let userId =
      item.associated[0].userId == this.props.me.cognitoId ? item.associated[1].userId : item.associated[0].userId;

    return (
      <TouchableOpacity
        style={{ paddingHorizontal: 16 }}
        onPress={() =>
          this.props.navigation.navigate('Chat', {
            username: this.getUserName(userId),
            sub: userId,
            partnerPreferedName: this.getPrefferedName(userId),
            partnerPicture: this.getAvatar(userId),
            me: this.props.me,
            conversationId: item.conversationId,
            conversationName: this.getPrefferedName(userId)
          })
        }
      >
        <Grid style={{ paddingVertical: 11 }}>
          <Row>
            <Col style={{ width: 51 }}>
              <FastImage
                style={{ width: 42, height: 42, borderRadius: 21 }}
                source={
                  this.getUserAvatar(userId)
                    ? {
                        uri: this.getAvatar(userId),
                        priority: FastImage.priority.normal
                      }
                    : Images.Avatar
                }
                resizeMode={FastImage.resizeMode.cover}
              />
            </Col>
            <Col>
              <Text style={styles.userName}>{this.getPrefferedName(userId)}</Text>
              <SingleMessage conversationId={item.conversationId} />
            </Col>
          </Row>
          <Row style={styles.conversationBorder} />
        </Grid>
      </TouchableOpacity>
    );
  }
  render() {
    let conversations =
      this.props.me && this.props.me.conversations ? this.props.me.conversations.userConversations : [];
    if (conversations.length > 0) {
      conversations = conversations.sort((a, b) => {
        return b.conversation.createdAt - a.conversation.createdAt;
      });
    }
    return (
      <FlatList
        keyExtractor={item => item.conversationId.toString()}
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
        data={conversations}
        renderItem={({ item }) => this._conversationRender(item)}
        ref={ref => (this.flatList = ref)}
        style={{}}
      />
    );
  }
}
