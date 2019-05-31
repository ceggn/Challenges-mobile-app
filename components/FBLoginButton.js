import React, { Component } from 'react';
import { View } from 'react-native';
import { I18n, Auth } from 'aws-amplify';
import { Button, Text } from 'native-base';
import { authorize, refresh, revoke } from 'react-native-app-auth';

const config = {
  clientId: '6ig5invve2v8brr1467i8smjl2',
  redirectUrl: 'de.challenges://oauthclient/redirect',
  serviceConfiguration: {
    authorizationEndpoint: 'https://challenges.auth.us-west-2.amazoncognito.com/oauth2/authorize',
    tokenEndpoint: 'https://challenges.auth.us-west-2.amazoncognito.com/oauth2/token',
    revocationEndpoint: 'https://challenges.auth.us-west-2.amazoncognito.com/oauth2/revoke'
  }
};

export default class FBLoginButton extends Component {
  async fblogin(props) {
    // Log in to get an authentication token
    const authState = await authorize(config);
    console.log('FACEBOOK DATA', authState);
    // Refresh token
    const refreshedState = await refresh(config, {
      refreshToken: authState.refreshToken,
    });
    console.log("REFRESH", refreshedState);
    Auth.signInWithoutPassword();
    Auth.currentAuthenticatedUser().then(
      data => {
        console.log('current logged user',data);
      }
    ).catch( e => console.log('error',e));
    Auth.federatedSignIn('facebook', { token: refreshedState.idToken}, {})
    .then(credentials => {
        console.log('get aws credentials', credentials);
    }).catch(e => {
        console.log(e);
    });
    //props.onStateChange('signedIn');
  }
  async revoke(){
    // Log in to get an authentication token
    const authState = await authorize(config);

    // Refresh token
    const refreshedState = await refresh(config, {
      refreshToken: authState.refreshToken,
    });
    // Revoke token
    await revoke(config, {
      tokenToRevoke: refreshedState.accessToken
    });
  }
  render() {
    return (
      <View style={{
            alignSelf: 'center',
        }}>
        <Button
          light
          style={{backgroundColor: 'rgba(255,255,255,0.28)'}}
          onPress={ () => this.fblogin(this.props)}>
          <Text style={{width: '100%', color: '#2D3741', fontSize:14, textAlign:'center', fontWeight: '300'}}>Facebook</Text>
        </Button>
        {/* <LoginButton
          readPermissions={["email", "public_profile"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                AccessToken.getCurrentAccessToken().then(
                    (data) => {
                        let token = data.accessToken;
                        let expires_at = data.expirationTime;
                        let user = data;
                        let graphParams = { parameters: {} };
                        let infoRequest = new GraphRequest('/me', graphParams, (error, result) => {
                            if (error) {
                              console.log('Error fetching data: ' + error.toString());
                            } else {
                              console.log('User Facebook details', result);
                              Auth.federatedSignIn('facebook', { token: data.accessToken.toString(), expires_at: data.expirationTime}, { result })
                                .then(credentials => {
                                    console.log('get aws credentials', credentials);
                                    this.props.onStateChange('signedIn');
                                }).catch(e => {
                                    console.log(e);
                                });
                            }
                          }
                        );
                        infoRequest.addStringParameter('id,name,email', 'fields');
                        // Start the graph request.
                        new GraphRequestManager().addRequest(infoRequest).start();
                    }
                )
              }
            }
          }
          onLogoutFinished={() => this.props.onStateChange('signedOut')}/> */}
      </View>
    );
  }
};

module.exports = FBLoginButton;