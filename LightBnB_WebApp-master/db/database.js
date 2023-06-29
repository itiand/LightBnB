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

  //EXPECTED RESULT
  // {
  //   name: 'Estella Rios',
  //   email: 'elizabethyork@ymail.com',
  //   password: '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  //   id: 1
  // }
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

// SELECT reservations.id, properties.title, reservations.start_date,
// cost_per_night, avg(rating) as average_rating
// FROM reservations
// JOIN properties ON reservations.property_id = properties.id
// JOIN property_reviews ON property_reviews.property_id = properties.id
// WHERE reservations.guest_id = 1
// GROUP BY reservations.id, properties.title, cost_per_night
// ORDER BY reservations.start_date
// LIMIT 10;

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

getAllReservations(2, 10).then(res => console.log('res', res));
/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool.query(`SELECT * FROM properties
    LIMIT $1;`, [limit])
    .then(response => {
      console.log('RESULT ROWS', response.rows);
      return response.rows;
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
