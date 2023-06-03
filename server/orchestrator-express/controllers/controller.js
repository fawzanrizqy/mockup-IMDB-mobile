if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const axios = require("axios");
const baseUrlUsers = process.env.URL_USERS;
const baseUrlApp = process.env.URL_APP;
const Redis = require("ioredis");
const redis = new Redis(
    process.env.URL_PORT,
    process.env.REDIS_URL
);


class Controller {
    /////USERS///
    static async getAllUsers(req, res, next) {
        try {
            let userList = await redis.get("userlist");
            if (userList) {
                let data = JSON.parse(userList);
                // console.log(data, "dari cache")
                return res.status(200).json(data);
            }


            const users = await axios.get(`${baseUrlUsers}/users`);
            redis.set("userlist", JSON.stringify(users.data));
            res.status(200).json(users.data);
        } catch (err) {
            next(err);
        }
    }

    static async getUserById(req, res, next) {
        try {
            const id = req.params.id;
            const user = await axios.get(`${baseUrlUsers}/users/${id}`);
            res.status(200).json(user.data);
        } catch (err) {
            next(err);
        }
    }

    static async createUser(req, res, next) {
        try {
            const { username, email, password, role, phoneNumber, address } = req.body;
            const user = await axios.post(`${baseUrlUsers}/users`, { username, email, password, role, phoneNumber, address }, {
                headers: {
                    "content-type": "application/json"
                }
            });
            redis.del("userlist");
            res.status(201).json(user.data);
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            await axios.delete(`${baseUrlUsers}/users/${id}`);
            redis.del("userlist");

            res.status(200).json({ message: "User deleted" });
        } catch (err) {
            next(err);
        }
    }

    ///MOVIES///
    static async getAllMovies(req, res, next) {
        try {
            let movieList = await redis.get("movieList");
            if (movieList) {
                let data = JSON.parse(movieList);
                console.log(data, "dari cache")
                return res.status(200).json(data);
            }

            const movies = await axios.get(`${baseUrlApp}/movies`);
            redis.set("movieList", JSON.stringify(movies.data));
            res.status(200).json(movies.data);
        } catch (err) {
            next(err);
        }
    }

    static async getMovieById(req, res, next) {
        try {
            const id = +req.params.id;
            const movie = await axios.get(`${baseUrlApp}/movies/${id}`);
            res.status(200).json(movie.data);
        } catch (err) {
            next(err);
        }
    }

    static async createMovie(req, res, next) {
        try {
            const { title,
                synopsis,
                trailerUrl,
                imgUrl,
                genreId,
                authorId,
                rating,
                artist } = req.body;
            const movie = await axios.post(`${baseUrlApp}/movies`, { title, synopsis, trailerUrl, imgUrl, genreId, authorId, rating, artist },
                { headers: { "content-type": "application/json" } });
            redis.del("movieList");

            res.status(201).json(movie.data);
        } catch (err) {
            next(err);
        }
    }

    static async updateMovie(req, res, next) {
        try {
            const id = +req.params.id;
            const {
                title,
                synopsis,
                trailerUrl,
                imgUrl,
                genreId,
            } = req.body;
            const movie = await axios.patch(`${baseUrlApp}/movies/${id}`,
                {
                    title,
                    synopsis,
                    trailerUrl,
                    imgUrl,
                    genreId,
                }, {
                headers: {
                    "content-type": "application/json"
                }
            });
            redis.del("movieList");

            res.status(200).json(movie.data);
        } catch (err) {
            next(err);
        }
    }

    static async deleteMovie(req, res, next) {
        try {
            const id = +req.params.id;
            const movie = await axios.delete(`${baseUrlApp}/movies/${id}`);
            redis.del("movieList");

            res.status(200).json(movie.data);

        } catch (err) {
            next(err);
        }
    }

    ////GENRES/////
    static async getGenres(req, res, next) {
        try {
            let genreList = await redis.get("genreList");
            if (genreList) {
                let data = JSON.parse(genreList);
                // console.log(data, "dari cache")
                return res.status(200).json(data);
            }

            const genres = await axios.get(`${baseUrlApp}/genres`);
            redis.set("genreList", JSON.stringify(genres.data));
            res.status(200).json(genres.data);
        } catch (err) {
            next(err);
        }
    }

    static async getGenreById(req, res, next) {
        try {
            const id = +req.params.id;
            const genre = await axios.get(`${baseUrlApp}/genres/${id}`);
            res.status(200).json(genre.data);
        } catch (err) {
            next(err);
        }
    }

    static async createGenre(req, res, next) {
        try {
            const { name } = req.body;
            const genre = await axios.post(`${baseUrlApp}/genres`, { name }, { headers: { "content-type": "application/json" } });
            redis.del("genreList");
            res.status(201).json(genre.data);
        } catch (err) {
            next(err);
        }
    }

    static async updateGenre(req, res, next) {
        try {
            const id = +req.params.id;
            const { name } = req.body;
            const genre = await axios.patch(`${baseUrlApp}/genres/${id}`, { name },
                { headers: { "content-type": "application/json" } });
            redis.del("genreList");
            res.status(200).json(genre.data);
        } catch (err) {
            next(err);
        }
    }

    static async deleteGenre(req, res, next) {
        try {
            const id = +req.params.id;
            const genre = await axios.delete(`${baseUrlApp}/genres/${id}`);
            redis.del("genreList");
            res.status(200).json(genre.data);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = Controller;