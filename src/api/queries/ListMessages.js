import gql from 'graphql-tag';

export default gql`
query AllMessages( $after: String, $conversationId: ID!, $first: Int ) {
  allMessageConnection( after: $after, conversationId: $conversationId, first: $first ) {
    messages {
      author{
        username
      }
      content
      conversationId
      createdAt
      id
      isSent
      recipient{
        username
      }
      sender
    }
    nextToken
  }
}
`;