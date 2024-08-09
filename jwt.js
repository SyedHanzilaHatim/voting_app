// const jwt = require('jsonwebtoken');

// const jwtAuthMiddleware = (req,res,next)=>{
//     //extracting the jwt token from the request headers
//     const token = req.headers.authorization.split(" ")[1];
//     if(!token) {
//         return res.status(401).json({error:"Unauthorized"});
//     try {
//         //verify the jwt token
//       const decoded =  jwt.verify(token,process.env.JWT_SECRET);
//       //Attach user information to the request object
//       req.body = decoded;
//       next();
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({error:"invalid token"});
        
//     }    
//     }
// }
// //generate token
// const generateToken = (userData) => {
//     //generate a new JWT Token using user data
//     return jwt.sign(userData,process.env.JWT_SECRET);

// }
// module.exports = {jwtAuthMiddleware,generateToken};

const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // Extracting the JWT token from the request headers
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is missing or malformed
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user information to the request object
        req.user = decoded; // Use req.user instead of req.body
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid token" });
    }
};

// Generate token
const generateToken = (userData) => {
    // Generate a new JWT Token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
