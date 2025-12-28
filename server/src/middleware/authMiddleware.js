import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // 1. Get token from header
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    // 2. Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // 3. Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attaches { id: "...", role: "..." } to req
    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};