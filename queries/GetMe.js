import gql from 'graphql-tag';

export default gql`
query myData {
	me {
    __typename
    id
    username
    registered
    cognitoId
    conversations {
      userConversations {
        userId
        conversationId
        conversation {
            id
            name
        }
        associated {
            userId
        }
      }
    }
  }
}
`;