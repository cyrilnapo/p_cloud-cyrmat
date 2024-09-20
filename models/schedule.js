// models/schedule.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.AZURE_MYSQL_HOST,
    user: process.env.AZURE_MYSQL_USER,
    password: process.env.AZURE_MYSQL_PASSWORD,
    database: process.env.AZURE_MYSQL_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});



connection.connect();

const Schedule = {
  create: (idSchedule, schLink, schUpdatedBy, callback) => {
    const query = 'INSERT INTO t_schedule (idSchedule, schLink, schUpdatedBy) VALUES (?, ?, ?)';
    connection.query(query, [idSchedule, schLink, schUpdatedBy], callback);
  },
  read: (idSchedule, callback) => {
    const query = 'SELECT schLink FROM t_schedule WHERE idSchedule = ?';
    connection.query(query, [idSchedule], callback);
  },
  update: (idSchedule, schLink, schUpdatedBy, callback) => {
    const query = 'UPDATE t_schedule SET schLink = ?, schUpdatedBy = ? WHERE idSchedule = ?';
    connection.query(query, [schLink, schUpdatedBy, idSchedule], callback);
  },
  delete: (idSchedule, callback) => {
    const query = 'DELETE FROM t_schedule WHERE idSchedule = ?';
    connection.query(query, [idSchedule], callback);
  },
  find: (schUpdatedBy, callback) => {
    const query = 'SELECT idSchedule FROM t_schedule WHERE schUpdatedBy = ?';
    connection.query(query, [schUpdatedBy], callback);
  },
};

module.exports = Schedule;
