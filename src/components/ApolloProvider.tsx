'use client';

import { ApolloClient, ApolloLink, ApolloProvider as BaseApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error'
import { ReactNode } from 'react';

const httpLink = createHttpLink({
  uri: "https://dept-management-server.onrender.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('token')) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
    }
  }

  if (networkError) {
    console.error('[Network Error]:', networkError);
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
});

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: ReactNode }) {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}