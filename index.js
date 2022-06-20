'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const admin = require('firebase-admin');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const PORT = process.env.PORT ?? 4000;

const credFirebase = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(credFirebase),
});

// const db = admin.firestore();

app.post('/webhook', (req, res) => {
  console.log('New verified request from Saweria!');
  console.log(req.body);
  res.sendStatus(200);
});

app.all('*', (_, res) => {
  return res.json({ message: 'hello world' });
});

app.listen(PORT, () => {
  console.log('aplikasi jalan di di port ', PORT);
});
