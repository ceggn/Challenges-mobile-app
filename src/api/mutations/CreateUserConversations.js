import gql from 'graphql-tag'
 
export default gql`
    mutation addUserConversation( $conversationId: ID!, $userId: ID! ) {
        createUserConversations(
            conversationId: $conversationId,
            userId: $userId
        ){
            __typename
            userId
            conversationId
            conversation {
                __typename
                id
                name
            }
            associated {
                __typename
                userId
            }
        }
    }
`