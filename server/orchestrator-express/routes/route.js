const express = require("express");
const Controller = require("../controllers/controller");
const errorHandler = require("../middleware/errorHandler");
const router = express.Router();

/////USERS ROUTES///////
router.get("/users", Controller.getAllUsers);
router.get("/users/:id", Controller.getUserById);
router.post("/users", Controller.createUser);
router.delete("/users/:id", Controller.deleteUser);
//////MOVIES ROUTES//////
router.get("/movies", Controller.getAllMovies)
router.post("/movies", Controller.createMovie);
router.get("/movies/:id", Controller.getMovieById);
router.delete("/movies/:id", Controller.deleteMovie);
router.patch("/movies/:id", Controller.updateMovie);
/////////////GENRES///////////////////////////////////
router.get("/genres", Controller.getGenres);
router.get("/genres/:id", Controller.getGenreById);
router.post("/genres", Controller.createGenre);
router.delete("/genres/:id", Controller.deleteGenre);
router.patch("/genres/:id", Controller.updateGenre);
/////////////ERROR HANDLING////////////
router.use(errorHandler)

module.exports = router;