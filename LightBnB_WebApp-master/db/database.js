const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  const query = `SELECT * 
                FROM users
                WHERE email = $1
                `;
  const values = [email];
  return pool.query(query, values)
    .then(response => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};



/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const query = `SELECT * 
  FROM users
  WHERE users.id = $1
  `;
  const values = [id];
  return pool.query(query, values)
    .then(response => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};



// getUserWithId(1).then( res => console.log('RESSS', res))
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {

  const query = `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING *`;
  const values = [user.name, user.email, user.password];

  return pool.query(query, values)
    .then(response => {
      return response;
    })
    .catch((err) => {
      console.log(err.message);
    });
};



/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const query = `SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id, cost_per_night
  ORDER BY reservations.start_date
  LIMIT $2;
  `;

  const values = [guest_id, limit];
  return pool.query(query, values)
    .then(response => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};



/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1=1 
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND properties.id = $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `GROUP BY properties.id
    HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  } else {
    queryString += `GROUP BY properties.id `;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  let columnsBracket = ``;
  let valuesBracket = ``;
  const values = [];

  const propertyKeys = Object.keys(property);
  for (let i = 0; i < propertyKeys.length; i++) {
    const key = propertyKeys[i];
    columnsBracket += `${key}`;
    valuesBracket += `$${i + 1}`;
    values.push(property[key]);

    if (i !== propertyKeys.length - 1) {
      columnsBracket += ', ';
      valuesBracket += ', ';
    }
  }

  const query = `INSERT INTO properties (${columnsBracket})
  VALUES (${valuesBracket})
  RETURNING *`;

  console.log('QUERY', query);

  return pool.query(query, values)
    .then(response => {
      console.log('RES', response);
      return response;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// const testObj = {
//   owner_id: 'int',
//   title: 'string',
//   description: 'string',
//   thumbnail_photo_url: 'string',
//   cover_photo_url: 'string',
//   cost_per_night: 'string',
//   street: 'string',
//   city: 'string',
//   province: 'string',
//   post_code: 'string',
//   country: 'string',
//   parking_spaces: 'int',
//   number_of_bathrooms: 'int',
//   number_of_bedrooms: 'int'
// };

// addProperty(testObj);

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
