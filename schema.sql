create database reviews_api;

use reviews_api

create table reviews (
  review_id integer primary key not null,
  product_id integer,
  rating integer,
  date date,
  summary text,
  body text,
  recommend boolean,
  reported text,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness integer
);

create table photos (
  id integer primary key not null,
  review_id integer,
  url text
);

load data local infile '/Users/danieltawata/Documents/sdc/reviewsSQL/reviews.csv'
into table reviews
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\n'
ignore 1 rows
(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, @vresponse, helpfulness);
set response = NULLIF(@vresponse, null)
load data local infile '/Users/danieltawata/Documents/sdc/reviewsSQL/reviews_photos.csv'
into table photos
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\n'
ignore 1 rows
(id, review_id, url);

