const { ApolloServer } = require('apollo-server');
const { verify } = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

//Conección DB
require('./config/db');


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = verify(token, process.env.SECRET);
                return usuario;
            } catch (error) {
                console.log(error);
            }
        }
    }
});

server.listen().then(({ url }) => {
    console.log(`SERVER LISTEN ON: ${url}`);
});
