const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Add your Firebase Cloud Functions here
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});
