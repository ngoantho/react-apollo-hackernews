import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import cors from 'cors';
import * as Query from './resolvers/Query.js';
import * as Mutation from './resolvers/Mutation.js';
import * as Subscription from './resolvers/Subscription.js';
import * as User from './resolvers/User.js';
import * as Link from './resolvers/Link.js';
import * as Vote from './resolvers/Vote.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUserId } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pubsub = new PubSub();

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: ['query', 'info', 'warn', 'error'],
});

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote
};

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

async function startServer() {
  const app = express();
  app.use(cors());

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId:
          req && req.headers.authorization
            ? getUserId(req)
            : null
      };
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ]
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  const serverCleanup = useServer({
    schema,
    context: (ctx) => {
      return {
        prisma,
        pubsub,
        userId: ctx.connectionParams?.authToken
          ? getUserId(null, ctx.connectionParams.authToken)
          : null
      };
    }
  }, wsServer);

  await server.start();
  server.applyMiddleware({ app });

  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://${HOST}:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://${HOST}:${PORT}${server.graphqlPath}`
    );
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
