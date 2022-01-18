const express = require('express');
const axios = require('axios');
const cors = require('cors');
const db = require('./database/index.js');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/reviews', (req, res) => {
  let { product_id, count } = req.query;
  count ? count = Number(count) : count = 5;
  const obj = {};
  db.getReviews(product_id, count)
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].recommend === 'true' ? data[i].recommend = true : data[i].recommend = false;
        data[i].reported === 'true' ? data[i].reported = true : data[i].reported = false;
        data[i].date = new Date(Number(data[i].date)).toISOString();
      }
      obj.product = data[0].product_id.toString();
      obj.page = 0;
      obj.count = count;
      obj.results = data;
      const review_ids = [];
      for (let i = 0; i < data.length; i++) {
        review_ids.push(data[i]['review_id']);
      }
      return db.getReviewPhotos(review_ids);
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

app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;
  const obj = {
    product_id: product_id,
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    recommended: {
      false: 0,
      true: 0
    },
    characteristics: {}
  }
  db.getMetaData(product_id)
    .then((data) => {
      const temp = {
        Fit: {
          id: null,
          total: 0,
          reviews: 0
        },
        Length: {
          id: null,
          total: 0,
          reviews: 0
         },
        Comfort: {
          id: null,
          total: 0,
          reviews: 0
         },
        Quality: {
          id: null,
          total: 0,
          reviews: 0
         }
      }
      for (let i = 0; i < data.length; i++) {
        temp[data[i].characteristic].id = data[i].characteristic_id;
        temp[data[i].characteristic].total += data[i].value;
        temp[data[i].characteristic].reviews++;
        obj.ratings[data[i].rating]++;
        if (data[i].recommend === 'true') {
          obj.recommended.true++;
        } else {
          obj.recommended.false++;
        }
      }
      for (let key in temp) {
        if (temp[key]['reviews'] !== 0) {
          obj.characteristics[key] = {};
          obj.characteristics[key].id = temp[key].id;
          obj.characteristics[key].value = temp[key]['total'] / temp[key]['reviews'];
        }
      }
      res.send(obj);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/reviews', (req, res) => {
  let review_id;
  db.addReview(req.body)
    .then((data) => {
      review_id = data.insertId;
      return db.addPhotos(review_id, req.body.photos);
    })
    .then((data) => {
      return db.searchMetaData(req.body.characteristics);
    })
    .then((data) => {
      const obj = {
        characteristic_ids: [],
        values: [],
        characteristics: []
      };
      for (let i = 0; i < data.length; i++) {
        obj.characteristic_ids.push(data[i].characteristic_id);
        obj.values.push(req.body.characteristics[data[i].characteristic_id]);
        obj.characteristics.push(data[i].characteristic);
      }
      obj.review_id = review_id;
      obj.product_id = req.body.product_id;
      return db.addMetaData(obj);
    })
    .then((data) => {
      res.send();
    })
    .catch((err) => {
      console.log(err);
    });
});


const port = 3001;

app.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
})