import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied, token missing or invalid!" });
  }

  // Extract token by splitting with a space
  const token = authHeader.split(" ")[1]; // Corrected: Split by space
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  try {
    // Verify the token using the secret k ey
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Secret from environment variables

    // Attach the decoded payload (usually user info) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token!" });
  }
};

export default authMiddleware;
