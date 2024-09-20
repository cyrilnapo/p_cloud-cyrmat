const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const teacherController = require('../controllers/teacherController');

router.post('/schedule', scheduleController.createSchedule);
router.get('/schedule/:idSchedule', scheduleController.getSchedule);
router.put('/schedule/:idSchedule', scheduleController.updateSchedule);
router.delete('/schedule/:idSchedule', scheduleController.deleteSchedule);
router.post('/teacher', teacherController.createTeacher);
router.get('/teacher/:idTeacher', teacherController.getTeacher);
router.put('/teacher/:idTeacher', teacherController.updateTeacher);
router.delete('/teacher/:idTeacher', teacherController.deleteTeacher);

module.exports = router;
