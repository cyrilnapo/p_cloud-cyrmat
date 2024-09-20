const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyTokenMiddleware');
const scheduleController = require('../controllers/scheduleController');
const { isAuthenticated } = require('../middlewares/authMiddleware'); 
const authProvider = require('../auth/AuthProvider');

router.get('/impersonate', isAuthenticated, async (req, res, next) => {
    try {
        const teacherEmail = req.session.account.idTokenClaims.verified_primary_email[0];
        const schedules = await scheduleController.getScheduleByTeacherEmail(teacherEmail);

        res.render('impersonate', {
            title: 'Voir comme mes apprentis',
            isAuthenticated: true,
            isAuthorized: req.session.isAuthorized,
            schedules: schedules
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/impersonate/:studentId', isAuthenticated, authProvider.acquireToken(['Sites.Read.All']), verifyToken, async (req, res, next) => {
    try {
        const studentId = req.params.studentId;

        const schedule = await scheduleController.getScheduleInternal(studentId);
        let graphResponse = [];

        if (schedule && schedule.length > 0) {
            const encodedShareLink = Buffer.from(schedule[0].schLink).toString('base64').replace(/=+$/, '').replace(/\+/g, "-").replace(/\//g, "_");
            const graphApiUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedShareLink}/root/content`;
            console.log(graphApiUrl);
            try {
                const response = await fetch(graphApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${req.session.accessToken}`
                    }
                });
                graphResponse = await response.json();
                console.log(graphResponse);
            } catch (error) {
                console.log(error);
                next(error);
            }
        }

        res.render('student-view', {
            title: `La vue de l'élève : ${studentId}`,
            isAuthenticated: true,
            isAuthorized: req.session.isAuthorized,
            schedule: JSON.stringify(graphResponse, null, 2),
            username: studentId
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
