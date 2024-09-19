import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App';

// Create an HTTP link
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Ensure this URL is correct
});

// Optionally set headers or any other context
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Authorization: `Bearer ${localStorage.getItem('token')}`, // Example if using auth tokens
    }
  };
});

// Create the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
