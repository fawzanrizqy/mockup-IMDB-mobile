const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();

router.get("/users", Controller.getUsers);
router.get("/users/:id", Controller.GetUserById);
router.get("/users-id/:id", Controller.GetUserByIdUser);
router.post("/users", Controller.CreateUser);
router.delete("/users/:id", Controller.deleteUser);

module.exports = router;