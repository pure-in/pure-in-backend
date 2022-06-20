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

const db = admin.firestore();

app.post('/webhook', (req, res) => {
  const { amount_raw, cut } = req.body;
  const Ref = db.collection('donations');
  const amount = amount_raw - cut;
  return Ref.doc('00000000-0000-0000-0000-000000000000')
    .set(req.body)
    .then(() =>
      db
        .collection('configs')
        .doc('saweria')
        .update({
          recap_donation_this_month: FieldValue.increment(amount),
          recap_donation_this_year: FieldValue.increment(amount),
          recap_donation_total: FieldValue.increment(amount),
        })
    )
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/donations', (_, res) => {
  const docRef = db.collection('configs').doc('saweria');

  return docRef
    .get()
    .then((result) => {
      if (!result.exists) return res.sendStatus(404);
      const data = result.data();
      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.all('*', (_, res) => {
  return res.json({ message: 'hello world' });
});

app.listen(PORT, () => {
  console.log('aplikasi jalan di di port ', PORT);
});
