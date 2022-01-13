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

const getReviews = () => {
  return new Promise((resolve, reject) => {
    const queryString = 'select * from reviews where product_id = 40344';
    connection.query(queryString, (err, results, field) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    })
  })
};

const getReviewPhotos = (id) => {
  return new Promise((resolve, reject) => {
    const queryString = 'select * from photos where review_id = ?';
    const queryArgs = id;
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
  getReviewPhotos: getReviewPhotos
}

// {
//   review_id: 4,
//   product_id: 2,
//   rating: 4,
//   date: 2147483647,
//   summary: '"They look good on me"',
//   body: '"I so stylish and just my aesthetic."',
//   recommend: 'true',
//   reported: 'false',
//   reviewer_name: '"fashionperson"',
//   reviewer_email: '"first.last@gmail.com"',
//   response: 'null',
//   {
//     "review_id": 1115867,
//     "rating": 5,
//     "summary": "hey",
//     "recommend": true,
//     "response": null,
//     "body": "hey everyonehey everyonehey everyonehey everyonehey everyone",
//     "date": "2022-01-07T00:00:00.000Z",
//     "reviewer_name": "hey",
//     "helpfulness": 1,
//     "photos": []
// },




// {
//   review_id: 1,
//   product_id: 1,
//   rating: 5,
//   date: 2147483647,
//   summary: '"This product was great!"',
//   body: '"I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all."',
//   recommend: 'true',
//   reported: 'false',
//   reviewer_name: '"funtime"',
//   reviewer_email: '"first.last@gmail.com"',
//   response: 'null',
//   helpfulness: 8
// },


//         {
//             "review_id": 1115867,
//             "rating": 5,
//             "summary": "hey",
//             "recommend": true,
//             "response": null,
//             "body": "hey everyonehey everyonehey everyonehey everyonehey everyone",
//             "date": "2022-01-07T00:00:00.000Z",
//             "reviewer_name": "hey",
//             "helpfulness": 1,
//             "photos": []
//         }

//   {
//     review_id: 1,
//     product_id: 1,
//     rating: 5,
//     summary: '1596080481467',
//     recommend: '"This product was great!"',
//     response: '"I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all."',
//     body: 'true',
//     date: 0,
//     reviewer_name: '"funtime"',
//     helpfulness: 0
//   },
//         {
//             "review_id": 1115867,
//             "rating": 5,
//             "summary": "hey",
//             "recommend": true,
//             "response": null,
//             "body": "hey everyonehey everyonehey everyonehey everyonehey everyone",
//             "date": "2022-01-07T00:00:00.000Z",
//             "reviewer_name": "hey",
//             "helpfulness": 1,
//             "photos": []
//         }


//   {
//     "product": "40344",
//     "page": 0,
//     "count": 5,
//     "results": [
//         {
//             "review_id": 1115867,
//             "rating": 5,
//             "summary": "hey",
//             "recommend": true,
//             "response": null,
//             "body": "hey everyonehey everyonehey everyonehey everyonehey everyone",
//             "date": "2022-01-07T00:00:00.000Z",
//             "reviewer_name": "hey",
//             "helpfulness": 1,
//             "photos": []
//         },
//         {
//             "review_id": 1115974,
//             "rating": 4,
//             "summary": "Love it!",
//             "recommend": true,
//             "response": null,
//             "body": "THis was the best camo onesie of all camo onesies. All the other camo onesies are bad compared to this one.",
//             "date": "2022-01-08T00:00:00.000Z",
//             "reviewer_name": "guy",
//             "helpfulness": 0,
//             "photos": []
//         },
//         {
//             "review_id": 1115956,
//             "rating": 5,
//             "summary": "Best Pants Ever",
//             "recommend": true,
//             "response": null,
//             "body": "I really enjoy wearing these on my long intergalactic space flights!!!",
//             "date": "2022-01-07T00:00:00.000Z",
//             "reviewer_name": "Allen",
//             "helpfulness": 0,
//             "photos": []
//         },
//         {
//             "review_id": 1115955,
//             "rating": 5,
//             "summary": "We come in peace",
//             "recommend": true,
//             "response": null,
//             "body": "These earth pants are most comfortable. I enjoy wearing them on my long space journeys.",
//             "date": "2022-01-07T00:00:00.000Z",
//             "reviewer_name": "Allen",
//             "helpfulness": 0,
//             "photos": []
//         },
//         {
//             "review_id": 1115703,
//             "rating": 3,
//             "summary": "This is a good product Buy it please This is a good product Buy it, please",
//             "recommend": true,
//             "response": null,
//             "body": "This is a good product Buy it please THere is a min number of charsThis is a good product Buy it please THere is a min number of chars",
//             "date": "2022-01-05T00:00:00.000Z",
//             "reviewer_name": "notryano",
//             "helpfulness": 0,
//             "photos": []
//         }
//     ]
// }