// Standalone MongoDB connection tester.
// Run with: node test-db.js
// This file has ZERO dependency on the rest of the app — it only tests your MONGODB_URI.

require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

console.log("----------------------------------------");
console.log("NanoTools AI — MongoDB connection test");
console.log("----------------------------------------");

if (!uri) {
  console.error("ERROR: MONGODB_URI is not set in your .env file.");
  console.error("Create a file named .env in this folder with a line like:");
  console.error("MONGODB_URI=mongodb://localhost:27017/nanotools");
  process.exit(1);
}

console.log("Found MONGODB_URI in .env, attempting to connect...");
console.log("(password is hidden below for safety)");
console.log(uri.replace(/:([^:@]+)@/, ":****@"));
console.log("");

mongoose
  .connect(uri)
  .then(() => {
    console.log("SUCCESS — MongoDB connected!");
    console.log("Database name:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    return mongoose.disconnect();
  })
  .then(() => {
    console.log("");
    console.log("Connection closed cleanly. Your database is ready to use.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILED to connect to MongoDB.");
    console.error("Reason:", err.message);
    console.error("");
    console.error("Common fixes:");
    console.error("1. If using MongoDB Atlas: go to Network Access in your Atlas");
    console.error("   dashboard and click 'Allow Access from Anywhere' (0.0.0.0/0)");
    console.error("2. Double check your username/password in the URI are correct");
    console.error("   and don't contain unescaped special characters");
    console.error("3. If using local MongoDB: make sure 'mongod' is running");
    console.error("4. Make sure the URI ends with a database name, e.g. /nanotools");
    process.exit(1);
  });
