import React, { Component } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Alert,
    Platform,
    NativeModules,
    StatusBar
} from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
import {
    Container, Header, Content, Form, Item, Input, Label, Text, Button, Left,
    Right,
    Body,
    Title,
} from 'native-base';
import { I18n, Auth, API } from 'aws-amplify';
import cahallengesDict from '../dictionary';
if( Platform.OS === 'ios' ){
  var locale = NativeModules.SettingsManager.settings.AppleLocale;
}else{
  var locale = NativeModules.I18nManager.localeIdentifier;
}
var languageCode = locale.substring(0, 2);
I18n.setLanguage(languageCode);
I18n.putVocabularies(cahallengesDict);
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

export default class PayOutScreen extends Component {
    state = {
        email: null,
        fname: null,
        lname: null,
        pp: null,
        addr1: null,
        addr2: null,
        country: null,
        loading: false
    };
    constructor(props) {
        super(props);
        this.payOut = this.payOut.bind(this);
    }
    componentDidMount(){
        Auth.currentAuthenticatedUser().then(
            user => {
                console.log(user);
                this.setState({
                  country: user.attributes['custom:country'] ? user.attributes['custom:country'] : null,
                  email: user.attributes['email']
                });
            }
        );
    }
    static navigationOptions = ({ navigate, navigation }) => ({
        header: null,
        tabBarVisible: true,
    });
    payOut(){
        this.setState({loading: true});
        Auth.currentAuthenticatedUser().then(
            user => {
              const path = "/payoutRequests";
              var balance = user.attributes['custom:balance'] ? user.attributes['custom:balance'] : 0.00;
              let newReport = {
                  body: {
                    "address": this.state.addr1,
                    "address_add": this.state.addr2 ? this.state.addr2 : '–',
                    "country": this.state.country,
                    "currentBalance": balance,
                    "email": this.state.email,
                    "paypal": this.state.pp,
                    "firstName": this.state.fname,
                    "isPrivate": user.attributes['custom:isPrivate'] ? true : false,
                    "lastName": this.state.lname,
                    "sent": false,
                    "declined": false,
                    "sub": user.signInUserSession.idToken.payload.sub,
                    "submissionDate": new Date().valueOf(),
                    "username": user.username
                }
              }
              API.post("payoutRequestsCRUD", path, newReport)
              .then(
                  result => {
                    this.setState({loading: false});
                    Alert.alert(
                        I18n.get('Report'),
                        I18n.get('Your payout request has been sent')
                    );
                    this.props.navigation.goBack();
                  }
              ).catch(
                  err => {
                      console.log(err);
                  }
              );
            }
        );
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
                <Container>
                    <Header transparent>
                        <StatusBar backgroundColor="#ED923D" barStyle={ Platform.OS === 'ios' ? "dark-content":"light-content" }/>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='back' size={15} color='#373744' style={{ left: 15 }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#373744' }}>{I18n.get('Payout')}</Title>
                        </Body>
                        <Right>

                        </Right>
                    </Header>
                    <Content>
                        <KeyboardAwareScrollView>
                            <Form>
                                <Item stackedLabel>
                                    <Label>{I18n.get('Email')}</Label>
                                    <Input
                                        keyboardType="email-address"
                                        value={this.state.email}
                                        onChangeText={(email) => this.setState({email})}
                                    />
                                </Item>
                                <Item stackedLabel>
                                    <Label>{I18n.get('First Name')}</Label>
                                    <Input
                                        onChangeText={(fname) => this.setState({fname})}
                                    />
                                </Item>
                                <Item stackedLabel>
                                    <Label>{I18n.get('Last Name')}</Label>
                                    <Input onChangeText={(lname) => this.setState({lname})} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>{I18n.get('PayPal Email Address')}</Label>
                                    <Input
                                        keyboardType="email-address"
                                        onChangeText={(pp) => this.setState({pp})}
                                    />
                                </Item>
                                <Item stackedLabel>
                                    <Label>{I18n.get('Address line 1')}</Label>
                                    <Input onChangeText={(addr1) => this.setState({addr1})} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>{I18n.get('Address line 2')}</Label>
                                    <Input onChangeText={(addr2) => this.setState({addr2})} />
                                </Item>
                                <Item stackedLabel last>
                                    <Label>{I18n.get('Country')}</Label>
                                    <Input value={this.state.country} onChangeText={(country) => this.setState({country})} />
                                </Item>
                                <Item stackedLabel style={{borderBottomWidth: 0, marginLeft: 0, marginBottom: 10, paddingHorizontal: 10}}>
                                    <Button disabled={ this.state.loading || !this.state.email || !this.state.fname || !this.state.lname || !this.state.pp || !this.state.addr1 || !this.state.country } small light={ !this.state.email || !this.state.fname || !this.state.lname || !this.state.pp || !this.state.addr1 || !this.state.country ? true : false } success={ this.state.email && this.state.fname && this.state.lname && this.state.pp && this.state.addr1 && this.state.country ? true : false } full onPress={() => this.payOut()} style={{ marginTop: 20 }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 0.39,
                                            color: !this.state.email || !this.state.fname || !this.state.lname || !this.state.pp || !this.state.addr1 ? "#373744":"#ffffff"}}>{ this.state.loading ? I18n.get('Loading...'):I18n.get('Request Payout')}</Text>
                                    </Button>
                                </Item>
                            </Form>
                        </KeyboardAwareScrollView>
                    </Content>
                </Container>
            </ImageBackground>
        );
    }
}