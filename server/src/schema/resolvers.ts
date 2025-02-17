import { User } from '../models/index.js';
import { BookDocument } from '../models/Book.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    // bookCount: number;
    savedBooks: BookDocument[];
}

interface AddUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface SaveBookArgs {
    input:{
        bookId: string
        authors: [string]
        title: string
        description: string
        image: string
        // link: string
    }
}

interface RemoveBookArgs {
    bookId: string;
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        // get a user's info
        me: async (_parent: any, _args: any, context: Context) => {
            if (context.user) {
                console.log("Oh hi!", context.user._id);
                return await User.findById(context.user._id).populate('savedBooks');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },

    Mutation: {
        // add a new user
        addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        // log a user in
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
            // If no user is found, throw an AuthenticationError
            if (!user) {
              throw new AuthenticationError("Could not find user with this email.");
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
              throw new AuthenticationError('password authentication failed.');
            }
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        // save book to user's savedBooks
        saveBook: async (_parent: any, { input }: SaveBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
              return await User.findOneAndUpdate(
                { _id: context.user._id },
                {
                  $addToSet: { savedBooks: input },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
            throw AuthenticationError;
          },
        // remove book from user's savedBooks
        removeBook: async (_parent: any, args: RemoveBookArgs, context: Context) => {
            if (context.user) {
                console.log("Trying to delete book, userId is ", context.user._id);
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: args } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        },
    },
};

export default resolvers;