import gql from 'graphql-tag';

export default gql`
  mutation updateConversation($createdAt: String, $id: ID!) {
    updateConversation(createdAt: $createdAt, id: $id) {
      createdAt
      id
    }
  }
`;
