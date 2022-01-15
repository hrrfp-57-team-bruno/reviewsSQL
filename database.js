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
const addReview = ({product_id, rating, summary, body, recommend, name, email}) => {
  return new Promise((resolve, reject) => {
    const queryString = 'insert into reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const queryArgs = [product_id, rating, 12345, summary, body, recommend, false, name, email, null, 0];
    connection.query(queryString, queryArgs, (err, results, field) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// id integer primary key not null auto_increment,
// characteristic_id integer,
// review_id integer,
// value integer,
// product_id integer,
// characteristic text

const searchMeta = (characteristic_id) => {
  return new Promise((resolve, reject) => {
    const queryString = 'select * from meta where characteristic_id = ? limit 1';
    const queryArgs = [characteristic_id];
    connection.query(queryString, queryArgs, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });

    // const queryString = 'insert into meta (characteristic_id, review_id, value, product_id'
  });
};

const addPhotos = (review_id, photo) => {
  console.log('hello')
  return new Promise((resolve, reject) => {
    const queryString = 'insert into photos (review_id, url) values (?, ?)';
    const queryArgs = [review_id, photo];
    connection.query(queryString, queryArgs, (err, results, field) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
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
  getMetaData: getMetaData,
  addReview: addReview,
  addPhotos: addPhotos,
  searchMeta: searchMeta
}
