if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { MongoClient } = require('mongodb');
const dbUri = process.env.DB_URI || "mongodb://127.0.0.1:27017";

let db = null

async function connectDB() {
    const client = new MongoClient(dbUri);
    try {
        const db = await client.db(process.env.DB_NAME);
        // console.log(process.env.DB_NAME);
        // console.log(process.env.DB_URI, "CHECK URL");
        return db;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

function getDB() {
    if (!db) {
        db = connectDB();
    }
    return db;
}

module.exports = { connectDB, getDB };