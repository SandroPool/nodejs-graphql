const { ApolloServer } = require('apollo-server');
const { verify } = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const app = express();

//Conección DB
require('./config/db');


const start = async _  => {
    const apolloServer = new ApolloServer({
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

    // apolloServer.listen().then(({ url }) => {
    //     console.log(`SERVER LISTEN ON: ${url}`);
    // });

    apolloServer.listen(process.env.PORT || 4000, _=>{
        console.log('Server on port', process.env.PORT || 4000);
    });
}

start();

