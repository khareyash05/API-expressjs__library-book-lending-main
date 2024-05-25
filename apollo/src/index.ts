import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const fs = require('fs');

import * as path from 'path'


// // we must convert the file Buffer to a UTF-8 string
// const typeDefs1 = `#graphql `
// typeDefs1.concat(fs.readFileSync(path.join(__dirname, './schema.gql'), 'utf8'))

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User{
    id: ID!
    name: String! 
    email: String!
  }

  type Query{
      getUserById(id:ID!):User
      getAllUsers:[User]
  }

  input CreateUserInput{
      name: String!
      email: String!
  }

  type Mutation{
      createUser(input:CreateUserInput):[User]
  }
`;

let books = [
    {
      id:"1",
      name: 'The Awakening',
      email: 'Kate Chopin',
    },
    {
      id:"2",
      name: 'City of Glass',
      email: 'Paul Auster',
    },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      getAllUsers(){
        return books;
      },
      // @ts-ignore
      getUserById(_,args){
        let ans
        console.log(args.id,typeof args.id);
        books.map(book =>{
          if(book.id == args.id) {
            console.log("aaya");  
            ans=book    
          }
        })
        return ans
      }
    },
    Mutation:{
      createUser(name:string,email:string){
        books.push({
          id:"3",
          name:name,
          email:email
        })
        return books
      }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
const extra = async()=>{

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

extra()
  