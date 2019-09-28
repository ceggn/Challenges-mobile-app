var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { TextInput, Platform, NativeModules } from 'react-native';

// i18n
import { I18n } from 'aws-amplify';
import cahallengesDict from '../../config/dictionary';
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
I18n.setLanguage(languageCode);
I18n.putVocabularies(cahallengesDict);

export const LoginUsername = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.login,
        placeholder: I18n.get('Username'),
        autoFocus: false,
        autoCapitalize: 'none'
    }, props));
};

export const LoginPassword = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.login,
        placeholder: I18n.get('Password'),
        secureTextEntry: true
    }, props));
};