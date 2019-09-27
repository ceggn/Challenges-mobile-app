import gql from 'graphql-tag';

export default gql`
  mutation updateConversation($createdAt: String, $id: ID!, $name: String!) {
    updateConversation(createdAt: $createdAt, name: $name, id: $id) {
      createdAt
      name
      id
    }
  }
`;
