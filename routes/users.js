/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();

var fetch = require('../fetch');
var { isAuthenticated } = require('../middlewares/authMiddleware');
const authProvider = require('../auth/AuthProvider');

var { GRAPH_ME_ENDPOINT } = require('../auth/authConfig');

// custom middleware to check auth state


router.get('/id',
    isAuthenticated, 
    async function (req, res, next) {
        console.log(JSON.stringify(req.session.idToken));
        res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
    }
);

router.get('/profile',
    isAuthenticated, 
    authProvider.acquireToken(['User.Read']),
    async function (req, res, next) {
        try {
            const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
            res.render('profile', { profile: graphResponse });
        } catch (error) {
            next(error);
        }
    }
);


router.get('/schedule', 
    isAuthenticated, 
    authProvider.acquireToken(['Files.Read']),
    async function (req, res, next) {
        const shareLink = 'https://eduvaud-my.sharepoint.com/:u:/g/personal/px53yvq_eduvaud_ch/EUCwiFF_PTpFlW4eo9d5fsIB_JODGiewfxrZXYA1A7FxTQ?email=sofiene.belkhiria%40eduvaud.ch';
        const encodedShareLink = Buffer.from(shareLink).toString('base64').replace(/=+$/, ''); 
        const graphApiUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedShareLink}/root/content`;

        try {
            const graphResponse = await fetch(graphApiUrl, req.session.accessToken);
            res.render('json-view', { jsonData: JSON.stringify(graphResponse, null, 2) });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
);

module.exports = router;