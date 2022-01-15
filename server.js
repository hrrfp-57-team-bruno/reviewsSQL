const express = require('express');
const axios = require('axios');
const db = require('./database.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// review_id integer primary key not null auto_increment,
// product_id integer,
// rating integer,
// date char(13),
// summary text,
// body text,
// recommend varchar(7),
// reported varchar(7),
// reviewer_name text,
// reviewer_email text,
// response text,
// helpfulness integer,

app.post('/reviews', (req, res) => {
  console.log(req.body);
  db.addReview(req.body)
    .then((data) => {
      console.log(data.insertId);
      for (let i = 0; i < req.body.photos.length; i++) {
        db.addPhotos(data.insertId, req.body.photos[i]);
      }
      return data.insertId;
    })
    .then((id) => {
      return db.searchMeta(14)
    })
    .then((data) => {
      console.log(data);
      res.send();
    })
});

app.get('/reviews', (req, res) => {
  const { product_id } = req.query;
  let count = 5;
  if (req.query.count) {
    count = Number(req.query.count);
  }
  const obj = {};
  db.getReviews(product_id, count)
    .then((data) => {
      console.log('!!!', data);
      for (let i = 0; i < data.length; i++) {
        data[i].recommend ? data[i].recommend = true : data[i].recommend = false;
        data[i].reported ? data[i].reported = true : data[i].reported = false;
        data[i].date = new Date(Number(data[i].date)).toISOString();
      }
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
    characteristics: {
      // Fit: {
      //   id: null,
      //   value: 0
      // },
      // Length: {
      //   id: null,
      //   value: 0
      // },
      // Comfort: {
      //   id: null,
      //   value: 0
      // },
      // Quality: {
      //   id: null,
      //   value: 0
      // }
    }
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
      }
      for (let key in temp) {
        if (temp[key]['reviews'] !== 0) {
          obj.characteristics[key] = {};
          obj.characteristics[key].id = temp[key].id;
          obj.characteristics[key].value = temp[key]['total'] / temp[key]['reviews'];
        }
      }
      return db.getReviews(product_id, 5);
    })
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        obj.ratings[data[i].rating]++;
        if (data[i].recommend) {
          obj.recommended.true++;
        } else {
          obj.recommended.false++;
        }
      }
      res.send(obj);
    })
    .catch((err) => {
      console.log(err);
    })
});



const port = 3001;

app.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
})