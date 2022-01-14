const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reviews_api'
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected!');
  }
})

const getReviews = (id, count) => {
  return new Promise((resolve, reject) => {
    const queryString = 'select * from reviews where product_id = ? limit ?';
    const queryArgs = [id, count];
    connection.query(queryString, queryArgs, (err, results, field) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    })
  })
};

const getReviewPhotos = (ids) => {
  return new Promise((resolve, reject) => {
    // const queryString = 'select * from photos where review_id in (232057,232058,232059,232060,232061)';
    let queryString = 'select * from photos where review_id in (';
    const queryArgs = ids;
    let questions = '';
    for (let i = 0; i < queryArgs.length; i++) {
      questions += ',?';
    }
    questions = questions.slice(1) + ')';
    queryString = queryString + questions;
    connection.query(queryString, queryArgs, (err, results, field) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getMetaData = (id) => {
  return new Promise((resolve, reject) => {
    let queryString = 'select * from meta where product_id = ?';
    let queryArgs = [id];
    connection.query(queryString, queryArgs, (err, results, field) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  getReviews: getReviews,
  getReviewPhotos: getReviewPhotos,
  getMetaData: getMetaData
}
