create database reviews_api;

use reviews_api

create table reviews (
  review_id integer primary key not null auto_increment,
  product_id integer,
  rating integer,
  date char(13),
  summary text,
  body text,
  recommend varchar(7),
  reported varchar(7),
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness integer,
  index (product_id)
);

create table photos (
  id integer primary key not null auto_increment,
  review_id integer,
  url text,
  index (review_id)
);

create table meta (
  id integer primary key not null auto_increment,
  characteristic_id integer,
  review_id integer,
  value integer,
  product_id integer,
  characteristic text
);

create table characteristics (
  id integer primary key not null auto_increment,
  product_id integer,
  name text
);

load data local infile '/Users/danieltawata/Documents/sdc/reviewsSQL/csv/reviews.csv'
into table reviews
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\n'
ignore 1 rows
(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, @vresponse, helpfulness)
set response = nullif(@vresponse, 'null');

load data local infile '/Users/danieltawata/Documents/sdc/reviewsSQL/csv/reviews_photos.csv'
into table photos
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\n'
ignore 1 rows
(id, review_id, url);

load data local infile '/Users/danieltawata/Documents/sdc/reviewsSQL/csv/characteristic_reviews.csv'
into table meta
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\n'
ignore 1 rows
(id, characteristic_id, review_id, value);

load data local infile '/Users/danieltawata/Documents/sdc/reviewsSQL/characteristics.csv'
into table characteristics
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\n'
ignore 1 rows
(id, product_id, name);

update meta inner join characteristics
on meta.characteristic_id = characteristics.id
set meta.product_id = characteristics.product_id, meta.characteristic = characteristics.name;

drop table characteristics;

create index index_product_id on meta(product_id);
create index index_review_id on meta(review_id);
create index index_characteristic_id on meta(characteristic_id);