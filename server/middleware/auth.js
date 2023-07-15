//for authentication
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); //token is present in authorization header from frontend

    if (!token) {
      // If the request header does not contain a token, return a 403 Forbidden status and "Access Denied" message.
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      // If the token starts with "Bearer ", remove the "Bearer " prefix from the token string.
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the token using the provided JWT_SECRET.
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified user information to the request object for further processing.
    req.user = verified;

    // Call the next middleware function in the chain.
    next();
  } catch (err) {
    // If an error occurs during token verification, return a 500 Internal Server Error status and the error message.
    res.status(500).json({ error: err.message });
  }
};
