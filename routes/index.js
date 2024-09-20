/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
const { verifyToken } = require('../middlewares/verifyTokenMiddleware');
var fetch = require('../fetch');
var { isAuthenticated } = require('../middlewares/authMiddleware');
const authProvider = require('../auth/AuthProvider');

const teacherController = require('../controllers/teacherController');
const scheduleController = require('../controllers/scheduleController');

router.get('/test', isAuthenticated, authProvider.acquireToken(['Files.Read']), verifyToken, async function (req, res, next) {
    const url = "https://graph.microsoft.com/v1.0/shares/u!aHR0cHM6Ly9lZHV2YXVkLW15LnNoYXJlcG9pbnQuY29tLzp1Oi9nL3BlcnNvbmFsL2NpbmR5X2hhcmRlZ2dlcl9lZHV2YXVkX2NoL0VYR3VCYXo1TG1KTmxjVkNROUFjZUQ0QjZMQmQ5UHFHWEU4WFIzYV9JMHVHVGc/driveItem";
    try {
        const graphResponse = await fetch(url, "eyJ0eXAiOiJKV1QiLCJub25jZSI6IktrN1h3QW1WMnBmTUR3VHhSYmpKek52UEtsNUJOcG9OV3JiYjJsbmdCSXMiLCJhbGciOiJSUzI1NiIsIng1dCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCIsImtpZCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MDZhYjkwOC0wNGY5LTRhODAtYmE5Yy04NzVhMzZlNzdiYzEvIiwiaWF0IjoxNzI0MzQ1NzkzLCJuYmYiOjE3MjQzNDU3OTMsImV4cCI6MTcyNDQzMjQ5MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhYQUFBQStwWHJHTlhMLzZUWEpSNFBKaTdoYTRnWjJ3VlMwN2lqRTB6OWoyRm1RNXpLVUl3R3kvNFZQWmtaUHdqRUNIcGQiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlNjaGFmZnRlciIsImdpdmVuX25hbWUiOiJDw6lkcmljIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTc4LjIzOC4xNjcuMjIwIiwibmFtZSI6IkPDqWRyaWMgU2NoYWZmdGVyIiwib2lkIjoiNTUzYjRhMTktYjNiZC00Yzg1LThiMDMtZTNkYThkMmQwZWU1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTk2NTcyMTc1LTE2MDc3MjU0NjUtMjg2ODA3MzQ4NC0xNjY3OTkiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDE0QkFGMjlDMCIsInJoIjoiMC5BVEFBQ0xscWtQa0VnRXE2bklkYU51ZDd3UU1BQUFBQUFBQUF3QUFBQUFBQUFBQXdBSjAuIiwic2NwIjoiQWNjZXNzUmV2aWV3LlJlYWQuQWxsIEFjY2Vzc1Jldmlldy5SZWFkV3JpdGUuQWxsIEFjY2Vzc1Jldmlldy5SZWFkV3JpdGUuTWVtYmVyc2hpcCBBZG1pbmlzdHJhdGl2ZVVuaXQuUmVhZC5BbGwgQWRtaW5pc3RyYXRpdmVVbml0LlJlYWRXcml0ZS5BbGwgQVBJQ29ubmVjdG9ycy5SZWFkLkFsbCBBUElDb25uZWN0b3JzLlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWQuU2hhcmVkIENhbGVuZGFycy5SZWFkV3JpdGUgQ2FsZW5kYXJzLlJlYWRXcml0ZS5TaGFyZWQgQ29udGFjdHMuUmVhZFdyaXRlIERldmljZU1hbmFnZW1lbnRBcHBzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUHJpdmlsZWdlZE9wZXJhdGlvbnMuQWxsIERldmljZU1hbmFnZW1lbnRNYW5hZ2VkRGV2aWNlcy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50UkJBQy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50UkJBQy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRTZXJ2aWNlQ29uZmlnLlJlYWQuQWxsIERpcmVjdG9yeS5BY2Nlc3NBc1VzZXIuQWxsIERpcmVjdG9yeS5SZWFkLkFsbCBEaXJlY3RvcnkuUmVhZFdyaXRlLkFsbCBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZC5BbGwgTWFpbC5SZWFkV3JpdGUgTWFpbGJveFNldHRpbmdzLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBQcmVzZW5jZS5SZWFkIFByZXNlbmNlLlJlYWQuQWxsIHByb2ZpbGUgUmVwb3J0cy5SZWFkLkFsbCBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgVXNlci5SZWFkV3JpdGUuQWxsIGVtYWlsIiwic3ViIjoiVTFZZ3BHVlpqUjRiSGV2Q2ZVTUNFcTRWZ1JQV1FxcTdIdmp0bmpwbG5mVSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjkwNmFiOTA4LTA0ZjktNGE4MC1iYTljLTg3NWEzNmU3N2JjMSIsInVuaXF1ZV9uYW1lIjoicHg1M3l2cUBlZHV2YXVkLmNoIiwidXBuIjoicHg1M3l2cUBlZHV2YXVkLmNoIiwidXRpIjoicC1Hd1JoWmpvVXl4SnJjc2JDNGVBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2lkcmVsIjoiMSAyNiIsInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6ImpWMW9QUlMxNXQ2UlVxTHAxUjZ3em9yNTZOQmZWT0txTXpJeUoyWGhMWFkifSwieG1zX3RjZHQiOjE1MjQxMzAwMDcsInhtc190ZGJyIjoiRVUifQ.JvSLrooPG1RV1e4sFsderBIFZz4X_GQWjuR2vKkyAvmTtRm4tba9nLvEdXoedO76d9M2TtHlm6vRhYQZQhlYLLzSl_mKgyRgUQcyztRQJxhe1wo_MSraKbXxNu2T5N0Ox8vv5h0sQiNVf3Wxcws0HmA6nlL9nbyMnSVp4ty38YZOk29BlfR7CnS8OYgzVYl5SRepFY-vf8-e78j_W8Onv4tdx7E_lfTDCe3j36jOwzifWKPHifpfcDhhxXplxpWIfFa5nh5qpQSa5cLeltoNucw8aGkvPlFSfLebKWA_j7hHK2dpXs81ezpE65wz8Hi12gIXKTcW_u3_DtR8IB8h0g");      
        console.log(graphResponse);  

        if (response.ok) {
            const driveItem = await response.json();
            const contentUrl = driveItem["@microsoft.graph.downloadUrl"];

            const contentResponse = await fetch(contentUrl);
            const fileContent = await contentResponse.text(); // Utilisez .json() si le fichier est au format JSON
            console.log(fileContent);
        } else {
            console.error("Erreur:", response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }  
    
    
    
    res.render('test', { title: 'Une page de test' });
});

router.get('/', isAuthenticated, authProvider.acquireToken(['Files.Read']), verifyToken, async function (req, res, next) {
    let currentUser = req.session.account.idTokenClaims.verified_primary_email[0];
    let fileId = [];
    const givenName = req.session.account.idTokenClaims.name;
    const currentTeacher = req.session.account.idTokenClaims.verified_primary_email[0];

    let graphResponse = [];
    if (req.session.isAuthorized){
        


        const graphApiUrlFile = "https://graph.microsoft.com/v1.0/me/drive/root:/lagapep_export_data/lagapep_my_students_links.json:/content";
        try {
            graphResponse = await fetch(graphApiUrlFile, req.session.accessToken);      
            console.log(graphResponse);            
        } catch (error) {
            console.log(error);
            next(error);
        }   
        
        
        await teacherController.deleteTeacherInternal(currentTeacher, null);        
        await teacherController.createTeacherInternal(currentTeacher, null);        
        
        for (const student of graphResponse) {
            console.log("Update of " + student.email);
            await scheduleController.createScheduleInternal(student.email, student.jsonLink, currentTeacher);
        }
        res.render('index', {
            title: 'Mon agenda',
            isAuthenticated: req.session.isAuthenticated,
            isAuthorized: req.session.isAuthorized,
            username: givenName
        });
        
    }
    // traitement pour les apprentis
    else {
        const schedule = await scheduleController.getScheduleInternal(currentUser);
        if (schedule && schedule.length > 0) {
            const encodedShareLink = Buffer.from(schedule[0].schLink).toString('base64').replace(/=+$/, '').replace(/\+/g, "-").replace(/\//g, "_");
            const graphApiUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedShareLink}/root/content`;
                        
            try {
                graphResponse = await fetch(graphApiUrl, req.session.accessToken);
                //console.log(graphResponse);
            } catch (error) {
                console.log(error);
                next(error);
            }                
        }
        
        res.render('student-view', {
            title: 'Mon agenda',
            isAuthenticated: req.session.isAuthenticated,
            schedule : JSON.stringify(graphResponse, null, 2),
            username: givenName
        });
    }
    
    
});

module.exports = router;

