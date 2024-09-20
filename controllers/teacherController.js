const Teacher = require('../models/teacher');

exports.getTeacherInternal = (idTeacher) => {
    return new Promise((resolve, reject) => {
        Teacher.read(idTeacher, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

exports.createTeacher = (req, res) => {
  console.log(req.session.account);
  const idTeacher = req.session.account.idTokenClaims.verified_primary_email[0]; 
  const { teaLink } = req.body;
  Teacher.create(idTeacher, teaLink, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        Teacher.update(idTeacher, teaLink, (updateErr, updateResults) => {
          if (updateErr) {
            res.status(500).send({ error: 'Failed to update teacher' });
          } else {
            res.status(200).send({ message: 'Teacher updated successfully' });
          }
        });
      } else {
        res.status(500).send({ error: 'Failed to create teacher' });
      }
    } else {
      res.status(201).send({ message: 'Teacher created successfully' });
    }
  });
};

exports.createTeacherInternal = (idTeacher, teaLink) => {
    return new Promise((resolve, reject) => {
        Teacher.create(idTeacher, teaLink, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    Teacher.update(idTeacher, teaLink, (updateErr, updateResults) => {
                        if (updateErr) {
                            reject(new Error('Failed to update teacher'));
                        } else {
                            resolve({ message: 'Teacher updated successfully' });
                        }
                    });
                } else {
                    reject(new Error('Failed to create teacher'));
                }
            } else {
                resolve({ message: 'Teacher created successfully' });
            }
        });
    });
};

exports.getTeacher = (req, res) => {
  const { idTeacher } = req.params;
  Teacher.read(idTeacher, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to get teacher', details: err.message });
    } else if (results.length === 0) {
      res.status(404).send({ message: 'Teacher not found' });
    } else {
      res.status(200).send(results[0]);
    }
  });
};


exports.updateTeacher = (req, res) => {
  const { idTeacher } = req.params;
  const { teaLink } = req.body;
  Teacher.update(idTeacher, teaLink, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to update teacher' });
    } else {
      res.status(200).send({ message: 'Teacher updated successfully' });
    }
  });
};

exports.deleteTeacher = (req, res) => {
  const { idTeacher } = req.params;
  Teacher.delete(idTeacher, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to delete teacher' });
    } else {
      res.status(200).send({ message: 'Teacher deleted successfully' });
    }
  });
};

exports.deleteTeacherInternal = (idTeacher) => {
    return new Promise((resolve, reject) => {
        Teacher.delete(idTeacher, (err, results) => {
            if (err) {
                if (err.code === 'NOT_FOUND' || err.message.includes('not found')) {
                    resolve({ message: 'Teacher not found, nothing to delete' });
                } else {
                    reject(new Error('Failed to delete teacher'));
                }
            } else {
                resolve({ message: 'Teacher deleted successfully' });
            }
        });
    });
};

