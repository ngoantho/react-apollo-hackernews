import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import { split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { AUTH_TOKEN } from "./constants";

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;
const httpLink = createHttpLink({
  uri: `http://${HOST}:${PORT}/graphql`
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${HOST}:${PORT}/graphql`,
  connectionParams: () => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
      authToken: token
    };
  }
}));

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Link: {
        keyFields: ["id"]
      }
    }
  })
});

// Use React 18's createRoot API
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);
