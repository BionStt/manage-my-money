import initKnex from 'knex';
import pg, { types } from 'pg';
import pgParseFloat from 'pg-parse-float';

let knex;

function start() {
    // Make float column types return JavaScript floats instead of strings
    pgParseFloat(pg);

    // Force DATE type to return a string value
    // See https://github.com/brianc/node-postgres/issues/1844
    const DATE_OID = 1082;
    const parseDate = value => value;
    types.setTypeParser(DATE_OID, parseDate);

    // Initialize Knex
    const dbConfig = {
        client: 'pg',
        debug: false,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            charset: 'utf8'
        }
    };
    knex = initKnex(dbConfig);
}

/**
 * Stop db
 * @param callback is called when all connections are destroyed
 */
function stop(callback) {
    if (knex && knex.client) {
        knex.destroy(callback);
    } else {
        callback();
    }
}

function getKnex() {
    return knex;
}

export const db = {
    start,
    stop,
    getKnex
};
