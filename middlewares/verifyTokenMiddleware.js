require('dotenv').config({ path: '.env.dev' });
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const jwksClient = jwksRsa({
    jwksUri: `https://login.microsoftonline.com/${process.env.TENANT_ID}/discovery/v2.0/keys` 
});

function includes(arr, value){
    if (!Array.isArray(arr) || typeof value !== 'string') {
        return false;
    }        
        
    const lowerCaseValue = value.toLowerCase();
        
    return arr.some(item => item.toLowerCase().includes(lowerCaseValue));

}
// Fonction pour obtenir la clé publique
function getKey(header, callback) {
    jwksClient.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

// Middleware pour vérifier le jeton
function verifyToken(req, res, next) {
    const token = req.session.idToken;
    console.log(token);

    if (!token) {
        return next();
    }

    jwt.verify(token, getKey, {
        audience: process.env.CLIENT_ID, 
        issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`, 
        algorithms: ['RS256']
    }, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        const groups = decoded.groups || [];
        req.user = decoded; 
        req.session.isAuthorized = includes(groups, "teacher");
        next();
    });
}

module.exports = {verifyToken};