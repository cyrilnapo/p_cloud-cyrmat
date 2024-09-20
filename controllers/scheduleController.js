const Schedule = require('../models/schedule');

exports.getScheduleByTeacherEmail = (teacherEmail) => {
    return new Promise((resolve, reject) => {
        Schedule.find(teacherEmail, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

exports.createScheduleInternal = (idSchedule, schLink, schUpdatedBy) => {
    return new Promise((resolve, reject) => {
        Schedule.create(idSchedule, schLink, schUpdatedBy, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    Schedule.update(idSchedule, schLink, schUpdatedBy, (updateErr, updateResults) => {
                        if (updateErr) {
                            console.log(updateErr);
                            reject(updateErr); 
                        } else {
                            resolve(updateResults); 
                        }
                    });
                } else {
                    console.log(err);
                    reject(err); 
                }
            } else {
                resolve(results);
            }
        });
    });
};

exports.getScheduleInternal = (idSchedule) => {
    return new Promise((resolve, reject) => {
        Schedule.read(idSchedule, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

exports.createSchedule = (req, res) => {
  const { idSchedule, schLink, schUpdatedBy } = req.body;
  Schedule.create(idSchedule, schLink, schUpdatedBy, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to create schedule' });
    } else {
      res.status(201).send({ message: 'Schedule created successfully' });
    }
  });
};

exports.getSchedule = (req, res) => {
  const { idSchedule } = req.params;
  Schedule.read(idSchedule, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to get schedule', details: err.message });
    } else if (results.length === 0) {
      res.status(404).send({ message: 'Schedule not found' });
    } else {
      res.status(200).send(results[0]);
    }
  });
};


exports.updateSchedule = (req, res) => {
  const { idSchedule } = req.params;
  const { schLink } = req.body;
  Schedule.update(idSchedule, schLink, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to update schedule' });
    } else {
      res.status(200).send({ message: 'Schedule updated successfully' });
    }
  });
};

exports.deleteSchedule = (req, res) => {
  const { idSchedule } = req.params;
  Schedule.delete(idSchedule, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to delete schedule' });
    } else {
      res.status(200).send({ message: 'Schedule deleted successfully' });
    }
  });
};
