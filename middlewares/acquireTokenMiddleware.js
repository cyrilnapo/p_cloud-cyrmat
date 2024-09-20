const authProvider = require('../auth/AuthProvider');

exports.acquireToken = async (req, res, next) => {
    try {
        const tokenResponse = await authProvider.acquireToken({
            scopes: ['Files.Read']
        });
        console.log("acquisition de jeton : " + tokenResponse);
        req.session.accessToken = tokenResponse.accessToken;
        next(); 
    } catch (error) {
        console.log("une erreur ?");
        next(error); 
    }
};
