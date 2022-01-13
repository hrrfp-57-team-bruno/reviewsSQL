const express = require('express');
const axios = require('axios');
const db = require('../database.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/reviews', (req, res) => {
  console.log(req.query);
  const obj = {};
  db.getReviews()
    .then((data) => {
      obj.product = data[0].product_id.toString();
      obj.page = 0;
      obj.count = 5;
      obj.results = data;
      return db.getReviewPhotos(40344);
    })
    .then((data) => {
      console.log('!!!', data);
      for (let i = 0; i < obj.results.length; i++) {
        obj.results[i].photos = data;
      }

      res.send(obj);
    })
    .catch((err) => {
      console.log(err);
    });
});

const port = 3001;

app.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
})