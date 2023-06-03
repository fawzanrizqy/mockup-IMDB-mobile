import { gql } from "@apollo/client";

export const GET_MOVIES = gql`
  query GetMovies {
  getMovies {
    id
    title
    synopsis
    trailerUrl
    imgUrl
    genreId
    authorId
    rating
    years
    type
    duration
    Genre {
      id
      name
    }
    Casts {
      id
      movieId
      name
      profilePict
    }
  }
}
`;

export const GET_MOVIES_BY_ID = gql`
  query GetMovieById($getMovieByIdId: Int!) {
  getMovieById(id: $getMovieByIdId) {
    id
    title
    synopsis
    trailerUrl
    imgUrl
    genreId
    authorId
    rating
    years
    type
    duration
    Genre {
      id
      name
    }
    Casts {
      id
      movieId
      name
      profilePict
    }
  }
}
`;

export const GET_USERS_BY_ID_USER = gql`
  query Query($idUser: Int!) {
  getUserByIdUser(idUser: $idUser) {
    _id
    idUser
    email
    username
    password
    role
    phoneNumber
    address
  }
}
`;