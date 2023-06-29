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
  const values = [ user.name, user.email, user.password];

  return pool.query(query, values)
    .then(response => {
      console.log('ressss', response);
      return response;
    })
    .catch((err) => {
      console.log(err.message);
    });
}


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

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
