const express = require('express');
const axios = require('axios');
const db = require('./database.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/reviews', (req, res) => {
  const { product_id, count } = req.query;
  const obj = {};
  db.getReviews(product_id)
    .then((data) => {
      obj.product = data[0].product_id.toString();
      obj.page = 0;
      obj.count = 5;
      obj.results = data;
      const ids = [];
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i]['review_id']);
      }
      return db.getReviewPhotos(ids);
    })
    .then((data) => {
      for (let i = 0; i < obj.results.length; i++) {
        obj.results[i].photos = [];
        for (let j = 0; j < data.length; j++) {
          if (obj.results[i].review_id === data[j].review_id) {
            obj.results[i].photos.push(data[j]);
          }
        }
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