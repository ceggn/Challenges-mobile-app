import gql from 'graphql-tag'
 
export default gql`
    subscription onMessageAdded( $conversationId: ID! ){
        subscribeToNewMessage( conversationId: $conversationId ){
            author {
                username
            }
            content
            conversationId
            createdAt
            id
            isSent
            recipient {
                username
            }
            sender
        }
    }
`