/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ImageBackground,
  FlatList,
  StyleSheet,
  Image,
  View
} from 'react-native';
import { createBottomTabNavigator, createStackNavigator, SafeAreaView } from 'react-navigation';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import {
  Container,
  Row,
  Col,
  Thumbnail,
  Grid,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  Button,
  Text,
  StyleProvider } from 'native-base';

const imgBorderRadius = (source) => {
  const { width, height } = Image.resolveAssetSource(source)
  return <Image source={source} style={{ width: null, height: null, resizeMode: 'cover', aspectRatio: width / height, borderRadius: 12 }} />
}
const img = (source) => {
  const { width, height } = Image.resolveAssetSource(source)
  return <Image source={source} style={{ width: null, height: null, resizeMode: 'cover', aspectRatio: width / height }} />
}
const styles = StyleSheet.create({
  tab: {
    backgroundColor: 'transparent'
  },
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
  },
  trendingExcerpt: {
    opacity: 0.8,
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: -0.06,
    textAlign: "left",
    color: "#535353"
  },
  videoTitleText: {
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.19,
    color: "#373744"
  },
  videoTitleDescriptionText: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.15,
    color: "rgba(55, 55, 68, 0.72)"
  },
  videoDescriptionNumberText: {
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.22,
    textAlign: "right",
    color: "#373744"
  },
  videoDescriptionNumberDescriptionText: {
    fontSize: 10,
    textAlign: 'right',
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.12,
    color: "#959598"
  },
  tabHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: -0.25,
    textAlign: "left",
    color: "#373744",
    left: 15
  },
  trendingCardFooter: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  trendingCardHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: {
      width: 0,
      height: -16
    },
    shadowRadius: 60,
    shadowOpacity: 1,
    backgroundColor: '#F7F8F8',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  trendingStackedAvatars: {
    width: 25,
    height: 25,
    position: 'absolute',
  },
  trendingCardFooterText: {
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.16,
    textAlign: "left",
    color: "#373744",
    marginRight: 15,
  },
  profileStatisticsWrapper: {
    marginLeft: 44,
    marginRight: 44,
    marginTop: 22,
    flexDirection: 'row',
  },
  profileCounter: {
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744"
  },
  profileCounterDescription: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    marginTop: 7,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744"
  },
  profileNameLocation: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#373744",
    marginBottom: 17
  },
  profileNameDescription: {
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#3b3b48"
  }
});

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerLeft: (
      <Icon name='filter_white' size={20} color='#373744' style={{ left: 15 }} />
    ),
    headerRight: (
      <React.Fragment>
        <Icon name='Camera' size={20} color='#373744' style={{ right: 40 }} />
        <Icon name='Search' size={15} color='#373744' style={{ right: 15 }} />
      </React.Fragment>
    ),
    tabBarVisible: true,
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0,
    },
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/images/screen-bg.png')}
        style={{
          flex: 1,
          width: null,
          height: null,
      }}>
        <View style={{ flex: 1 }}>
          <StyleProvider style={getTheme(customStyle)}>
            <Container>
            <Header hasTabs/>
              <Tabs renderTabBar={()=> <ScrollableTab />} tabBarBackgroundColor={'transparent'}>
                <Tab heading="Popular" textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  <FlatList
                    data={[
                      {key: 'Devin'},
                      {key: 'Jackson'},
                      {key: 'James'},
                      {key: 'Joel'},
                      {key: 'John'},
                      {key: 'Jillian'},
                      {key: 'Jimmy'},
                      {key: 'Julie'},
                    ]}
                    renderItem={({item}) =>
                      <View style={{ paddingHorizontal: 20 }}>
                        {imgBorderRadius(require('./assets/images/surf-1.jpg'))}
                        <Grid style={{ marginVertical: 10, justifyContent: 'space-between' }} justifyContent={'space-between'}>
                          <Col style={{ width: 50 }}>
                            <Thumbnail square small style={{ width: 30, height: 30}} source={require('./assets/images/avatar.png')} />
                          </Col>
                          <Col>
                              <Text style={styles.videoTitleText}>GoPro Surfing</Text>
                              <Text style={styles.videoTitleDescriptionText}>Maximilian Lave</Text>
                          </Col>
                          <Col style={{ width: 70 }}>
                              <Text style={styles.videoDescriptionNumberText}>901</Text>
                              <Text style={styles.videoDescriptionNumberDescriptionText}>Challenger</Text>
                          </Col>
                          <Col style={{ width: 60 }}>
                              <Text style={styles.videoDescriptionNumberText}>9.1</Text>
                              <Text style={styles.videoDescriptionNumberDescriptionText}>Rankings</Text>
                          </Col>
                        </Grid>
                      </View>
                    }
                  />
                </Tab>
                <Tab heading="SPORT" textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                <FlatList
                    data={[
                      {key: 'Devin'},
                      {key: 'Jackson'},
                      {key: 'James'},
                      {key: 'Joel'},
                      {key: 'John'},
                      {key: 'Jillian'},
                      {key: 'Jimmy'},
                      {key: 'Julie'},
                    ]}
                    renderItem={({item}) =>
                      <View style={{ paddingHorizontal: 20 }}>
                        {imgBorderRadius(require('./assets/images/sport-1.jpg'))}
                        <Grid style={{ marginVertical: 10, justifyContent: 'space-between' }} justifyContent={'space-between'}>
                          <Col style={{ width: 50 }}>
                            <Thumbnail square small style={{ width: 30, height: 30}} source={require('./assets/images/avatar.png')} />
                          </Col>
                          <Col>
                              <Text style={styles.videoTitleText}>Neon Effect Challenge</Text>
                              <Text style={styles.videoTitleDescriptionText}>Ambrossini Klara</Text>
                          </Col>
                          <Col style={{ width: 70 }}>
                              <Text style={styles.videoDescriptionNumberText}>213</Text>
                              <Text style={styles.videoDescriptionNumberDescriptionText}>Challenger</Text>
                          </Col>
                          <Col style={{ width: 60 }}>
                              <Text style={styles.videoDescriptionNumberText}>9.7</Text>
                              <Text style={styles.videoDescriptionNumberDescriptionText}>Rankings</Text>
                          </Col>
                        </Grid>
                      </View>
                    }
                  />
                </Tab>
                <Tab heading="GAMES" textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  
                </Tab>
                <Tab heading="MUSIC" textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  
                </Tab>
                <Tab heading="LIVE" textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  
                </Tab>
                <Tab heading="RECENT" textStyle={{ fontSize: 15 }} activeTextStyle={{ fontSize: 25 }} tabStyle={{ backgroundColor: "transparent" }} activeTabStyle={{ backgroundColor: "transparent" }} style={styles.tab}>
                  
                </Tab>
              </Tabs>
            </Container>
          </StyleProvider>
        </View>
      </ImageBackground>
    );
  }
}