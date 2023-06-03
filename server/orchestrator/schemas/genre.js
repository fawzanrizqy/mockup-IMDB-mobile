if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const BASEURL = process.env.URL_APP;
const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis(
    process.env.URL_PORT,
    process.env.REDIS_URL
);

const typeDefs = `#graphql

  type Genre {
    id: ID!
    name: String!
  }

  type GenreUpdatedResult {
    message: String
  }

  type GenreDeleteResult {
    message: String
  }

  type Query {  
    getGenres: [Genre]
    getGenreById( id: Int!): Genre
  }

  type Mutation {
    addGenre(name:String!): Genre
    updateGenre(name:String!, id:Int!): GenreUpdatedResult
    deleteGenre(id: Int!): GenreDeleteResult
  }
`;

const resolvers = {
    Query: {
        getGenres: async () => {
            let genreList = await redis.get("genreList");
            if (genreList) {
                let data = JSON.parse(genreList);
                // console.log(data, "dari cache")
                return data;
            }

            const { data } = await axios.get(`${BASEURL}/genres`);
            redis.set("genreList", JSON.stringify(data));
            return data;
        },
        getGenreById: async (_, { id }) => {
            const { data } = await axios.get(`${BASEURL}/genres/${id}`);
            return data;
        },

    },
    Mutation: {
        addGenre: async (_, { name }) => {
            const { data } = await axios.post(`${BASEURL}/genres`, { name });
            redis.del("genreList");
            return data;
        },
        updateGenre: async (_, { id, name }) => {
            const { data } = await axios.patch(`${BASEURL}/genres/${id}`, { name });
            redis.del("genreList");
            return data;
        },
        deleteGenre: async (_, { id }) => {
            const { data } = await axios.delete(`${BASEURL}/genres/${id}`);
            redis.del("genreList");
            return data;
        },
    },
};

module.exports = {
    typeDefs,
    resolvers,
};