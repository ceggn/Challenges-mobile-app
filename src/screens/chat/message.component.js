import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  NativeModules
} from 'react-native';
import { Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  message: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
  }
});

class Message extends PureComponent {
  render() {
    const { avatar, message, isCurrentUser, username, navigation } = this.props;

    return (
      <View key={message.id} style={styles.container}>
        { !isCurrentUser &&
        <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', {user: username})}>
          <FastImage
              style={{ marginTop: 10, marginLeft: 16, width: 40, height: 40, borderRadius: 20 }}
              source={
                avatar ? 
                {
                  uri: avatar,
                  priority: FastImage.priority.normal,
                } : Images.Avatar }
              resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity> }
        <View style={{flex: 1}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={ isCurrentUser ? ['rgb(231,91,58)', 'rgb(237,146,61)'] : ['rgb(72,85,99)', 'rgb(41,50,60)'] }
            style={[styles.message, isCurrentUser && styles.myMessage]}
          >
            <Text style={{
              color:'#ffffff',
              fontSize: 15,
              fontWeight: "normal",
              fontStyle: "normal",
              letterSpacing: -0.24
              }}>{message.content}</Text>
          </LinearGradient>
            { !isCurrentUser && <Text style={{
              fontSize: 11,
              fontWeight: "normal",              
              fontStyle: "normal",
              letterSpacing: 0.39,
              textAlign: "left",
              marginLeft: -40,
              marginTop: 4,
              color: "#858e99"}}>{ moment( parseInt( message.createdAt ) ).format('lll')}</Text> }
            { isCurrentUser && message.isSent && <Text style={{
              fontSize: 11,
              fontWeight: "normal",              
              fontStyle: "normal",
              letterSpacing: 0.39,
              textAlign: "right",
              paddingRight: 16,
              marginTop: 4,
              color: "#858e99"}}>{ moment( parseInt( message.createdAt ) ).format('lll')} | {I18n.get('Delivered')}</Text> }
        </View>
      </View>
    );
  }
}

export default Message;