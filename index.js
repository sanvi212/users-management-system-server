const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Environment variables
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const cluster = "cluster0.3prl4wl.mongodb.net";
const dbName = "usersManagementDB";

// Properly build MongoDB URI with env variables
const uri = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db(dbName);
    const usersCollection = database.collection("usersManagement");

    // GET ALL USERS
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET USER BY ID
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // CREATE NEW USER
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // UPDATE USER (PATCH)
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    // DELETE USER
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // MongoDB কানেকশন টেস্ট
    await client.db("admin").command({ ping: 1 });
  } finally {
  }
}
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Users Management System Server is Now running!");
});

// Server start
app.listen(port, () => {
});