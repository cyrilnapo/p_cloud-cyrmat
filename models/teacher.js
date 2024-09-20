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

const Teacher = {
  create: (idTeacher, teaLink, callback) => {
    const query = 'INSERT INTO t_teacher(idTeacher, teaLink) VALUES (?, ?)';
    connection.query(query, [idTeacher, teaLink], callback);
  },
  read: (idTeacher, callback) => {
    const query = 'SELECT teaLink FROM t_teacher WHERE idTeacher = ?';
    connection.query(query, [idTeacher], callback);
  },
  update: (idTeacher, teaLink, callback) => {
    const query = 'UPDATE t_teacher SET teaLink = ? WHERE idTeacher = ?';
    connection.query(query, [teaLink, idTeacher], callback);
  },
  delete: (idTeacher, callback) => {
    const query = 'DELETE FROM t_teacher WHERE idTeacher = ?';
    connection.query(query, [idTeacher], callback);
  }
};

module.exports = Teacher;
