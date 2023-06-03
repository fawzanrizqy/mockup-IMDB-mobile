if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const BASEURL = process.env.URL_USERS;
const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis(
  process.env.URL_PORT,
  process.env.REDIS_URL
);


const typeDefs = `#graphql
  type User {
    _id: ID!
    idUser: Int
    email: String
    username: String
    password: String
    role: String
    phoneNumber: String
    address: String
  }

  type UserCreatedResult {
    message: String
  }

  type UserDeleteResult {
    message: String
  }

  type Query {  
    getUsers: [User]
    getUserById( _id: String!): User
    getUserByIdUser(idUser: Int!): User
  }

  type Mutation {
    addUser(email: String!, username: String!, password: String!, role: String!, phoneNumber:String, address: String): UserCreatedResult
    deleteUser(_id: String!): UserDeleteResult
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      let userList = await redis.get("userlist");
      if (userList) {
        let data = JSON.parse(userList);
        // console.log("dari cache")
        return data
      }

      const { data } = await axios.get(`${BASEURL}/users`);
      redis.set("userlist", JSON.stringify(data));
      return data;
    },
    getUserById: async (_, { _id }) => {
      const { data } = await axios.get(`${BASEURL}/users/${_id}`);
      return data;
    },
    getUserByIdUser: async (_, { idUser }) => {
      const { data } = await axios.get(`${BASEURL}/users-id/${idUser}`);
      return data;
    },
  },
  Mutation: {
    addUser: async (_, { email, username, password, role, phoneNumber, address }) => {
      const { data } = await axios.post(`${BASEURL}/users`, { email, username, password, role, phoneNumber, address });
      redis.del("userlist");
      return data;
    },
    deleteUser: async (_, { _id }) => {
      const { data } = await axios.delete(`${BASEURL}/users/${_id}`);
      redis.del("userlist");
      return data;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};