const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String
        title: String
        authors: [String]
        description: String
        image: String

    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String

    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }
`;

export default typeDefs;