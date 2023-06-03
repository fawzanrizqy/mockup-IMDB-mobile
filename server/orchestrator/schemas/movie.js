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

type Cast{
id: ID!
movieId: Int
name:String
profilePict:String
}

  type Movie {
    id: ID!
    title: String!
    synopsis: String!
    trailerUrl: String
    imgUrl: String
    genreId: Int!
    authorId: Int!
    rating: Float!
    years: Int,
    duration: String,
    type: String
    Genre: Genre!
    Casts: [Cast]
  }

  type MovieUpdatedResult {
    message: String
  }

  type MovieDeleteResult {
    message: String
  }

  type Query {  
    getMovies: [Movie]
    getMovieById( id: Int!): Movie
  }

  type Mutation {
    addMovie(title: String!, synopsis: String!, trailerUrl: String, imgUrl: String, genreId: Int!, authorId:Int!, artist:[String!], rating:Float!, years:Int, duration:String, type:String): Movie
    updateMovie(id: Int!, title: String!, synopsis: String!, trailerUrl: String, imgUrl: String, genreId: Int!, years:Int, duration:String, type:String): MovieUpdatedResult
    deleteMovie(id: Int!): MovieDeleteResult
  }
`;

const resolvers = {
    Query: {
        getMovies: async () => {
            let movieList = await redis.get("movieList");
            if (movieList) {
                let data = JSON.parse(movieList);
                return data;
            }

            const { data } = await axios.get(`${BASEURL}/movies`);
            redis.set("movieList", JSON.stringify(data));
            return data;
        },
        getMovieById: async (_, { id }) => {
            const { data } = await axios.get(`${BASEURL}/movies/${id}`);
            return data;
        },

    },
    Mutation: {
        addMovie: async (_, {
            title,
            synopsis,
            trailerUrl,
            imgUrl,
            genreId,
            authorId,
            rating,
            years,
            duration,
            type,
            artist }) => {
            const { data } = await axios.post(`${BASEURL}/movies`, {
                title,
                synopsis,
                trailerUrl,
                imgUrl,
                genreId,
                authorId,
                rating,
                artist,
                years,
                duration,
                type,
            });
            redis.del("movieList");

            return data;
        },
        updateMovie: async (_, {
            id,
            title,
            synopsis,
            trailerUrl,
            imgUrl,
            genreId,
            years,
            duration,
            type }) => {
            const { data } = await axios.patch(`${BASEURL}/movies/${id}`, {
                title,
                synopsis,
                trailerUrl,
                imgUrl,
                genreId,
                years,
                duration,
                type,
            });
            redis.del("movieList");

            return data;
        },
        deleteMovie: async (_, { id }) => {
            const { data } = await axios.delete(`${BASEURL}/movies/${id}`);
            redis.del("movieList");

            return data;
        },
    },
};

module.exports = {
    typeDefs,
    resolvers,
};