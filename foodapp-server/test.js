const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@rinkusingh.b4dmfid.mongodb.net/?appName=RinkuSingh`; // Or paste your string directly here for a quick test

console.log("Attempting to connect...");

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connection and Authentication passed!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILED:");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    process.exit(1);
  });