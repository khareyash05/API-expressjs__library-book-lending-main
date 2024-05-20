import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import * as path from 'path'

const fs =  require('fs')
const schemaString = fs.readFileSync(path.join(__dirname, './schema.gql'), 'utf8')
const schema = buildSchema(schemaString)

// const authMiddleware = (req,res,next)=>{

// }

const root ={
  //@ts-ignore
  getUser :({id},req)=>{
    if(id==='1') return{id:'1',email:'a@b.com',firstName:'John',lastName:'Doe'}
    return null;
  },
  //@ts-ignore
  createUser  :({input},req)=>{
    return {id:'2',...input}
  }
}

const app = express();
app.use('/graphql',graphqlHTTP({
  schema:schema,
  rootValue:root,
  graphiql:true
}))

const PORT = 4000
app.listen(PORT)