import React, { PureComponent } from 'react';
import {
  View,  
  Text
} from 'native-base';
import ListMessages from '../queries/ListMessages';
import MessageAddedSubscription from '../subscriptions/MessagesAddedSubscription';
import { graphql, compose } from 'react-apollo';

const LastMessageQuery = compose(
  graphql(ListMessages, {
      options: props => ({
        variables: {
          conversationId: props.conversationId,
          first: 1,
        },
        pollInterval: 3000,
        fetchPolicy: 'cache-and-network'
      }),
      props: ( props ) => ({
        refetch: props.data.refetch,  
        message: props.data.allMessageConnection && props.data.allMessageConnection.messages[0] ? props.data.allMessageConnection.messages[0].content : "",
      })
  })
);

class SingleMessage extends PureComponent {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    message: "",
  }
  componentDidMount(){
    //this.props.refetch();
  }
  render() {
    const { message } = this.props;
    if (!message) {
        return null;
    }
    return (
      <Text style={{
        fontSize: 12,
        fontWeight: "300",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#373744"
        }}>
        {this.props.message}
      </Text>
    )
  }
}
export default compose(
  LastMessageQuery
)(SingleMessage);