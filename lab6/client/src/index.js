import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const BASE_URL = "http://localhost:4000";

const httpLink = new HttpLink({
    uri: BASE_URL,
    onError: ({ networkError, graphQLErrors }) => {
      console.log("graphQLErrors", graphQLErrors);
      console.log("networkError", networkError);
    }
  });

const cache = new InMemoryCache();

const client = new ApolloClient({
    link: httpLink,
    cache
  });
  
ReactDOM.render(
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>,
     document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
  }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
