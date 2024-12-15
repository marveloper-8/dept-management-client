import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context'
import { getSession } from "next-auth/react";

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
})

const authLink = setContext(async (_, {headers}) => {
    const session: any = await getSession()
    return {
        headers: {
            ...headers,
            authorization: session?.accessToken ? `Bearer ${session?.accessToken}` : "",
        }
    }
})

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})