import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://tolerant-seal-67.hasura.app/v1/graphql",
    headers: {
        "x-hasura-admin-secret" : "0lhfwXYK3u33jbeo0ayAz7X0XEKfbTVyWgxgT0v8a9CNJ5MZ8WWSeMT1EvAeID4k"
    }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
