const User = require("../models/users");

class Controller {
    static async getUsers(req, res) {
        try {
            const users = await User.getUsersAll();
            // console.log(users, "ini dari controller getUsersAll");
            res.status(200).json(users);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }

    static async GetUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await User.getUserById(id);
            res.status(200).json(user);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }

    static async GetUserByIdUser(req, res) {
        try {
            const id = +req.params.id;
            const user = await User.getUserByIdUser(id);
            res.status(200).json(user);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }

    static async CreateUser(req, res) {
        try {
            const { username, email, password, role, phoneNumber, address } = req.body;

            if (!username || !email || !password || !role) {
                throw ({ name: "validationErr", message: "Username, Email, Password, and Role Fields Required", code: 400 })
            }

            const checkLast = await User.getUsersAll();

            if (checkLast.length > 0 && email === checkLast[checkLast.length - 1].email) {
                throw ({ name: "validationErr", message: "Email Already Exists", code: 400 })
            }

            const idUser = checkLast.length > 0 ? checkLast[checkLast.length - 1].idUser + 1 : 1;

            const newUser = await User.createUser({ username, email, password, role, phoneNumber, address, idUser });
            res.status(201).json({ message: "User Created Successfully" });

        } catch (err) {
            console.log(err)
            if (err.name) {
                res.status(err.code).json({ message: err.message });

            }
            else {
                res.status(500).json(err);
            }
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const checkUser = await User.getUserById(id);
            if (!checkUser) {
                throw ("User Not Found")
            }
            const user = await User.deleteUser(id);
            res.status(200).json({ message: "User Deleted Successfully" });
        } catch (err) {
            res.status(404).json(err);
        }
    }

}

module.exports = Controller;



