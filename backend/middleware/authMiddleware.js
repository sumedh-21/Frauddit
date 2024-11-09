const admin = require('../firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split('Bearer ')[1]; // Get token from request header

  if (!token) {
    return res.status(403).send('No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach the decoded user info to the request
    next(); // Continue to the next middleware/route
  } catch (error) {
    return res.status(403).send('Unauthorized');
  }
};

module.exports = verifyToken;