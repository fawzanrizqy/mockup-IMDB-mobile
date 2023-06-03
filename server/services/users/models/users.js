const { ObjectId } = require("mongodb");
const { getDB } = require("../config/config")

class User {

    static async getCollectionName() {
        try {
            const db = await getDB();
            const users = db.collection("Users");
            return users;
        } catch (error) {
            console.log(error)
        }
    }

    static async getUsersAll() {
        try {
            const col = await User.getCollectionName();
            // console.log(col, "<<<<<<<<<<<<<<<<,")
            const users = await col.find().toArray();
            // console.log(users, "ini dari class users")
            return users;
        } catch (error) {
            console.log(error)
        }
    }

    static async getUserById(id) {
        try {
            const col = await User.getCollectionName();
            const users = await col.findOne({ _id: new ObjectId(id) });
            return users;
        } catch (error) {
            console.log(error)
        }
    }


    static async getUserByIdUser(id) {
        try {
            const col = await User.getCollectionName();
            const users = await col.findOne({ idUser: id });
            return users;
        } catch (error) {
            console.log(error)
        }
    }

    static async createUser(user) {
        try {
            const col = await User.getCollectionName();
            const users = await col.insertOne(user);
            // console.log(user, "ini dari class users")
            return users;
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteUser(id) {
        try {
            const col = await User.getCollectionName();
            const users = await col.deleteOne({ _id: new ObjectId(id) });
            return users;
        } catch (error) {
            console.log(error)
        }
    }


}

module.exports = User;