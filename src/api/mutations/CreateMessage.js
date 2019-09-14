import gql from 'graphql-tag'
 
export default gql`
    mutation addMessage( $content: String, $conversationId: ID!, $createdAt: String!, $id: ID! ) {
        createMessage(
            content: $content,
            conversationId: $conversationId,
            createdAt: $createdAt,
            id: $id
        ){
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