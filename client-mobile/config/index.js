import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://imdb-server.ojan.dev",
    cache: new InMemoryCache(),
});


export default client;
