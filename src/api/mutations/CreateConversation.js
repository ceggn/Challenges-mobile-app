import gql from 'graphql-tag'
 
export default gql`
    mutation addConversation( $createdAt: String, $id: ID!, $name: String!) {
        createConversation(
            createdAt: $createdAt,
            name: $name,
            id: $id
        ){
            createdAt
            name
            id
        }
    }
`