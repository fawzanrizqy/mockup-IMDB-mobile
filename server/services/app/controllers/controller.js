const { Movie, Cast, Genre } = require("../models")
const { sequelize } = require("../models/")
const { Op } = require("sequelize");

class Controller {

    ///////////////MOVIES/////////////
    static async fetchMovies(req, res, next) {
        try {
            let option = {};
            const { title } = req.query;

            if (title) {
                option.title = {
                    [Op.iLike]: `%${title}%`,
                };
            }

            const movies = await Movie.findAll({
                include: [{
                    model: Genre,
                },
                {
                    model: Cast,
                }],
                where: option
            });

            res.status(200).json(movies);
        } catch (err) {
            next(err);
        }
    }

    static async fetchMovieById(req, res, next) {
        try {
            const id = +req.params.id;

            const movie = await Movie.findOne({
                where: {
                    id
                },
                include: [{
                    model: Genre,
                },
                {
                    model: Cast,
                }
                ]
            })
            if (!movie) {
                throw ({ name: "notFound", message: "Movie not found", code: 404 });
            }

            res.status(200).json(movie);
        } catch (err) {
            next(err);
        }
    }

    static async addMovie(req, res, next) {
        const t = await sequelize.transaction();
        try {

            const { title,
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
            } = req.body;

            const slug = title.split(' ').join('-').toLowerCase();

            const movie = await Movie.create({
                title,
                synopsis,
                trailerUrl,
                imgUrl,
                genreId,
                authorId,
                rating,
                slug,
                years,
                duration,
                type,
            }, { transaction: t });

            const dataActor = artist.map(actor => {
                if (!actor) {
                    throw ({ name: "validationErr", message: "Actor Name required", code: 400 });
                }

                return {
                    name: actor,
                    movieId: movie.id
                }
            });

            const casts = await Cast.bulkCreate(dataActor, { transaction: t });
            t.commit();
            res.status(201).json(movie)
        } catch (err) {
            t.rollback();
            next(err);
        }
    }

    static async updateMovie(req, res, next) {
        const t = await sequelize.transaction();
        try {

            const {
                title,
                synopsis,
                trailerUrl,
                imgUrl,
                genreId, years,
                duration,
                type,
            } = req.body;
            const slug = title.split(' ').join('-').toLowerCase();

            const movie = await Movie.update({
                title, synopsis, trailerUrl, imgUrl, genreId, slug, years,
                duration,
                type,
            },
                { where: { id: +req.params.id } }, { transaction: t });
            t.commit();
            res.status(200).json({ message: "movie updated" });
        } catch (err) {
            t.rollback();
            next(err);
        }
    }

    static async deleteMovie(req, res, next) {
        try {
            const id = +req.params.id;
            const movie = await Movie.destroy({ where: { id } });

            res.status(200).json({ message: "movie deleted" });
        } catch (err) {
            next(err);
        }
    }

    ////////////////////////////GENRE///////////////////////////

    static async fetchGenres(req, res, next) {
        try {
            const genres = await Genre.findAll();

            res.status(200).json(genres);
        } catch (err) {
            next(err);
        }
    }

    static async fetchGenreById(req, res, next) {
        try {
            const id = +req.params.id;
            const genre = await Genre.findByPk(id);
            if (!genre) {
                throw ({ name: "notFound", message: "Genre not found", code: 404 });
            }
            res.status(200).json(genre);
        } catch (err) {
            next(err);
        }
    }

    static async addGenre(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { name } = req.body;
            const genre = await Genre.create({ name }, { transaction: t });
            t.commit();
            res.status(201).json(genre);
        } catch (err) {
            t.rollback();
            next(err);
        }
    }

    static async updateGenre(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { name } = req.body;
            const id = +req.params.id;
            const genre = await Genre.update({ name }, { where: { id } }, { transaction: t });
            t.commit();
            res.status(200).json({ message: "genre updated" });

        } catch (err) {
            t.rollback();
            next(err);
        }
    }

    static async deleteGenre(req, res, next) {
        try {
            const id = +req.params.id;
            const genre = await Genre.destroy({ where: { id } });
            res.status(200).json({ message: "genre deleted" });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = Controller